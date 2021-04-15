import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Mapa1 from '../screens/Mapa1'
import Mapa2 from '../screens/Mapa2'

const Stack = createStackNavigator();

function StackNavigator2({ navigation }) {
  return (
    <Stack.Navigator screenOptions={{
        headerShown: false,
      }} >          
          <Stack.Screen name="Mapa1" component={Mapa1}/>
          <Stack.Screen name="Mapa2" component={Mapa2}/>       
    </Stack.Navigator>
  );
}

export default StackNavigator2