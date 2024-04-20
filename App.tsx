import React, { useEffect, useState } from 'react';
import LogoutScreen from './src/screens/LogoutScreen';
import auth from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StartPage from './src/mgt/StartPage';
//import PasswordGenerator from './src/mgt/PasswordGeneratorScreen';
import PasswordRender from './src/mgt/PasswordRender';
import Help from './src/mgt/Help';
import MasterPasswordScreen from './src/mgt/MasterPasswordScreen';
import PasswordManagerScreen from './src/mgt/PasswordManagerScreen'; 
import LoadKeys from './src/mgt/LoadKeys';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

//import Header from './src/header/Header.js'
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import {FirstScreenNavigator, SecondScreenNavigator, ThirdScreenNavigator} from './customNavigation'

const Stack = createNativeStackNavigator();
const App = () => {
  const [user, setUser] = useState();

  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });

  const onAuthStateSave = (user: any) => setUser(user);

  useEffect(() => {
    console.log('The biometrics', rnBiometrics);
    const promptFingerprint = () => {
      rnBiometrics
        .simplePrompt({promptMessage: 'Confirm fingerprint'})
        .then((resultObject: { success: any; }) => {
          const {success} = resultObject;
  
          if (success) {
            console.log('successful biometrics provided');
          } else {
            console.log('user cancelled biometric prompt');
            // Re-prompt for fingerprint if the user cancels
            promptFingerprint();
          }
        })
        .catch(() => {
          console.log('biometrics failed');
          // Handle biometric failure here, if needed
        });
    };
  
    promptFingerprint(); // Initial prompt for fingerprint
  }, []);

  
const Tab = createBottomTabNavigator();

  return (
    <>
      
      <NavigationContainer>
        
        <Tab.Navigator screenOptions={{headerShown:false}}>
          <Tab.Screen name="Start" component={FirstScreenNavigator} options={{
          tabBarLabel: 'Start',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} />
          <Tab.Screen name="Render" component={SecondScreenNavigator}  options={{
          tabBarLabel: 'Render',
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={size} />
          ),
        }}/> 
          <Tab.Screen name="Help" component={Help} options={{headerShown:true}} options={{
          tabBarLabel: 'Help',
          tabBarIcon: ({ color, size }) => (
            <Icon name="question" color={color} size={size} />
          ),
        }} />
          {/* <Stack.Screen name="PasswordManager" component={PasswordManagerScreen} options={{ title: 'Password Manager' }} />
          <Stack.Screen name="PassGen" component={PasswordGenerator} options={{ title: 'Gen Pass' }} />
          <Stack.Screen name="Load" component={LoadKeys} options={{ title: 'Load' }} /> */}
          <Tab.Screen name="Account" component={ThirdScreenNavigator} options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Icon name="gear" color={color} size={size} />
          ),
        }}/>
          
        </Tab.Navigator>
      </NavigationContainer> 
        
     
    </>
  )
}

export default App;