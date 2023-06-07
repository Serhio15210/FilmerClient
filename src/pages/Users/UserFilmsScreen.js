import React, {useEffect, useRef, useState} from 'react';
import {Animated, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {getForeignUserFilms, getUserFilms} from "../../api/films";
import Loading from "../../components/UI/Loading";
import {normalize} from "../../responsive/fontSize";
import SortDropdown from "../../components/SortDropdowns/SortDropdown";
import SortRateDropdown from "../../components/SortDropdowns/SortRateDropdown";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED, MAIN_SUCCESS} from "../../constants/colors";
import PageButtons from "../../components/UI/PageButtons";
import Ionicons from "react-native-vector-icons/Ionicons";
import {IMG_URI, UNKNOWN_IMG} from "../../api/apiKey";
import {AirbnbRating} from "react-native-ratings";
import UserFilm from "../Profile/UserFilm";

const UserFilmsScreen = ({route,navigation}) => {
  const [films, setFilms] = useState([])
  let scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollY] = useState(new Animated.Value(0));
  const filters = [{label: 'ASC', value: 'asc'}, {label: 'DESC', value: 'desc'}, {
    label: 'Rating Highest',
    value: 'rateHigh'
  }, {label: 'Rating Lowest', value: 'rateLow'}]
  const rates = [{label: '0', value: 0}, {label: '1', value: 1}, {label: '2', value: 2}, {
    label: '3',
    value: 3
  }, {label: '4', value: 4}, {label: '5', value: 5}]
  const [value, setValue] = useState('all');
  const [watched, setWatched] = useState(0);
  const [sortRate, setSortRate] = useState(0);
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const scrolling = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  useEffect(() => {
    setLoading(true)
    getForeignUserFilms(route.params.id,value, sortRate,watched, page).then(res => {
      console.log(res?.films)
      setFilms(res?.films)
      setTotalPages(res?.totalPages)
      setLoading(false)
    })
  }, [value, page, sortRate,watched])

  return (
      <View style={styles.container}>
        <View style={{padding: normalize(15)}}>
          <SortDropdown value={value} filters={filters} setValue={setValue}/>
          <View style={styles.rateRow}>
            <SortRateDropdown value={sortRate} filters={rates} setValue={setSortRate}/>
            <TouchableOpacity style={{marginLeft:normalize(20)}} onPress={()=>{
              watched===0?setWatched(1):setWatched(0)
            }}>
              {watched===0?<Ionicons name={'eye'} color={MAIN_GREY} size={30}/>:<Ionicons name={'eye-off'} color={MAIN_SUCCESS} size={30}/>}
            </TouchableOpacity>
          </View>
        </View>

        {loading ? <Loading/> :films?.length === 0 ?
          <View style={styles.containerCenter}>
            <Text style={{color: MAIN_GREY_FADE}}>Films not found</Text>
          </View>
          :
          <Animated.ScrollView ref={scrollRef} style={{flex: 1}} showsVerticalScrollIndicator={false}
                               onScroll={Animated.event(
                                 [{nativeEvent: {contentOffset: {y: scrollY}}}],
                                 {useNativeDriver: false, throttle: 16}
                               )}
                               scrollEventThrottle={16}>
            <View style={styles.content}>
              <View style={styles.filmsContent}>
                {films?.map((item, index) => {
                  return <UserFilm item={item} key={index} onPress={()=>{
                    if (item?.isSerial){
                      navigation.navigate('SerialOverview',{title:item?.title,id:item?.imdb_id})
                    }else navigation.navigate('FilmOverview',{title:item?.title,id:item?.imdb_id})

                  }}/>
                })}
              </View>
              {totalPages > 1 && <View style={{paddingHorizontal: normalize(15)}}>
                <PageButtons page={page} setPage={setPage} extend totalPages={totalPages}/>
              </View>}

            </View>

          </Animated.ScrollView>}
        <Animated.View style={{...styles.up, opacity: scrolling}}>
          <TouchableOpacity onPress={() => {
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            });
          }}>
            <Ionicons name={'arrow-up'} color={'white'} size={30}/>
          </TouchableOpacity>
        </Animated.View>
      </View>
  );
};

const styles = StyleSheet.create({

  scroll: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    flex: 1, backgroundColor: 'white'
  },
  containerCenter: {
    flex: 1, alignItems: 'center', justifyContent: 'center'
  },
  content: {
    flex: 1, justifyContent: 'space-between', paddingBottom: normalize(30)
  },
  filmsContent: {
    flex: 1, padding: normalize(15), flexDirection: 'row', flexWrap: 'wrap'
  },
  userName: {
    color: 'white',
    fontSize: normalize(24)
  },
  title: {
    color: MAIN_GREY,
    fontSize: normalize(18),
    textTransform: 'capitalize'
  },
  text: {
    color: 'black',
    fontSize: normalize(18),
    textTransform: 'capitalize'
  },
  profileHeader: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: MAIN_GREY_FADE,
    backgroundColor: MAIN_RED,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(20),
    // backgroundColor:'white',
    // elevation:20
  },
  block: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: MAIN_GREY_FADE,
    padding: normalize(15)
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(20)
  },
  activityImg: {
    width: normalize(120), height: normalize(140), borderRadius: 5
  },
  up: {
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
  rateRow: {
    flexDirection: 'row', width: '100%', marginTop: normalize(10),alignItems:'center'
  }

})

export default UserFilmsScreen;
