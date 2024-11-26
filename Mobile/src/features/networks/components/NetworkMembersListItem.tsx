import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import useThemeContext from '../../../theme/useThemeContext.ts';
import {ThemeColors} from '../../../theme/colors.ts';

const NetworkMembersListItem = ({memberUid}: {memberUid: string}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [member, setMember] = useState<any | null>(null);
  const {colors} = useThemeContext();
  const themeStyles = styles(colors);

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
        <View style={themeStyles.container}>
          <View style={{flexDirection: 'column', flex: 1}}>
            <Text style={themeStyles.nameText}>{member.displayName}</Text>
            {member.companyName && (
              <Text style={themeStyles.infoText}>{member.companyName}</Text>
            )}
            {member.phoneNumber && (
              <Text style={themeStyles.infoText}>{member.phoneNumber}</Text>
            )}
            <Text style={themeStyles.infoText}>{member.email}</Text>
          </View>
          <FontAwesome5
            name={'chevron-right'}
            style={themeStyles.chevron}
            size={20}
          />
        </View>
      )}
    </View>
  );
};

const styles = (colors: ThemeColors) =>
  StyleSheet.create({
    chevron: {
      color: '#CCCCCC',
    },
    nameText: {
      fontSize: 16,
      fontWeight: 'bold',
      paddingVertical: 7.5,
      color: colors.text.default,
    },
    infoText: {
      color: colors.text.default,
    },
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

export default NetworkMembersListItem;
