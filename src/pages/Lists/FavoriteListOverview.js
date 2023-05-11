import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {useTheme} from "../../providers/ThemeProvider";
import {useAuth} from "../../providers/AuthProvider";
import {addFilmsToList, deleteFromList, deleteListById, getListById} from "../../api/lists";
import {ActivityIndicator, Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import AntDesign from "react-native-vector-icons/AntDesign";

import FindFilmModal from "../../components/filmModals/FindFilmModal";
import Feather from "react-native-vector-icons/Feather";
import {MAIN_GREY_FADE, MAIN_RED} from "../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import FilmItem from "../../components/Films/FilmItem";
import unknown from "../../styles/unknown.png";
import {FAVORITE_LIST_IMG, IMG_URI} from "../../api/apiKey";
import FavoriteFilmItem from "../../components/Films/FavoriteFilmItem";
import {setUser} from "../../redux/authReducer";
import {
  addFavoriteFilm,
  addFilmsFavorite,
  addFilmsToFavorite,
  deleteFavoriteFilm,
  getFavoriteFilms
} from "../../api/auth";
import Loading from "../../components/Loading";
import RateInfoModal from "../../components/filmModals/RateInfoModal";

const FavoriteListOverview = ({route}) => {
  const {
    user, refresh, userList
  } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [isAddFilm, setIsAddFilm] = useState(false)
  const [openEditFilm, setOpenEditFilm] = useState(false)
  const [selectFilm, setSelectFilm] = useState({})
  const [listData, setListData] = useState([])
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {isDarkTheme} = useTheme()
  const {getUserInfo} = useAuth()
  let row = []
  let swipe

  const getList =  () => {
    getFavoriteFilms().then(res=>{

      setListData(res?.favoriteFilms)
      // console.log(res?.favoriteFilms)
      setLoading(false)
    })


  }
  const leftAction = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })
    return (
      <View style={styles.delete}>
        <Animated.Text style={{color: 'white', marginLeft: normalize(30), transform: [{scale}]}}> <AntDesign
          name="delete"
          size={30}
          color={'white'}/></Animated.Text>
      </View>
    )
  }
  const closeRow = (index) => {
    if (swipe && swipe !== row[index]) {
      swipe.close();
    }
    swipe = row[index];
  }
  const deleteItem = (item) => {
    console.log( item?._id)
    deleteFavoriteFilm(item?.imdb_id).then(res => {
      console.log(res,listData.filter(film => film?.imdb_id !== item?.imdb_id))
      // getList()
      // if (res?.success) {
      //   // getUserInfo()
      //   dispatch(setUser( {...user, favoriteFilms: listData.filter(film => film?.imdb_id !== item?.imdb_id)}))
      // }
      setListData((prev)=>prev.filter(film => film?.imdb_id !== item?.imdb_id))
      // dispatch(setUser( {...user, favoriteFilms: listData.filter(film => film?.imdb_id !== item?.imdb_id)}))
    })
  }

  // const addNewFilms = (films) => {
  //   // films?.length > 10 &&
  //   setLoading(true)
  //   addFilmsToFavorite(films).then(res => {
  //     console.log(res)
  //     if (res.success) {
  //       getUserInfo()
  //       // dispatch(setUser({...user, favoriteFilms: user.favoriteFilms.concat(films)}))
  //       setLoading(false)
  //     }else {
  //       setLoading(false)
  //     }
  //
  //   })
  // }
  const addNewFilm = (film) => {
    // films?.length > 10 &&
    setLoading(true)
    addFavoriteFilm(film).then(res => {
      console.log(res)
      if (res.success) {
        getList()
        // getUserInfo()
        // dispatch(setUser({...user, favoriteFilms: user.favoriteFilms.concat(films)}))
        setLoading(false)
      }else {
        setLoading(false)
      }

    })
  }
  // useEffect(() => {
  //   const drawerHeader = navigation.getParent().getParent()
  //
  //   if (isFocused) {
  //     drawerHeader.setOptions({
  //       headerShown: false
  //     })
  //   } else {
  //     drawerHeader.setOptions({
  //       headerShown: true
  //     })
  //   }
  // }, [isFocused, navigation]);
  useEffect(() => {
    !openEditFilm&&getList()

  }, [openEditFilm])

  return (
      <View style={styles.container}>
        <Image source={{uri: FAVORITE_LIST_IMG}} style={{
          width: '100%',
          height: normalize(300),

        }}/>

        {isAddFilm &&
          <FindFilmModal setOpen={setIsAddFilm} open={isAddFilm} isFavorite={true} listData={listData}
                           isListCreated={true} onPressSuccess={addNewFilm}/>}
        {openEditFilm&&<RateInfoModal open={openEditFilm} setOpen={setOpenEditFilm}
                                      selectFilm={selectFilm} />}
        <View>

          <View style={styles.betweenRow}>
            {/*<TouchableOpacity style={styles.edit}>*/}
            {/*  <Text style={{color: 'black', marginRight: normalize(10)}}>Edit</Text>*/}
            {/*  <Feather name={'edit'} color={'black'} size={18}/>*/}
            {/*</TouchableOpacity>*/}

          </View>

        </View>
        <View style={{paddingHorizontal: normalize(15), flex: 1}}>
          <Text
            style={{...styles.imgTitle, color: 'black', fontWeight: '600', marginBottom: normalize(20)}}>Фільми/Серіали:</Text>
          {listData?.length === 0 ?
            <TouchableOpacity style={styles.addBlock} onPress={() => setIsAddFilm(true)}>
              {/*<Text style={{textAlign: 'center', alignItems: 'center',color:'white',fontSize:normalize(18)}}>Add films </Text>*/}
              <Ionicons name={'add-circle-outline'} size={50} color={MAIN_GREY_FADE}/>
            </TouchableOpacity> :
            loading?<Loading/>:
              <FlatList data={listData}
                        contentContainerStyle={{alignItems: 'center', paddingBottom: normalize(100)}}
                        renderItem={({item, index}) => {
                          return <FilmItem item={item} key={item?._id} index={index} row={row} closeRow={closeRow}
                                           leftAction={leftAction}
                                           swipeAction={deleteItem} onRatePress={()=>{
                            setSelectFilm(item)
                            setOpenEditFilm(true)
                          }} />
                        }
                        }/>
          }

        </View>
        <TouchableOpacity style={styles.add} onPress={() => setIsAddFilm(true)}>
          <Ionicons name={'add'} color={'white'} size={30}/>
        </TouchableOpacity>
      </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  imageBg: {
    height: normalize(300), width: '100%', flexDirection: 'row', justifyContent: 'center'
  },
  imgTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', padding: normalize(15),
    position: 'absolute', bottom: 0, zIndex: 2
  },
  imgTitle: {
    color: 'white', fontSize: normalize(24), marginRight: normalize(10)
  },
  white16: {
    color: 'white', fontSize: normalize(16)
  },
  edit: {
    backgroundColor: 'white',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(10),

    borderRadius: 10,
    alignSelf: 'flex-end',
    margin: normalize(15)
  },
  add: {
    backgroundColor: MAIN_RED,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    width: normalize(60),
    height: normalize(60),
    position: 'absolute',
    right: normalize(15),
    bottom: normalize(15)
  },
  addBlock: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  betweenRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'
  },
  delete: {
    backgroundColor: '#DC143C',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    borderRadius: 10
  }
})
export default FavoriteListOverview;
