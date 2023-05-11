import React, {useRef, useState} from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import {useAuth} from "../../providers/AuthProvider";
import {
  ActivityIndicator, FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {deleteFavoriteFilm} from "../../api/auth";
import {IMG_URI} from "../../api/apiKey";
import {normalize} from "../../responsive/fontSize";
import LinearGradient from "react-native-linear-gradient";
import AntDesign from "react-native-vector-icons/AntDesign";
import {MAIN_RED, MAIN_SUCCESS} from "../../constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddFilmToListModal from "../filmModals/AddFilmToListModal";
import AddFilmModal from "../filmModals/AddFilmModal";
import {DefaultStyles} from "../../styles/defaultstyles";

const MenuSerialList = ({data, name, isLoading}) => {
  const {isDarkTheme, screenTheme} = useTheme();
  const [isAddList, setIsAddList] = useState(false)
  const [openRateFilm, setOpenRateModal] = useState(false)
  const navigation = useNavigation()
  const {authToken, getUserInfo} = useAuth()
  const focusPoint = useRef(null);
  const title = name;
  const [chosenFilm, setChosenFilm] = useState({
    title: '',
    poster: '',
    filmId: ''
  })
  const {width: windowWidth} = useWindowDimensions();
  const [selectSerial, setSelectSerial] = useState({})
  const {
    user, refresh
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch()

  const isFavorite = (id) => {
    return !!user?.favoriteFilms?.find(item => item?.imdb_id === id)
  }
  const changeUser = (item) => {
    if (isFavorite(item?.id + '')) {
      deleteFavoriteFilm(item?.id, authToken).then(res => {

        if (res?.success) {
          getUserInfo()
        }
      })
    } else {
      setOpenRateModal(true)
    }
  }

  const renderItem = ({item, index}) => {
    return (
      <View key={index} style={{margin: 5}}>
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation()
            navigation.navigate("SerialOverview", {id: item.id, title: item.name});
          }
          }
        >
          <Image source={{uri: IMG_URI + item.poster_path}} style={screenTheme.carouselImage}/>
          <Pressable style={{

            position: "absolute",
            top: 0,
            height: normalize(57),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
          }} onPress={(e) => e.stopPropagation()}>

            <LinearGradient
              colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0)']}
              style={{

                position: 'absolute',
                width: '100%',
                height: '100%',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}>
            </LinearGradient>
            <TouchableOpacity style={{
              padding: normalize(10),
              paddingTop: normalize(15),
            }} onPress={(e) => {
              e.stopPropagation()
              setSelectSerial({
                imdb_id: item?.id + '',
                poster: item?.poster_path,
                title: item?.name,
                isSerial:true
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
              setSelectSerial(item)
              setIsAddList(true)
            }}>

              <MaterialIcons name="library-add" size={30} color="white"
              />
            </TouchableOpacity>

          </Pressable>

        </TouchableOpacity>
        <Text style={screenTheme.carouselText} adjustsFontSizeToFit numberOfLines={3}>{item.name}</Text>
      </View>

    );
  };
  return (

    <View style={{flex:1,minHeight:normalize(480)}}>
      {isAddList &&
        <AddFilmToListModal open={isAddList} setOpen={setIsAddList} film={selectSerial}/>}
      {openRateFilm && <AddFilmModal setOpen={setOpenRateModal} open={openRateFilm} selectFilm={selectSerial}
                                     changeUser={changeUser}/>}
      <View style={{flex:1, backgroundColor: isDarkTheme ? "#DAA520" : "#DC143C"}}>
        <LinearGradient colors={['white', '#f8bfca', '#f595a8', MAIN_RED, 'white']}
                        style={DefaultStyles.ImageBg}>


          <View style={{
            flexDirection: "row",
            justifyContent:'space-between',
            paddingHorizontal:normalize(10)}}>

            <Text numberOfLines={1} style={screenTheme.listTitleText}>{title}</Text>

            <TouchableOpacity style={{justifyContent: "center"}}
                              onPress={() => navigation.navigate("MenuFullList", {data: data, title: title,isSerial:true})}>
              <Text style={screenTheme.viewAll}>Див.Все</Text></TouchableOpacity>
          </View>
          {isLoading ?
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

export default MenuSerialList;
