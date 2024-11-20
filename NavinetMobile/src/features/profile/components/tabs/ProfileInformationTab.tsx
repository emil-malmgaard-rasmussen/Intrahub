import {StyleSheet, Text, View} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ProfileInformationTab = ({user}) => {
  return (
    <View style={styles.container}>
      <View style={{padding: 10, gap: 10}}>
        <View style={styles.informationContainer}>
          <MaterialIcons name={'person-outline'} size={20}/>
          <Text numberOfLines={2}>
            {user?.displayName}
          </Text>
        </View>
        <View style={styles.informationContainer}>
          <MaterialIcons name={'alternate-email'} size={20}/>
          <Text numberOfLines={2}>
            {user?.email}
          </Text>
        </View>
        <View style={styles.informationContainer}>
          <MaterialIcons name={'phone-iphone'} size={20} />
          <Text numberOfLines={2}>
            {user?.phoneNumber}
          </Text>
        </View>
        <View style={styles.informationContainer}>
          <FontAwesome name={'building-o'} size={20} />
          <Text numberOfLines={2}>
            {user?.companyName}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 40,
  },
  informationContainer: {
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 10,
  },
});

export default ProfileInformationTab;
