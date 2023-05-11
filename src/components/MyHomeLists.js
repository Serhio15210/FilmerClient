import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {ADD_LIST_IMG, DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, FAVORITE_LIST_IMG} from "../api/apiKey";

import ListPoster from "./ListPoster";

import {useIsFocused, useNavigation} from "@react-navigation/native";
import {useAuth} from "../providers/AuthProvider";

import {useTheme} from "../providers/ThemeProvider";
import {useSelector} from "react-redux";
import GetFilms from "../api/GetFilms";
import ListPreview from "./UserLists/ListPreview";
import Ionicons from "react-native-vector-icons/Ionicons";
import {normalize} from "../responsive/fontSize";
import ListsRow from "./UserLists/ListsRow";

const MyHomeLists = () => {
  const {isDarkTheme, screenTheme} = useTheme();
  const {getUserLists}=useAuth()
  const navigation = useNavigation()
  const {
    user, refresh,userList
  } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(false)
  const isFocused = useIsFocused();
  useEffect(()=>{

    if (isFocused){
      getUserLists()
    }
    setLoading(false)
  },[isFocused])
  return (
    <View style={{...screenTheme.carouselContentContainer, ...{}}}>

      <View style={{...StyleSheet.absoluteFill, backgroundColor: isDarkTheme ? "#DAA520" : "#DC143C"}}>
        <ImageBackground source={{uri: !isDarkTheme ? DARK_BACKGROUND_IMG : DEFAULT_BACKGROUND_IMG}}
                         style={{flex: 1}} blurRadius={10}>

          <View style={{...screenTheme.listTitle}}>
            <View style={{width: "50%"}}>
              <Text style={screenTheme.listTitleText}>Мої Списки</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AllListsScreen",{title:user?.userName})}>
              <Text style={screenTheme.viewAll}>Див.Все</Text></TouchableOpacity>
          </View>

          <View style={{
            justifyContent: "center",
            padding: normalize(10)
          }}>

            {loading ?
              <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems:'center'
              }}>
                <ActivityIndicator size="large"
                                   color={isDarkTheme ? '#DAA520' : "red"}/></View>
              :
               <ListsRow/>

            }


          </View>


        </ImageBackground>
      </View>
    </View>
  );
};

export default MyHomeLists;
