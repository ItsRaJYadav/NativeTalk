// UserProfileScreen.js
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet,TouchableOpacity } from 'react-native';
import axios from 'axios';

const UserProfileScreen = ({route}) => {
    const userId = route.params.userId;
    // console.log(userId);
    const [user, setUser] = useState(null);
   

    useEffect(() => {
        axios.get(`/auth/user/${userId}`)
            .then((response) => {
                setUser(response.data);
                // console.log(response.data)
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
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
                style={styles.Button}
                onPress={() => navigation.navigate('EditProfile')}>
                <Text style={styles.ButtonText}>Block</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Loading...</Text>
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
      Button: {
        backgroundColor: '#FF0000',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
      },
      ButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
      },
    });
    
    export default UserProfileScreen;