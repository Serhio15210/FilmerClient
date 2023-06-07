import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Button,
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator
} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {data, dataEng} from "../../constants/genres";
import {MAIN_GREY, MAIN_RED} from "../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {saveFavGenres} from "../../api/auth";
import FavoriteActors from "./FavoriteActors";
import {useTheme} from "../../providers/ThemeProvider";

const FavoriteGenres = () => {
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const {i18n,locale} = useTheme()
  const slideUpAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [animate, setAnimate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState([])
  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(slideUpAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const stopAnimation = () => {
    Animated.parallel([
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };
  const saveGenres=()=>{
    // navigation.navigate('FavoriteActors')
    setLoading(true)
    saveFavGenres(genres).then(res=>{

      if (res.success){
        navigation.navigate('FavoriteActors')
      }
      setLoading(false)
    })
  }
  useEffect(() => {
    isFocused ? startAnimation() : stopAnimation()
  }, [isFocused])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('chooseFavoriteGenres')}:</Text>

      <Animated.View
        style={[
          styles.block,
          {
            opacity: opacityAnim,
            transform: [
              {
                translateY: slideUpAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [normalize(550), 0],
                }),
              },
            ],
          },
        ]}
      >
        <FlatList showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flat}
                  style={{width: '100%'}} data={locale==='ukr'?data:dataEng} numColumns={2}
                  renderItem={({item, index}) => {
                    return <TouchableOpacity style={{
                      ...styles.genre,
                      backgroundColor: genres.includes(item.id) ? MAIN_RED : 'white',
                      marginRight: index % 2 === 0 ? normalize(10) : 0,
                    }} onPress={() => {
                      genres.includes(item.id) ?
                        setGenres((prev) => prev.filter(genre => genre !== item.id)) :
                        setGenres((prev) => prev.concat([item.id]))
                    }}>
                      <Image source={item.picture} style={styles.picture}
                      />
                      <Text style={styles.genreText}>{item.name}</Text>
                    </TouchableOpacity>
                  }}/>

      </Animated.View>
      <TouchableOpacity disabled={loading} style={styles.nextButton} onPress={saveGenres}>
        {loading?<ActivityIndicator color={'white'} size={20}/>:<AntDesign name={'right'} color={'white'} size={20}/>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: normalize(15)
  },
  block: {
    flex: 1,
    width: '100%',
    marginTop: normalize(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  flat:{
    paddingHorizontal: normalize(3),
    paddingBottom: normalize(80),
    paddingTop: normalize(30)
  },
  title: {
    color: 'black', fontSize: normalize(24), fontWeight: '600'
  },
  genre: {
    elevation: 3,
    flex: 1,
    maxWidth: '49%',

    marginBottom: normalize(10),
    borderRadius: 5,
    height: normalize(130),
  },
  picture: {
    width: '100%',
    height: normalize(100),
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5
  },
  genreText: {
    color: 'black',
    paddingHorizontal: normalize(5),
    textAlign: 'center',
    fontSize: normalize(16),
    flex: 1,
    flexWrap: 'wrap'
  },
  nextButton: {
    backgroundColor: MAIN_RED,
    width: normalize(60),
    height: normalize(60),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: normalize(30),
    right: normalize(30)
  }
});

export default FavoriteGenres;
