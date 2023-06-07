import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {Animated, FlatList, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Loading from "../../components/UI/Loading";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED} from "../../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import {IMG_URI} from "../../api/apiKey";
import {normalize} from "../../responsive/fontSize";
import {getSubscribers} from "../../api/users";
import UserItem from "./UserItem";
import {styles} from "./styles/subStyles"
import {useAuth} from "../../providers/AuthProvider";
import {useTheme} from "../../providers/ThemeProvider";
const Subscribers = ({navigation,route}) => {
  const [subs, setSubs] = useState([])
  const {userList, user} = useSelector(state => state.auth)
  let scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollY] = useState(new Animated.Value(0));
  const {i18n}=useTheme()
  const [loading, setLoading] = useState(true)
  // const [totalPages, setTotalPages] = useState(1)
  // const [page, setPage] = useState(1)
  const scrolling = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  useEffect(() => {

    getSubscribers(route.params.id).then(res=>{
      console.log(res)
      setSubs(res?.subscribers)
      setLoading(false)
    })

  }, [])

  return (
    loading ? <Loading/> :
      <View style={styles.container}>

        {subs.length === 0 ?
          <View style={styles.containerCenter}>
            <Text style={{color: MAIN_GREY_FADE}}>{i18n.t('subscribersNotFound')}</Text>
          </View>
          :
          <Animated.FlatList ref={scrollRef} data={subs} showsVerticalScrollIndicator={false}
                             onScroll={Animated.event(
                               [{nativeEvent: {contentOffset: {y: scrollY}}}],
                               {useNativeDriver: false, throttle: 16}
                             )}
                             scrollEventThrottle={16}
                             renderItem={({item}) => {
                               return (
                                 <UserItem item={item} onPress={() => {
                                   item?._id===user?._id?
                                     navigation.navigate('ProfileScreen'):
                                   navigation.navigate('UserOverview', {
                                     id: item?._id,
                                     title: item?.userName
                                   })
                                 }}/>

                               );
                             }}
          />}

        <Animated.View style={{...styles.up, opacity: scrolling}}>
          <TouchableOpacity onPress={() => {
            scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 });
          }}>
            <Ionicons name={'arrow-up'} color={'white'} size={30}/>
          </TouchableOpacity>
        </Animated.View>
      </View>
  );
};

// const styles = StyleSheet.create({
//
//   scroll: {
//     flex: 1,
//     backgroundColor: 'white'
//   },
//   container: {
//     flex: 1, backgroundColor: 'white',
//     padding:normalize(15),
//   },
//   containerCenter: {
//     flex: 1, alignItems: 'center', justifyContent: 'center'
//   },
//   title: {
//     fontSize: normalize(18),
//     color: 'black',
//     fontWeight: '500',
//     marginBottom: 5
//   },
//   filmsRow: {
//     flexDirection: 'row', alignItems: 'center', width: normalize(300), height: normalize(140)
//   },
//   up: {
//     backgroundColor: MAIN_RED,
//     borderRadius: 100,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: normalize(60),
//     height: normalize(60),
//     position: 'absolute',
//     right: normalize(15),
//     bottom: normalize(15)
//   },
//
//
// })

export default Subscribers;
