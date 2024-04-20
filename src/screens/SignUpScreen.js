import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onRegister = async () => {
    if (!email.trim()) {
      alert('Please enter your email address.');
      return; // Prevent login if email is empty
    }

    if (!password.trim()) {
      alert('Please enter your password.');
      return; // Prevent login if password is empty
    }
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      alert('User Registered');
      // Send email verification
            // Clear input fields (optional)
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
      alert(error.message); // Handle errors appropriately
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signup}>Sign Up Screen</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#000"
        style={styles.inputBox}
        value={email}
        onChangeText={value => setEmail(value)}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#000"
        style={styles.inputBox}
        value={password}
        onChangeText={value => setPassword(value)}
      />
      <TouchableOpacity onPress={onRegister} style={styles.register}>
        <Text style={styles.registerTitle}>Register</Text>
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
});

export default SignUpScreen;
