import {useTheme} from "../providers/ThemeProvider";
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import {DrawerContent} from "../components/navigation/DrawerMenu";
import {Text, TouchableOpacity, View} from "react-native";
import Tabs from "./Tabs";
import {createDrawerNavigator} from "@react-navigation/drawer";
import {MAIN_RED} from "../constants";
import {normalize} from "../responsive/fontSize";
import Ionicons from "react-native-vector-icons/Ionicons";
import NotificationModal from "../components/wrapper/NotificationModal";
import {Root} from "./Root";
import TopTab from "./TopTab";

const Draw = createDrawerNavigator();
const NotificationButton = ({openNotification, setOpenNotification}) => {
  const {
    user, notifications
  } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0)
  useEffect(()=>{
    setUnreadCount(notifications?.filter(item => !item?.isRead)?.length)
  },[notifications])
  return (
    <View style={{
      backgroundColor: 'red', position: 'absolute',
      top: 0
    }}>

      <TouchableOpacity style={{
        backgroundColor: MAIN_RED,
        borderBottomRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderTopLeftRadius: 30,
        padding: normalize(15),
        alignSelf: 'flex-end',
        position: 'absolute',
        top: 0
      }} onPress={() => setOpenNotification(!openNotification)}>
        {unreadCount > 0 &&
          <View style={{
            position: 'absolute',
            left: 0,
            top: normalize(5),
            width: normalize(18),
            height: normalize(18),
            backgroundColor: 'black',
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center'
          }}><Text
            style={{color: 'white', fontSize: normalize(10)}}>{unreadCount}</Text></View>}
        <Ionicons name="notifications" color="white" size={normalize(26)}/>
      </TouchableOpacity>
      <NotificationModal openNotification={openNotification} setOpenNotification={setOpenNotification}
                         setUnreadCount={setUnreadCount} unreadCount={unreadCount}/>
    </View>
  );
}
export const Drawer = (props) => {
  const {isDarkTheme} = useTheme();

  const dispatch = useDispatch();

  const [openNotification, setOpenNotification] = useState(false)
  useEffect(() => {
    setOpenNotification(false)
  }, [props.navigation])
  // console.log(props.navigation.getState().routes[0].state.routes[0].state.routes[0])
  return (
    <Draw.Navigator drawerContent={props => <DrawerContent {...props} />} defaultStatus="closed"
                    screenOptions={({route}) => ({

                      useNativeDriver: true,
                      headerStyle: {elevation: 0},
                      drawerLabel: ({focused, color, size}) => {
                        return <Text>{route.name}</Text>
                      },

                      headerShown: true,
                      // headerLeft: () =>
                      //   <TouchableOpacity style={{marginLeft: normalize(10)}} onPress={navigation.toggleDrawer}>
                      //     <MenuIcon width={normalize(30)} height={normalize(30)}/>
                      //   </TouchableOpacity>,
                      headerRight: () => <NotificationButton openNotification={openNotification}
                                                             setOpenNotification={setOpenNotification}/>

                    })}
    >

      <Draw.Screen name="HomeTab" component={Tabs}
                   options={{
                     headerShown: true,
                     useNativeDriver: true,
                     title: 'Filmer',
                     headerTitleStyle: {color: isDarkTheme ? '#DAA520' : 'black'},

                   }}/>
      {/*<Draw.Screen name="DrawerHomeRoot" component={Root}*/}
      {/*             options={{*/}
      {/*               headerShown: false,*/}
      {/*               useNativeDriver: true,*/}
      {/*               title: 'Фильмы',*/}
      {/*               headerTitleStyle: {color: isDarkTheme ? '#DAA520' : 'black'},*/}

      {/*             }} />*/}
    </Draw.Navigator>
  );
}
