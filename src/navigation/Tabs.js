/* eslint-disable */
import React, {useState} from "react";

import {Text, View, TouchableOpacity, Pressable, TouchableWithoutFeedback} from "react-native";


import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import {createStackNavigator} from "@react-navigation/stack";

import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {useTheme} from "../providers/ThemeProvider";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import HomeFilmsScreen from "../pages/HomeFilmsScreen";
import {DrawerContent} from "../components/navigation/DrawerMenu";
import {colors} from "../pages/styles";
import Svg, {Path} from "react-native-svg";
import Ionicons from "react-native-vector-icons/Ionicons";
import MenuIcon from "../assets/menu.svg";
import {normalize} from "../responsive/fontSize";
import {MAIN_RED} from "../constants/colors";
import CustomTabBar from "../components/navigation/CustomTabBar";
import {useAuth} from "../providers/AuthProvider";
import {useDispatch, useSelector} from "react-redux";
import {setOpenNotification} from "../redux/authReducer";
import NotificationModal from "../components/wrapper/NotificationModal";
import AddList from "../pages/Lists/AddList";
import ListOverview from "../pages/Lists/ListOverview";
import FavoriteListOverview from "../pages/Lists/FavoriteListOverview";
import {Root} from "./Root";
import {Drawer} from "./DrawerMain";
import SearchUserScreen from "../pages/Users/SearchUserScreen";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import UserOverview from "../pages/Users/UserOverview";
import FindScreen from "../pages/FindScreen";
import HomeSerials from "../pages/HomeSerials";
import ProfileStack from "./ProfileStack";


const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();
const Draw = createDrawerNavigator();

export const Users = ({ navigation, route }) => {
  const {isDarkTheme} = useTheme();
  // React.useLayoutEffect(() => {
  //   const routeName = getFocusedRouteNameFromRoute(route);
  //   // console.log(route)
  //   if (routeName === "UserOverview"){
  //     navigation.setOptions({tabBarStyle:{display:'none'}});
  //     navigation.getParent().setOptions({
  //
  //             headerShown: false
  //           })
  //   }else {
  //     navigation.setOptions({tabBarStyle:{display:'flex'}});
  //     navigation.getParent().setOptions({
  //       // title:route.params.title,
  //       headerShown: true
  //     })
  //   }
  // }, [navigation, route]);
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchUserScreen" component={SearchUserScreen} options={{headerShown: false}} />
      {/*<Stack.Screen name="UserOverview" component={UserOverview} options={({route}) => ({title: route.params.title,id: route.params.id,headerShown: true})} />*/}

    </Stack.Navigator>
  );
}





export const Tabs = () => {

  const [selectedTab, setSelectedTab] = useState('Home');
  return (

    <Tab.Navigator initialRouteName={selectedTab} tabBar={(props)=><CustomTabBar {...props} selectedTab={selectedTab} setSelectedTab={setSelectedTab}/> } screenOptions={{
      headerShown:false,
      gestureEnabled: false
    }}>
      <Tab.Screen name={"Home"} component={HomeFilmsScreen}   />

      <Tab.Screen name={"Serial"} component={HomeSerials}    />
      <Tab.Screen name={"Find"} component={FindScreen}    />
      <Tab.Screen name={"Users"} component={Users}  />

      <Tab.Screen name={"Profile"} component={ProfileStack} />
    </Tab.Navigator>
  );
};


export default Tabs;
