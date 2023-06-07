import React, {useContext, useEffect, useRef, useState} from "react";
import {
  ActivityIndicator,
  Dimensions, FlatList,
  Image,
  ImageBackground, Pressable,
  StyleSheet,
  Text, TouchableHighlight, TouchableNativeFeedback,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";


import {DefaultStyles} from "../../styles/defaultstyles";

import {DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG, IMG_URI} from "../../api/apiKey";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddFilmToListModal from "../filmModals/AddFilmToListModal";

import {useAuth} from "../../providers/AuthProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import {MAIN_RED, MAIN_SUCCESS} from "../../constants/colors";
import {useDispatch, useSelector} from "react-redux";
import {addFavoriteFilm, deleteFavoriteFilm} from "../../api/auth";
import {setRefresh, setUser} from "../../redux/authReducer";
import AddFilmModal from "../filmModals/AddFilmModal";
import {normalize} from "../../responsive/fontSize";
import {themeColors} from "./themeColors";
import {form} from "../../pages/Auth/Login";


const MenuFilmsList = ({data, name, isLoading}) => {
  const {isDarkTheme, screenTheme, i18n, appTheme} = useTheme();
  const [isAddList, setIsAddList] = useState(false)
  const [openRateFilm, setOpenRateModal] = useState(false)
  const navigation = useNavigation()
  const {authToken, getUserInfo} = useAuth()
  const focusPoint = useRef(null);
  const title = name
  const [chosenFilm, setChosenFilm] = useState({
    title: '',
    poster: '',
    filmId: ''
  })
  const {width: windowWidth} = useWindowDimensions();
  const [selectFilm, setSelectFilm] = useState({})
  const {
    user, refresh
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const style = styles(themeColors[appTheme]);
  const isFavorite = (id) => {
    return !!user?.favoriteFilms?.find(item => item?.imdb_id === id)
  }
  const changeUser = (item) => {
    if (isFavorite(item?.id + '')) {
      // dispatch(setUser({
      //   ...user,
      //   favoriteFilms: user?.favoriteFilms?.filter(item => item?.imdb_id !== id)
      // }))
      deleteFavoriteFilm(item?.id, authToken).then(res => {

        if (res?.success) {
          getUserInfo()
// dispatch(setUser({
//             ...user,
//             favoriteFilms: user?.favoriteFilms?.filter(item => item?.imdb_id !== item?.id+'')
//           }))
        }
      })
    } else {
      // dispatch(setUser({
      //   ...user,
      //   favoriteFilms: user?.favoriteFilms?.concat([{imdb_id:id}])
      // }))
      setOpenRateModal(true)
    }
  }

  const renderItem = ({item, index}) => {
    return (
      <View key={index} style={{margin: 5}}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation()
            navigation.navigate("FilmOverview", {id: item.id, title: item.title});
          }
          }
        >
          <Image source={{uri: IMG_URI + item.poster_path}} style={style.carouselImage}/>
          <Pressable style={style.buttonsRow} onPress={(e) => e.stopPropagation()}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0)']}
              style={style.gradientHeader}>
            </LinearGradient>
            <TouchableOpacity style={{
              padding: normalize(10),
              paddingTop: normalize(15),
            }} onPress={(e) => {
              e.stopPropagation()
              setSelectFilm({
                imdb_id: item?.id + '',
                poster: item?.poster_path,
                title: item?.title
              })

              changeUser(item)
            }}>
              <AntDesign name="heart" size={30}

                         color={isFavorite(item.id + '') ? MAIN_SUCCESS : "white"}/>
            </TouchableOpacity>
            <TouchableOpacity style={{
              padding: normalize(10),
              paddingTop: normalize(15),
            }} onPress={() => {
              setSelectFilm({
                imdb_id: item?.id + '',
                poster: item?.poster_path,
                title: item?.title
              })

              setIsAddList(true)
            }}>

              <MaterialIcons name="library-add" size={30} color="white"
              />
            </TouchableOpacity>

          </Pressable>

        </TouchableOpacity>
        <Text style={style.carouselText} adjustsFontSizeToFit numberOfLines={3}>{item.title}</Text>
      </View>

    );
  };
  return (

    <View style={style.carouselContentContainer}>
      {isAddList &&
        <AddFilmToListModal open={isAddList} setOpen={setIsAddList} film={selectFilm}/>}
      {openRateFilm &&
        <AddFilmModal setOpen={setOpenRateModal} open={openRateFilm} selectFilm={selectFilm} changeUser={changeUser}/>}
      <View style={{...StyleSheet.absoluteFill, backgroundColor: themeColors[appTheme].backgroundColor}}>
        <LinearGradient colors={themeColors[appTheme].gradientBg}
                        style={DefaultStyles.ImageBg}>

          <View style={style.listTitle}>

            <Text numberOfLines={1} style={style.listTitleText}>{title}</Text>

            <TouchableOpacity style={{justifyContent: "center"}}
                              onPress={() => navigation.navigate("MenuFullList", {data: data, title: title})}>
              <Text style={style.viewAll}>{i18n.t('seeAll')}</Text></TouchableOpacity>
          </View>
          {data?.length === 0 ?
            <View style={{
              flex: 1,
              justifyContent: "center",
            }}>
              <ActivityIndicator size="large" color={style.loadColor}/></View> :
            <View style={style.carouselContainerView}>
              <FlatList
                horizontal={true}
                data={data}
                renderItem={renderItem}
                rowWrapperStyle={{justifyContent: 'space-between'}}
                keyExtractor={(item, index) => `key-${index}`}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}

              />
            </View>}


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
  carouselText: {
    paddingLeft: normalize(15),
    color: "white",
    width: normalize(200),
    textAlign: 'center',
    paddingRight: normalize(15),
    fontWeight: "bold",
    alignSelf: 'center',

  },
  loadColor: theme.loadColor,
  carouselImage: {
    width: normalize(200),
    height: normalize(320),
    borderRadius: 10,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,2)",
  },
  buttonsRow: {
    position: "absolute",
    top: 0,
    height: normalize(57),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  gradientHeader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  }
})
export default MenuFilmsList;
