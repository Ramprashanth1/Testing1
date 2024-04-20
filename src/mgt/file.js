import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View, TextInput, Button, FlatList, Share } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DocumentPicker, { types } from 'react-native-document-picker';
import * as RNFS from 'react-native-fs';


const App = () => {
  const [passwords, setPasswords] = useState([]);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fileResponse, setFileResponse] = useState([]);

  //const [fileResponse, setFileResponse] = useState(null);
  //const [passwords, setPasswords] = useState([]);

const addPassword = () => {
  const newPassword = {
    website, // Use website from state
    username, // Use username from state
    password, // Use password from state
  };

  setPasswords([...passwords, newPassword]);
  console.log(newPassword);
  setWebsite(""); // Clear input fields after adding
  setUsername("");
  setPassword("");
};

const savePasswords = async () => {
  try {
    const passwordsJSON = JSON.stringify(passwords);
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
      const fileName = 'passwords.json';
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

const renderPasswordItem = ({ item }) => (
    <View style={styles.passwordEntry}>
      <Text style={styles.passwordLabel}>Website:</Text>
      <Text style={styles.passwordValue}>{item.website}</Text>
      <Text style={styles.passwordLabel}>Username:</Text>
      <Text style={styles.passwordValue}>{item.username}</Text>
    </View>
  );

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
  
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Password Manager</Text>

      <TextInput
  style={styles.input}
  placeholder="Website"
  onChangeText={(text) => setWebsite(text)}
/>

<TextInput
  style={styles.input}
  placeholder="Username"
  onChangeText={(text) => setUsername(text)}
/>

<TextInput
  style={styles.input}
  placeholder="Password"
  onChangeText={(text) => setPassword(text)}
/>


      <Button
        title="Add Password"
        onPress={addPassword}
      />

      <Button
        title="Save Passwords"
        onPress={savePasswords}
      />

<Button
  title="Download Passwords"
  onPress={downloadPasswords}
/>

{fileResponse.map((file, index) => (
        <Text
          key={index.toString()}
          style={styles.uri}
          numberOfLines={1}
          ellipsizeMode={'middle'}>
          {file?.name}
        </Text>
      ))}
      <Button
        title="Load Passwords"
        onPress={handleDocumentSelection}
      />
      {passwords.length > 0 ? (
      <Text style={styles.passwordList}>Saved Passwords:</Text>
    ) : (
      <Text style={styles.noPasswords}>No passwords saved yet.</Text>
    )}
      {passwords.length > 0 && (
        <>
          <Text style={styles.passwordList}>Saved Passwords:</Text>
          <FlatList
            data={passwords}
            renderItem={renderPasswordItem}
            keyExtractor={(item) => item.website || Math.random().toString()} // Use a unique key for each item
          />
        </>
      )}
      <View style={styles.container}>

  </View>
    </View>
            
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center"
  },
  header: {
    fontSize: 20,
    fontWeight: "bold"
  },
  input: {
    width: 200,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10
  },
  listItem: {
    fontSize: 16,
    padding: 10
  },
  passwordEntry: {
    marginBottom: 10,
  },
  passwordLabel: {
    fontWeight: 'bold',
  },
  passwordValue: {
    marginLeft: 5,
  },
});

export default App;