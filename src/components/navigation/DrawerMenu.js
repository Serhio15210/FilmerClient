import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity, Button, Alert, FlatList, LogBox, SectionList, ImageBackground, TouchableWithoutFeedback
} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper';
import {
  DrawerContentScrollView,
  DrawerItem
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {CommonActions, useNavigation} from "@react-navigation/native";
import DrawerSection from "react-native-paper/src/components/Drawer/DrawerSection";
import {useAuth} from "../../providers/AuthProvider";

import {useTheme} from "../../providers/ThemeProvider";
import {generateRandomColor} from "../../styles/randomColors";
import {MAIN_RED} from "../../constants";
import {normalize} from "../../responsive/fontSize";
import avatarBg from "../../assets/radiantAvatarBg.png"
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import Entypo from "react-native-vector-icons/Entypo";
import {useSelector} from "react-redux";

export function DrawerContent(props) {
  const {setIsDarkTheme, isDarkTheme, setIsAuth} = useTheme();
  const [openTop, setOpenTop] = useState(false)
  const [openListsTop, setOpenListsTop] = useState(false)
  const heightTop = openTop ? "auto" : 0
  const heightListsTop = openListsTop ? "auto" : 0
  const {
    user
  } = useSelector((state) => state.auth);
  const navigation = useNavigation()


  // const favoriteList=userData.lists.shift()
  // const subscribers = userData.subscribers ? userData.subscribers.length : "0"
  // const subscriptions = userData.subscriptions ? userData.subscriptions.length : "0"


  useEffect(() => {
    // LogBox.ignoreLogs(["VirtualizedLists should never be nested"])
    setOpenTop(false)
  }, [])
  return (
    <View
      style={{flex: 1, backgroundColor: isDarkTheme ? "black" : "white", color: isDarkTheme ? "black" : "white"}}>
      <DrawerContentScrollView {...props}  >
        <View style={styles.drawerContent}>
          <ImageBackground source={avatarBg} style={styles.userInfoSection}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}  >
              <View style={styles.avatarBlock}>
                <View style={styles.avatar}>
                  <Text style={{fontSize: 20, color: 'white'}}>{user?.userName[0]?.toUpperCase()}</Text>
                </View>
              </View>
              <Title style={[styles.title, {color: "white"}]}>{user?.userName}</Title>
            </View>

            <View style={{...styles.row, justifyContent: 'space-around'}}>
              <TouchableOpacity>
                <Text style={styles.sub}>Підписки: {user?.subscriptions?.length}</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.sub}>Підписники: {user?.subscribers?.length}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>

          <Drawer.Section
            style={[styles.bottomDrawerSection, {borderTopColor: isDarkTheme ? '#DAA520' : "white",}]}>
            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  name="home-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Головна"
              onPress={() => {
                props.navigation.navigate('Home')
              }}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Icon
                  name="account-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Профіль"
              onPress={()=>navigation.navigate('Profile')}
            />
            <DrawerItem
              icon={({color, size}) => (
                <Feather
                  name="settings"
                  color={color}
                  size={size}
                />
              )}
              label="Налаштування"
              onPress={() => {

              }}
            />

          </Drawer.Section>
          <Drawer.Section
            style={[styles.bottomDrawerSection, {borderTopColor: isDarkTheme ? '#DAA520' : "white",}]}>
            <DrawerItem
              icon={({color, size}) => (
                <Fontisto
                  name="film"
                  color={color}
                  size={size}
                />
              )}
              label="Кращі фільми"
              onPress={() => {
                navigation.navigate('BestFilms')
                // navigation.reset({
                //   index: 0,
                //   routes: [{name: "HomeScreen"}, {name: "BestFilms"}]
                // })
              }}
            />

            <DrawerItem
              icon={({color, size}) => (
                <Entypo
                  name="list"
                  color={color}
                  size={size}
                />
              )}
              label="Мої списки"
              onPress={() => {
                navigation.navigate("AllListsScreen",{title:user?.userName})
              }}
            />

          </Drawer.Section>
          <Drawer.Section style={{
            ...styles.themeBlock,
            backgroundColor:!isDarkTheme?"#d3d3d3":"#666"
          }}>

            <TouchableOpacity onPress={async () => {
              await AsyncStorage.setItem('theme', `${false}`)
              setIsDarkTheme(false)
            }} style={{
              backgroundColor: isDarkTheme?'transparent':'white',
              elevation: isDarkTheme?0:5,
              ...styles.themeButton
            }}>
                <Ionicons name={'sunny'} color={isDarkTheme?"white":"#F6D42A"}/>
                <Text style={{...styles.themeText,color:isDarkTheme?"white":"black"}}>Світла</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={async () => {
              await AsyncStorage.setItem('theme', `${true}`)
              setIsDarkTheme(true)
            }} style={{
              backgroundColor: !isDarkTheme?'transparent':'black',
              elevation: !isDarkTheme?0:5,
              ...styles.themeButton
            }}>

              <Ionicons name={'moon'} color={!isDarkTheme?"black":"#F6D42A"}/>
                <Text style={{...styles.themeText,color:isDarkTheme?"white":"black"}}>Темна</Text>

            </TouchableOpacity>


          </Drawer.Section>




        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    marginTop: -4

  },
  userInfoSection: {
    backgroundColor: MAIN_RED,
    paddingBottom: normalize(10)
  },
  avatarBlock: {
    backgroundColor: "white",
    borderRadius: 50,
    borderTopLeftRadius: 0,
    width: normalize(80),
    height: normalize(80),
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(10),
    marginRight: normalize(10)
  },
  avatar: {
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: generateRandomColor(),
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: normalize(24),
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  sub: {
    color: 'white'
  },

  drawerSection: {
    marginTop: 15,

  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopWidth: 1
  },
  themeBlock:{
    alignItems: "center",
    flexDirection: "row",
    marginLeft: normalize(15),
    marginRight: normalize(15),
    borderRadius:10,
    padding:2
  },
  themeButton:{
    padding: normalize(5),
    paddingLeft: normalize(10),
    paddingRight: normalize(10),
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    borderRadius: 10
  },
  themeText:{
    marginLeft:normalize(10)
  }
});
