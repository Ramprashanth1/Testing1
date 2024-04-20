import {
  Button,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  
} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//import GoogleLogin from './GoogleLogin';
//import PhoneSignIn from './PhoneSignIn';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [mail,setMail]=useState(false);
  const [password, setPassword] = useState('');
  const navigateToSignUp = () => {
    // Navigate to the Password Manager screen
    navigation.navigate('SignUp');
  };
  const navigateToLogout = () => {
    // Navigate to the Password Manager screen
    navigation.navigate('Logout');
  };
  const onLogin = async () => {
    if (!email.trim()) {
      alert('Please enter your email address.');
      return; // Prevent login if email is empty
    }

    if (!password.trim()) {
      alert('Please enter your password.');
      return; // Prevent login if password is empty
    }
    try {
       await auth().signInWithEmailAndPassword(email, password);
      
      
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  

  const forgetPassword = () => {
    try{
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        alert(error);
      });
    }catch(e){
      alert(e);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.signup}>Login Screen</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#000"
        style={styles.inputBox}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#000"
        style={styles.inputBox}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={onLogin} style={styles.register}>
        <Text style={styles.registerTitle}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.register} onPress={navigateToSignUp}>
        <Text style={styles.registerTitle}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          email ? forgetPassword() : alert("Enter email and Try Forget Password");
        }}
        style={styles.register}
      >
        <Text style={styles.registerTitle}>Forget Password?</Text>
      </TouchableOpacity>
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
  inputBox: {
    borderWidth: 1,
    borderColor: 'grey',
    paddingHorizontal: 12,
    borderRadius: 15,
    width: '90%',
    marginTop: 20,
    color:'#000'
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
  signup: {
    fontSize: 20,
    color: '#000000',
    fontWeight: '600',
    marginBottom: 80,
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
});

export default LoginScreen;
