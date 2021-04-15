import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from '@expo/vector-icons'; 
import  MainStackNavigator from "./StackNavigation";
import StackNavigation2 from "./StackNavigation2"


const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="HOME"  >
      <Tab.Screen name="HOME" component={MainStackNavigator}  options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="home" size={24} color='black' />
          ),
        }}
      />
      <Tab.Screen name="MAPA" component={StackNavigation2} options={{
          tabBarLabel: "Mapa",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="map-marked" size={24} color="black" /> 
          ),
        }}
       />   
      
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;