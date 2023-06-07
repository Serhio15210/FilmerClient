import React from 'react';
import {useTheme} from "../providers/ThemeProvider";
import AddList from "../pages/Lists/AddList";
import FavoriteListOverview from "../pages/Lists/FavoriteListOverview";
import ListOverview from "../pages/Lists/ListOverview";
import {createStackNavigator} from "@react-navigation/stack";
import FilmOverview from "../pages/Overview/FilmOverview";
import {Drawer} from "./DrawerMain";
import {useSelector} from "react-redux";
import ProfileStack from "./ProfileStack";
import UserOverview from "../pages/Users/UserOverview";
import AllListsScreen from "../pages/Profile/AllListsScreen";
import Subscribers from "../pages/Profile/Subscribers";
import Subscriptions from "../pages/Profile/Subscriptions";
import UserFilmsScreen from "../pages/Users/UserFilmsScreen";
import UserListOverview from "../pages/Lists/UserListOverview";
import MenuFullList from "../pages/MenuFullList";
import BestFilms from "../pages/BestFilms";
import ActorOverview from "../pages/Overview/ActorOverview";
import Reviews from "../pages/Reviews";
import Notifications from "../pages/Notifications";
import SerialOverview from "../pages/Overview/SerialOverview";
import SeasonOverview from "../pages/Overview/SeasonOverview";
import {useAuth} from "../providers/AuthProvider";
import FavoriteGenres from "../pages/Favorites/FavoriteGenres";
import FavoriteActors from "../pages/Favorites/FavoriteActors";

import {styles} from "../components/MyHomeLists";
import {themeColors} from "./themeColors";

const Stack = createStackNavigator();
export const Root = ({navigation}) => {
  const {isDarkTheme} = useTheme();
  const { isAuth,isNewUser } = useAuth();
  const {i18n,appTheme}=useTheme()
  const {user} = useSelector(state => state.auth)
  const style = styles(themeColors[appTheme]);
  // const drawerHeader = navigation.getParent().getParent()
  //
  //   drawerHeader.setOptions({
  //     headerShown: false
  //   })
  return (
    <Stack.Navigator initialRouteName={isNewUser?"FavoriteGenres":"HomeRoot"} screenOptions={{
      headerTintColor: themeColors[appTheme].titleColor
    }}>

      <Stack.Screen name="HomeRoot" component={Drawer} options={{headerShown: false}}/>
      <Stack.Screen name="FavoriteGenres" component={FavoriteGenres} options={{headerShown: false}}/>
      <Stack.Screen name="FavoriteActors" component={FavoriteActors} options={{headerShown: false}}/>
      <Stack.Screen name="MenuFullList" component={MenuFullList}
                    options={({route}) => ({title: route.params.title, headerShown: true })}/>
      <Stack.Screen name="BestFilms" component={BestFilms} options={{headerShown: true, useNativeDriver: true, title: i18n.t('bestFilms')}} />
      <Stack.Screen name="AddList" component={AddList} options={{headerShown: true, headerTransparent: true,title:i18n.t('newList')}}/>
      <Stack.Screen name="FavoriteListOverview" component={FavoriteListOverview} options={({route}) => ({
        title: i18n.t('favorites'),
        headerShown: true,
        headerTransparent: true,
        headerTitleStyle: {color: 'white',},
        headerTintColor: 'white'
      })}/>
      <Stack.Screen name="FilmOverview" component={FilmOverview} options={({route}) => ({title: route.params.title, id: route.params.id, headerShown: false})}/>
      <Stack.Screen name="SerialOverview" component={SerialOverview} options={({route}) => ({title: route.params.title, id: route.params.id, headerShown: false})}/>
      <Stack.Screen name="SeasonOverview" component={SeasonOverview} options={({route}) => ({title: route.params.title, id: route.params.id, headerShown: false})}/>
      <Stack.Screen name="ActorOverview" component={ActorOverview}
                    options={({route}) => ({title: route.params.title, id: route.params.id, headerShown: false})}/>
      <Stack.Screen name="Reviews" component={Reviews}
                    options={({route}) => ({title: route.params.title})}/>
      <Stack.Screen name="Notifications" component={Notifications}
                    options={({route}) => ({title: i18n.t('notifications')})}/>
      <Stack.Screen name="ListOverview" component={ListOverview} options={({route}) => ({
        title: route.params.title,
        id: route.params.id,
        headerShown: true,
        headerTransparent: true,
        headerTitleStyle: {color: 'white',},
        headerTintColor: 'white'
      })}/>
      <Stack.Screen name="Profile" component={ProfileStack} options={({route}) => ({headerShown: false})}/>
      <Stack.Screen name="UserOverview" component={UserOverview} options={({route}) => ({
        title: route.params.title,
        id: route.params.id,
        headerShown: true,
        headerTransparent: true,
        headerTitleStyle: {color: 'white',},
        headerTintColor: 'white'
      })}/>

      <Stack.Screen name="AllListsScreen" component={AllListsScreen}
                    options={({route}) => ({title: route.params.title, headerShown: true})}/>
      <Stack.Screen name="Subscribers" component={Subscribers}
                    options={({route}) => ({title: i18n.t('subscribers'), id: route.params.id, headerShown: true})}/>
      <Stack.Screen name="Subscriptions" component={Subscriptions}
                    options={({route}) => ({title: i18n.t('subscriptions'), id: route.params.id, headerShown: true})}/>
      <Stack.Screen name="UserFilmsScreen" component={UserFilmsScreen}
                    options={({route}) => ({title: route.params.title, id: route.params.id, headerShown: true})}/>
      <Stack.Screen name="UserListOverview" component={UserListOverview} options={({route}) => ({
        title: route.params.title,
        id: route.params.id,
        headerShown: true,
        headerTransparent: true,
        headerTitleStyle: {color: 'white',},
        headerTintColor: 'white'
      })}/>

    </Stack.Navigator>
  );
}

