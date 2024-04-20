import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TextInput from "../ui/TextInput";
//import { Icon } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

const MasterPasswordScreen = ({ navigation }) => {
  const [masterPassword, setMasterPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const validateMasterPassword = () => {

    
    // Perform validation logic here
    // For simplicity, let's just check if the master password is not empty
    if (masterPassword.trim() !== '') {
      navigation.navigate('PasswordManager', { masterPassword });
    } else {
      // Show an error message or handle invalid master password
      alert('Please enter a valid master password.');
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle visibility on icon click
  };


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Enter Master Password</Text>
      <TextInput
        
        placeholder="Master Password"
        placeholderTextColor="#000"
        secureTextEntry={!showPassword}
        value={masterPassword}
        onChangeText={setMasterPassword}
      />
      <TouchableOpacity style={styles.footerIcon} onPress={toggleShowPassword}>
            <Icon name="eye" size={30} color= '#673AB7' />
          </TouchableOpacity>
      <TouchableOpacity onPress={validateMasterPassword} style={styles.register}>
        <Text style={styles.registerTitle}>Submit</Text>
      </TouchableOpacity>
      
    </View>
  );
};

/*const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 20,
    marginBottom: 20,
    color:'black'

  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    color:'black'

  },
  submitButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
});*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  register: {
    width: '90%',
    backgroundColor: '#673AB7',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 40,
  },
  footerIcon: {
    padding: 10,
    margin:10,
    backgroundColorcolor: "#673AB7",
},
  registerTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  subHeading: {
    fontSize: 20,
    marginBottom: 10,
    color: '#555',
  },
  noData: {
    fontSize: 16,
    fontStyle: 'italic',
    marginBottom: 10,
    color: '#777',
    textAlign: 'center',
  },
  passwordItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  listLabel: {
    fontWeight: 'bold',
    marginRight: 5,
    color: '#333',
  },
  listValue: {
    flex: 1,
    color: '#555',
  },
  copyIcon: {
    marginLeft: 10,
    color: '#555',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  input: {
    color: '#333',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MasterPasswordScreen;
