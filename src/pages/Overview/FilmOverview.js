import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator, Alert, Animated,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View, StyleSheet, Dimensions, Pressable, Linking
} from "react-native";
import {AirbnbRating} from "react-native-ratings";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {useAuth} from "../../providers/AuthProvider";
import {useTheme} from "../../providers/ThemeProvider";
import {useIsFocused, useNavigation} from "@react-navigation/native";


import Ionicons from "react-native-vector-icons/Ionicons";
import GetFilms from "../../api/GetFilms";
import {IMG_URI, NONAME_IMG} from "../../api/apiKey";
import {MAIN_GREY, MAIN_RED, MAIN_SUCCESS} from "../../constants";
import {useDispatch} from "react-redux";
import {normalize} from "../../responsive/fontSize";
import LinearGradient from "react-native-linear-gradient";
import AnimatedHeader from "../../components/UI/AnimatedHeader";
import Loading from "../../components/Loading";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import imdb from "../../assets/imdb.png"
import rt from "../../assets/rottenTomatoes.png"
import metacritic from "../../assets/metacritic.png"
import Metacritic from "../../assets/metacritic.svg"
import tmdb from "../../assets/tmdb.png"
import Tmdb from "../../assets/tmdb.svg"
import Crew from "./Crew";
import SimilarFilms from "./SimilarFilms";
import Details from "./Details";
import Genres from "./Genres";
import RateInfoModal from "../../components/filmModals/RateInfoModal";
import TrailerModal from "../../components/Films/TrailerModal";
import {getFilm, getReviews} from "../../api/films";
import Review from "./Review";
import {styles} from "./styles";
import Orientation, {LANDSCAPE, OrientationLocker, PORTRAIT} from 'react-native-orientation-locker';
import FilmModal from "../../components/Films/FIilmModal";
const FilmOverview = ({route}) => {
  const [isLoading, setLoading] = useState(true);
  const [state, setState] = useState({
    results: [],
    selected: {},
    genres: [],
    cast: [],
    studio: [],
    countries: [],
  });
  const [ratings, setRatings] = useState([]);
  const [similarFilms, setSimilarFilms] = useState([]);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState({all:[],subs:[]});
  const [trailer, setTrailer] = useState([]);

  const [chosenFilm, setChosenFilm] = useState({})
  const {screenTheme, isDarkTheme} = useTheme();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const details = screenTheme;
  const [refreshing, setRefreshing] = React.useState(false);
  const [addFilm, setAddFilm] = useState(false);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const {id, title} = route.params;
  const navigation = useNavigation()
  const [openReview, setOpenReview] = useState(false)
  const [switchButton, setSwitchButton] = useState('cast')
  const [filmSrc, setFilmSrc] = useState('')
  const [scrollY] = useState(new Animated.Value(0));
  const scrolling = React.useRef(new Animated.Value(0)).current;
  const boxInterpolation = scrolling.interpolate({
    inputRange: [0, 100],
    outputRange: ["rgb(255,255,255)", "rgba(255,255,255,0)"],
  })
  const animatedStyle = {
    backgroundColor: boxInterpolation
  }
  const headerBgColor = scrollY.interpolate({
    inputRange: [0, normalize(100), normalize(200)],
    outputRange: ['transparent', 'rgba(255, 255, 255, 0.4)', 'rgba(255, 255, 255, 1)'],
    extrapolate: 'clamp',
  });
  const arrowColor = scrollY.interpolate({
    inputRange: [0, normalize(100), normalize(200)],
    outputRange: ['rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 1)'],
    extrapolate: 'clamp',
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, normalize(100), normalize(200)],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  const getDetails=async () => {

    try {
      const data2 = await GetFilms.getDetailFilm(id)

      setState({
        ...state,
        selected: data2,
        genres: data2.genres,

        studio: data2.production_countries,

      });
      // const chosen=await getFilm(id)
      setChosenFilm({
        imdb_id: data2?.id + '',
        poster: data2?.poster_path,
        title: data2?.title,
        rate: 0,
        comment: '',
        isFavorite: false
      })
      setCast(data2.credits?.cast || []);
      setCrew(data2.credits?.crew || []);

      // const rate = await GetFilms.getRatings(data2.imdb_id)
      //
      // setRatings(rate);
      const reviews=await getReviews(id)
      setReviews({
        all: reviews?.reviewsAll,
        subs:reviews?.reviewsSub
      })
      const video = await GetFilms.getFilmVideo(data2.imdb_id)
      console.log('video',video)
      setFilmSrc(video?.iframe_src)
      const similar = await GetFilms.getSimilarFilm(id)
      setSimilarFilms(similar?.results);
      const tr = await GetFilms.getTrailer(id)
      setTrailer(tr)
      setLoading(false)
    }catch (e) {

      setLoading(false)
    }
  }
  useEffect(() => {
    // setLoading(true)
    let rev = []

    try {
     getDetails()
    } catch (e) {
      console.log(e)
    } finally {
      // setLoading(false)
    }
  }, []);
  useEffect(()=>{
    !openVideo?Orientation.lockToPortrait():Orientation.lockToLandscape()
  },[openVideo])
  const [playing, setPlaying] = useState(false);
  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      // Alert.alert("video has finished playing!");
    }
  }, []);


  return (
    isLoading ?
      <Loading/> :
      <View style={styles.container} >
        {addFilm && <RateInfoModal selectFilm={chosenFilm} open={addFilm} setOpen={setAddFilm}/>}
        {openTrailer && <TrailerModal isOpen={openTrailer} setIsOpen={setOpenTrailer} trailers={trailer}/>}
        {openVideo&& <FilmModal setIsOpen={setOpenVideo} isOpen={openVideo} filmSrc={filmSrc}/>}
        <TouchableOpacity style={styles.add} onPress={() => setAddFilm(true)}>
          <Ionicons name={'add'} color={'white'} size={30}/>
        </TouchableOpacity>

        <AnimatedHeader scrollY={scrollY} title={title} headerOpacity={headerOpacity} headerBgColor={headerBgColor}
                        arrowColor={arrowColor}/>
        <Animated.ScrollView onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false, throttle: 16}
        )}
                             scrollEventThrottle={16}  >
          <ImageBackground source={{uri: IMG_URI + state.selected.backdrop_path}} blurRadius={1}
                           style={{width: '100%', height: normalize(270)}}>
            <LinearGradient
              colors={['transparent', 'transparent', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 1)']}
              style={styles.gradient}>
            </LinearGradient>
          </ImageBackground>
          <View style={styles.block}>
            <View style={styles.titleBlock}>
              <View>
                <Text style={{...styles.title, maxWidth: Dimensions.get('window').width - normalize(150)}}
                      adjustsFontSizeToFit numberOfLines={3}>{state.selected.title}</Text>
                <Text style={{
                  ...styles.title,
                  maxWidth: Dimensions.get('window').width - normalize(150),
                  fontSize: normalize(12)
                }} adjustsFontSizeToFit numberOfLines={3}>{state.selected.original_title}</Text>
                <Text style={{
                  ...styles.text,
                  fontWeight: '500',
                  marginTop: normalize(20)
                }}>{state.selected?.release_date?.split('-')[0]} <Text
                  style={{color: MAIN_RED}}>●</Text> {state.selected.runtime} хв
                </Text>
                <TouchableOpacity style={styles.whiteButton} onPress={()=>{
                  Linking.openURL(`https://www.youtube.com/embed/${trailer[0]?.key}`);
                  // setOpenTrailer(true)
                }}>
                  <Text style={styles.text}>Трейлер</Text>
                  <FontAwesome5 name={'play'} color={MAIN_RED} style={{marginLeft: normalize(10)}}/>
                </TouchableOpacity>

              </View>

              <Image source={{uri: IMG_URI + state.selected.poster_path}} style={styles.poster} resizeMode="contain"/>
            </View>

            {state.selected?.overview&&<View style={{flex: 1, paddingTop: normalize(20)}}>
              <Text style={styles.tagline}>{state.selected?.tagline}</Text>
              <View style={{marginTop: normalize(10)}}>
                <Text style={styles.text} numberOfLines={openReview ? 0 : 3}>{state.selected?.overview}</Text>
                <Pressable style={{alignSelf: 'center'}} onPress={() => setOpenReview(!openReview)}>
                  {openReview ? <Text style={{...styles.text, color: MAIN_RED}}>Приховати</Text> :
                    <MaterialIcons name={'more-horiz'} color={MAIN_RED} size={normalize(40)}/>}
                </Pressable>
              </View>

            </View>}
            <View style={{flex: 1, paddingTop: normalize(20)}}>
              <Text style={{...styles.tagline, fontSize: normalize(18)}}>Рейтинги:</Text>
              <View style={{width: '100%', marginTop: normalize(15)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/*<Image source={tmdb} style={{width:normalize(25),height:normalize(25)}}/>*/}
                  <Tmdb width={normalize(25)} height={normalize(25)}/>
                  <Text style={styles.text}> TMDB: <Text
                    style={styles.rateText}>{state.selected.vote_average}</Text></Text>
                </View>
                {/*{ratings[0]?.Source && <View style={styles.rateItem}>*/}
                {/*  <Image source={imdb} style={{width: normalize(25), height: normalize(25)}}/>*/}
                {/*  <Text style={styles.text}> {ratings[0]?.Source}: <Text*/}
                {/*    style={styles.rateText}>{ratings[0]?.Value}</Text></Text>*/}
                {/*</View>}*/}
                {/*{ratings[1]?.Source && <View style={styles.rateItem}>*/}
                {/*  <Image source={rt} style={{width: normalize(25), height: normalize(25)}}/>*/}
                {/*  <Text style={styles.text}> {ratings[1]?.Source}: <Text*/}
                {/*    style={styles.rateText}>{ratings[1]?.Value}</Text></Text>*/}
                {/*</View>}*/}
                {/*{ratings[2]?.Source && <View style={styles.rateItem}>*/}
                {/*  /!*<Image source={metacritic} style={{width:normalize(25),height:normalize(25)}}/>*!/*/}
                {/*  <Metacritic width={normalize(25)} height={normalize(25)}/>*/}
                {/*  <Text style={styles.text}> {ratings[2]?.Source}: <Text*/}
                {/*    style={styles.rateText}>{ratings[2]?.Value}</Text></Text>*/}
                {/*</View>}*/}
              </View>

            </View>
            <View style={{marginTop: normalize(50)}}>
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={{...styles.switchButton, borderColor: switchButton === 'cast' ? MAIN_RED : MAIN_GREY}}
                  onPress={() => setSwitchButton('cast')}>
                  <Text style={styles.text}>Команда</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{...styles.switchButton, borderColor: switchButton === 'details' ? MAIN_RED : MAIN_GREY}}
                  onPress={() => setSwitchButton('details')}>
                  <Text style={styles.text}>Деталі</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{...styles.switchButton, borderColor: switchButton === 'genre' ? MAIN_RED : MAIN_GREY}}
                  onPress={() => setSwitchButton('genre')}>
                  <Text style={styles.text}>Жанри</Text>
                </TouchableOpacity>

              </View>
              {switchButton === 'cast' && <Crew cast={cast} crew={crew} navigation={navigation}/>}
              {switchButton === 'details' && <Details data={state.selected}/>}
              {switchButton === 'genre' && <Genres data={state.genres}/>}

            </View>
            {reviews?.all?.length>0&&<View style={{marginTop: normalize(50),marginBottom:normalize(20)}}>
              <Text style={styles.castTitle}>Reviews:</Text>
              {reviews?.all?.slice(0,4)?.map((item,index)=>{
                return (
                  <Review item={item} key={index}/>
                )
              })}
              <TouchableOpacity onPress={()=>navigation.navigate('Reviews',{reviews:reviews,title:state.selected.title})}>
                <Text style={{...styles.text,textAlign:'center',fontWeight:'600',fontSize:normalize(18)}}>All reviews</Text>
              </TouchableOpacity>

            </View>}
            <SimilarFilms similarFilms={similarFilms} navigation={navigation}/>
          </View>
        </Animated.ScrollView>
      </View>
  )
    ;
};



export default FilmOverview;
