import NetworkMembersListItem from '../NetworkMembersListItem.tsx';
import {ScrollView, StyleSheet} from 'react-native';
import React from 'react';

const NetworkMembersTab = ({network}: {network: any}) => {
  return (
    <ScrollView style={styles.details}>
      {network.users.map(d => (
        <NetworkMembersListItem key={d} memberUid={d} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  details: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 40,
  },
});

export default NetworkMembersTab;
