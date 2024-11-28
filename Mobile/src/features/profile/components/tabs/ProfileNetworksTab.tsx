import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {ThemeColors} from '../../../../theme/colors.ts';
import useThemeContext from '../../../../theme/useThemeContext.ts';

const ProfileNetworkItem = ({
  user,
  networkId,
}: {
  user: any;
  networkId: string;
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [network, setNetwork] = useState<any | null>(null);
  const {colors} = useThemeContext();
  const styles = createStyles(colors);

  const leaveNetwork = async () => {
    try {
      const currentUser = auth().currentUser;

      if (!currentUser) {
        throw new Error('User is not authenticated');
      }

      // Reference to the current network document by its id
      const networkRef = firestore().collection('NETWORKS').doc(networkId);

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
      if (!networkData.users.includes(currentUser.uid)) {
        throw new Error('You are not a member of this network');
      }

      // If the current user is an admin, proceed to remove the member
      // Fetch the user document using the memberUid (since doc id is randomly generated)
      const userSnapshot = await firestore()
        .collection('USERS')
        .where('uid', '==', user.uid)
        .get();

      if (userSnapshot.empty) {
        throw new Error('User not found');
      }

      const userDoc = userSnapshot.docs[0].ref; // Get the reference to the first document

      const batch = firestore().batch();

      // Remove the member from the network's users array
      batch.update(networkRef, {
        users: firestore.FieldValue.arrayRemove(currentUser.uid),
      });

      // Remove the network ID from the user's networks array
      batch.update(userDoc, {
        networks: firestore.FieldValue.arrayRemove(network.id),
      });

      await batch.commit();

      Alert.alert(`${user.displayName} er fjernet fra ${network.name}`);
    } catch (error) {
      console.error('Error removing member: ', error);
      Alert.alert('Error:', error.message);
    }
  };

  const getNetwork = async () => {
    try {
      const networkSnapshot = await firestore()
        .collection('NETWORKS')
        .where('id', '==', networkId)
        .get();

      if (!networkSnapshot.empty) {
        const userDoc = networkSnapshot.docs[0].data();
        setNetwork(userDoc);
      } else {
        console.log('No network found with the provided ID');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNetwork();
  }, [networkId]);

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
            <Text style={styles.profileNetworkItemTitle}>{network.name}</Text>
            <Text style={styles.profileNetworkItemDescription}>
              {network.description}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={leaveNetwork}>
              <Text style={styles.removeText}>Forlad</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const ProfileNetworksTab = ({user}: {user: any}) => {
  const {colors} = useThemeContext();
  const styles = createStyles(colors);

  if (user.networks.length <= 0) {
    return (
      <View style={styles.details}>
        <Text style={styles.label}>Ingen netværk</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.details}>
      {user.networks.map(d => (
        <ProfileNetworkItem key={d} user={user} networkId={d} />
      ))}
    </ScrollView>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    details: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      paddingBottom: 40,
    },
    removeText: {
      color: '#f31616',
    },
    label: {
      color: '#959595',
      fontStyle: 'italic',
      alignSelf: 'center',
      fontSize: 12,
    },
    profileNetworkItemDescription: {
      color: colors.text.default,
    },
    profileNetworkItemTitle: {
      color: colors.text.default,
      fontSize: 16,
      fontWeight: 'bold',
      paddingVertical: 7.5,
    },
  });

export default ProfileNetworksTab;
