import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const NetworkMembersListItem = ({memberUid}: {memberUid: string}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [member, setMember] = useState<any | null>(null);

  const getMembers = async () => {
    try {
      const userSnapshot = await firestore()
        .collection('USERS')
        .where('uid', '==', memberUid)
        .get();

      if (!userSnapshot.empty) {
        const userDoc = userSnapshot.docs[0].data();
        setMember(userDoc);
      } else {
        console.log('No member found with the provided UID');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMembers();
  }, [memberUid]);

  return (
    <View style={{padding: 10, borderBottomWidth: 1, borderColor: '#ddd'}}>
      {loading ? (
        <ActivityIndicator size="small" />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                paddingVertical: 7.5,
              }}>
              {member.displayName}
            </Text>
            {member.companyName && <Text>{member.companyName}</Text>}
            {member.phoneNumber && <Text>{member.phoneNumber}</Text>}
            <Text>{member.email}</Text>
          </View>
          <FontAwesome5
            name={'chevron-right'}
            style={styles.chevron}
            size={20}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chevron: {
    color: '#CCCCCC',
  },
});

export default NetworkMembersListItem;
