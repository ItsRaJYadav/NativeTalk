


import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert, Image } from 'react-native';
import Axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import FooterMenuItem from '../components/Menu';
import { AuthContext } from '../context/authorization';

const UsersScreen = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const userId = state?.user?._id;
  const [quickAddUsers, setQuickAddUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [friendRequestSuccess, setFriendRequestSuccess] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quickAddResponse = await Axios.get(`/auth/allusers/${userId}`);
        setQuickAddUsers(quickAddResponse.data);
        setFilteredUsers(quickAddResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId, friendRequestSuccess]); 

  useEffect(() => {
    if (searchQuery) {
      const filtered = quickAddUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(quickAddUsers);
    }
  }, [searchQuery, quickAddUsers]);

  const sendFriendRequest = async (userId) => {
    try {
      const response = await Axios.post('/auth/createRoom', {
        receiverId: userId,
        senderId: state.user._id,
      });

      if (response.status === 201) {
        setFriendRequestSuccess(true);
        Alert.alert('Friend Request Sent', 'Your friend request was sent successfully.');
      } else {
        Alert.alert('Friend Request Error', 'Unexpected response status code: ' + response.status);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Alert.alert('Friend Request Error', 'You have already sent a friend request to this user.');
        return
      }
      if (error.response && error.response.status === 404) {
        Alert.alert('User id not found ');
      } else {
       
        Alert.alert('Error', 'There was an error');
      }
    }
  };


  
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>iMessage</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('AllRequests');
          }}
        >
          <Text style={styles.buttonText}>All Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('AllUnreadMessages');
          }}
        >
          <Text style={styles.buttonText}>Unread Messages</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search users..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => item._id + index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.userContainer}
           
          >
            <Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{item.name}</Text>
            {!item.isFriend && (
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => sendFriendRequest(item.id)}
              >
                <Ionicons name="person-add" size={24} color="#007BFF" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        )}
      />

      <FooterMenuItem />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    elevation: 2,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconButton: {
    marginLeft: 'auto',
  },
});

export default UsersScreen;

