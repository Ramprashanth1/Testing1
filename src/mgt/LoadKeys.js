import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Clipboard , Share} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { sha256 } from 'js-sha256';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, { types } from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';
import { generatePassword } from './passGenerator';


const LoadKeys =({route, navigation})=>{
    const [website, setWebsite] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwords, setPasswords] = useState([]);
    const [data, setData]=useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [fileResponse, setFileResponse] = useState([]);

    const { masterPassword } = route.params; 
    
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
    
      const generatePassword6 = (username, website) => {
        const passwordLength = 16;
        const specialSymbols = '!@#$%^&*()-_=+{}[]|;:,.<>?';
      
        // Combine username and website for a deterministic seed
        const salt = username + website;
      
        // Use a hashing function (e.g., sha256) to generate a deterministic key from the seed
        const key1 = sha256(salt);
        
        const seed = key1 + masterPassword;

        const key= sha256(seed);
        
        let generatedPwd = '';
        let charIndex = 0;
      
        // Iterate through the password length
        for (let i = 0; i < passwordLength; i++) {
          // Extract a byte from the key
          const byte = key.charCodeAt(charIndex);
      
          // Use bit manipulation to determine character type
          if (byte % 2 === 0) {
            // Even byte: Use a character from the derived key
            generatedPwd += key.charAt(charIndex);
          } else {
            // Odd byte: Use a special symbol
            const symbolIndex = byte % specialSymbols.length;
            generatedPwd += specialSymbols[symbolIndex];
          }
      
          charIndex++; // Move to the next byte in the key
        }
      
        return generatedPwd;
      };
      const generatePassword1 = (username, website) => {
    
        const passwordLength = 16;
        const specialSymbols = '!@#$%^&*()-_=+{}[]|;:,.<>?';
        const salt = website + username;
        const iterations = 10000;
        const keyLen = 32;
    
        
        const concatenatedString = salt + sha256(masterPassword);
        
    
        
        const hexKey = sha256(concatenatedString).substring(0, keyLen); 
    
        let generatedPwd = '';
    
        // Generate password by mixing characters from the derived key and special symbols
        for (let i = 0; i < passwordLength; i++) {
            if (i < hexKey.length) {
                generatedPwd += hexKey[i];
            } else {
                const index = Math.floor(Math.random() * specialSymbols.length);
                generatedPwd += specialSymbols[index];
            }
        }
    
        return generatedPwd;
      };
      
      const editPassword = (index) => {
        setEditing(true);
        setEditIndex(index);
        setWebsite(passwords[index].website);
        setUsername(passwords[index].username);
        setPassword(passwords[index].password);
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
              setPasswords(loadedPasswords.map(item => ({
                website: item.website,
                username: item.username,
                lowercase : item.lowercase,
                uppercase : item.uppercase,
                digits : item.digits,
                symbols : item.symbols,
                length : item.length,
                counter :item.counter,
                password: generatePassword(masterPassword,item.website,item.username,item.lowercase,item.uppercase,item.digits,item.symbols,item.length,item.counter),
                
              })));
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
              <TouchableOpacity style={styles.copyIcon} onPress={() => copyText(item.counter)}>
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
            
          </View>
        ));
      };
      return (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.heading}>Password Manager</Text>
            
    
    
            <TouchableOpacity onPress={handleDocumentSelection} style={styles.register}>
        <Text style={styles.registerTitle}>Load Keys</Text>
      </TouchableOpacity>
          

          <Text style={styles.subHeading}>Your Passwords</Text>
            {alertVisible && <Text id="alert"> (Copied!)</Text>}
            {passwords.length === 0 ? (
              <Text style={styles.noData}>No Data To Show</Text>
            ) : (
              <ScrollView horizontal>
                <View style={styles.table}>{renderPasswordList()}</View>
              </ScrollView>
            )}

          </View>
          
        </ScrollView>
      );
    };
    
    /*const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#fff',
        color: 'black'
      },
      content: {
        padding: 20,
        color: 'black'
      },
      heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'black'
      },
      subHeading: {
        fontSize: 18,
        marginBottom: 10,
        color: 'black'
      },
      noData: {
        fontSize: 16,
        fontStyle: 'italic',
        marginBottom: 10,
        color: 'black'
      },
      table: {
        flexDirection: 'row',
        color: 'black'
      },
      passwordItem: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        color: 'black'
      },
      listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        color: 'black'
      },
      listLabel: {
        fontWeight: 'bold',
        marginRight: 5,
        color: 'black'
      },
      listValue: {
        flex: 1,
        color: 'black'
      },
      copyIcon: {
        marginLeft: 10,
        color: 'black'
    
      },
      buttonsContainer: {
        flexDirection: 'row',
        marginTop: 5,
        color: 'black'
      },
      editButton: {
        backgroundColor: 'blue',
        padding: 5,
        marginRight: 5,
        borderRadius: 5,
      },
      deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
      },
      input: {
        color: 'black',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        
      },
      submitButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
      },
      submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
    });*/
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
    
    export default LoadKeys;
