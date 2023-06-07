import React from 'react';
import {createStackNavigator} from "@react-navigation/stack";
import {Drawer} from "./DrawerMain";
import AddList from "../pages/Lists/AddList";
import FavoriteListOverview from "../pages/Lists/FavoriteListOverview";
import FilmOverview from "../pages/Overview/FilmOverview";
import ListOverview from "../pages/Lists/ListOverview";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import {useTheme} from "../providers/ThemeProvider";
import {useSelector} from "react-redux";
import AllFilmsScreen from "../pages/Profile/AllFilmsScreen";
import AllListsScreen from "../pages/Profile/AllListsScreen";
import Subscribers from "../pages/Profile/Subscribers";
import Subscriptions from "../pages/Profile/Subscriptions";
const Stack = createStackNavigator();
const ProfileStack = () => {
  const {i18n} = useTheme();
  const {user}=useSelector(state => state.auth)
  return (
    <Stack.Navigator initialRouteName={'ProfileScreen'}>

      <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={({route}) => ({title: user.userName, headerShown: true, headerTransparent: true,headerTitleStyle:{color:'white', },headerTintColor:'white'})}/>
      <Stack.Screen name="AllFilmsScreen" component={AllFilmsScreen} options={({route}) => ({title: user.userName, headerShown: true})}/>
      <Stack.Screen name="AllListsScreen" component={AllListsScreen} options={({route}) => ({title: route.params.title, headerShown: true})}/>
      <Stack.Screen name="Subscribers" component={Subscribers} options={({route}) => ({title: i18n.t('subscribers'),id:route.params.id, headerShown: true})}/>
      <Stack.Screen name="Subscriptions" component={Subscriptions} options={({route}) => ({title: i18n.t('subscriptions'),id:route.params.id, headerShown: true})}/>

    </Stack.Navigator>
  );
};

export default ProfileStack;
