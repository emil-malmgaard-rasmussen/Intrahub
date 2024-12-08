import BannerSlider from '../../components/banners/BannerSlider';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Carousel from 'react-native-reanimated-carousel';
import {SCREEN_WIDTH} from '../../utils/Dimensions.ts';
import {Calendar} from 'react-native-calendars';
import moment from 'moment/moment';

const OverviewScreen = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  const markActivityPeriod = (fromDate: string, toDate?: string) => {
    let marked = {};

    if (toDate) {
      marked = {
        ...marked,
        [fromDate]: {
          marked: true,
          dotColor: '#0aada8',
        },
        [toDate]: {
          marked: true,
          dotColor: '#0aada8',
        },
      };

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

  const renderBanner = (item: any) => {
    return <BannerSlider data={item} />;
  };

  const fetchPosts = async (networkIds: any[]) => {
    setLoading(true);
    try {
      if (networkIds.length > 0) {
        const postsSnapshot = await firestore()
          .collection('POSTS')
          .where('networkId', 'in', networkIds)
          .orderBy('createdAt', 'desc')
          .get();

        // Extract the posts data
        const fetchedPosts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworkActivities = async (networkIds: any[]) => {
    const networksSnapshot = await firestore()
      .collection('ACTIVITIES')
      .where('networkId', 'in', networkIds)
      .get();

    const activitiesSnapshot = networksSnapshot.docs.map(doc => doc.data());

    const marked = activitiesSnapshot.reduce((acc, activity) => {
      const fromDate = moment(activity.dateFrom.toDate()).format('YYYY-MM-DD');
      const toDate = activity.dateTo ? moment(activity.dateTo.toDate()).format('YYYY-MM-DD') : undefined;

      const activityPeriod = markActivityPeriod(fromDate, toDate);

      Object.keys(activityPeriod).forEach(date => {
        if (!acc[date]) {
          acc[date] = {
            marked: true,
            dotColor: '#0aada8',
            activities: [],
          };
        }

        acc[date].activities.push({
          title: activity.title,
          description: activity.description,
        });
      });

      return acc;
    }, {});

    setMarkedDates(marked);
  };

  useEffect(() => {
    const user = auth().currentUser;
    const uid = user!.uid;

    // Get the user's networks (assuming you have a 'NETWORKS' collection)
    firestore()
      .collection('USERS')
      .where('uid', '==', uid)
      .limit(1)
      .get()
      .then(userSnapshot => {
        const networkIds = userSnapshot.docs[0].data().networks;
        fetchPosts(networkIds);
        fetchNetworkActivities(networkIds);
      });
  }, []);

  const formatSelectedDate = (dateString: any) => {
    const dayOfWeek = moment(dateString).format('dddd');
    const date = moment(dateString).format('D/M/YYYY');
    return `Aktiviteter for ${dayOfWeek} d. ${date}`;
  };

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    const selectedActivities = markedDates[day.dateString]?.activities || [];
    setActivities(selectedActivities);
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <SafeAreaView
      style={[
        {flex: 1, backgroundColor: '#fff'},
        Platform.OS === 'android' && {paddingTop: 30},
      ]}>
      <ScrollView>
        <View style={{padding: 20, flex: 1}}>
          <View
            style={{
              marginVertical: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 18, color: '#959595'}}>Overblik</Text>
          </View>
          {loading ? (
            <ActivityIndicator size={'large'} />
          ) : (
            <View style={{flex: 1}}>
              <Carousel
                loop={posts.length > 0}
                width={SCREEN_WIDTH - 40}
                height={SCREEN_WIDTH / 1.5}
                autoPlay={posts.length > 1}
                autoPlayInterval={7000}
                data={posts}
                scrollAnimationDuration={4000}
                renderItem={renderBanner}
                vertical={false}
              />
            </View>
          )}

          <View style={{flex: 1}}>
            <Text style={{fontSize: 18, color: '#959595'}}>Aktiviteter</Text>
            <Calendar
              style={styles.calendar}
              onDayPress={handleDayPress}
              markedDates={markedDates}
            />
            {selectedDate && (
              <View style={styles.activitiesContainer}>
                <Text style={styles.header}>
                  {formatSelectedDate(selectedDate)}
                </Text>
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
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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

export default OverviewScreen;
