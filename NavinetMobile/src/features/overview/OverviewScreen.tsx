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

const OverviewScreen = ({navigation}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);

  const renderBanner = ({item}) => {
    return <BannerSlider data={item} />;
  };

  const fetchPosts = async (networkIds: any[]) => {
    setLoading(true);
    try {
      // Extract the network IDs

      if (networkIds.length > 0) {
        // Query the 'POSTS' collection for posts in the user's networks
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

    const activities = networksSnapshot.docs.map(doc => doc.data());

    const marked = activities.reduce((acc, activity) => {
      let activityDate;

      if (activity.date.toDate) {
        activityDate = moment(activity.date.toDate()).format('YYYY-MM-DD');
      } else {
        activityDate = moment(activity.date).format('YYYY-MM-DD');
      }

      if (!acc[activityDate]) {
        acc[activityDate] = {
          marked: true,
          selected: false,
          selectedColor: '#0aada8',
          activities: [],
        };
      }

      acc[activityDate].activities.push({
        title: activity.title,
        description: activity.description,
      });

      return acc;
    }, {});
    setMarkedDates(marked);
  };

  useEffect(() => {
    const user = auth().currentUser;
    const uid = user.uid;

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

  const formatSelectedDate = dateString => {
    const dayOfWeek = moment(dateString).format('dddd');
    const date = moment(dateString).format('D/M/YYYY');
    return `Aktiviteter for ${dayOfWeek} d. ${date}`;
  };

  const handleDayPress = day => {
    setSelectedDate(day.dateString);
    const selectedActivities = markedDates[day.dateString]?.activities || [];
    setActivities(selectedActivities);
  };

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
                loop
                width={SCREEN_WIDTH - 40}
                height={SCREEN_WIDTH / 1.5}
                autoPlay={true}
                autoPlayInterval={7000}
                data={posts}
                scrollAnimationDuration={4000}
                renderItem={renderBanner}
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
