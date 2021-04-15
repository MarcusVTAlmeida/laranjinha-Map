import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import * as firebase from 'firebase';

function Home({ navigation }){
  const user = firebase.auth().currentUser;

  if (user) {
   console.log('User email: ', user.email);
  }
  return(
    <View style={styles.center}>
      <Text>Olá {user.displayName}, {user.email} </Text>
      
    </View>
  )};


const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
});

export default Home;