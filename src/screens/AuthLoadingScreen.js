import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native'
import * as firebase from 'firebase';
import Background from '../components/Background'
import { theme } from '../core/theme'

function AuthLoadingScreen({ navigation }) {
  useEffect(
     () => {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          navigation.replace('Dashboard');
        } else {
          navigation.replace('StartScreen');
        }
      });
    }
  );

  return (
    <Background>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </Background>
  )
}

export default AuthLoadingScreen
