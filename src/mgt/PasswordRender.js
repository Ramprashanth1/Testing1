import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet,theme, Clipboard,color, Checkbox , Share,Keyboard,TouchableWithoutFeedback,KeyboardAvoidingView, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { sha256 } from 'js-sha256';
//import { pbkdf2 } from 'crypto';
//import crypto from 'crypto';
//import {pbkdf2} from 'pbkdf2';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, { types } from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';


import { generatePassword } from "./passwordGenerator.js";
//import TextInput from "../ui/TextInput";

import Styles from "../ui/Styles.js";
import Counter from "./Counter.js";
import Options from "./Options";
//import MasterPassword from "./MasterPassword";
import { NativeModules } from "react-native";

import {
  isProfileValid,
  isLengthValid,
  isCounterValid,
  areOptionsValid,
} from "./validations.js";
import { Button, Snackbar, useTheme } from "react-native-paper";
import { addError, cleanErrors } from "../errors/errorsActions";


const PasswordRender = ({ route, navigation }) => {
  const [site, setSite] = useState('');
  const [login, setLogin] = useState('');
  const [lowercase, setLowercase] = useState(true);
const [uppercase, setUppercase] = useState(true);
const [digits, setDigits] = useState(true);
const [symbols, setSymbols] = useState(true);
  const [length, setLength] = useState('');
  const [counter, setCounter]=useState('');
  const [password, setPassword] = useState('');
  const [passwords, setPasswords] = useState([]);
  const [data, setData]=useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const { masterPassword } = route.params; 

  const navigateToFile = () => {
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
    if (!site || !login || !masterPassword) {
      alert('Please fill all fields.');
      return;
    }

    const newPassword = {
      site,
      login,
      masterPassword,
      lowercase,
      uppercase,
      digits,
      symbols,
      length,
      counter,
      password: generatePassword(masterPassword, site,  login,  length,  counter,  lowercase,  uppercase,  digits,  symbols),
    };

    const newData={
      site,
      login,
      lowercase,
      uppercase,
      digits,
      symbols,
      length,
      counter,
    };
    setPasswords([...passwords, newPassword]);
    setData([...data,newData]);
    setSite('');
    setLogin('');
    setLowercase('');
    setUppercase('');
    setDigits('');
    setSymbols('');
    setLength('');
    setCounter('');

  };

  const editPassword = (index) => {
    setEditing(true);
    setEditIndex(index);
    setWebsite(passwords[index].site);
    setUsername(passwords[index].login);
    setUsername(passwords[index].lowercase);
    setUsername(passwords[index].uppercase);
    setUsername(passwords[index].digits);
    setUsername(passwords[index].symbols);
    setUsername(passwords[index].length);
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
  
  const handleDocumentSelection = useCallback(async () => {
    try {
      
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
         // Assuming JSON files (adjust if needed)
      });
      //console.log(response);
      //const obj = JSON.parse(response);
      console.log(response[0].name);
      //console.log(obj);
      setFileResponse(response);
      console.log('File selected:', response);

      if (response.error) {
        console.error('Error selecting file:', response.error);
        return;
      }

      const fileData = await readFile(response[0].uri);
      if (fileData) {
        try {
          const loadedPasswords = JSON.parse(fileData);
          setPasswords(loadedPasswords);
          alert('Passwords loaded successfully!');
        } catch (error) {
          console.error('Error parsing JSON file:', error);
          alert('Invalid JSON file. Please select a valid passwords.json file.');
        }
      } else {
        alert('No file selected.');
      }
    } catch (err) {
      console.error('Error loading passwords:', err);
      alert('Error loading passwords. Please try again.');
    }
  }, []);

  const readFile = async (uri) => {
    try {
      if (!uri) {
        console.error('Invalid file URI provided.');
        return null;
      }

      const fileData = await RNFS.readFile(uri, 'utf8'); // Read as UTF-8 text
      return fileData;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  };

  const renderPasswordList = () => {
    return passwords.map((item, index) => (
      <View style={styles.passwordItem} key={index}>
        <View style={styles.listItem}>
          <Text style={styles.listLabel}>Website:</Text>
          <Text style={styles.listValue}>{item.website}</Text>
          <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.website)}>
            <Icon name="copy" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listLabel}>Username:</Text>
          <Text style={styles.listValue}>{item.username}</Text>
          <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.username)}>
            <Icon name="copy" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listLabel}>Counter:</Text>
          <Text style={styles.listValue}>{item.counter}</Text>
          <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.username)}>
            <Icon name="copy" size={20} color="#555" />
          </TouchableOpacity>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.listLabel}>Password:</Text>
          <Text style={styles.listValue}>{maskPassword(item.password)}</Text>
          <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.password)}>
            <Icon name="copy" size={20} color="#555" />
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => editPassword(index)}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => deletePassword(item.website)}>
            <Icon name="trash" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={Styles.container}
        >
    

      
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={Styles.innerContainer}>
              <TextInput
                label="Site"
                value={site}
                onChangeText={(text) => setSite(text)}
              />
              <TextInput
                label="Login"
                value={login}
                onChangeText={(text) => setLogin(text)}
              />
              <TextInput
                label="Master Password"
                value={masterPassword}
                onChangeText={(text) =>setState(text)}
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
                 status={lowercase ? 'checked' : 'unchecked'}
                 onPress={() => setLowercase(!lowercase)}
               />
               <Text style={{ fontSize: 16, color: color }}>a-z</Text>
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
                 onPress={() => setUppercase(!uppercase)}
               />
               <Text style={{ fontSize: 16, color: color }}>A-Z</Text>
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
                 onPress={() => setDigits(!digits)}

              />
              <Text style={{ fontSize: 16, color: color }}>0-9</Text>
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
                onPress={() => setSymbols(!digits)}
              />
              <Text style={{ fontSize: 16, color: color }}>!@%</Text>
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
                  setValue={(length) => setLength(length)}
                  isValueValid={isLengthValid}
                />
                <Counter
                  label="Counter"
                  value={counter}
                  setValue={(counter) =>
                    setCounter(counter)
                  }
                  isValueValid={isCounterValid}
                />
              </View>
              <Button
                mode="contained"
                icon="cogs"
                onPress={onPress={savePassword}}
              >
                {"GENERATE"}
              </Button>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingTop: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      setSaved(false);
                      setUpdated(false);
                      setCopied(false);
                      setSeePassword(false);
                      
                    }}
                    style={{
                      marginBottom: 10,
                      marginRight: 5,
                      
                    }}
                    labelStyle={{ fontSize: 12 }}
                    icon="refresh"
                  >
                    clear
                  </Button>
                </View>
                {password  === false && (
                  <View style={{ flex: 1 }}>
                    <Button
                      mode="outlined"
                      onPress={() => {
                        
                        setCopied(true);
                      }}
                      style={{
                        marginBottom: 10,
                        marginRight: 5,
                        backgroundColor: theme.colors.background,
                      }}
                      labelStyle={{ fontSize: 12 }}
                      icon="clipboard"
                    >
                      copy
                    </Button>
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  {password && (
                    <Button
                      mode="outlined"
                      onPress={() => {
                        setSeePassword((seePassword) => !seePassword);
                      }}
                      style={{
                        marginBottom: 10,
                        marginRight: 5,
                        backgroundColor: theme.colors.background,
                      }}
                      labelStyle={{ fontSize: 12 }}
                      icon="eye"
                    >
                      {seePassword ? "hide" : "show"}
                    </Button>
                  )}
                </View>
              </View>
              {password && seePassword && (
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      fontFamily: "Hack",
                      marginTop: 20,
                    }}
                  >
                    {password}
                  </Text>
                </View>
              )}

            
            </ScrollView>
          </TouchableWithoutFeedback>

        <Text style={styles.subHeading}>Your Passwords</Text>
        {alertVisible && <Text id="alert"> (Copied!)</Text>}
        {passwords.length === 0 ? (
          <Text style={styles.noData}>No Data To Show</Text>
        ) : (
          <ScrollView horizontal>
            <View style={styles.table}>{renderPasswordList()}</View>
          </ScrollView>
        )}

        <Text style={styles.subHeading}>{editing ? 'Edit Password' : 'Add a Password'}</Text>
        
        
        

        <View style={styles.footer}>
                <TouchableOpacity style={styles.footerIcon} onPress={savePasswords}>
                    <Icon name="save" size={24} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon} onPress={downloadPasswords}>
                    <Icon name="download" size={24} color="#007bff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.footerIcon} onPress={navigateToFile}>
                    <Icon name="upload" size={24} color="#007bff" />
                </TouchableOpacity>
          </View>
        

        


      

  </KeyboardAvoidingView>

  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 40,
    
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
    bottom:20
},
footerIcon: {
    padding: 10,
    margin:10
},
});

export default PasswordRender;