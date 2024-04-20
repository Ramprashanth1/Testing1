import {
    Button,
    View,
    Text,
    
    StyleSheet,
    TouchableOpacity,
    Alert,
  } from 'react-native';
  
import TextInput from "../ui/TextInput";
  import React, { useState, useEffect } from 'react';
  import auth from '@react-native-firebase/auth';
  import firestore from '@react-native-firebase/firestore';
  
  const LogoutScreen = () => {
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [currentUserid, setCurrentUserid] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const writeUserDataToFirestore = async (userId, firstName, lastName) => {
        try {
          const docRef = firestore().collection('users').doc(userId);
          await docRef.set({
            fname,
            lname,
          });
          console.log('User data written successfully!');
        } catch (error) {
          console.error('Error writing user data:', error);
        }
      };

    const handleRegistration = async () => {
        // ... existing registration logic (email, password, etc.)
    
        try {
          //const userCredential = await auth().createUserWithEmailAndPassword(email, password);
          //const userId = userCredential.user.uid; // Get the newly created user ID
          const userId = currentUserid;
          await writeUserDataToFirestore(userId, firstName, lastName);
          Alert.alert('Registration successful!');
          // Navigate to Login Screen or other appropriate screen
        } catch (error) {
          console.error('Registration error:', error);
          Alert.alert('Registration failed. Please try again.');
        }
      };
    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged((user) => {
        if (user) {
            console.log(user.uid);
          setCurrentUserEmail(user.email);
          setCurrentUserid(user.uid);
        } else {
          setCurrentUserEmail(null); // Clear email when logged out
        }
      });
  
      return unsubscribe; // Cleanup function to prevent memory leaks
    }, []);
  
    const handleLogout = async () => {
      try {
        await auth().signOut();
        Alert.alert('Successfully logged out!');
      } catch (error) {
        console.error('Error logging out:', error);
        Alert.alert('Logout failed. Please try again.');
      }
    };
  
    return (
      <View style={styles.container}>
         <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      {/* ... other registration form elements */}
      <Button title="Update" onPress={handleRegistration} style={styles.button}/>
        <Text style={styles.heading}>
          {currentUserEmail ? (
            `You are logged in as: ${currentUserEmail}`
          ) : (
            'You are currently logged out.'
          )}
        </Text>
        <Button title="Log Out" onPress={handleLogout} style={styles.button} />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color:'black'
    
      },
    text: {
      fontSize: 16,
      marginBottom: 20,
    },
    button: {
      padding: 10,
      borderRadius: 5,
    },
  });
  
  export default LogoutScreen;