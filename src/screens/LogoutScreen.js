import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React , { useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import { Checkbox,useTheme } from 'react-native-paper';
import Counter from "../mgt/Counter";
import storeAccountInfo from './storeAccountInfo';
import {
  isProfileValid,
  isLengthValid,
  isCounterValid,
  areOptionsValid,
} from "../mgt/validations";


const LogoutScreen = ({navigation}) => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [currentUserid, setCurrentUserid] = useState(null);
    

  const [accountInfo, setAccountInfo] = useState({
      lowercase:true,
      uppercase:true,
      digits:true,
      symbols:true,
      length:16,
      counter:1,
  });
  const theme = useTheme();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((user) => {
      if (user) {
        
        setCurrentUserEmail(user.email);
        setCurrentUserid(user.uid);
      } else {
        setCurrentUserEmail(null); // Clear email when logged out
      }
    });

    return unsubscribe; // Cleanup function to prevent memory leaks
  }, []);
  
    const navigateToPasswordManager = () => {
      // Navigate to the Password Manager screen
      navigation.navigate('MasterPassword');
    };
    const handleSubmit = async () => {
      console.log(accountInfo);
      const user = currentUserid;
      await storeAccountInfo(user, accountInfo);
    };
    
  const onLogout = () => {
    auth()
      .signOut()
      .then(response => {
        console.log('response :', response);
        Alert.alert('User signed out!');
      })
      .catch(error => {
        console.log('error :', error);
        Alert.alert('Not able to logout!');
      });
  };

  return (
    <View style={styles.container}>
    <View ><Text style={styles.heading}>
          Hi {auth.user && auth.user.email}!
        </Text></View>
       <Text style={styles.heading}>Options</Text>
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
          status={accountInfo.lowercase ? "checked" : "unchecked"}
          onPress={(e) => setAccountInfo({ ...accountInfo, lowercase: !accountInfo.lowercase })}
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
          status={accountInfo.uppercase ? "checked" : "unchecked"}
          onPress={(e) => setAccountInfo({ ...accountInfo, uppercase: !accountInfo.uppercase})}
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
          status={accountInfo.digits ? "checked" : "unchecked"}
          onPress={(e) => setAccountInfo({ ...accountInfo, digits:!accountInfo.digits })}
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
          status={accountInfo.symbols ? "checked" : "unchecked"}
          onPress={(e) => setAccountInfo({ ...accountInfo, symbols: !accountInfo.symbols})}
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
                  value={accountInfo.length}
                  onChange={(value) => setAccountInfo({ ...accountInfo, length: value })}
                  isValueValid={isLengthValid}
                />
                <Counter
                  label="Counter"
                  value={accountInfo.counter}
                  onChange={(value) => setAccountInfo({ ...accountInfo, counter: value })}
                  isValueValid={isCounterValid}
                />
              </View>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Update Options</Text>
          
        </TouchableOpacity>
      <Text style={styles.heading}>Logout</Text>
      <Text style={styles.description}>
        Logout from your account</Text>
      
      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={navigateToPasswordManager} style={styles.button}>
        <Text style={styles.buttonText}>Password Managaer</Text>
      </TouchableOpacity> */}
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
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});



export default LogoutScreen;
