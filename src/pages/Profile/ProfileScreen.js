import React, {useEffect, useState} from 'react';
import {FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {useDispatch, useSelector} from "react-redux";
import {useAuth} from "../../providers/AuthProvider";
import {getActivities, getProfile} from "../../api/auth";
import {setUser} from "../../redux/authReducer";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED} from "../../constants/colors";
import {IMG_URI, NONAME_IMG} from "../../api/apiKey";
import Feather from "react-native-vector-icons/Feather";
import Loading from "../../components/UI/Loading";
import {AirbnbRating} from "react-native-ratings";
import {getRateStats, getUserFilms} from "../../api/films";
import RatingStats from "../../components/UI/RatingStats";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {loadToken, removeToken} from "../../utils/storage";
import {styles} from "./styles/profileStyles"
import {useTheme} from "../../providers/ThemeProvider";
const ProfileScreen = () => {
  const {user,userList} = useSelector(state => state.auth)
  const {getUserInfo, authToken,setIsAuth,setAuthToken} = useAuth()
  const {i18n}=useTheme()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const isFocused = useIsFocused()
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState([])
  const [rateStats, setRateStats] = useState([])
  const getInfo = async () => {
    const response = await getProfile(authToken)
    if (!!response?.userInfo) {
      dispatch(setUser({
        _id:response?.userInfo?._id,
        userName: response?.userInfo?.userName || '',
        avatar: response?.userInfo?.avatar || '',
        email: response?.userInfo?.email || '',
        subscribers: response?.userInfo?.subscribers || [],
        subscriptions: response?.userInfo?.subscriptions || [],
        favoriteFilms: response?.userInfo?.favoriteFilms || []

      }))
    }

    const activity = await getActivities()
    console.log(activity)
    if (activity.success) {
      setActivities(activity?.activities)
    }
    const stats=await getRateStats()
    // console.log(stats)
    setRateStats(stats?.stats)
    setLoading(false)
  }
  useEffect(() => {
    isFocused&&getInfo()
  }, [isFocused])
  return (
    loading?<Loading/>:
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <TouchableOpacity style={{position: 'absolute', top: normalize(20), right: normalize(15)}}>
            <Feather name={'edit'} color={'white'} size={18}/>
          </TouchableOpacity>
          {/*<Image source={{uri: NONAME_IMG}} style={{width: normalize(100), height: normalize(100), borderRadius: 100}}/>*/}
          <View style={styles.avatar}>
            <Text style={{fontSize: normalize(24), color: 'white'}}>{user?.userName[0]?.toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.userName}</Text>

        </View>
        <View style={styles.block}>
          <Text style={styles.title}>{i18n.t('recentActivity')}</Text>
          <FlatList showsHorizontalScrollIndicator={false} horizontal data={activities} contentContainerStyle={{marginTop:normalize(10)}} renderItem={({item, index}) => {
            return (<TouchableOpacity key={index} style={{marginRight:normalize(15)}}>
              <Image source={{uri: IMG_URI + item?.poster}} style={styles.activityImg}/>
              {item?.rate>0&&<AirbnbRating
                count={5}
                defaultRating={item?.rate}
                showRating={false}
                isDisabled={true}
                size={normalize(15)}
                selectedColor={MAIN_RED}
                ratingContainerStyle={{marginTop:0,width: normalize(100)}}

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
          <TouchableOpacity style={styles.detailRow} onPress={()=>navigation.navigate('AllFilmsScreen')}>
            <Text style={styles.text}>{i18n.t('films')}</Text>
            <Text style={styles.text}>{rateStats?.all}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={()=>navigation.navigate('AllListsScreen',{title:user?.userName,id:user?._id})}>
            <Text style={styles.text}>{i18n.t('lists')}</Text>
            <Text style={styles.text}>{userList?.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={()=>navigation.navigate('Subscribers',{id:user?._id})}>
            <Text style={styles.text}>{i18n.t('subscribers')}</Text>
            <Text style={styles.text}>{user?.subscribers?.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailRow} onPress={()=>navigation.navigate('Subscriptions',{id:user?._id})}>
            <Text style={styles.text}>{i18n.t('subscriptions')}</Text>
            <Text style={styles.text}>{user?.subscriptions?.length}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{marginLeft:normalize(15),marginTop:normalize(15)}} onPress={()=>{
          setIsAuth(false)
          setAuthToken('')
          removeToken()
        }}>
          <Text style={{color:MAIN_RED,fontWeight:'600',fontSize:normalize(18)}}>{i18n.t('exit')} <Ionicons size={15} name={'exit-outline'}/></Text>
        </TouchableOpacity>
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
//     backgroundColor: 'white'
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
//     backgroundColor:MAIN_RED,
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
//   activityImg:{
//     width: normalize(100), height: normalize(120),borderRadius:5
//   }
//
// })
export default ProfileScreen;
