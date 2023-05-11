import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {Animated, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {getSubscribers, getSubscriptions} from "../../api/users";
import Loading from "../../components/Loading";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED} from "../../constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import {normalize} from "../../responsive/fontSize";
import {IMG_URI, NONAME_IMG} from "../../api/apiKey";
import {generateRandomColor} from "../../styles/randomColors";
import UserItem from "./UserItem";
import {styles} from "./styles/subStyles"
const Subscriptions = ({navigation, route}) => {
  const [subs, setSubs] = useState([])
  const {userList, user} = useSelector(state => state.auth)
  let scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollY] = useState(new Animated.Value(0));

  const [loading, setLoading] = useState(true)
  // const [totalPages, setTotalPages] = useState(1)
  // const [page, setPage] = useState(1)
  const scrolling = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  useEffect(() => {

    getSubscriptions(route.params.id).then(res => {
      console.log(res)
      setSubs(res?.subscriptions)
      setLoading(false)
    })

  }, [])

  return (
    loading ? <Loading/> :
      <View style={styles.container}>

        {subs?.length === 0 ?
          <View style={styles.containerCenter}>
            <Text style={{color: MAIN_GREY_FADE}}>Subscriptions not found</Text>
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
                                   item?._id === user?._id ?
                                     navigation.navigate('ProfileScreen') :
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
            scrollRef?.current?.scrollToOffset({animated: true, offset: 0});
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
//     padding: normalize(15),
//   },
//   containerCenter: {
//     flex: 1, alignItems: 'center', justifyContent: 'center'
//   },
//   title: {
//     fontSize: normalize(18),
//     color: 'black',
//     fontWeight: '500',
//
//   },
//
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
//   }
//
// })

export default Subscriptions;
