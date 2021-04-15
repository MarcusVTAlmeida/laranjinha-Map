import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import * as firebase from 'firebase';
import apiKeys from '../core/config';
import AuthLoadingScreen from '../screens/AuthLoadingScreen'
import StartScreen from '../screens/StartScreen'
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import  Dashboard from '../screens/Dashboard'
import Home from '../screens/Home'

import Photo from '../screens/Photo'


const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const Stack = createStackNavigator()
if (!firebase.apps.length) {
  console.log('Connected with Firebase')
  firebase.initializeApp(apiKeys.firebaseConfig);
}
function MainStackNavigator({ navigation }) {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle} >
          <Stack.Screen name="AuthLoadingScreen" component={AuthLoadingScreen}/>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="StartScreen" component={StartScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />             
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/> 
         
          <Stack.Screen name="Photo" component={Photo}/>     
    </Stack.Navigator>
  );
}



export default MainStackNavigator