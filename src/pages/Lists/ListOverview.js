import React, {useEffect, useState} from 'react';
import {addFilmsToList, addFilmToList, deleteFromList, deleteListById, getListById, renameList} from "../../api/lists";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {IMG_URI} from "../../api/apiKey";
import {normalize} from "../../responsive/fontSize";
import LinearGradient from "react-native-linear-gradient";
import NewListFilmItem from "../../components/Films/NewListFilmItem";
import FilmItem from "../../components/Films/FilmItem";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useTheme} from "../../providers/ThemeProvider";
import {useDispatch, useSelector} from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import {MAIN_GREY_FADE, MAIN_RED} from "../../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import FindFilmModal from "../../components/filmModals/FindFilmModal";
import AwesomeAlert from "react-native-awesome-alerts";

import {useAuth} from "../../providers/AuthProvider";
import {setUserList} from "../../redux/authReducer";
import RateInfoModal from "../../components/filmModals/RateInfoModal";

const ListOverview = ({route}) => {
  const {
    user, refresh, userList
  } = useSelector((state) => state.auth);
  const {id, title} = route.params;
  const [loading, setLoading] = useState(true);
  const [isAddFilm, setIsAddFilm] = useState(false)
  const [isAlert, setIsAlert] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [openEditFilm, setOpenEditFilm] = useState(false)
  const [isChanged, setIsChanged] = useState(false)
  const [listName, setListName] = useState(title || '')
  const [listData, setListData] = useState({})
  const [selectFilm, setSelectFilm] = useState({})
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const {isDarkTheme,i18n} = useTheme()
  const {getUserLists} = useAuth()
  let row = []
  let swipe
  const changeListName = () => {
    renameList(id, listName).then(res => {
      if (res.success) {

        navigation.setOptions({
          title: listName
        })
        setIsEdit(false)
      }

    })
  }
  const getList = () => {
    getListById(id).then(res => {
      if (res.success) {

        setListData(res?.list)
        setLoading(false)
      }

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
    console.log(listData?._id?.length, item?._id)
    deleteFromList(listData?._id, item?._id).then(res => {
      console.log(res)
      if (res.success) {
        setListData((prev) => {
          return {...prev, films: prev.films.filter(film => film?._id !== item?._id)}
        })
      }
    })
    // setFilms((prev)=>{
    //   return prev.filter(film => film?.imdb_id!==item?.imdb_id+'')
    // })
  }
  const deleteList = () => {
    deleteListById(id).then(res => {
      if (res.success) {
        setIsAlert(false)
        // dispatch(setUserList( userList.filter(item=>item?._id!==id)))
        // SweetAlert.showAlertWithOptions({
        //     title: `List ${listData.name} was deleted!`,
        //     subTitle: '',
        //     confirmButtonTitle: 'OK',
        //     confirmButtonColor: '#dedede',
        //     style: 'success',
        //     otherButtonColor: '#dedede',
        //     cancellable: true
        //   },
        //   callback => {
        //     setIsAlert(false)
        //
        //   }
        // )
        navigation.goBack()
        // getUserLists()

      }
    })
  }
  // const addNewFilms = (films) => {
  //   console.log(films)
  //   films?.length > 10 && setLoading(true)
  //   addFilmsToList(listData?._id, films).then(res => {
  //     // console.log(res)
  //     if (res.success) {
  //       getList()
  //       // setListData((prev) => {
  //       //   return {...prev, films: films}
  //       // })
  //     }
  //   })
  // }
  const addNewFilm = (film) => {

    // films?.length > 10 && setLoading(true)
    addFilmToList(listData?._id, film).then(res => {
      // console.log(res)
      if (res.success) {
        getList()
        // setListData((prev) => {
        //   return {...prev, films: films}
        // })
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
    !openEditFilm && getList()

  }, [openEditFilm])

  return (
    loading ?
      <View style={{...styles.container, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={isDarkTheme ? "#DAA520" : "#DC143C"}/></View> :

      <View style={styles.container}>
        <DeleteAlert listData={listData} deleteList={deleteList} isAlert={isAlert} setIsAlert={setIsAlert}/>
        {openEditFilm && <RateInfoModal open={openEditFilm} setOpen={setOpenEditFilm}
                                        selectFilm={selectFilm} setIsChanged={setIsChanged}/>}
        {isAddFilm &&
          <FindFilmModal setOpen={setIsAddFilm} open={isAddFilm} isFavorite={false} listData={listData?.films}
                         setListData={setListData} isListCreated={true} onPressSuccess={addNewFilm}/>}
        <View>
          {listData?.films?.length < 4 ?
            <OneImage listData={listData} name={listName}/> : <Collage listData={listData} name={listName}/>
          }
          <View style={{...styles.betweenRow}}>
            {!isEdit ? <TouchableOpacity style={styles.edit} onPress={() => setIsEdit(true)}>
                <Text style={{color: 'black', marginRight: normalize(10)}}>{i18n.t('rename')}</Text>
                <Feather name={'edit'} color={'black'} size={18}/>
              </TouchableOpacity> :
              <TextInput value={listName} onChangeText={setListName} style={styles.nameInput}/>}

            {isEdit ? <TouchableOpacity style={{...styles.edit, backgroundColor: MAIN_RED}} onPress={changeListName}>
                {/*<AntDesign name="check"*/}
                {/*           size={18}*/}
                {/*           color={'white'}/>*/}
                <Text style={{fontSize: normalize(16), color: 'white'}}>{i18n.t('save')}</Text>
              </TouchableOpacity> :
              <TouchableOpacity style={{...styles.edit, backgroundColor: MAIN_RED}} onPress={() => setIsAlert(true)}>
                <AntDesign name="delete"
                           size={18}
                           color={'white'}/>
              </TouchableOpacity>}
          </View>

        </View>
        <View style={{paddingHorizontal: normalize(15), flex: 1}}>
          <Text
            style={{...styles.imgTitle, color: 'black', fontWeight: '600', marginBottom: normalize(20)}}>Films:</Text>
          {listData?.films?.length === 0 ?
            <TouchableOpacity style={styles.addBlock} onPress={() => setIsAddFilm(true)}>
              {/*<Text style={{textAlign: 'center', alignItems: 'center',color:'white',fontSize:normalize(18)}}>Add films </Text>*/}
              <Ionicons name={'add-circle-outline'} size={50} color={MAIN_GREY_FADE}/>
            </TouchableOpacity> :

            <FlatList data={listData?.films}
                      maxToRenderPerBatch={3}
                      contentContainerStyle={{alignItems: 'center', paddingBottom: normalize(100)}}
                      renderItem={({item, index}) => {
                        return <FilmItem item={item} key={item?._id} index={index} row={row} closeRow={closeRow}
                                         leftAction={leftAction}
                                         swipeAction={deleteItem} onRatePress={() => {
                          setSelectFilm(item)
                          setOpenEditFilm(true)
                        }
                        } onPress={()=>{
                          if (item?.isSerial){
                            navigation.navigate('SerialOverview',{title:item.title,id:item?.imdb_id})
                          }else navigation.navigate('FilmOverview',{title:item.title,id:item?.imdb_id})
                        }}/>
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


const OneImage = ({listData, name}) => {
  const gradient = listData?.films?.length === 0 ? ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'] : ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']
  return (
    <ImageBackground source={{uri: IMG_URI + listData?.films[0]?.poster}} style={styles.imageBg}  >
      <LinearGradient
        colors={gradient}
        style={styles.gradient}/>
      {listData?.films?.length === 0 &&
        <Text style={{fontSize: normalize(50), color: 'black', alignSelf: 'center', textAlign: 'center'}}
              numberOfLines={3}
              adjustsFontSizeToFit>{name}</Text>}
      <View style={styles.imgTitleRow}>
        <Text style={styles.imgTitle} numberOfLines={2} adjustsFontSizeToFit>{listData?.name}</Text>
        {/*<Text style={styles.white16} numberOfLines={1}*/}
        {/*      adjustsFontSizeToFit>Subscribers: {listData?.subscribers?.length}</Text>*/}
      </View>

    </ImageBackground>
  )
}
const Collage = ({listData, name}) => {
  return (
    < View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']}
        style={styles.gradient}/>
      {listData?.films?.slice(0, 4)?.map((item, index) => {
        const source = {uri: IMG_URI + item?.poster};
        if (item?.poster) {
          return (
            <Image key={index} source={source} style={{width: '50%', height: normalize(150)}}
                   resizeMode={'cover'}/>
          )
        }
      })}
      <View style={styles.imgTitleRow}>
        <Text style={styles.imgTitle} numberOfLines={2} adjustsFontSizeToFit>{name}</Text>
        {/*<Text style={styles.white16} numberOfLines={1}*/}
        {/*      adjustsFontSizeToFit>Subscribers: {listData?.subscribers?.length}</Text>*/}
      </View>
    </View>
  )
}
const DeleteAlert = ({isAlert, setIsAlert, listData, deleteList}) => {
  const {isDarkTheme,i18n} = useTheme()
  const [deleting, setDeleting] = useState(false)
  return (
    isAlert && <AwesomeAlert
      show={isAlert}
      showProgress={false}
      title={i18n.t('areYouSure')}
      message={`${i18n.t('deleteWatchList')} ${listData.name}?`}
      closeOnTouchOutside={true}
      closeOnHardwareBackPress={false}
      showCancelButton={true}
      showConfirmButton={true}
      cancelText={i18n.t('noCancel')}
      successText={i18n.t('success')}
      confirmText={deleting ? i18n.t('deleting') : i18n.t('yesDelete')}
      confirmButtonColor={isDarkTheme ? '#DAA520' : "#DC143C"}
      contentContainerStyle={{
        width: isAlert ? normalize(300) : 0,
        height: isAlert ? normalize(300) : 0,
        alignItems: 'center',
        justifyContent: "center",
        backgroundColor: isDarkTheme ? '#333333' : 'white',
        borderColor: isDarkTheme ? '#DAA520' : "#DC143C",
        borderWidth: 1,
      }}
      titleStyle={{fontSize: normalize(30), color: isDarkTheme ? 'white' : 'black'}}
      messageStyle={{fontSize: 15, color: isDarkTheme ? 'white' : 'black'}}
      cancelButtonStyle={{  alignItems: 'center', height: normalize(50), justifyContent: 'center'}}
      cancelButtonTextStyle={{fontSize: 14}}
      confirmButtonStyle={{  alignItems: 'center', height: normalize(50), justifyContent: 'center'}}
      confirmButtonTextStyle={{fontSize: 13}}
      onCancelPressed={() => {

        setIsAlert(false)
      }}
      onConfirmPressed={async () => {
        setDeleting(true)
        deleteList()
      }}
    />
  )
}
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
    height: normalize(300), width: '100%', flexDirection: 'row', justifyContent: 'center',backgroundPositionX: "50%",
    backgroundPositionY: "50%",
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
  },
  nameInput: {
    borderBottomWidth: 1, borderColor: MAIN_GREY_FADE, width: '50%', color: 'black', margin: normalize(15)
  }
})
export default ListOverview;
