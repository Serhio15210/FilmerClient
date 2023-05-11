import React, {useEffect, useState} from 'react';
import {Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {addFilmToList} from "../../controllers/ListController";
import ListPoster from "../ListPoster";
import {addFavoriteFilm} from "../../api/auth";
import {useAuth} from "../../providers/AuthProvider";
import {BlurView} from '@react-native-community/blur';
import ModalContainer from "../ModalContainer";
import {normalize} from "../../responsive/fontSize";
import {AirbnbRating} from "react-native-ratings";
import {MAIN_GREY, MAIN_RED} from "../../constants";
import {getFilm} from "../../api/films";

const AddFilmModal = ({open, setOpen, changeUser, selectFilm}) => {
  const {authToken,getUserInfo} = useAuth()
  const [rate, setRate] = useState(0)
  const [comment, setComment] = useState('')
  const [chosenFilm, setChosenFilm] = useState({})
  useEffect(()=>{
    getFilm(selectFilm?.imdb_id).then(res=>{
      if (res.success){
        // console.log(res.film)
        setRate(res.film?.rate)
        setComment(res.film?.comment)
        setChosenFilm({
          imdb_id: res.film?.imdb_id + '',
          poster: res.film?.poster,
          title: res.film?.title,
          rate:res.film?.rate,
          comment:res.film?.comment,
          isSerial:res.film?.isSerial,
          isFavorite:res.film.isFavorite
        })
      }else {
        setChosenFilm(selectFilm)
        // setIsFavorite(selectFilm.isFavorite)
        // setRate(selectFilm?.rate)
        // setComment(selectFilm?.comment)
      }
    })

  },[])
  const likeFilm = () => {

    addFavoriteFilm({...chosenFilm,rate:rate,comment:comment}, authToken).then(res => {
      if (res?.success) {
        getUserInfo()
        setOpen(false)
      }
    })
  }
  return (
    <ModalContainer open={open} setOpen={setOpen} position={'flex-end'} padding={0} type={"fade"}>
      <View style={styles.container}>
        <View style={styles.block}>
          <Text style={styles.title}>{chosenFilm?.title}</Text>
        </View>
        <View style={{...styles.block}}>
          <AirbnbRating
            count={5}
            // reviews={["Ужасно!", "Плохо(", "Нормально", "Хорошо", "Потрясающе!"]}
            defaultRating={rate}
            showRating={false}
            onFinishRating={(e) => setRate(e)}
            size={normalize(40)}
            selectedColor={MAIN_RED}
            starContainerStyle={{width: '80%', justifyContent: 'space-around'}}
            // ratingContainerStyle={{backgroundColor:'red',marginTop:0}}

          />
        </View>
        <View style={{...styles.block, borderBottomWidth: 0}}>
          <TextInput style={styles.input} multiline textAlignVertical={'top'} placeholder={'Напишите отзыв'}
                     placeholderTextColor={'rgb(210, 210, 210)'} value={comment} onChangeText={(e)=>setComment(e)}/>
        </View>
        <TouchableOpacity style={styles.button} onPress={()=>{
          likeFilm()
        }}>
          <Text style={styles.buttonText}>Добавить</Text>
        </TouchableOpacity>
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
    borderRadius: 10

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
  buttonText:{
    color: 'white', fontSize: normalize(18)
  }
})
export default AddFilmModal;
