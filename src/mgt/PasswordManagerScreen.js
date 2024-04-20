import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Clipboard , Share} from 'react-native';
import { Checkbox,useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';

import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, { types } from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';
import TextInput from "../ui/TextInput";
import Counter from "./Counter";
import {
  isProfileValid,
  isLengthValid,
  isCounterValid,
  areOptionsValid,
} from "./validations";

import { generatePassword } from './passGenerator';

const PasswordManagerScreen = ({  navigation,route }) => {
  const [website, setWebsite] = useState(''); //site
  const [username, setUsername] = useState('');  //login
  const [lowercase, setLowercase]=useState('checked');   
  const [uppercase, setUppercase]=useState('checked');   
  const [digits, setDigits]=useState('checked');   
  const [symbols, setSymbols]=useState('checked');   
  const [length, setLength]=useState(16);   
  const [counter, setCounter]=useState(1);   
  const [showPassword, setShowPassword] = useState(false); 
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [data, setData]=useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const { masterPassword } = route.params;

  const theme = useTheme();

  const navigateToLoad = () => {
    // Navigate to the Password Manager screen
    navigation.navigate('Load',{masterPassword});
  };
  
  
  
  
  const maskPassword = (pass) => {
    let str = '';
    for (let index = 0; index < pass.length; index++) {
      str += '*';
    }
    return str;
  };

  const copyText = async (txt) => {
    try {
      await Clipboard.setString(txt);
      setAlertVisible(true);
      setTimeout(() => {
        setAlertVisible(false);
      }, 2000);
    } catch (error) {
      console.error('Error copying text:', error);
    }
  };

  const deletePassword = (website) => {
    const updatedPasswords = passwords.filter((e) => e.website !== website);
    setPasswords(updatedPasswords);
    alert(`Successfully deleted ${website}'s password`);
  };

  
  const savePassword = () => {
    if (!website || !username) {
      alert('Please fill in both username and website fields.');
      return;
    }

    const newPassword = {
      website,
      username,
      lowercase,
      uppercase,
      digits,
      symbols,
      length,
      counter,
      password: generatePassword(masterPassword,website,username,lowercase,uppercase,digits,symbols,length,counter),
    };

    const newData={
      website,
      username,
      lowercase,
      uppercase,
      digits,
      symbols,
      length,
      counter
    };

    if (editing) {
      // Update the existing password object
      const updatedPasswords = [...passwords];
      updatedPasswords[editIndex] = newPassword;
      setPasswords(updatedPasswords);
    } else {
      // Add the new password object
      setPasswords([...passwords, newPassword]);
    }


    //setPasswords([...passwords, newPassword]);
    setData([...data,newData]);
    setWebsite('');
    setUsername('');
    setPassword('');
    setEditing(false);
    setEditIndex(null);

  };

  const editPassword = (index) => {
    setEditing(true);
    setEditIndex(index);
    setWebsite(passwords[index].website);
    setUsername(passwords[index].username);
    setLowercase(passwords[index].lowercase);
    setUppercase(passwords[index].uppercase);
    setDigits(passwords[index].digits);
    setSymbols(passwords[index].symbols);
    setLength(passwords[index].length);
    setCounter(passwords[index].counter);
    setPassword(passwords[index].password);
  };

  const savePasswords = async () => {
    try {
      const passwordsJSON = JSON.stringify(data);
      await AsyncStorage.setItem('passwords.json', passwordsJSON);
      console.log(passwords);
      // Provide feedback to the user
      alert('Passwords saved successfully!');
    } catch (error) {
      console.error('Error saving passwords:', error);
      // Provide feedback to the user about the error
      alert('Error saving passwords. Please try again.');
    }
  };
  
  const downloadPasswords = async () => {
    try {
      const passwordsJSON = await AsyncStorage.getItem('passwords.json');
      if (passwordsJSON) {
        
        const fileType = 'application/json';
        
        // Ensure passwordsJSON contains valid JSON data
        const formattedPasswords = JSON.parse(passwordsJSON); 
        console.log(passwordsJSON);
        const shareOptions = {
            title: 'Download Passwords',
            message: passwordsJSON,
            url: `data:${fileType};base64,${encodeURIComponent(JSON.stringify(formattedPasswords))
              }`, // Encode to handle special characters and spaces
            failOnCancel: false,
          };
  
        await Share.share(shareOptions);
      } else {
        alert('No passwords found.');
      }
    } catch (error) {
      console.error('Error sharing passwords:', error); // Log the error
      alert('Error sharing passwords. Please try again.');
    }
  };
  
  
  
  const renderPasswordList = () => {
    return passwords.map((item, index) => (
      <View style={styles.passwordItem} key={index}>
        <View style={styles.listItem}>
          <Text style={styles.listLabel}>Website:</Text>
          <Text style={styles.listValue}>{item.website}</Text>
          <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.website)}>
            <Icon name="copy" size={20} color="#673AB7" />
          </TouchableOpacity>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listLabel}>Username:</Text>
          <Text style={styles.listValue}>{item.username}</Text>
          <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.username)}>
            <Icon name="copy" size={20} color="#673AB7" />
          </TouchableOpacity>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listLabel}>Counter:</Text>
          <Text style={styles.listValue}>{item.counter}</Text>
          <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.username)}>
            <Icon name="copy" size={20} color="#673AB7" />
          </TouchableOpacity>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listLabel}>Password:</Text>
          <Text style={styles.listValue}>{showPassword?item.password:maskPassword(item.password)}</Text>
          <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.password)}>
            <Icon name="copy" size={20} color="#673AB7" />
          </TouchableOpacity>
          <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => editPassword(index)}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deletePassword(item.website)}>
            <Icon name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
        </View>
        
      </View>
    ));
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword); // Toggle visibility on icon click
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
      {/* <Text style={styles.subHeading}>{editing ? 'Edit Password' : 'Add a Password'}</Text> */}
      <Text style={styles.subHeading}>{editing ? 'Edit Password' : 'Add a Password'}</Text>
      <TextInput
                label="Site"
                value={website}
                onChangeText={(text) => setWebsite(text)}
              />
              <TextInput
                label="Login"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
        
        
          <View
      style={{
        
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          marginLeft: -5,
        }}
      >
        <Checkbox
          status={lowercase ? "checked" : "unchecked"}
          onPress={() => {setLowercase(!lowercase)}}
        />
        <Text style={{ fontSize: 16, color: theme.colors.primary }}>a-z</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 5,
        }}
      >
        <Checkbox
          status={uppercase ? "checked" : "unchecked"}
          onPress={() => {setUppercase(!uppercase)}}
        />
        <Text style={{ fontSize: 16, color: theme.colors.primary }}>A-Z</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginRight: 5,
        }}
      >
        <Checkbox
          status={digits ? "checked" : "unchecked"}
          onPress={() => {setDigits(!digits)}}
        />
        <Text style={{ fontSize: 16, color: theme.colors.primary }}>0-9</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Checkbox
          status={symbols ? "checked" : "unchecked"}
          onPress={() => {setSymbols(!symbols)}}
        />
        <Text style={{ fontSize: 16, color: theme.colors.primary }}>!@%</Text>
      </View>
    </View>
  <View
                style={{
                  marginTop: 5,
                  marginBottom: 30,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Counter
                  label="Length"
                  value={length}
                  setValue={(length) => setLength((length))}
                   isValueValid={isLengthValid}
                />
                <Counter
                  label="Counter"
                  value={counter}
                  setValue={(counter) => setCounter(counter)                  }
                   isValueValid={isCounterValid}
                />
              </View>

        <TouchableOpacity onPress={savePassword} style={styles.register}>
        <Text style={styles.registerTitle}>{editing ? 'Update Password' : 'Generate Password'}</Text>
      </TouchableOpacity>
        <Text>{password}</Text>
        <View style={styles.footer}>
        <TouchableOpacity style={styles.footerIcon} onPress={toggleShowPassword}>
            <Icon name="eye" size={30} color= '#673AB7' />
          </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon} onPress={savePasswords}>
                    <Icon name="save" size={24} color="#673AB7" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon} onPress={downloadPasswords}>
                    <Icon name="download" size={24} color="#673AB7" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon} onPress={navigateToLoad}>
                    <Icon name="list" size={24} color="#673AB7" />
                </TouchableOpacity>
                
          </View>
          <Text style={styles.subHeading}>Your Passwords</Text>
        {alertVisible && <Text id="alert"> (Copied!)</Text>}
        {passwords.length === 0 ? (
          <Text style={styles.noData}>No Data To Show</Text>
        ) : (
          <ScrollView horizontal>
            <View >{renderPasswordList()}</View>
          </ScrollView>
        )}
        
        
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    padding: 5,
    
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  register: {
    width: '90%',
    backgroundColor: '#673AB7',
    padding: 12,
    borderRadius: 30,
    alignItems: 'center',
    margin: 20,
  },
  registerTitle: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  subHeading: {
    fontSize: 20,
    marginBottom: 10,
    color: '#555',
  },
  table: {
    flexDirection: 'Column',
    color: 'black',
    
    alignItems: 'center',
    
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
    
    padding:15,
    marginBottom: 10,
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
    fontSize: 13,
    
  },
  copyIcon: {
    marginLeft: 10,
    color: '#555',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    margin: 5,
    
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 5,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    margin: 5,
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
    margin: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  // Footer styles
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    bottom:10,
    padding:10

},
footerIcon: {
    padding: 10,
    margin:10
},
});

export default PasswordManagerScreen;