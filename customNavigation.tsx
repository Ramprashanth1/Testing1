import React,{ useEffect, useState } from "react";

import { createStackNavigator } from "@react-navigation/stack";


import auth from '@react-native-firebase/auth';
import LoginScreen from './src/screens/LoginScreen';
import SecondLogout from './src/screens/CleanLogout';
import NewLogout from './src/screens/NewLogout';
import SignUpScreen from './src/screens/SignUpScreen';
import LogoutScreen from './src/screens/LogoutScreen';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StartPage from './src/mgt/StartPage';
import PasswordRender from './src/mgt/PasswordRender';
import Help from './src/mgt/Help';
import MasterPasswordScreen from './src/mgt/MasterPasswordScreen';
import SecondMaster from './src/mgt/SecondMaster';
import PasswordManagerScreen from './src/mgt/PasswordManagerScreen'; 
import LoadKeys from './src/mgt/LoadKeys';

const Stack = createStackNavigator();  // creates object for Stack Navigator

const FirstScreenNavigator = () => {
  const [user, setUser] = useState();
    const onAuthStateSave = (user: any) => setUser(user);
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateSave);
        return subscriber;
      })
  return (
    <>
    {user?
    <Stack.Navigator>
          <Stack.Screen name="Welcome" component={StartPage}  />
          <Stack.Screen name="MasterPassword" component={MasterPasswordScreen}  />
          
          <Stack.Screen name="PasswordManager" component={PasswordManagerScreen} options={{ title: 'Password Manager' }} />
          
          <Stack.Screen name="Load" component={LoadKeys} options={{ title: 'Load' }} />
          <Stack.Screen name="Help" component={Help} options={{ title: 'Help' }} />
          <Stack.Screen name="logout" component={NewLogout} options={{ title: 'Account' }} />
        
        </Stack.Navigator>
      :
      <Stack.Navigator initialRouteName="login">
          <Stack.Screen name="login" component={LoginScreen} options={{ title: 'Log In' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        
        </Stack.Navigator>

    }
    </>
  );
}

export {FirstScreenNavigator}; // Stack-Navigator for Screen 1 Tab

const SecondScreenNavigator = () => {
  const [user, setUser] = useState();
    const onAuthStateSave = (user: any) => setUser(user);
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateSave);
        return subscriber;
      })
    return (

      <>
      {user ?
        
        <Stack.Navigator>
        <Stack.Screen name="Master Password" component={SecondMaster} options={{ title: 'Master Password' }} />
        <Stack.Screen name="Load" component={LoadKeys} options={{ title: 'Load' }} />

        <Stack.Screen name="logout" component={NewLogout} options={{ title: 'Account' }} />
        
        
        </Stack.Navigator>
       :
        
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen name="login" component={LoginScreen} options={{ title: 'Log In' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        
        </Stack.Navigator>
       
      }
    </>
      //   <Stack.Navigator>
        
      //   <Stack.Screen name="Master Password" component={SecondMaster} options={{ title: 'Master Password' }} />
      //   <Stack.Screen name="Load" component={LoadKeys} options={{ title: 'Load' }} />

        
      // </Stack.Navigator>
    );
  }
  
  export {SecondScreenNavigator}; // Stack-Navigator for Screen 2 Tab

  const ThirdScreenNavigator = () => {
    const [user, setUser] = useState();
    const onAuthStateSave = (user: any) => setUser(user);
    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateSave);
        return subscriber;
      })
    return (
      <>
      {user ?
        
        <Stack.Navigator>
        <Stack.Screen name="logout" component={NewLogout} options={{ title: 'Account' }} />
        
        
        </Stack.Navigator>
       :
        
        <Stack.Navigator initialRouteName="login">
          <Stack.Screen name="login" component={LoginScreen} options={{ title: 'Log In' }} />
        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }} />
        
        </Stack.Navigator>
       
      }
    </>
       
    );
  }
  
  export {ThirdScreenNavigator};