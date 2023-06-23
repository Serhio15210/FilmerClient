import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions, FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View, Animated
} from "react-native";

import AntDesign from "react-native-vector-icons/AntDesign";
import {useIsFocused, useNavigation} from "@react-navigation/native";


import {useAuth} from "../../providers/AuthProvider";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useTheme} from "../../providers/ThemeProvider";
import AwesomeAlert from "react-native-awesome-alerts";
import {normalize} from "../../responsive/fontSize";
import {MAIN_GREY_FADE, MAIN_RED, MAIN_RED_FADE, MAIN_SUCCESS} from "../../constants/colors";
import {ADD_LIST_IMG, IMG_URI} from "../../api/apiKey";
import ListPoster from "../../components/UI/ListPoster";
import FilmerButton from "../../components/UI/FilmerButton";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import FindFilmModal from "../../components/filmModals/FindFilmModal";
import AwesomeButton from "react-native-really-awesome-button";
import FilmItem from "../../components/Films/FilmItem";
import {createNewList} from "../../api/lists";
import NewListFilmItem from "../../components/Films/NewListFilmItem";
import {setUserList} from "../../redux/authReducer";
import {useDispatch, useSelector} from "react-redux";
import Toast from "react-native-toast-message";

const AddList = (props) => {

  const {authToken, getUserLists} = useAuth()
  const {screenTheme, isDarkTheme,i18n} = useTheme();
  const theme = screenTheme
  const [editName, setEditName] = useState(true)
  const [isAddFilm, setIsAddFilm] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [isListCreated, setIsCreated] = useState(false)
  const [isListChanged, setIsListChanged] = useState(false);
  const [nameQuery, setNameQuery] = useState('')
  const [movieQuery, setMovieQuery] = useState('')
  const navigation = useNavigation();
  const [isAlert, setIsAlert] = useState(false)
  const [films, setFilms] = useState([])
  let row = []
  let swipe
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const saveList = async () => {

    const response = await createNewList({
      name: nameQuery,
      films: films
    }, authToken)
    console.log(response)
    return response?.success
  }
  useEffect(() => {
    return () => {
      setEditName(true)
    };
  }, []);

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

  const leftAction = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    })
    return (
      <View style={{
        backgroundColor: isDarkTheme ? '#DAA520' : '#DC143C',
        justifyContent: 'center',
        marginBottom: 20,
        width: '100%',
        borderRadius: 10
      }}>
        <Animated.Text style={{color: 'white', marginLeft: 30, transform: [{scale}]}}> <AntDesign name="delete"
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

    const id=item?.imdb_id
    // console.log(films[1]?.imdb_id !== id,films.filter(film => film?.imdb_id !== id))
    setFilms((prev) => {
      return prev.filter(film => film?.imdb_id !== id)
    })
  }
