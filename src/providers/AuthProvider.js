import React, {useContext, useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useDispatch, useSelector} from "react-redux";
import {getProfile, saveFcmToken} from "../api/auth";
import {setNotifications, setUser, setUserList} from "../redux/authReducer";
import {getUserList} from "../api/lists";
import messaging from "@react-native-firebase/messaging";
import Toast from 'react-native-toast-message';
import {pushConfig} from "../constants/pushConfig";
import {getNotifications} from "../api/notifications";

const AuthContext = React.createContext(null);

const AuthProvider = ({children}) => {
  const [authToken, setAuthToken] = useState('')
  const [isAuth, setIsAuth] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isNewUser, setIsNewUser] = useState(false)
  const dispatch = useDispatch()
  const {
    user, refresh, userList, notifications
  } = useSelector((state) => state.auth);
  const getUserInfo = async () => {
    const response = await getProfile(authToken)
    if (!!response?.userInfo) {
      dispatch(setUser({
        _id: response?.userInfo?._id,
        userName: response?.userInfo?.userName || '',
        avatar: response?.userInfo?.avatar || '',
        email: response?.userInfo?.email || '',
        subscribers: response?.userInfo?.subscribers || [],
        subscriptions: response?.userInfo?.subscriptions || [],
        favoriteFilms: response?.userInfo?.favoriteFilms || [],
        favGenres: response?.userInfo?.favGenres || [],
        favActors: response?.userInfo?.favActors || [],

      }))
    }
  }
  const getUserLists = () => {
    getUserList().then(res => {
      if (res.success) {
        dispatch(setUserList(res?.lists))
      }
    })
  }

  const getUserNotifications = () => {
    getNotifications().then(res => {

      dispatch(setNotifications(res?.notifications||[]))
    })
  }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  useEffect(() => {

    AsyncStorage.getItem('auth').then(res => {

      if (res) {
        if (requestUserPermission) {
          messaging().getToken().then(token => {
            console.log(token)
            saveFcmToken(token, res)
          })
        }
        setAuthToken(res)
      }
      setIsLoaded(true)
    })

  }, [])

  useEffect(() => {
    if (authToken) {
      AsyncStorage.setItem('auth', authToken)
      getUserInfo()
      getUserNotifications()
      // deleteAloneFilms(authToken)
      setIsAuth(true)
    }
  }, [authToken])
  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      });
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );

    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);

    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      Toast.show({
        type: 'success',
        // And I can pass any custom props I want
        text1: remoteMessage?.notification?.title,
        text2: remoteMessage?.notification?.body
      });
      getUserNotifications()

    });


    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        isAuth,
        setIsAuth,
        getUserInfo,
        getUserLists,
        getUserNotifications,
        isNewUser,
        setIsNewUser,
        isLoaded
      }}
    >
      {children}

      <Toast autoHide={true} config={pushConfig} onPress={() => {
        Toast.hide()
      }} visibilityTime={3000}/>

    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error("useAuth() called outside of a AuthProvider?");
  }
  return auth;
};

export {AuthProvider, useAuth};
