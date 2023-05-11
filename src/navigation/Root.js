import React from 'react';
import {useTheme} from "../providers/ThemeProvider";
import HomeFilmsScreen from "../pages/HomeFilmsScreen";
import AddList from "../pages/Lists/AddList";
import FavoriteListOverview from "../pages/Lists/FavoriteListOverview";
import ListOverview from "../pages/Lists/ListOverview";
import {createStackNavigator} from "@react-navigation/stack";
import FilmOverview from "../pages/Overview/FilmOverview";
import {Drawer} from "./DrawerMain";
import {useSelector} from "react-redux";
import ProfileScreen from "../pages/Profile/ProfileScreen";
import ProfileStack from "./ProfileStack";
import UserOverview from "../pages/Users/UserOverview";
import AllFilmsScreen from "../pages/Profile/AllFilmsScreen";
import AllListsScreen from "../pages/Profile/AllListsScreen";
import Subscribers from "../pages/Profile/Subscribers";
import Subscriptions from "../pages/Profile/Subscriptions";
import UserFilmsScreen from "../pages/Users/UserFilmsScreen";
import UserListOverview from "../pages/Lists/UserListOverview";
import MenuFullList from "../pages/MenuFullList";
import BestFilms from "../pages/BestFilms";
import ActorOverview from "../pages/ActorOverview/ActorOverview";
import Reviews from "../pages/Reviews";
import Notifications from "../pages/Notifications";
import SerialOverview from "../pages/Overview/SerialOverview";
import SeasonOverview from "../pages/Overview/SeasonOverview";
import {useAuth} from "../providers/AuthProvider";
import FavoriteGenres from "../pages/Favorites/FavoriteGenres";
import FavoriteActors from "../pages/Favorites/FavoriteActors";

const Stack = createStackNavigator();
export const Root = ({navigation}) => {
  const {isDarkTheme} = useTheme();
  const { isAuth,isNewUser } = useAuth();
  const {user} = useSelector(state => state.auth)
  // const drawerHeader = navigation.getParent().getParent()
  //
  //   drawerHeader.setOptions({
  //     headerShown: false
  //   })
  return (
    <Stack.Navigator initialRouteName={isNewUser?"FavoriteGenres":"HomeRoot"}>

      <Stack.Screen name="HomeRoot" component={Drawer} options={{headerShown: false}}/>
      <Stack.Screen name="FavoriteGenres" component={FavoriteGenres} options={{headerShown: false}}/>
      <Stack.Screen name="FavoriteActors" component={FavoriteActors} options={{headerShown: false}}/>
      <Stack.Screen name="MenuFullList" component={MenuFullList}
                    options={({route}) => ({title: route.params.title, headerShown: true})}/>
      <Stack.Screen name="BestFilms" component={BestFilms} options={{headerShown: true, useNativeDriver: true, title: 'Лучшие фильмы',headerTitleStyle:{color:isDarkTheme?'#DAA520':'black'}}} />
      <Stack.Screen name="AddList" component={AddList} options={{headerShown: true, headerTransparent: true,title:'Новий список'}}/>
      <Stack.Screen name="FavoriteListOverview" component={FavoriteListOverview} options={({route}) => ({
        title: 'Улюблені',
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
                    options={({route}) => ({title: 'Сповіщення'})}/>
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
                    options={({route}) => ({title: route.params.title, id: route.params.id, headerShown: true})}/>
      <Stack.Screen name="Subscriptions" component={Subscriptions}
                    options={({route}) => ({title: route.params.title, id: route.params.id, headerShown: true})}/>
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

