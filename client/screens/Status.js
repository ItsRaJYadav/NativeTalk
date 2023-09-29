import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import FooterMenu from '../components/Menu';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';

const StatusScreen = ({ navigation }) => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const dummyStories = [
      { id: '1', username: 'user1', image: 'https://via.placeholder.com/150' },
      { id: '2', username: 'user2', image: 'https://via.placeholder.com/150' },
    ];

    setStories(dummyStories);
  }, []);

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Status</Text>
      <FlatList
        data={stories}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.storyContainer}
            onPress={() => navigation.navigate('ViewStatus', { story: item })}
          >
            <Image source={{ uri: item.image }} style={styles.storyImage} />
            <Text style={styles.storyUsername}>{item.username}</Text>
          </TouchableOpacity>
        )}
      />

      
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  storyContainer: {
    marginRight: 16,
    alignItems: 'center',
  },
  storyImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  storyUsername: {
    marginTop: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'blue', // Change the color to your desired button color
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default StatusScreen;
