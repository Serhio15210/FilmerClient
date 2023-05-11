import React, {useEffect, useState} from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {useDispatch} from "react-redux";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {normalize} from "../../responsive/fontSize";
import GetSerials from "../../api/GetSerials";
import {getReviews} from "../../api/films";
import GetFilms from "../../api/GetFilms";
import Loading from "../../components/Loading";
import {styles} from "./styles";
import RateInfoModal from "../../components/filmModals/RateInfoModal";
import TrailerModal from "../../components/Films/TrailerModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import AnimatedHeader from "../../components/UI/AnimatedHeader";
import {IMG_URI} from "../../api/apiKey";
import LinearGradient from "react-native-linear-gradient";
import {MAIN_GREY, MAIN_RED} from "../../constants";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Seasons from "./Seasons";
import Tmdb from "../../assets/tmdb.svg";
import Crew from "./Crew";
import Details from "./Details";
import Genres from "./Genres";
import Review from "./Review";
import SimilarFilms from "./SimilarFilms";
import Episodes from "./Episodes";

const SeasonOverview = ({route}) => {
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
  const [reviews, setReviews] = useState({all: [], subs: []});
  const [trailer, setTrailer] = useState([]);
  const [chosenFilm, setChosenFilm] = useState({})
  const {screenTheme, isDarkTheme} = useTheme();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const details = screenTheme;
  const [refreshing, setRefreshing] = React.useState(false);
  const [addFilm, setAddFilm] = useState(false);
  const [openTrailer, setOpenTrailer] = useState(false);
  const {id, title, season} = route.params;
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

  const getDetails = async () => {
    try {
      const data2 = await GetSerials.getDetailSeason(id, season)
      console.log(data2)
      setState({
        ...state,
        selected: data2,
        genres: data2.genres,
        studio: data2.production_countries,
      });

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

      const video = await GetFilms.getFilmVideo(data2.imdb_id)
      setFilmSrc(video?.iframe_src)
      const similar = await GetSerials.getSimilarSerial(id)
      setSimilarFilms(similar?.results);

      setLoading(false)
    } catch (e) {
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

  return (
    isLoading ?
      <Loading/> :
      <View style={styles.container}>
        <AnimatedHeader scrollY={scrollY} title={title} headerOpacity={headerOpacity} headerBgColor={headerBgColor}
                        arrowColor={arrowColor}/>
        <Animated.ScrollView onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false, throttle: 16}
        )} scrollEventThrottle={16}>
          <ImageBackground source={{uri: IMG_URI + state.selected.poster_path}} blurRadius={1}
                           style={{flex:1, height: normalize(270)}} resizeMode={'cover'}>
            <LinearGradient
              colors={['transparent', 'transparent', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 1)']}
              style={styles.gradient}>
            </LinearGradient>
          </ImageBackground>
          <View style={styles.block}>
            <View style={{...styles.titleBlock, justifyContent: 'center', alignItems: 'center'}}>
              <Image source={{uri: IMG_URI + state.selected.poster_path}} style={styles.poster} resizeMode="contain"/>
              <View style={{paddingHorizontal: normalize(15), alignItems: 'center', justifyContent: 'center'}}>
                <Text style={{
                  ...styles.title,
                  maxWidth: Dimensions.get('window').width - normalize(150),
                  textAlign: 'center'
                }}
                      adjustsFontSizeToFit numberOfLines={3}>{title}</Text>

                <Text style={{
                  ...styles.text,
                  fontWeight: '500',
                  marginTop: normalize(20)
                }}>Дата виходу: {state.selected?.air_date}
                </Text>

              </View>
            </View>
            {state.selected?.overview && <View style={{flex: 1, paddingTop: normalize(20)}}>
              <Text style={styles.tagline}>{state.selected?.tagline}</Text>
              <View style={{marginTop: normalize(10)}}>
                <Text style={styles.text} numberOfLines={openReview ? 0 : 3}>{state.selected?.overview}</Text>
                <Pressable style={{alignSelf: 'center'}} onPress={() => setOpenReview(!openReview)}>
                  {openReview ? <Text style={{...styles.text, color: MAIN_RED}}>Hide</Text> :
                    <MaterialIcons name={'more-horiz'} color={MAIN_RED} size={normalize(40)}/>}
                </Pressable>
              </View>
            </View>}

            <View style={{flex: 1, paddingTop: normalize(20)}}>
              <Text style={styles.tagline}>Епізоди:</Text>
              <Episodes data={state.selected.episodes}/>
            </View>
            <View style={{marginTop: normalize(50)}}>
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={{...styles.switchButton, borderColor: MAIN_GREY, width: '100%'}}
                  onPress={() => setSwitchButton('cast')}>
                  <Text style={styles.text}>Команда</Text>
                </TouchableOpacity>
              </View>
              <Crew cast={cast} crew={crew} navigation={navigation}/>


            </View>

            <SimilarFilms similarFilms={similarFilms} navigation={navigation} isSerial={true}/>
          </View>
        </Animated.ScrollView>
      </View>
  );
};

export default SeasonOverview;
