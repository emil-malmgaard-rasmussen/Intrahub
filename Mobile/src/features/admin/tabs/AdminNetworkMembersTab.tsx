import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import AdminNetworkMembersListItem from '../components/AdminMembersListItem.tsx';
import {SCREEN_HEIGHT} from '../../../utils/Dimensions.ts';

interface AdminNetworkMembersTabProps {
  network: any;
  handlePresentModalPress: () => void;
  handleRemoveMember: (uid: string) => void;
}

const AdminNetworkMembersTab = (props: AdminNetworkMembersTabProps) => {
  const {network, handlePresentModalPress, handleRemoveMember} = props;

  return (
    <View style={styles.details}>
      <TouchableOpacity
        style={{alignSelf: 'center', paddingVertical: 4}}
        onPress={handlePresentModalPress}>
        <Text
          style={{
            color: '#1b6cc8',
            fontSize: 16,
            textDecorationLine: 'underline',
          }}>
          Tilføj medlem
        </Text>
      </TouchableOpacity>
      <ScrollView showsVerticalScrollIndicator={false}>
        {network.users.map(d => (
          <AdminNetworkMembersListItem
            key={d}
            memberUid={d}
            network={network}
            handleRemoveMemberFunc={handleRemoveMember}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  details: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 40,
    height: SCREEN_HEIGHT / 1.3,
  },
});

export default AdminNetworkMembersTab;
