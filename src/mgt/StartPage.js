import React, {useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Help from './Help';
import auth from '@react-native-firebase/auth';

const StartPage = ({ navigation  }) => {

  const navigateToPasswordManager = () => {
    // Navigate to the Password Manager screen
    navigation.navigate('MasterPassword');
  };

  const navigateToHelp = () => {
    // Navigate to the Password Manager screen
    navigation.navigate('Help');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Password Manager</Text>
      <Text style={styles.description}>
        Password Manager helps you securely generate and manage your passwords for different websites and services.
      </Text>
      <Text style={styles.description}>
        You can generate strong and unique passwords, generate them securely, and access them whenever you need using a master password.
      </Text>
      <TouchableOpacity onPress={navigateToPasswordManager} style={styles.register}>
        <Text style={styles.registerTitle}>Get Started</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
      
      <TouchableOpacity style={styles.footerIcon} onPress={navigateToHelp}>
                    <Icon name="question" size={24} color="#673AB7" />
        </TouchableOpacity>
      </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    color: 'black'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'black'

  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
    color:'black'
  },
  register: {
    width: '90%',
    backgroundColor: '#673AB7',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  registerTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerIcon: {
    padding: 10,
    margin:10
},
});

export default StartPage;
