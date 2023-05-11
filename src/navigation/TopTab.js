// import React from 'react';
// import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import HomeFilmsScreen from "../pages/HomeFilmsScreen";
// import HomeSerials from "../pages/HomeSerials";
// import {MAIN_GREY_FADE, MAIN_RED, MAIN_RED_FADE} from "../constants";
// import {normalize} from "../responsive/fontSize";
//
// const Tab = createMaterialTopTabNavigator();
//
// function TopTab() {
//   return (
//     <Tab.Navigator screenOptions={{
//       swipeEnabled: false,
//       tabBarPressOpacity: 0,
//       tabBarBounces: false,
//       tabBarPressColor: "transparent",
//       tabBarActiveTintColor:MAIN_RED,
//       tabBarInactiveTintColor:MAIN_GREY_FADE,
//       tabBarStyle:{backgroundColor:'white',height:normalize(40),elevation:0},
//       tabBarLabelStyle:{fontSize:normalize(16),marginTop:0}
//     }}>
//       <Tab.Screen name="Movies" component={HomeFilmsScreen} options={{title: 'Фільми'}}/>
//       <Tab.Screen name="Serials" component={HomeSerials} options={{title: 'Серіали'}}/>
//     </Tab.Navigator>
//   );
// }
//
//
// export default TopTab;
