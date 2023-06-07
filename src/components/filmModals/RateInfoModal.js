import React, {useEffect, useState} from 'react';
import {useAuth} from "../../providers/AuthProvider";
import {addFavoriteFilm, deleteFavoriteFilm} from "../../api/auth";
import ModalContainer from "../ModalContainer";
import {Dimensions, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {AirbnbRating} from "react-native-ratings";
import {normalize} from "../../responsive/fontSize";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED, MAIN_SUCCESS} from "../../constants/colors";
import {addFilmsToList} from "../../api/lists";

import AwesomeButton from "react-native-really-awesome-button";
import {editFilm, getFilm} from "../../api/films";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useDispatch, useSelector} from "react-redux";
import {setUser} from "../../redux/authReducer";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddFilmToListModal from "./AddFilmToListModal";
import {useTheme} from "../../providers/ThemeProvider";
import {themeColors} from "./themeColors";

const RateInfoModal = ({open, setOpen,  selectFilm,isUser=true }) => {
  const {authToken,getUserInfo} = useAuth()
  const {
    user, refresh
  } = useSelector((state) => state.auth);
  const {i18n,appTheme}=useTheme()
  const styles=style(themeColors[appTheme])
  const [chosenFilm,setChosenFilm]=useState({})
  const [rate, setRate] = useState(selectFilm?.rate||0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [comment, setComment] = useState(selectFilm?.comment||'')
  const dispatch=useDispatch()
  const [isAddList, setIsAddList] = useState(false)
  useEffect(()=>{
     try {

       getFilm(selectFilm?.imdb_id).then(res => {
         if (res.success) {
           setIsFavorite(res.film.isFavorite)
           setRate(res.film?.rate)
           setComment(res.film?.comment)
           setChosenFilm({
             imdb_id: res.film?.imdb_id + '',
             poster: res.film?.poster,
             title: res.film?.title || res.film?.name,
             rate: res.film?.rate,
             comment: res.film?.comment,
             isFavorite: res.film.isFavorite
           })
         } else {
           setChosenFilm(selectFilm)
           // setIsFavorite(selectFilm.isFavorite)
           // setRate(selectFilm?.rate)
           // setComment(selectFilm?.comment)
         }
       })
     }catch (e) {
       setChosenFilm(selectFilm)
     }

  },[])
  // useEffect(()=>{
  //   console.log(chosenFilm)
  // },[chosenFilm])
  const changeFilm = async () => {
    const response = await editFilm(chosenFilm, rate, comment)
    return response.success
  }
  const likeFilm = () => {
    if (isFavorite) {
      deleteFavoriteFilm(chosenFilm?.imdb_id, authToken).then(res => {
        if (res?.success) {
          setIsFavorite(false)
          // dispatch(setUser({
          //   ...user,
          //   favoriteFilms: user?.favoriteFilms?.filter(item=>item?.imdb_id!==selectFilm?.imdb_id)
          // }))
        }
      })
    } else {
      addFavoriteFilm({...chosenFilm,rate:rate,comment:comment,isFavorite:true}, authToken).then(res => {
        if (res?.success) {
          setIsFavorite(true)
          // dispatch(setUser({
          //   ...user,
          //   favoriteFilms: user?.favoriteFilms?.concat([{imdb_id:selectFilm?.imdb_id}])
          // }))
        }
      })

    }
  }
  return (
    <ModalContainer open={open} setOpen={setOpen} position={'flex-end'} padding={0} type={"fade"}>
      {isAddList &&
        <AddFilmToListModal open={isAddList} setOpen={setIsAddList} film={chosenFilm}/>}
      <View style={styles.container}>
        <View style={{...styles.block,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <Text style={styles.title}>{chosenFilm?.title}</Text>
          <Pressable onPress={()=>setOpen(false)}>
            <MaterialIcons name="close" size={30} color={themeColors[appTheme].titleColor}
            />
          </Pressable>

        </View>
        <View style={{...styles.block,flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation()
            likeFilm()
          }
          } style={styles.like}>

            <AntDesign name="heart" size={normalize(40)} color={isFavorite ? MAIN_SUCCESS : MAIN_GREY_FADE}
                       style={{alignSelf: 'center'}}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={(e) => {
            e.stopPropagation()
            setIsAddList(true)
          }
          } style={styles.like}>

            <MaterialIcons name="library-add" size={30} color={MAIN_GREY_FADE}
            />
          </TouchableOpacity>
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
          <TextInput style={styles.input} multiline textAlignVertical={'top'} placeholder={i18n.t('writeComment')}
                     placeholderTextColor={'rgb(210, 210, 210)'} value={comment} onChangeText={(e)=>setComment(e)}/>
        </View>
        {isUser&&<AwesomeButton
          progress
          onPress={async (next) => {

              const load = await changeFilm()
              if (load) {
                next();
                setOpen(false)
              }


          }}

          width={Dimensions.get('window').width-normalize(30)}
          backgroundColor={themeColors[appTheme].buttonBg}
          borderRadius={10}
          backgroundDarker={'white'}
        >
          {i18n.t('save')}
        </AwesomeButton>}
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
    color: theme.titleColor, fontWeight: '700', fontSize: 20
  },
  input: {
    color: theme.titleColor, minHeight: normalize(100)
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

export default RateInfoModal;
