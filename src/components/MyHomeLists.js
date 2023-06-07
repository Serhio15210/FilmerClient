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

import ListPoster from "./UI/ListPoster";

import {useIsFocused, useNavigation} from "@react-navigation/native";
import {useAuth} from "../providers/AuthProvider";

import {useTheme} from "../providers/ThemeProvider";
import {useSelector} from "react-redux";
import GetFilms from "../api/GetFilms";
import ListPreview from "./UserLists/ListPreview";
import Ionicons from "react-native-vector-icons/Ionicons";
import {normalize} from "../responsive/fontSize";
import ListsRow from "./UserLists/ListsRow";
import {themeColors} from "./Films/themeColors";
import {DefaultStyles} from "../styles/defaultstyles";
import LinearGradient from "react-native-linear-gradient";

const MyHomeLists = () => {
  const {isDarkTheme, screenTheme,i18n,appTheme} = useTheme();
  const {getUserLists}=useAuth()
  const navigation = useNavigation()
  const {
    user, refresh,userList
  } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState()
  const [loading, setLoading] = useState(false)
  const isFocused = useIsFocused();
  const style = styles(themeColors[appTheme]);
  useEffect(()=>{

    if (isFocused){
      getUserLists()
    }
    setLoading(false)
  },[isFocused])
  return (
    <View style={style.carouselContentContainer}>

      <View style={{...StyleSheet.absoluteFill, backgroundColor: themeColors[appTheme].backgroundColor}}>
        <LinearGradient colors={themeColors[appTheme].gradientBg.slice(0,4)}
                        style={DefaultStyles.ImageBg}>

          <View style={style.listTitle}>
            <View style={{width: "50%"}}>
              <Text style={style.listTitleText}>{i18n.t('myLists')}</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AllListsScreen",{title:user?.userName,id:user?._id})}>
              <Text style={style.viewAll}>{i18n.t('seeAll')}</Text></TouchableOpacity>
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
                                   color={style.loadColor}/></View>
              :
               <ListsRow/>

            }


          </View>


        </LinearGradient>
      </View>
    </View>
  );
};
export const styles = (theme) => StyleSheet.create({
  carouselContentContainer: {
    flex: 1,
    backgroundColor: "#000",
    height: normalize(480),
    paddingHorizontal: normalize(15),
  },
  listTitle: {
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(10),
    paddingBottom: 0,
    width: '100%'
  },
  listTitleText: {
    color: theme.textColor, fontSize: normalize(24), fontWeight: "bold", marginLeft: normalize(0), marginVertical: 10,
    fontFamily: 'Kanit-Black'

  },
  viewAll: {
    color: theme.textColor, fontSize: normalize(14),
    fontWeight: "normal",
  },
  carouselContainerView: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: normalize(5),
    paddingBottom: 30
  },
  loadColor: theme.loadColor,
})
export default MyHomeLists;
