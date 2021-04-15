import React from 'react'
import { Provider } from 'react-native-paper'
import { NavigationContainer } from '@react-navigation/native'

import { theme } from './src/core/theme'
import BottomTabNavigator from "./src/navigation/TabNavigation";
import DrawerNavigator from "./src/navigation/DrawerNav";


function App() {
  return (
    <Provider theme={theme}>
      <NavigationContainer>
      <DrawerNavigator />     
      </NavigationContainer>
    </Provider>
  )
}



export default App
