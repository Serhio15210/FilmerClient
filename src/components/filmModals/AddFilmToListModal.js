import React, {useContext, useEffect} from 'react';
import {
  Alert, Dimensions,
  FlatList, Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import {useAuth} from "../../providers/AuthProvider";
import ListPoster from "../ListPoster";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {useTheme} from "../../providers/ThemeProvider";

import {useSelector} from "react-redux";
import ModalContainer from "../ModalContainer";
import {AirbnbRating} from "react-native-ratings";
import {normalize} from "../../responsive/fontSize";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED, MAIN_RED_FADE, MAIN_SUCCESS} from "../../constants";
import ListPreview from "../UserLists/ListPreview";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {FAVORITE_LIST_IMG, IMG_URI} from "../../api/apiKey";
import unknown from "../../styles/unknown.png";
import {addFilmsToList, addFilmToList} from "../../api/lists";

const AddFilmToListModal = ({open, setOpen, film}) => {
  const {
    user, refresh, userList
  } = useSelector((state) => state.auth);
  const {isDarkTheme, screenTheme} = useTheme()
  const {getUserLists} = useAuth()
  const ifFilmWasAddedToList = (listId) => {
    const id=film.id||film.imdb_id
    return userList.filter(list => list._id === listId)[0].films.filter(item => item.imdb_id === id+'').length === 0
  }
  useEffect(()=>{
    getUserLists()
  },[])
  const addToList=(listId)=>{
    addFilmToList(listId,film).then(res=>{
      if (res.success){
        setOpen(false)
      }
    })
  }
  return (
    <ModalContainer open={open} setOpen={setOpen} position={'flex-end'} padding={0} type={"fade"}>

      <View style={styles.container}>
        <View style={{...styles.block,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={styles.title}>Add to</Text>
          <Pressable onPress={()=>setOpen(false)}>
            <MaterialIcons name="close" size={30} color={'black'}
            />
          </Pressable>

        </View>
        <View style={{...styles.block, height: normalize(400), marginBottom: 0}}>
          <ScrollView showsVerticalScrollIndicator={false}  >
            <View style={styles.wrap}>
              {userList?.map((item, index) => {
                return (
                  <TouchableOpacity disabled={!ifFilmWasAddedToList(item?._id)} key={index} activeOpacity={0.7} style={styles.list} onPress={()=>addToList(item?._id)}>
                    {!ifFilmWasAddedToList(item?._id)&&<View
                      style={{position:'absolute',
                        height:'100%',
                        width:'100%',
                        backgroundColor:'rgba(0, 0, 0, 0.3)',
                        borderRadius:10,zIndex:5}}/>}
                    {item.films?.length >= 3 ? <View style={styles.filmsRow}>

                        <Image source={{uri: IMG_URI + item.films[0]?.poster}} style={styles.img1}/>
                        <Image source={{uri: IMG_URI + item.films[1]?.poster}} style={styles.img2}/>
                        <Image source={{uri: IMG_URI + item.films[2]?.poster}} style={styles.img3}/>

                      </View> :
                      <Image source={item.films?.length === 0 ? unknown : {uri: IMG_URI + item.films[0]?.poster}}
                             style={{
                               width: normalize(140),
                               height: normalize(160),
                               borderRadius: 10,
                               marginHorizontal:normalize(5)

                             }}/>

                    }
                    <Text style={{...styles.title,marginHorizontal:normalize(5),textAlign:'center'}} numberOfLines={2} adjustsFontSizeToFit>{item?.name}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          </ScrollView>

        </View>


      </View>

    </ModalContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: normalize(15),
    borderRadius: 10,


  },
  block: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgb(210, 210, 210)',
    marginBottom: normalize(20),
    paddingBottom: normalize(20)
  },
  title: {
    color: "black", fontWeight: '700', fontSize: 20
  },
  input: {
    color: 'black', minHeight: normalize(100)
  },
  button: {
    width: '100%',
    backgroundColor: MAIN_RED,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: normalize(20)
  },
  buttonText: {
    color: 'white', fontSize: normalize(18)
  },
  wrap:{
    flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'
  },
  filmsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    width: normalize(160),

    minHeight: normalize(170),
    maxHeight: normalize(250),
    margin:normalize(5),

  },
  list:{
    margin: normalize(10),
    backgroundColor: 'white',
    elevation: 5,
    borderRadius: 10,
    alignItems:'center',
    maxWidth:normalize(170)

  },
  img1: {
    width: normalize(110),
    height: normalize(160),
    position: 'absolute',
    left: 0,
    zIndex: 3,
    borderRadius: 10,
  },
  img2: {
    width: normalize(100),
    height: normalize(150),
    position: 'absolute',
    left: normalize(40),
    zIndex: 2,
    borderRadius: 10,
  },
  img3: {
    width: normalize(90),
    height: normalize(140),
    position: 'absolute',
    left: normalize(70),
    zIndex: 1,
    borderRadius: 10,
  }
})
export default AddFilmToListModal;
