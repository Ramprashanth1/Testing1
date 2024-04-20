import React from "react";
import { useContext } from 'react';
//import ValueContext from '../header/Header';
import { ScrollView, Image, Linking, View ,StyleSheet,Text,TouchableOpacity} from "react-native";
import { Title, Subheading, Paragraph, Button, useTheme } from "react-native-paper";


export default function HelpScreen() {
  const theme = useTheme()
  return (
    <ScrollView contentContainerStyle={styles.innerContainer}>
      
      <Title style={styles.title}>Help</Title>
      <Subheading style={styles.heading}>How does it work?</Subheading>
      <Paragraph style={styles.subHeading}>
        This is a password manager that doesn't store any data. It computes
        a unique password using a website, login id, and a master password. You don't
        need to sync a password vault across every device because it works
        offline! It will always generate the same password as long as those
        three parameters don't change.
      </Paragraph>
      
      
      <Subheading style={styles.heading}>Options</Subheading>
      <View>
        
      </View>
      <Paragraph style={styles.subHeading}>
        Sometimes sites have specific password rules. For instance, some banks
        only accept passwords made of digits. The app lets you set parameters
        for the generated password. The
        counter in particular allows you to generate a new password without
        having to change your master password.
      </Paragraph>
      
      <Subheading style={styles.heading}>Youtube</Subheading>
      <View>
        
      
      <Text style={styles.subHeading}
      onPress={() => Linking.openURL('https://youtube.com/@GenPassApp-gb5et')}>
  GenPass App youtube channel : Click Here
</Text>
</View>
      <Subheading style={styles.heading}>Support</Subheading>
      <Paragraph>
        Still need some help? Or you have an idea on how to improve.
        You can send us an email. You can write your
        email in English.
      </Paragraph>
      
      <TouchableOpacity onPress={() => {
          Linking.openURL("mailto:genpass.app@gmail.com?subject=GenPas Password Manager");
        }} style={styles.register}>
        <Text style={styles.registerTitle}>Send us an email</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ 
	container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingTop: 40,
        
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
      innerContainer: {
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 20,
      },
      heading: {
        paddingTop:10,
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
      },
      subHeading: {
        fontSize: 15,
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
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        margin: 20,
    
      },
      submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        
      },
});