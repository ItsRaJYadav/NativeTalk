// UserProfileScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/authorization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../components/Loader';

const UserProfileScreen = ({ navigation }) => {
  const [state, setState] = useContext(AuthContext);
  const userId = state?.user?._id;
  const [user, setUser] = useState(null);
  console.log(userId)

  const handleLogout = async () => {
    setState({ token: "", user: null });
    await AsyncStorage.removeItem("@auth");
    alert("logout Successfully");
    navigation.navigate('Login');
  };

  const EditProfile = async () => {
    navigation.navigate('EditProfile', { userId})
  };

  useEffect(() => {
    axios.get(`/auth/user/${userId}`)
      .then((response) => {
        setUser(response.data);
        // console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        handleLogout();
      });
  }, [userId]);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.about}>{user.about}</Text>
          <Text style={styles.phone}>{user.phone}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={ EditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

        </>
      ) : (
        <Loader/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  about: {
    fontSize: 16,
    marginBottom: 10,
  },
  phone: {
    fontSize: 16,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  editButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default UserProfileScreen;