import React, {useCallback, useEffect, useState} from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {useDispatch} from "react-redux";
import {
  Animated,
  Dimensions, FlatList,
  Image,
  ImageBackground,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {normalize} from "../../responsive/fontSize";
import GetFilms from "../../api/GetFilms";
import {getReviews} from "../../api/films";
import Loading from "../../components/UI/Loading";
import RateInfoModal from "../../components/filmModals/RateInfoModal";
import TrailerModal from "../../components/Films/TrailerModal";
import Ionicons from "react-native-vector-icons/Ionicons";
import AnimatedHeader from "../../components/UI/AnimatedHeader";
import {IMG_URI} from "../../api/apiKey";
import LinearGradient from "react-native-linear-gradient";
import {MAIN_GREY, MAIN_RED} from "../../constants/colors";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Tmdb from "../../assets/tmdb.svg";
import Crew from "./Crew";
import Details from "./Details";
import Genres from "./Genres";
import Review from "./Review";
import SimilarFilms from "./SimilarFilms";
import {style, styles} from "./style";
import GetSerials from "../../api/GetSerials";
import {data} from "../../constants/genres";
import Seasons from "./Seasons";
import {themeColors} from "./themeColors";

const SerialOverview = ({route}) => {
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
  const {screenTheme, isDarkTheme,i18n,appTheme} = useTheme();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const details = screenTheme;
  const styles = style(themeColors[appTheme])
  const [refreshing, setRefreshing] = React.useState(false);
  const [addFilm, setAddFilm] = useState(false);
  const [openTrailer, setOpenTrailer] = useState(false);
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

  const getDetails = async () => {
    try {
      const data2 = await GetSerials.getDetailSerial(id)
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
        title: data2?.name,
        rate: 0,
        comment: '',
        isFavorite: false
      })
      setCast(data2.credits?.cast || []);
      setCrew(data2.credits?.crew || []);

      const reviews = await getReviews(id)
      setReviews({
        all: reviews?.reviewsAll,
        subs: reviews?.reviewsSub
      })
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
        {addFilm && <RateInfoModal selectFilm={chosenFilm} open={addFilm} setOpen={setAddFilm}/>}
        {openTrailer && <TrailerModal isOpen={openTrailer} setIsOpen={setOpenTrailer} trailers={trailer}/>}
        <TouchableOpacity style={styles.add} onPress={() => setAddFilm(true)}>
          <Ionicons name={'add'} color={'white'} size={30}/>
        </TouchableOpacity>
        <AnimatedHeader scrollY={scrollY} title={title} headerOpacity={headerOpacity} headerBgColor={headerBgColor}
                        arrowColor={arrowColor}/>
        <Animated.ScrollView onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false, throttle: 16}
        )} scrollEventThrottle={16}>
          <ImageBackground source={{uri: IMG_URI + state.selected.backdrop_path}} blurRadius={1}
                           style={{width: '100%', height: normalize(270)}}>
            <LinearGradient
              colors={['transparent', 'transparent', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 1)']}
              style={styles.gradient}>
            </LinearGradient>
          </ImageBackground>
          <View style={styles.block}>
            <View style={{...styles.titleBlock, justifyContent: 'flex-start'}}>
              <Image source={{uri: IMG_URI + state.selected.poster_path}} style={styles.poster} resizeMode="contain"/>
              <View style={{marginLeft: normalize(15)}}>
                <Text style={{...styles.title, maxWidth: Dimensions.get('window').width - normalize(150)}}
                      adjustsFontSizeToFit numberOfLines={3}>{state.selected.name}</Text>
                <Text style={{
                  ...styles.title,
                  maxWidth: Dimensions.get('window').width - normalize(150),
                  fontSize: normalize(12)
                }} adjustsFontSizeToFit numberOfLines={3}>{state.selected.original_name}</Text>
                <Text style={{
                  ...styles.text,
                  fontWeight: '500',
                  marginTop: normalize(20)
                }}>Тривалість серії: {state.selected?.episode_run_time?.join('-')} <Text
                  style={{color: MAIN_RED}}>●</Text>{state.selected.runtime} хв
                </Text>
                {state.selected?.homepage && <TouchableOpacity style={styles.whiteButton} onPress={() => {
                  Linking.openURL(state.selected?.homepage);
                }}>
                  <Text style={styles.text}>{i18n.t('homePage')}</Text>
                  <FontAwesome5 name={'play'} color={MAIN_RED} style={{marginLeft: normalize(10)}}/>
                </TouchableOpacity>}
              </View>
            </View>
            {state.selected?.overview && <View style={{flex: 1, paddingTop: normalize(20)}}>
              <Text style={styles.tagline}>{state.selected?.tagline}</Text>
              <View style={{marginTop: normalize(10)}}>
                <Text style={styles.text} numberOfLines={openReview ? 0 : 3}>{state.selected?.overview}</Text>
                <Pressable style={{alignSelf: 'center'}} onPress={() => setOpenReview(!openReview)}>
                  {openReview ? <Text style={{...styles.text, color: MAIN_RED}}>{i18n.t('hide')}</Text> :
                    <MaterialIcons name={'more-horiz'} color={MAIN_RED} size={normalize(40)}/>}
                </Pressable>
              </View>
            </View>}

            <View style={{flex: 1, paddingTop: normalize(20)}}>
              <Text style={{...styles.tagline, fontSize: normalize(18)}}>{i18n.t('seasons')}:</Text>
              <Seasons data={state.selected.seasons} seasonName={state.selected?.name} seasonId={id}/>
            </View>
            <View style={{flex: 1, paddingTop: normalize(20)}}>
              <Text style={{...styles.tagline, fontSize: normalize(18)}}>{i18n.t('ratings')}:</Text>
              <View style={{width: '100%', marginTop: normalize(15)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {/*<Image source={tmdb} style={{width:normalize(25),height:normalize(25)}}/>*/}
                  <Tmdb width={normalize(25)} height={normalize(25)}/>
                  <Text style={styles.text}> TMDB: <Text
                    style={styles.rateText}>{state.selected.vote_average}</Text></Text>
                </View>
              </View>
            </View>
            <View style={{marginTop: normalize(50)}}>
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  style={{...styles.switchButton, borderColor: switchButton === 'cast' ? MAIN_RED : MAIN_GREY}}
                  onPress={() => setSwitchButton('cast')}>
                  <Text style={styles.text}>{i18n.t('team')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{...styles.switchButton, borderColor: switchButton === 'details' ? MAIN_RED : MAIN_GREY}}
                  onPress={() => setSwitchButton('details')}>
                  <Text style={styles.text}>{i18n.t('details')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{...styles.switchButton, borderColor: switchButton === 'genre' ? MAIN_RED : MAIN_GREY}}
                  onPress={() => setSwitchButton('genre')}>
                  <Text style={styles.text}>{i18n.t('genres')}</Text>
                </TouchableOpacity>

              </View>
              {switchButton === 'cast' && <Crew cast={cast} crew={crew} navigation={navigation}/>}
              {switchButton === 'details' && <Details data={state.selected}/>}
              {switchButton === 'genre' && <Genres data={state.genres}/>}

            </View>
            {reviews?.all.length > 0 && <View style={{marginTop: normalize(50), marginBottom: normalize(20)}}>
              <Text style={styles.castTitle}>{i18n.t('reviews')}:</Text>
              {reviews?.all?.slice(0, 4)?.map((item, index) => {
                return (
                  <Review item={item} key={index}/>
                )
              })}
              <TouchableOpacity
                onPress={() => navigation.navigate('Reviews', {reviews: reviews, title: state.selected.title})}>
                <Text style={{...styles.text, textAlign: 'center', fontWeight: '600', fontSize: normalize(18)}}>{i18n.t('allReviews')}</Text>
              </TouchableOpacity>

            </View>}
            <SimilarFilms similarFilms={similarFilms} navigation={navigation} isSerial={true}/>
          </View>
        </Animated.ScrollView>
      </View>
  );
};

export default SerialOverview;
