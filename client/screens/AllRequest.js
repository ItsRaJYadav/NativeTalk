import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Axios from 'axios';
import { AuthContext } from '../context/authorization';
import FooterMenu from '../components/Menu';

const AllRequestsScreen = ({ navigation }) => {
    const [requests, setRequests] = useState([]);
    const [state] = useContext(AuthContext);
    const userId = state?.user?._id;

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await Axios.get(`/auth/allrequests/${userId}`);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchRequests();
    }, []);

    const acceptRequest = async (requestId) => {
        console.log('Accepting request:', userId, requestId);
        try {
           
            await Axios.post('/auth/acceptFriendReq', { senderId: userId, receiverId: requestId });
            // Remove the accepted request from the requests state
            setRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };
    



    return (
        <>
            <View style={styles.container}>
                <Text style={styles.header}>Friend Requests</Text>
                {requests.length === 0 ? (
                    <Text>You have no friend requests.</Text>
                ) : (
                    <FlatList
                        data={requests}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => (
                            <View style={styles.requestContainer}>
                                <Image source={{ uri: item.avatar }} style={styles.profileImage} />
                                <Text style={styles.requestName}>{item.name} </Text>
                                <TouchableOpacity
                                    style={styles.acceptButton}
                                    onPress={() => acceptRequest(item._id)}
                                >
                                    <Text style={styles.buttonText}>Accept</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                )}

            </View>
            <FooterMenu />
        </>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    requestContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    requestName: {
        fontSize: 16,
    },
    acceptButton: {
        backgroundColor: 'green',
        padding: 8,
        borderRadius: 8,
    },
    declineButton: {
        backgroundColor: 'red',
        padding: 8,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    }
});

export default AllRequestsScreen;
