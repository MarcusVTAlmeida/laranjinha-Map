
import React from "react";

import { createDrawerNavigator } from "@react-navigation/drawer";

import { MainStackNavigator } from "./StackNavigation";
import BottomTabNavigator from "./TabNavigation";
import CustomSidebarMenu from "./DrawStyle";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    drawerContentOptions={{
      activeTintColor: '#e91e63',
      itemStyle: {marginVertical: 5},
    }}
    drawerContent={(props) => <CustomSidebarMenu {...props} />}>
      <Drawer.Screen name="Home" component={BottomTabNavigator} />
      
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;