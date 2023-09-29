// LandingPage.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const LandingPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://icon-library.com/images/sms-app-icon/sms-app-icon-17.jpg' }}
        style={styles.illustration}
      />
      <Text style={styles.header}>Welcome to My Chat App</Text>
      <Text style={styles.subheader}>Connect and chat with friends and family.</Text>
      <Text style={styles.slogan}>Chat Anytime, Anywhere!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  illustration: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  slogan: {
    fontSize: 18,
    marginBottom: 32,
    color: '#007BFF',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LandingPage;