// useEffect(()=>{
//   console.log(films)
// },[films])
  return (
    <View style={{flex: 1, paddingTop: normalize(50)}}>
      {isAddFilm && <FindFilmModal setOpen={setIsAddFilm} open={isAddFilm} isFavorite={false} listData={films}
                                   setListData={setFilms} isListCreated={isListCreated}/>}
      {/*<FilmerButton text={<Entypo name={'check'} size={20}/>} style={styles.saveButton}/>*/}
      <AwesomeAlert
        show={isAlert}
        showProgress={false}
        title={i18n.t('nameMustHave5Sym')}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        cancelText={i18n.t('close')}
        contentContainerStyle={{
          width: normalize(300),
          height: normalize(300),
          alignItems: 'center',
          justifyContent: "center",
          backgroundColor: isDarkTheme ? 'black' : 'white',
          borderColor: isDarkTheme ? '#DAA520' : "#DC143C",
          borderWidth: 1.5
        }}
        titleStyle={{fontSize: 25, color: isDarkTheme ? 'white' : 'black', textAlign: 'center'}}
        messageStyle={{fontSize: 15, color: isDarkTheme ? 'white' : 'black'}}
        cancelButtonStyle={{width: 100, alignItems: 'center', height: 50, justifyContent: 'center'}}
        cancelButtonTextStyle={{fontSize: 14}}
        confirmButtonStyle={{width: 100, alignItems: 'center', height: 50, justifyContent: 'center'}}
        confirmButtonTextStyle={{fontSize: 13}}
        onCancelPressed={() => {

          setIsAlert(false)
        }}

      />

      <View style={{

        alignItems: 'center',
        width: '100%',
        padding: normalize(15)


      }}>
        <ListPoster list={films}/>

        <TextInput style={styles.input} placeholder={i18n.t('enterName')}
                   placeholderTextColor={isDarkTheme ? "white" : "black"}
                   value={nameQuery}
                   onChangeText={text => setNameQuery(text)} editable={editName} multiline/>

      </View>
      <View style={{flex: 1}}>
        {films?.length === 0 ?
          <TouchableOpacity style={styles.addButton} onPress={() => setIsAddFilm(true)}>
            {/*<Text style={{textAlign: 'center', alignItems: 'center',color:'white',fontSize:normalize(18)}}>Add films </Text>*/}
            <Ionicons name={'add-circle-outline'} size={50} color={MAIN_GREY_FADE}/>
          </TouchableOpacity> :
          <FlatList data={films} contentContainerStyle={{alignItems: 'center'}} renderItem={({item, index}) => {
            return <NewListFilmItem item={item} key={index} index={index} row={row} closeRow={closeRow}
                                    leftAction={leftAction} swipeAction={deleteItem}/>
          }
          }/>
        }
        <TouchableOpacity style={styles.add} onPress={() => setIsAddFilm(true)}>
          <Ionicons name={'add'} color={'white'} size={30}/>
        </TouchableOpacity>
      </View>


      {/*<FilmerButton text={'Save'} style={{marginTop:10,backgroundColor:MAIN_SUCCESS}}/>*/}
      <AwesomeButton
        progress
        onPress={async (next) => {
          if (nameQuery?.length >= 5) {
            const load = await saveList()
            if (load) {
              Toast.show({
                type: 'success',
                // And I can pass any custom props I want
                text1: i18n.t('successAddList'),
              });
              // getUserLists()
              // dispatch(setUserList((prev)=>{
              //   return prev.filter(item=>item?._id!==id)
              // }))
              // SweetAlert.showAlertWithOptions({
              //     title: `List ${nameQuery} created!`,
              //     subTitle: '',
              //     confirmButtonTitle: 'OK',
              //     confirmButtonColor: '#dedede',
              //     style: 'success',
              //     otherButtonColor: '#dedede',
              //     cancellable: true
              //   },
              //   callback => {
              //     setIsAlert(false)
              //   }
              // )
              navigation.goBack()
              next();
            }
          } else {
            setIsAlert(true)
            next()
          }
        }}
        style={{alignSelf: 'center', marginBottom: normalize(10)}}
        width={Dimensions.get('window').width - 15}
        backgroundColor={MAIN_RED}
        borderRadius={10}
        backgroundDarker={'white'}
      >
        {i18n.t('save')}
      </AwesomeButton>

    </View>
  );
};
const styles = StyleSheet.create({
  addButton: {
    width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center'
  },
  text: {
    color: 'white', fontSize: normalize(18)
  },
  input: {
    borderBottomWidth: 1,
    width: '100%',
    color: 'black',
    borderColor: MAIN_GREY_FADE,
    fontSize: normalize(18),
    marginTop: normalize(10)
  },
  saveButton: {
    position: 'absolute',
    backgroundColor: MAIN_SUCCESS,
    width: normalize(45),
    height: normalize(45),
    padding: 0,
    borderRadius: 100,
    right: normalize(15),
    top: normalize(10),
    zIndex: 100
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
})
export default AddList;
