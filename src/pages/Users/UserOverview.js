import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "../../providers/AuthProvider";
import {useNavigation} from "@react-navigation/native";
import {getActivities, getProfile, subscribeUser, unsubscribeUser} from "../../api/auth";
import {setUser} from "../../redux/authReducer";
import {getRateStats} from "../../api/films";
import Loading from "../../components/UI/Loading";
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import Feather from "react-native-vector-icons/Feather";
import {IMG_URI, NONAME_IMG} from "../../api/apiKey";
import {AirbnbRating} from "react-native-ratings";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED, MAIN_SUCCESS} from "../../constants/colors";
import RatingStats from "../../components/UI/RatingStats";
import {removeToken} from "../../utils/storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import {getUserProfile} from "../../api/users";
import {getUserList} from "../../api/lists";
import {styles} from "../Profile/styles/profileStyles"
import {useTheme} from "../../providers/ThemeProvider";
const UserOverview = ({route}) => {
  const {user}=useSelector(state => state.auth)
  const dispatch = useDispatch()
  const {i18n}=useTheme()
  const navigation = useNavigation()
  const [userInfo, setUserInfo] = useState({})
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])
  const [rateStats, setRateStats] = useState([])
  const [listCount, setListCount] = useState(0)
  const isSubscribe = () => {
    return user?.subscriptions?.includes(route.params.id)
  }
  const subscribe = () => {
    subscribeUser(route.params.id).then(res => {
      console.log(res)
      if (res.success) {
        dispatch(setUser({...userInfo, subscriptions: userInfo.subscriptions.concat([route.params.id])}))
      }
    })
  }
  const unsubscribe = () => {
    unsubscribeUser(route.params.id).then(res => {
      if (res.success) {
        dispatch(setUser({...user, subscriptions: user.subscriptions.filter(item => item !== route.params.id)}))
      }
    })
  }
  const getInfo = async () => {
    const response = await getUserProfile(route.params.id)
    console.log(response)
    if (!!response?.userInfo) {
      setUserInfo({
        userName: response?.userInfo?.userName || '',
        avatar: response?.userInfo?.avatar || '',
        email: response?.userInfo?.email || '',
        subscribers: response?.userInfo?.subscribers || [],
        subscriptions: response?.userInfo?.subscriptions || [],
        favoriteFilms: response?.userInfo?.favoriteFilms || []

      })
    }
    const lists = await getUserList(route.params.id)
    setListCount(lists?.lists?.length)
    const activity = await getActivities(route.params.id)
    console.log(activity)
    if (activity.success) {
      setActivities(activity?.activities)
    }
    const stats = await getRateStats(route.params.id)
    // console.log(stats)
    setRateStats(stats?.stats)
    setLoading(false)
  }
  useEffect(() => {
    getInfo()
  }, [])
  return (
    loading ? <Loading/> :
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            {/*<Image source={{uri: NONAME_IMG}}*/}
            {/*       style={{width: normalize(100), height: normalize(100), borderRadius: 100}}/>*/}
            <View style={styles.avatar}>
              <Text style={{fontSize: normalize(24), color: 'white'}}>{userInfo?.userName[0]?.toUpperCase()}</Text>
            </View>
            <Text style={styles.userName}>{userInfo?.userName}</Text>
            <TouchableOpacity style={{
              backgroundColor: 'white',
              elevation: 5,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              marginTop:normalize(15),
              paddingHorizontal:normalize(20),
              height:normalize(30),

            }} onPress={()=>{
              isSubscribe()?unsubscribe():subscribe()
            }}>
              <Text style={{...styles.text,color:isSubscribe()?MAIN_SUCCESS:'black'}} numberOfLines={1} adjustsFontSizeToFit>{isSubscribe()?i18n.t('subscriber'):i18n.t('subscribe')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.block}>
            <Text style={styles.title}>{i18n.t('recentActivity')}</Text>
            <FlatList showsHorizontalScrollIndicator={false} horizontal data={activities}
                      contentContainerStyle={{marginTop: normalize(10)}} renderItem={({item, index}) => {
              return (<TouchableOpacity key={index} style={{marginRight: normalize(15)}} onPress={()=>navigation.navigate(item?.isSerial?'SerialOverview':'FilmOverview', {id: item?.imdb_id,title:item?.title})}>
                <Image source={{uri: IMG_URI + item?.poster}} style={styles.activityImg}/>
                {item?.rate > 0 && <AirbnbRating
                  count={5}
                  defaultRating={item?.rate}
                  showRating={false}
                  isDisabled={true}
                  size={normalize(15)}
                  selectedColor={MAIN_RED}
                  ratingContainerStyle={{marginTop: 0, width: normalize(100)}}

                />}
              </TouchableOpacity>)
            }}/>
          </View>
          <View style={styles.block}>
            <Text style={styles.title}>{i18n.t('ratings')}</Text>
            <RatingStats data={rateStats}/>
          </View>
          <View style={styles.block}>
            <Text style={styles.title}>{i18n.t('details')}</Text>
            <TouchableOpacity style={styles.detailRow} onPress={() => navigation.navigate('UserFilmsScreen',{id:route.params.id,title:userInfo?.userName})}>
              <Text style={styles.text}>{i18n.t('films')}</Text>
              <Text style={styles.text}>{rateStats?.all}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailRow} onPress={() => navigation.navigate('AllListsScreen',{id:route.params.id,title:userInfo.userName})}>
              <Text style={styles.text}>{i18n.t('lists')}</Text>
              <Text style={styles.text}>{listCount}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailRow} onPress={()=>navigation.navigate('Subscribers',{id:route.params.id})}>
              <Text style={styles.text}>{i18n.t('subscribers')}</Text>
              <Text style={styles.text}>{userInfo?.subscribers?.length}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailRow} onPress={()=>navigation.navigate('Subscriptions',{id:route.params.id})}>
              <Text style={styles.text}>{i18n.t('subscriptions')}</Text>
              <Text style={styles.text}>{userInfo?.subscriptions?.length}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
  );
};
// const styles = StyleSheet.create({
//   scroll: {
//     flex: 1,
//     backgroundColor: 'white'
//   },
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//   },
//   userName: {
//     color: 'white',
//     fontSize: normalize(24)
//   },
//   title: {
//     color: MAIN_GREY,
//     fontSize: normalize(18),
//     textTransform: 'capitalize'
//   },
//   text: {
//     color: 'black',
//     fontSize: normalize(18),
//     textTransform: 'capitalize'
//   },
//   profileHeader: {
//     width: '100%',
//     borderBottomWidth: 1,
//     borderColor: MAIN_GREY_FADE,
//     backgroundColor: MAIN_RED,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: normalize(20),
//     paddingTop:normalize(60)
//     // backgroundColor:'white',
//     // elevation:20
//   },
//   block: {
//     width: '100%',
//     borderBottomWidth: 1,
//     borderColor: MAIN_GREY_FADE,
//     padding: normalize(15)
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginTop: normalize(20)
//   },
//   activityImg: {
//     width: normalize(100), height: normalize(120), borderRadius: 5
//   }
//
// })

export default UserOverview;
