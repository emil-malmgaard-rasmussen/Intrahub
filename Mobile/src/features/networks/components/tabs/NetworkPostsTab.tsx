import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // For Chevron
import {SCREEN_WIDTH} from '../../../../utils/Dimensions.ts';
import {useRefreshContext} from '../../../../navigation/RefreshContext.tsx';

const NetworkPostsTab = ({networkId}) => {
  const [posts, setPosts] = useState<any[]>([]);
  const navigation = useNavigation();
  const {refresh} = useRefreshContext();

  const getNetworkPosts = async () => {
    firestore()
      .collection('POSTS')
      .where('networkId', '==', networkId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        if (!snapshot) {
          return;
        }
        if (snapshot.docs.length <= 0) {
          setPosts([]);
        } else {
          const fetchedPosts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPosts(fetchedPosts);
        }
      });
  };

  useEffect(() => {
    getNetworkPosts();
  }, [networkId]);

  useEffect(() => {
    if (refresh) {
      getNetworkPosts();
    }
  }, [refresh]);

  const handlePostDetailNavigation = post => {
    navigation.navigate('NetworkPostDetail', {post: post});
  };

  if (posts.length <= 0) {
    return (
      <View style={styles.noContentContainer}>
        <Text style={styles.noContent}>Ingen aktiviteter</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {posts.map(post => (
        <TouchableOpacity
          key={post.id}
          onPress={() => handlePostDetailNavigation(post)}
          style={styles.postItem}>
          <View style={styles.postItemText}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBio}>{post.bio}</Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  noContentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  postsHeading: {
    color: '#959595',
    fontSize: 16,
  },
  formContainer: {
    overflow: 'hidden',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1ba16e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imagePicker: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    height: 150,
    marginBottom: 10,
    borderRadius: 8,
  },
  imagePickerText: {
    color: '#888',
  },
  imagePreview: {
    width: SCREEN_WIDTH - 40,
    height: 150,
    borderRadius: 8,
  },
  postItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  postItemText: {
    flex: 1,
  },
  postTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postBio: {
    color: '#888',
    fontSize: 14,
  },
  errorText: {
    color: '#a11d1d',
  },
  noContent: {
    color: '#959595',
  },
});

export default NetworkPostsTab;
