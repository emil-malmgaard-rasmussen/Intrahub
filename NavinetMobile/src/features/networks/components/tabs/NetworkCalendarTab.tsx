import {Calendar} from 'react-native-calendars';
import {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {useRefreshContext} from '../../../../navigation/RefreshContext.tsx';
import {ScrollView, StyleSheet, Text, View} from 'react-native';

const NetworkCalendarTab = ({networkId}: {networkId: string}) => {
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const {refresh} = useRefreshContext();

  // Helper function to mark the period (fromDate to toDate)
  const markActivityPeriod = (fromDate: string, toDate?: string) => {
    let marked = {};

    if (toDate) {
      // If both fromDate and toDate are provided, mark the period
      marked = {
        ...marked,
        [fromDate]: {
          marked: true,
          dotColor: '#0aada8', // Starting dot color
        },
        [toDate]: {
          marked: true,
          dotColor: '#0aada8', // Ending dot color
        },
      };

      // Mark all dates in between as part of the activity period
      let currentDate = moment(fromDate);
      while (currentDate.isBefore(moment(toDate).add(1, 'day'))) {
        const dateString = currentDate.format('YYYY-MM-DD');
        if (!marked[dateString]) {
          marked[dateString] = {
            marked: true,
            color: '#0aada8', // Color for the range of dates
            selectedColor: '#0aada8', // Color to indicate selection
          };
        }
        currentDate.add(1, 'day');
      }
    } else {
      // If toDate is not provided, only mark the single date
      marked[fromDate] = {
        marked: true,
        dotColor: '#0aada8',
      };
    }

    return marked;
  };

  const getNetworkActivities = async () => {
    const networksSnapshot = await firestore()
      .collection('ACTIVITIES')
      .where('networkId', '==', networkId)
      .get();

    const activitiesSnapshot = networksSnapshot.docs.map(doc => doc.data());

    const marked = activitiesSnapshot.reduce((acc, activity) => {
      const fromDate = moment(activity.dateFrom.toDate()).format('YYYY-MM-DD');
      const toDate = activity.dateTo ? moment(activity.dateTo.toDate()).format('YYYY-MM-DD') : undefined;

      const activityPeriod = markActivityPeriod(fromDate, toDate);

      acc = { ...acc, ...activityPeriod };

      // Store activities in each marked date
      Object.keys(activityPeriod).forEach(date => {
        if (!acc[date]) {
          acc[date] = {
            activities: [],
          };
        }
        acc[date].activities = [...(acc[date].activities || []), {
          title: activity.title,
          description: activity.description,
        }];
      });

      return acc;
    }, {});

    setMarkedDates(marked);
  };

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
    const selectedActivities = markedDates[day.dateString]?.activities || [];
    setActivities(selectedActivities);
  };

  const formatSelectedDate = dateString => {
    const dayOfWeek = moment(dateString).format('dddd');
    const date = moment(dateString).format('D/M/YYYY');
    return `Aktiviteter for ${dayOfWeek} d. ${date}`;
  };

  useEffect(() => {
    getNetworkActivities();
  }, [networkId]);

  useEffect(() => {
    if (refresh) {
      getNetworkActivities();
    }
  }, [refresh]);

  return (
    <ScrollView style={styles.container}>
      <Calendar
        style={styles.calendar}
        onDayPress={handleDayPress}
        markedDates={markedDates}
      />
      {selectedDate && (
        <View style={styles.activitiesContainer}>
          <Text style={styles.header}>{formatSelectedDate(selectedDate)}</Text>
          {activities.length > 0 ? (
            activities.map((activity, index) => (
              <View key={index} style={styles.activity}>
                <Text style={styles.title}>{activity.title}</Text>
                <Text>{activity.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noContent}>Ingen aktiviteter</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  calendar: {
    borderColor: '#CECECE',
    borderWidth: 1,
    borderRadius: 5,
  },
  activitiesContainer: {
    marginTop: 16,
    padding: 16,
    elevation: 1,
  },
  header: {
    fontSize: 16,
    marginBottom: 8,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
  },
  activity: {
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
  },
  noContent: {
    color: '#959595',
  },
});

export default NetworkCalendarTab;
