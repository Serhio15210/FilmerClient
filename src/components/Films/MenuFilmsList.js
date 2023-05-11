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
import {addFilmToFavoriteList, deleteFilmFromFavoriteList} from "../../controllers/ListController";
import {useAuth} from "../../providers/AuthProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import {MAIN_RED, MAIN_SUCCESS} from "../../constants";
import {useDispatch, useSelector} from "react-redux";
import {addFavoriteFilm, deleteFavoriteFilm} from "../../api/auth";
import {setRefresh, setUser} from "../../redux/authReducer";
import AddFilmModal from "../filmModals/AddFilmModal";
import {normalize} from "../../responsive/fontSize";


const MenuFilmsList = ({data, name, isLoading}) => {
  const {isDarkTheme, screenTheme} = useTheme();
  const [isAddList, setIsAddList] = useState(false)
  const [openRateFilm, setOpenRateModal] = useState(false)
  const navigation = useNavigation()
  const {authToken,getUserInfo} = useAuth()
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

  const isFavorite = (id) => {
      return !!user?.favoriteFilms?.find(item => item?.imdb_id === id)
  }
  const changeUser = (item) => {
    if (isFavorite(item?.id+'')) {
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
          <Image source={{uri: IMG_URI + item.poster_path}} style={screenTheme.carouselImage}/>
          <Pressable style={{

            position: "absolute",
            top: 0,

            height:normalize(57),

           flexDirection:'row',

            alignItems:'center',
            justifyContent:'space-between',
            width:'100%'
          }} onPress={(e)=>e.stopPropagation()}>

            <LinearGradient colors={['rgba(0, 0, 0, 1)','rgba(0, 0, 0, 0.7)','rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0)']}
                            style={{

                              position:'absolute',
                              width:'100%',
                              height:'100%',
                              borderTopRightRadius:10,
                              borderTopLeftRadius:10,
                            }}>
            </LinearGradient>
            <TouchableOpacity style={{padding:normalize(10),
              paddingTop:normalize(15),}}  onPress={(e) => {
              e.stopPropagation()
              setSelectFilm({
                imdb_id:item?.id+'',
                poster:item?.poster_path,
                title:item?.title
              })

              changeUser(item)
            }}>
              <AntDesign name="heart" size={30}

                         color={isFavorite(item.id + '') ? MAIN_SUCCESS : "white"}/>
            </TouchableOpacity>
            <TouchableOpacity style={{padding:normalize(10),
              paddingTop:normalize(15),}} onPress={()=>{
                setSelectFilm(item)
                setIsAddList(true)
            }}>

              <MaterialIcons name="library-add" size={30} color="white"
              />
            </TouchableOpacity>

          </Pressable>



        </TouchableOpacity>
        <Text style={screenTheme.carouselText} adjustsFontSizeToFit numberOfLines={3}>{item.title}</Text>
      </View>

    );
  };
  return (

    <View style={screenTheme.carouselContentContainer}>
      {isAddList &&
        <AddFilmToListModal open={isAddList} setOpen={setIsAddList} film={selectFilm}/>}
      {openRateFilm&&<AddFilmModal setOpen={setOpenRateModal} open={openRateFilm} selectFilm={selectFilm} changeUser={changeUser}/>}
      <View style={{...StyleSheet.absoluteFill, backgroundColor: isDarkTheme ? "#DAA520" : "#DC143C"}}>
        <LinearGradient colors={['white', '#f8bfca', '#f595a8', MAIN_RED, 'white']}
                        style={DefaultStyles.ImageBg}>


          <View style={screenTheme.listTitle}>

            <Text numberOfLines={1} style={screenTheme.listTitleText}>{title}</Text>

            <TouchableOpacity style={{justifyContent: "center"}}
                              onPress={() => navigation.navigate("MenuFullList", {data: data, title: title})}>
              <Text style={screenTheme.viewAll}>Див.Все</Text></TouchableOpacity>
          </View>
          {data?.length === 0 ?
            <View style={{
              flex: 1,
              justifyContent: "center",
            }}>
              <ActivityIndicator size="large" color={isDarkTheme ? "#DAA520" : "#DC143C"}/></View> :
            <View style={screenTheme.carouselContainerView}>
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

export default MenuFilmsList;
