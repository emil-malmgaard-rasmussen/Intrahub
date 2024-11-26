import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import {useRefreshContext} from '../../../navigation/RefreshContext.tsx';

interface AdminNetworkMembersListItemProps {
  handleRemoveMemberFunc: (uid: string) => void;
  memberUid: string;
  network: any;
}
const AdminNetworkMembersListItem = (props: AdminNetworkMembersListItemProps) => {
  const {handleRemoveMemberFunc, memberUid, network} = props;
  const [loading, setLoading] = useState<boolean>(true);
  const [member, setMember] = useState<any | null>(null);
  const {triggerRefresh} = useRefreshContext();

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

  const handleRemoveMember = async () => {
    try {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      // Reference to the current network document by its id
      const networkRef = firestore().collection('NETWORKS').doc(network.id);

      // Get the network document
      const networkDoc = await networkRef.get();

      if (!networkDoc.exists) {
        throw new Error('Network does not exist');
      }

      const networkData = networkDoc.data();

      if (!networkData) {
        throw new Error('No response from networkDoc');
      }

      // Check if the current user is an admin in this network
      if (!networkData.administrators.includes(currentUser.uid)) {
        throw new Error(
          'You are not authorized to remove members from this network',
        );
      }

      // If the current user is an admin, proceed to remove the member
      // Fetch the user document using the memberUid (since doc id is randomly generated)
      const userSnapshot = await firestore()
        .collection('USERS')
        .where('uid', '==', memberUid)
        .get();

      if (userSnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = userSnapshot.docs[0].ref; // Get the reference to the first document

      const batch = firestore().batch();

      // Remove the member from the network's users array
      batch.update(networkRef, {
        users: firestore.FieldValue.arrayRemove(memberUid),
      });

      // Remove the network ID from the user's networks array
      batch.update(userDoc, {
        networks: firestore.FieldValue.arrayRemove(network.id),
      });
      handleRemoveMemberFunc(memberUid)
      triggerRefresh();
      await batch.commit();

      Alert.alert(`${member.displayName} er fjernet fra ${network.name}`);
    } catch (error) {
      console.error('Error removing member: ', error);
      Alert.alert('Error:', error.message);
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
          <TouchableOpacity onPress={handleRemoveMember}>
            <MaterialIcons name={'delete'} style={styles.chevron} size={25} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chevron: {
    color: '#f31616',
  },
});

export default AdminNetworkMembersListItem;
