import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  BackHandler,
  Dimensions, Image, KeyboardAvoidingView,
  ScrollView,
  StyleSheet, Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import {normalize} from "../../responsive/fontSize";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED, MAIN_SUCCESS} from "../../constants";
import PageButtons from "../../components/UI/PageButtons";
import {getUsers} from "../../api/users";
import Loading from "../../components/Loading";
import {useDispatch, useSelector} from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import {subscribe, subscribeUser, unsubscribeUser} from "../../api/auth";
import {setUser} from "../../redux/authReducer";
import UserItem from "../../components/users/UserItem";
import {useIsFocused} from "@react-navigation/native";
import Input from "../../components/UI/Input";

const SearchUserScreen = ({navigation}) => {
  const [users, setUsers] = useState()
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  let scrollRef = useRef(null);
  const {user} = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const isFocused = useIsFocused();
  const [scrollPosition, setScrollPosition] = useState(0)
  const [scrollY] = useState(new Animated.Value(0));
  const scrolling = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const isSubscribe = (id) => {
    return user?.subscriptions?.includes(id)
  }
  const subscribe = (id) => {
    subscribeUser(id).then(res => {
      console.log(res)
      if (res.success) {
        dispatch(setUser({...user, subscriptions: user.subscriptions.concat([id])}))
      }
    })
  }
  const unsubscribe = (id) => {
    unsubscribeUser(id).then(res => {
      if (res.success) {
        dispatch(setUser({...user, subscriptions: user.subscriptions.filter(item => item !== id)}))
      }
    })
  }
  useEffect(() => {
    // console.log(navigation.getState())
    getUsers(query, page).then(res => {
      // console.log(res)
      setUsers(res?.users)
      setTotalPages(res?.totalPages)
      setLoading(false)
    })
  }, [query, page])

  function handleBackButtonClick() {
    if (!isFocused) {
      navigation.goBack()
    }else  return true;

  }

  useEffect(() => {
      if (isFocused) {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        return () => {
          BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
      }

  }, [isFocused])
  return (

    <View
      style={styles.container}  >
       <Input query={query} setQuery={setQuery}/>
      {loading ? <Loading/> :
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <View style={{
            flex: 1,
            paddingVertical: normalize(20),
            paddingHorizontal: normalize(5),
            paddingBottom: normalize(150)
          }}>
            {users?.map((item, index) => {
              return (
                <UserItem item={item} isSubscribe={isSubscribe(item?._id)} subscribe={subscribe}
                          unsubscribe={unsubscribe} key={index}
                          onPress={() => navigation.navigate('UserOverview', {title: item?.userName, id: item?._id})}/>
              )
            })
            }
            {totalPages > 1 && <View>
              <PageButtons page={page} setPage={setPage} extend totalPages={totalPages}/>
            </View>}
          </View>

        </ScrollView>}
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

  container: {
    flex: 1, backgroundColor: 'white',
    padding: normalize(15)
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


})
export default SearchUserScreen;
