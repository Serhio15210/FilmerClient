import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useAuth} from "../providers/AuthProvider";
import {useDispatch, useSelector} from "react-redux";
import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import GetFilms from "../api/GetFilms";
import {LogBox, ScrollView, useWindowDimensions} from "react-native";
import ScreenWrapper from "../components/wrapper/ScreenWrapper";
import MenuFilmsList from "../components/Films/MenuFilmsList";
import MyHomeLists from "../components/MyHomeLists";
import GetSerials from "../api/GetSerials";
import MenuSerialList from "../components/Serials/MenuSerialList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTheme} from "../providers/ThemeProvider";

const HomeSerials = ({navigation}) => {
  const [soonData, setSoonData] = useState([]);
  const [premierData, setPremierData] = useState([]);
  const [popularData, setPopularData] = useState([]);
  const componentMounted = useRef(true)
  const {getUserInfo, getUserLists, getUserNotifications} = useAuth()
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const {isDarkTheme,i18n} = useTheme()
  const [recommendData, setRecommendData] = useState([]);
  const {
    refresh, user
  } = useSelector((state) => state.auth);
  const isFocused = useIsFocused();
  const getRecommendCache = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('recommendSerials');
      if (jsonData !== null) {
        const data = JSON.parse(jsonData);
        if (jsonData?.date !== new Date().getDay() + '') {
          const newFilms = await GetSerials.getRecommendation(user.favGenres, user.favActors)
          setRecommendData(newFilms)
          const newJsonData = JSON.stringify({date: new Date().getDay() + '', data: newFilms});
          await AsyncStorage.setItem('recommendSerials', newJsonData);
        } else {
          setRecommendData(data?.data)
        }

      } else {
        if ((user.favGenres?.length > 0 || user.favActors?.length > 0)) {
          const newFilms = await GetSerials.getRecommendation(user.favGenres, user.favActors)
          setRecommendData(newFilms)
          const newJsonData = JSON.stringify({date: new Date().getDay() + '', data: newFilms});
          await AsyncStorage.setItem('recommendSerials', newJsonData);
        }
      }

    } catch (error) {
      console.log('Ошибка при сохранении массива объектов в кеше:', error);
    }
  };
  const getData = async () => {

    GetSerials.getLatestSerials().then((response) => {
      setSoonData(response.results)

    });

    GetSerials.getTopSerials().then((response) => {
      setPremierData(response.results)

    });
    GetSerials.getPopularSerials().then((response) => {
      setPopularData(response.results)

    });
    await getUserInfo()
    await getUserLists()
    setLoading(false)
  }
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

    try {
      if (isFocused) {
        console.log('foc')
        setLoading(true)
        getRecommendCache()
        getData()
        navigation.closeDrawer()

      }

    } catch (error) {
      console.error(error);
    }

    return () => { // This code runs when component is unmounted
      componentMounted.current = false; // (4) set it to false when we leave the page
    }

  }, [isFocused]);
  const {width: windowWidth} = useWindowDimensions();

  return (
    <ScreenWrapper refreshing={() => {
      setLoading(true)
      getData()
      getUserNotifications()
    }}>
      <ScrollView

        style={{height: '100%'}}
      >


        <MenuSerialList data={soonData} name={i18n.t('novelty')} navigation={navigation} isLoading={isLoading}/>
        <MenuSerialList data={popularData} name={i18n.t('nowWatching')} isLoading={isLoading}/>
        <MenuSerialList data={premierData} name={i18n.t('bestSerials')} isLoading={isLoading}/>
        {recommendData?.length > 0 &&
          <MenuSerialList data={recommendData} name={i18n.t('recommendations')} navigation={navigation} isLoading={isLoading}/>}
        <MyHomeLists/>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default HomeSerials;
