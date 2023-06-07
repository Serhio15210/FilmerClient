import React, {useEffect, useState} from 'react';
import Loading from "../../components/UI/Loading";
import RateInfoModal from "../../components/filmModals/RateInfoModal";
import TrailerModal from "../../components/Films/TrailerModal";
import {Animated, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AnimatedHeader from "../../components/UI/AnimatedHeader";
import {normalize} from "../../responsive/fontSize";
import GetActorsInfo from "../../api/GetActorsInfo";
import {IMG_URI} from "../../api/apiKey";
import LinearGradient from "react-native-linear-gradient";
import {MAIN_GREY_FADE} from "../../constants/colors";
import {useTheme} from "../../providers/ThemeProvider";

const ActorOverview = ({route, navigation}) => {
  const {id, title} = route.params
  const [scrollY] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(true)
  const [info, setInfo] = useState([])
  const {i18n} = useTheme()
  const [films, setFilms] = useState([])
  const [images, setImages] = useState([])
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
  const getInfo = async () => {
    const res = await GetActorsInfo.getActorsInfo(id)
    setInfo(res)
    const actorFilms = await GetActorsInfo.getActorsFilms(id)
    setFilms(actorFilms?.cast)
    const posters = await GetActorsInfo.getActorImages(id)

    setImages(posters.profiles)
    setIsLoading(false)
  }
  useEffect(() => {
    getInfo()
  }, [])
  return (
    isLoading ?
      <Loading/> :
      <View style={styles.container}>

        <AnimatedHeader scrollY={scrollY} title={title} headerOpacity={headerOpacity} headerBgColor={headerBgColor}
                        arrowColor={arrowColor}/>
        <Animated.ScrollView onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false, throttle: 16}
        )}
                             scrollEventThrottle={16}>
          <Header images={images}/>
          <View style={styles.content}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={{uri: IMG_URI + info?.profile_path}}
                     style={{width: normalize(100), height: normalize(150), borderRadius: 5}}/>
              <Text
                style={{
                  color: 'black',
                  fontSize: normalize(24),
                  fontWeight: '600',
                  marginLeft: normalize(10),
                  flex: 1,
                  textAlign: 'center'
                }}
                numberOfLines={5} adjustsFontSizeToFit>{info?.name}</Text>
            </View>
            {/*<TouchableOpacity style={{*/}
            {/*  backgroundColor: 'white',*/}
            {/*  elevation: 5,*/}
            {/*  alignItems: 'center',*/}
            {/*  justifyContent: 'center',*/}
            {/*  borderRadius: 10,*/}
            {/*  marginTop:normalize(15),*/}
            {/*  paddingHorizontal:normalize(20),*/}
            {/*  height:normalize(30),*/}
            {/*  alignSelf:'flex-start'*/}
            {/*}}>*/}
            {/*  <Text style={styles.text} numberOfLines={1} adjustsFontSizeToFit>Підписатись</Text>*/}
            {/*</TouchableOpacity>*/}
            {info?.also_known_as?.length > 0 && <View style={styles.block}>
              <Text style={styles.title}>{i18n.t('asKnownAs')}:</Text>
              <Text style={styles.text}>{info?.also_known_as?.join(' , ')}</Text>
            </View>}
            {info?.birthday && <View style={styles.block}>
              <Text style={styles.title}>{i18n.t('birthday')}:</Text>
              <Text style={styles.text}>{info?.birthday}</Text>
            </View>}
            {info?.place_of_birth && <View style={styles.block}>
              <Text style={styles.title}>{i18n.t('birthdayPlace')}:</Text>
              <Text style={styles.text}>{info?.place_of_birth}</Text>
            </View>}
            {info?.biography && <View style={styles.block}>
              <Text style={styles.title}>{i18n.t('biography')}:</Text>
              <Text style={styles.text}>{info?.biography}</Text>
            </View>}
            {films.length > 0 && <View style={styles.block}>
              <Text style={styles.title}>{i18n.t('films')}:</Text>
              <FlatList horizontal contentContainerStyle={{paddingTop: normalize(15)}}
                        showsHorizontalScrollIndicator={false} initialNumToRender={5} data={films}
                        renderItem={({item, index}) => {
                          return (
                            <TouchableOpacity key={item.id} style={{marginRight: normalize(20), width: normalize(200)}}
                                              onPress={() => navigation.push("FilmOverview", {
                                                id: item.id,
                                                title: item.title || item.name
                                              })}>
                              <ImageBackground source={{uri: IMG_URI + item.poster_path}}
                                               style={{
                                                 height: normalize(250),
                                                 width: normalize(200),

                                                 backgroundSize: "cover",
                                                 backgroundPositionX: "50%",
                                                 backgroundPositionY: "50%",
                                               }} imageStyle={{borderRadius: 10}}/>


                              <Text style={{
                                color: 'black',
                                fontSize: normalize(18),
                                textAlign: 'center'
                              }}>{item.title || item.name}</Text>
                              <Text style={{
                                color: 'black',
                                fontSize: normalize(18),
                                textAlign: 'center',
                                fontWeight: '600'
                              }}>({item?.character})</Text>
                            </TouchableOpacity>
                          )
                        }}/>
            </View>}
          </View>
        </Animated.ScrollView>


      </View>

  );
};
const Header = ({images}) => {
  // console.log(images?.slice(0, 1))
  const array = images?.length >= 9 ? images?.slice(1, 9) : images?.length >= 4 ? images?.slice(1, 4) : images?.slice(0, 1)
  return (
    <View style={{alignItems: 'center', flexDirection: 'row', flexWrap: 'wrap', height: normalize(300)}}>
      {array?.map((item, index) => {
        return <Image key={index} source={{uri: IMG_URI + item?.file_path}}
                      style={{
                        flex: 1,
                        height: array?.length >= 8 ? normalize(150) : normalize(300),
                        minWidth: normalize(100)
                      }} resizeMode={'cover'}/>
      })}
      <LinearGradient
        colors={['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.5)', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 1)']}
        style={styles.gradient}>
      </LinearGradient>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  content: {
    flex: 1,
    padding: normalize(15)
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    color: MAIN_GREY_FADE,
    fontSize: normalize(18),
  },
  text: {
    color: 'black',
    fontSize: normalize(16)
  },
  block: {
    marginTop: normalize(15)
  }
})
export default ActorOverview;
