import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from the appropriate package

const YourFormComponent = ({ route }) => {
    const Id = route?.params?.userId;
    console.log(Id);
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [image, setImage] = useState(null);
    const handleImageUpload = () => {
        // Implement image upload logic here (e.g., using a file picker library)
        // Set the selected image file using `setImage`
    };

    const handleSubmit = () => {
        // Create a FormData object to send as a POST request
        const formData = new FormData();
        formData.append('name', name);
        formData.append('about', about);
        formData.append('image', image); // Append the image file to the form data


        Axios.post('YOUR_SERVER_URL', formData)
            .then((response) => {
            })
            .catch((error) => {
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <Ionicons name="person" size={24} color="black" style={styles.icon} />
                <TextInput
                    placeholder="Name"
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Ionicons name="information-circle" size={24} color="black" style={styles.icon} />
                <TextInput
                    placeholder="About"
                    style={styles.input}
                    value={about}
                    onChangeText={(text) => setAbout(text)}
                />
            </View>
            <TouchableOpacity onPress={handleImageUpload}>
                <Ionicons name="attach" size={24} color="black" style={styles.icon} />
                <Text style={styles.uploadText}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    uploadText: {
        fontSize: 16,
        color: 'blue',
        marginLeft: 8,
    },
    submitButton: {
        backgroundColor: 'blue',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
    },
    submitButtonText: {
        fontSize: 18,
        color: 'white',
    },
});

export default YourFormComponent;
