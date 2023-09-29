
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Button } from 'react-native';
import FooterMenu from '../components/Menu';
import Axios from 'axios';
import { AuthContext } from '../context/authorization';
import { useFocusEffect } from '@react-navigation/native';
import { SocketContext } from '../context/SocketContext';
import { Ionicons } from '@expo/vector-icons';

const ChatListScreen = ({ navigation }) => {
  const [state] = useContext(AuthContext);
  const socket = useContext(SocketContext);
  const userId = state?.user?._id;

  const [chatList, setChatList] = useState([]);
  const [hasFriends, setHasFriends] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const response = await Axios.get(`/auth/allfriends/${userId}`);
          const friends = response.data;

          const chatListWithLastMessage = await Promise.all(
            friends.map(async (friend) => {
              const lastMessageResponse = await Axios.get(`/auth/lastmessage/${userId}/${friend._id}`);
              const { lastMessage, time } = lastMessageResponse.data[0];

              return {
                ...friend,
                lastMessage,
                time,
              };
            })
          );

          const sortedChatList = chatListWithLastMessage.sort((a, b) => {
            const timeA = new Date(a.time).getTime();
            const timeB = new Date(b.time).getTime();
            return timeB - timeA;
          });

          setChatList(sortedChatList);
          setHasFriends(sortedChatList.length > 0);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }, [userId])
  );

  useEffect(() => {
    socket.on('new-chat', ({ text, roomId, time }) => {
      setChatList((prevChatList) =>
        prevChatList.map((chatItem) => {
          if (chatItem._id === roomId) {
            return {
              ...chatItem,
              lastMessage: text,
              time,
            };
          }
          return chatItem;
        })
      );
    });

    return () => {
      socket.off('chat');
    };
  }, [socket]);

  return (
    <View style={styles.container}>
      {hasFriends ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={chatList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('Chat', { userId: item._id, name: item.name, avatar: item.avatar })}
            >
              <Image source={{ uri: item.avatar }} style={styles.profileImage} />
              <View style={styles.chatDetails}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.lastMessage}>
                  {item.lastMessage
                    ? item.lastMessage.length > 20
                      ? `${item.lastMessage.slice(0, 15)}...`
                      : item.lastMessage
                    : 'No messages'}
                </Text>
              </View>
              <View style={styles.messageInfo}>
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadCount}>{item.time || 2}</Text>
                </View>
               
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noFriendsContainer}>
          <Text style={styles.noFriendsText}>You don't have any friends.</Text>
          <Button title="Make Friends" onPress={() => navigation.navigate('AllUsers')} />
        </View>
      )}
      <FooterMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  chatDetails: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 16,
    color: 'gray',
  },
  messageInfo: {
    alignItems: 'flex-end',
  },
  unreadBadge: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  forwardIcon: {
    marginLeft: 8,
  },
  noFriendsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFriendsText: {
    fontSize: 18,
    marginBottom: 16,
  },
});

export default ChatListScreen;
