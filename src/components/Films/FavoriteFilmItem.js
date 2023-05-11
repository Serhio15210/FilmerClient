import React, {useState} from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {deleteFavoriteFilm} from "../../api/auth";
import {setUser} from "../../redux/authReducer";
import AddFilmModal from "../filmModals/AddFilmModal";
import Swipable from "react-native-gesture-handler/Swipeable";
import {ActivityIndicator, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {IMG_URI} from "../../api/apiKey";
import unknown from "../../styles/unknown.png";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {MAIN_GREY, MAIN_SUCCESS} from "../../constants";

const FavoriteFilmItem = ({item, isSerial, closeRow, index, row, leftAction, swipeAction}) => {
  const {isDarkTheme, screenTheme} = useTheme()
  const navigation = useNavigation()
  const theme = screenTheme
  const [isEdit, setIsEdit] = useState(false)
  const [pressDelete, setPressDelete] = useState(false)
  const [openRateFilm, setOpenRateModal] = useState(false)
  const {
    user, refresh
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch()


  return (
    <>

      <Swipable ref={ref => row[index] = ref} renderLeftActions={leftAction} useNativeAnimations={true}
                overshootLeft={false} onSwipeableOpen={() => {
        swipeAction(item)
        closeRow(index)
      }} onSwipeableWillOpen={() => {

        closeRow(index)
      }}>
        <View style={styles.block}>
          <Image
            source={item?.poster?.length !== 0 && item?.poster !== null ? {uri: IMG_URI + item.poster} : unknown}
            style={styles.img} resizeMode="cover"/>

          <View style={{alignItems: "center", justifyContent: "center"}}>
            <Text
              numberOfLines={2} adjustsFontSizeToFit style={styles.title}>{item.title}</Text>

            {item?.rate > 0 && <TouchableOpacity style={styles.row} onPress={() => {
              // swipeAction(item)
            }}>
              <AntDesign name="star" size={20} style={{marginRight: normalize(10)}} color="#FFD700"/>
              <Text style={styles.rate}>{`${item?.rate}/5`}</Text>
            </TouchableOpacity>}

          </View>
          <FontAwesome name="commenting" size={20}
                       color={item?.comment ? isDarkTheme ? "#DAA520" : "#DC143C" : isDarkTheme ? 'white' : 'black'}
                       style={styles.comment}
          />

          <TouchableOpacity onPress={() => {
            setPressDelete(true)
            swipeAction(item)
          }} style={styles.like}>

            {pressDelete?<ActivityIndicator size="small" color={isDarkTheme ? "#DAA520" : "#DC143C"}/>:<AntDesign name="heart" size={30} color={MAIN_SUCCESS}
                       style={{alignSelf: 'center'}}/>}
          </TouchableOpacity>


        </View>
      </Swipable>
    </>
  );
};
const styles = StyleSheet.create({
  block: {
    width: Dimensions.get('window').width - 30,
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 3,
    marginBottom: 20,
    marginHorizontal: normalize(5),
    borderRadius: 10
  },
  img: {
    width: normalize(100),
    height: normalize(150),
    alignSelf: "flex-start",
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0
  },
  title: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",

    textAlign: "center",
    marginBottom: 5,
    maxWidth: normalize(200),
    width: '100%',
    padding: normalize(15)
  },
  row: {
    display: 'flex', flexDirection: 'row', alignItems: 'center'
  },
  rate: {
    color: "black", fontSize: normalize(16)
  },
  comment: {
    position: 'absolute', right: normalize(5), top: normalize(5)
  },
  like:{
    backgroundColor: 'white',
    elevation: 4,
    width: 35,
    height: 35,
    alignSelf: 'center',
    alignItems: 'center',
    marginRight: 10,
    justifyContent: 'center',
    borderRadius: 10
  }
})
export default FavoriteFilmItem;
