import React, {useEffect, useState} from 'react';
import {Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


import ListPoster from "../UI/ListPoster";
import {addFavoriteFilm} from "../../api/auth";
import {useAuth} from "../../providers/AuthProvider";
import {BlurView} from '@react-native-community/blur';
import ModalContainer from "../ModalContainer";
import {normalize} from "../../responsive/fontSize";
import {AirbnbRating} from "react-native-ratings";
import {MAIN_GREY, MAIN_RED} from "../../constants/colors";
import {getFilm} from "../../api/films";
import {useTheme} from "../../providers/ThemeProvider";
import AwesomeButton from "react-native-really-awesome-button";

import {themeColors} from "./themeColors";

const AddFilmModal = ({open, setOpen, changeUser, selectFilm}) => {
  const {authToken,getUserInfo} = useAuth()
  const {i18n,appTheme} = useTheme()
  const [rate, setRate] = useState(0)
  const [comment, setComment] = useState('')
  const [chosenFilm, setChosenFilm] = useState({})
  const styles=style(themeColors[appTheme])
  useEffect(()=>{

    try{
      getFilm(selectFilm?.imdb_id).then(res=>{
        if (res?.success){
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
    }catch (e) {
      console.log('selectFilm')
      setChosenFilm(selectFilm)
    }


  },[])
  const likeFilm = async () => {

    const response = await addFavoriteFilm({...chosenFilm, rate: rate, comment: comment}, authToken)
    return response?.success
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
            selectedColor={themeColors[appTheme].selectedRate}
            starContainerStyle={{width: '80%', justifyContent: 'space-around'}}
            // ratingContainerStyle={{backgroundColor:'red',marginTop:0}}

          />
        </View>
        <View style={{...styles.block, borderBottomWidth: 0}}>
          <TextInput style={styles.input} multiline textAlignVertical={'top'} placeholder={`${i18n.t('writeComment')}...`}
                     placeholderTextColor={'rgb(210, 210, 210)'} value={comment} onChangeText={(e)=>setComment(e)}/>
        </View>
        {/*<TouchableOpacity style={styles.button} onPress={()=>{*/}
        {/*  likeFilm()*/}
        {/*}}>*/}
        {/*  <Text style={styles.buttonText}>{i18n.t('add')}</Text>*/}
        {/*</TouchableOpacity>*/}
        <AwesomeButton
          progress
          onPress={async (next) => {

              const load = await  likeFilm()
              if (load) {
                setOpen(false)
                getUserInfo()
                next()
              }

          }}
          style={{alignSelf: 'center', marginBottom: normalize(10)}}
          width={Dimensions.get('window').width - 30}
          backgroundColor={themeColors[appTheme].buttonBg}
          borderRadius={10}
          backgroundDarker={'white'}
        >
          {i18n.t('add')}
        </AwesomeButton>
      </View>

    </ModalContainer>


  );
};
const style = (theme)=> StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.backgroundColor,
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
    color: theme.titleColor, fontWeight: '700', fontSize: normalize(20)
  },
  input: {
    color: theme.titleColor, minHeight: normalize(100)
  },
  button: {
    width: '100%',
    backgroundColor: theme.buttonBg,
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
