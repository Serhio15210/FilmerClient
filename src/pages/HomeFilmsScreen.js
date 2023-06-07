import React, {useCallback, useEffect, useRef, useState} from "react";
import {LogBox, RefreshControl, ScrollView, StatusBar, useWindowDimensions,} from "react-native";
import MenuFilmsList from "../components/Films/MenuFilmsList";
import GetFilms from "../api/GetFilms";
import {useAuth} from "../providers/AuthProvider";

import {useFocusEffect, useIsFocused} from "@react-navigation/native";
import MyHomeLists from "../components/MyHomeLists";

import ScreenWrapper from "../components/wrapper/ScreenWrapper";
import {useDispatch, useSelector} from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useTheme} from "../providers/ThemeProvider";
import {themeColors} from "./Auth/themeColors";
import {form} from "./Auth/Login";


const HomeFilmsScreen = ({navigation}) => {
    const [soonData, setSoonData] = useState([]);
    const [recommendData, setRecommendData] = useState([]);
    const [premierData, setPremierData] = useState([]);
    const [popularData, setPopularData] = useState([]);
    const componentMounted = useRef(true)
    const { getUserInfo,getUserLists,getUserNotifications}=useAuth()
    const [isLoading, setLoading] = useState(true);
    const dispatch = useDispatch();
  const {isDarkTheme,i18n,locale,appTheme} = useTheme()
    const {
        refresh,user
    } = useSelector((state) => state.auth);
    const isFocused = useIsFocused();

  const getRecommendCache = async () => {
    try {
      const jsonData = await AsyncStorage.getItem('recommendFilms');
      if (jsonData !== null) {
        const data = JSON.parse(jsonData);
        if (jsonData?.date !== new Date().getDay() + '') {
          const newFilms=await GetFilms.getRecommendation(user.favGenres, user.favActors)
          setRecommendData(newFilms)
          const newJsonData = JSON.stringify({date:new Date().getDay() + '',data:newFilms});
          await AsyncStorage.setItem('recommendFilms', newJsonData);
        }else{
          setRecommendData(data?.data)
        }

      } else {
        if ((user.favGenres?.length > 0 || user.favActors?.length > 0)) {
          const newFilms = await GetFilms.getRecommendation(user.favGenres, user.favActors)
          setRecommendData(newFilms)
          const newJsonData = JSON.stringify({date: new Date().getDay() + '', data: newFilms});
          await AsyncStorage.setItem('recommendFilms', newJsonData);
        }
      }

    } catch (error) {
      console.log('Ошибка при сохранении массива объектов в кеше:', error);
    }
  };
    const getData=async () => {
      try {

        GetFilms.getSoonMovies().then((response) => {
          setSoonData(response.results)

        });
        GetFilms.getPremiereMovies().then((response) => {
          setPremierData(response.results)

        });
        GetFilms.getPopularMovies().then((response) => {
          setPopularData(response.results)

        });
        await getUserInfo()
        await getUserLists()
      } finally {
        setLoading(false)
      }

    }
    useEffect(() => {
        LogBox.ignoreLogs(["VirtualizedLists should never be nested"])

        try {
            setLoading(true)
          getRecommendCache()


            getData()
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }

        return () => { // This code runs when component is unmounted
            componentMounted.current = false; // (4) set it to false when we leave the page
        }

    }, [locale]);

    return (
      <ScreenWrapper refreshing={()=>{
          setLoading(true)
          // getUserLists()
          getData()
          // getUserInfo()
          getUserNotifications()
      }}>
        <ScrollView
            style={{height: '100%'}}
        >

            <MenuFilmsList data={soonData} name={i18n.t("soonInCinema")} navigation={navigation} isLoading={isLoading}/>
            <MenuFilmsList data={premierData} name={i18n.t("premiers")} isLoading={isLoading}/>
            <MenuFilmsList data={popularData} name={i18n.t("nowWatching")} isLoading={isLoading}/>
          {recommendData?.length > 0 &&
            <MenuFilmsList data={recommendData} name={i18n.t("recommendations")} navigation={navigation} isLoading={isLoading}/>}
            <MyHomeLists/>
        </ScrollView>
      </ScreenWrapper>
    );
};

export default HomeFilmsScreen;
