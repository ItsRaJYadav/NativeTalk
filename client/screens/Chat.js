import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/authorization';

const MessageItem = React.memo(({ item, currentUserId }) => {
  return (
    <View>
      <View
        style={[
          styles.messageItem,
          {
            alignSelf: item.senderId === currentUserId ? 'flex-end' : 'flex-start',
            backgroundColor: item.senderId === currentUserId ? '#007BFF' : '#EFEFEF',
          },
        ]}
      >
        <Text
          style={[
            styles.messageText,
            {
              color: item.senderId === currentUserId ? 'white' : 'black',
            },
          ]}
        >
          {item.text}
        </Text>
      </View>
      <Text
        style={[
          styles.timeText,
          {
            alignSelf: item.senderId === currentUserId ? 'flex-end' : 'flex-start',
            color: item.senderId === currentUserId ? '#007BFF' : 'gray',
          },
        ]}
      >
        {item.time}
      </Text>
    </View>
  );
});

const ChatScreen = ({ navigation, route }) => {
  const socket = useContext(SocketContext);
  const [newMessage, setNewMessage] = useState('');
  const Id = route?.params?.userId;
  const name = route?.params?.name;
  const uri = route?.params?.avatar;

  const [state] = useContext(AuthContext);
  const currentUserId = state?.user?._id;
  const flatListRef = useRef(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  
  useEffect(() => {
    const userId1 = currentUserId;
    const userId2 = Id;

    const fetchMessagesAndRoomId = async () => {
      try {
        console.log('Sending Axios request...');
        const response = await axios.get(`/auth/chat/room/${userId1}/${userId2}`);

        if (Array.isArray(response.data) && response.data.length > 0) {
          const { roomId, messages } = response.data[0];

          setCurrentRoomId(roomId);
          setMessages(messages);
          // console.log(response.data);

          socket.emit('join-room', { roomId, role: 'user' });
        } else {
          console.error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching chat room and messages:', error);
      }
    };

    fetchMessagesAndRoomId();

    socket.on('chat', (data) => {
      if (data.roomId === currentRoomId && data.senderId !== currentUserId) {
        setMessages((prevMessages) => [...prevMessages, data]);

        // Scroll to the end with animation
        flatListRef.current.scrollToEnd({ animated: true });
      }
    });

    socket.on('typing-started-from-server', ({ roomId }) => {
      if (roomId === currentRoomId) {
        setIsTyping(true);
        clearTypingTimeout();
      }
    });

    socket.on('typing-stopped-from-server', ({ roomId }) => {
      if (roomId === currentRoomId) {
        setIsTyping(false);
        startTypingTimeout();
      }
    });

    return () => {
      socket.off('chat');
      socket.off('typing-started-from-server');
      socket.off('typing-stopped-from-server');
      clearTypingTimeout();
    };
  }, [route, currentUserId, Id, socket, currentRoomId]);

  const clearTypingTimeout = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const startTypingTimeout = () => {
    typingTimeoutRef.current = setTimeout(() => {
      if (currentRoomId) {
        socket.emit('stop_typing', { roomId: currentRoomId });
      }
    }, 5000);
  };

  const handleSendMessage = () => {
    if (!currentRoomId) {
      console.error('Room ID is not available.');
      return;
    }

    const currentTime = new Date().toLocaleString();
    const newMessageObj = {
      senderId: currentUserId,
      text: newMessage,
      roomId: currentRoomId,
      time: currentTime,
    };

    socket.emit('chat', newMessageObj);

    setMessages((prevMessages) => [...prevMessages, newMessageObj]);
    setNewMessage('');

    socket.emit('stop_typing', { roomId: currentRoomId });
    

    // Scroll to the end with animation
    flatListRef.current.scrollToEnd({ animated: true });
    
  };

  const handleTyping = () => {
    if (!currentRoomId) {
      console.error('Room ID is not available.');
      return;
    }

    socket.emit('typing', { roomId: currentRoomId });
    clearTypingTimeout();
  };

  const handleTypingStopped = () => {
    if (!currentRoomId) {
      console.error('Room ID is not available.');
      return;
    }

    socket.emit('stop_typing', { roomId: currentRoomId });
    startTypingTimeout();
  };

  const navigateToUserProfile = () => {
    navigation.navigate('UserProfile', { userId: Id });
  };

  
  const openFilePicker = () => {
    // Implement file picker 
  };


  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.profileInfo} onPress={navigateToUserProfile}>
          <Image source={{ uri }} style={styles.profileImage} />
          <Text style={styles.profileName}>{name}</Text>

          {isTyping && (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>typing...</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {currentRoomId !== null ? (
        <FlatList
          data={messages}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item }) => (
            <MessageItem item={item} currentUserId={currentUserId} />
          )}
          ref={flatListRef}
          onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        />
      ) : (
        <ActivityIndicator size="large" color="#007BFF" />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
          onFocus={handleTyping}
          onBlur={handleTypingStopped}
          editable={currentRoomId !== null}
          multiline
        />
        {newMessage.trim().length < 1 && !isTyping && (
          <>
           
            <TouchableOpacity style={styles.iconButton} onPress={openFilePicker}>
              <Ionicons name="attach" size={28} color="black" />
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={currentRoomId === null || newMessage.trim() === ''}
        >
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  messageContainer: {
    flexGrow: 1,
  },
  messageItem: {
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    alignSelf: 'flex-start', // Adjust as needed
    maxWidth: '70%',
    flexDirection: 'row', // Add this to align text and time horizontally
    justifyContent: 'space-between', // Add this to create space between text and time
    alignItems: 'center', // Add this to vertically center text and time
  },
  messageText: {
    fontSize: 16,
    flex: 1, // Allow text to wrap if it overflows
  },
  timeText: {
    fontSize: 12,
    marginLeft: 8, // Add some spacing between text and time
  },
  dateText: {
    textAlign: 'center',
    paddingVertical: 8,
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 8,
    marginLeft: 8,
  },
  // Style for the typing indicator
  typingIndicator: {
    padding: 8,
    alignItems: 'center',
  },
  typingText: {
    fontStyle: 'italic',
    color: 'gray',
  },
  iconButton: {
    marginLeft: 8,
  },
});

export default ChatScreen;

