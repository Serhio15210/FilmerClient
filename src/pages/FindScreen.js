import React, {useCallback, useEffect, useState} from "react";
import {
  Animated,
  FlatList,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import {useTheme} from "../providers/ThemeProvider";
import GetFindInfo from "../api/GetFindInfo";
import GetFilms from "../api/GetFilms";
import GetSerials from "../api/GetSerials";
import FilmItem from "../components/Films/FilmItem";
import OverviewFilmItem from "../components/Films/OverviewFilmItem";
import {API_KEY, DARK_BACKGROUND_IMG, DEFAULT_BACKGROUND_IMG} from "../api/apiKey";
import {DefaultStyles} from "../styles/defaultstyles";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FilterDropdown from "../components/Find/FilterDropdown";
import {normalize} from "../responsive/fontSize";
import {MAIN_GREY_FADE, MAIN_RED} from "../constants";
import Input from "../components/UI/Input";
import AntDesign from "react-native-vector-icons/AntDesign";
import PageButtons from "../components/UI/PageButtons";
import Loading from "../components/Loading";
import SearchActorItem from "../components/SearchActorItem";
import GetActorsInfo from "../api/GetActorsInfo";


const FindScreen = ({navigation}) => {
  const [movieQuery, setMovieQuery] = useState("");
  const [query, setQuery] = useState("");
  const [openTop, setOpenTop] = useState(false);
  const [isFilter, setIsFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const heightTop = openTop ? "auto" : 0;
  const {screenTheme, isDarkTheme} = useTheme()
  const [selectedYear, setSelectedYear] = useState([]);
  const [selectedDate, setSelectedDate] = useState([]);
  let scrollPageRef
  const [filter, setFilter] = useState('movie');
  const [page, setPage] = useState(1);
  const [infoData, setInfoData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [translateY, setTranslateY] = useState(new Animated.Value(normalize(350)))

  const getInfo = async () => {
    setLoading(true)
    let res
    if (filter === 'movie') {
      if (!movieQuery) {
        res = await GetFilms.getPremiereMovies(page)

      } else {
        res = await GetFindInfo.getFilmsByQuery(page, movieQuery)
      }

    }

    if (filter === 'serial') {
      !movieQuery ?
        res = await GetSerials.getPopularSerials(page) :
        res = await GetFindInfo.getSerialsByQuery(page, movieQuery)
    }
    setInfoData(res.results)
    setTotalPages(res.total_pages > 500 ? 500 : res.total_pages)
    setLoading(false)
  }
  const getFilterInfo = async () => {
    const id = selectedDate.join().length === 0 ? "" : selectedDate.join()
    const years = selectedYear.join().length === 0 ? "" : selectedYear.join()
    setLoading(true)
    const filterData = await GetFindInfo.getFilterMovies(page, years, id, movieQuery)
    // console.log(filterData.results[0])
    setInfoData(filterData.results)
    setTotalPages(filterData.total_pages > 500 ? 500 : filterData.total_pages)
    setLoading(false)
  }
  const getActorsInfo = async () => {
    setLoading(true)
    let res

    if (movieQuery) {
      res = await GetActorsInfo.getActorsByQuery(page, movieQuery)
    } else res = await GetActorsInfo.getPopularActors(page)

    setInfoData(res.results)
    setTotalPages(res.total_pages > 500 ? 500 : res.total_pages)
    setLoading(false)
  }
  useEffect(() => {
    if (filter === 'actor') {
      getActorsInfo()
    } else {
      isFilter ? getFilterInfo() : getInfo()
    }

    return navigation.addListener('blur', () => {
      setOpenTop(false)
    });
  }, [page, movieQuery, filter, isFilter]);
// useEffect(()=>{
//   setMovieQuery('')
// },[filter])

  const renderItem = ({item, index}) => {
    return (
      <OverviewFilmItem item={item} onPress={()=>navigation.navigate('FilmOverview',{title:item.title||item.name,id:item.id})}/>
    )
  }
  const renderActorItem = ({item, index}) => {
    return (
      <SearchActorItem item={item} index={index} onPress={()=>navigation.navigate('ActorOverview',{title:item.name,id:item.id})}/>
    )
  }
  return (
    <View style={styles.container}>

      < View style={{
        height: heightTop,
        ...styles.filterBlock
      }}>
        {openTop &&
          <FilterDropdown navigation={navigation} filter={filter} setFilter={setFilter} setOpenTop={setOpenTop}
                          setPage={setPage} selectedDate={selectedDate} selectedYear={selectedYear}
                          setSelectedDate={setSelectedDate} setSelectedYear={setSelectedYear}
                          onPress={() => setIsFilter(true)} setIsFilter={setIsFilter} setQuery={setMovieQuery}/>}
      </View>

      <View style={styles.content}>


        <View style={{...styles.rowBetween, paddingBottom: normalize(10)}}>
          <Input query={movieQuery} setQuery={(e) => {
            setMovieQuery(e)
            // setQuery(e)
          }}/>
          <TouchableOpacity style={{marginLeft: normalize(10)}} onPress={() => setOpenTop(!openTop)}>
            <AntDesign name={'filter'} color={openTop ? MAIN_RED : 'black'} size={30}/>
          </TouchableOpacity>

        </View>

        {loading ? <Loading/> :
          filter !== 'actor' ? <FlatList showsVerticalScrollIndicator={false}
                                         contentContainerStyle={{
                                           paddingBottom: normalize(120),
                                           paddingTop: normalize(20)
                                         }} data={infoData}
                                         ref={(ref) => {
                                           scrollPageRef = ref;
                                         }} keyExtractor={(item, index) => `key-${index}`} renderItem={renderItem}
                                         ListFooterComponent={<PageButtons page={page} setPage={setPage}
                                                                           totalPages={totalPages} extend/>}
            /> :
            <FlatList numColumns={2} showsVerticalScrollIndicator={false}
                      contentContainerStyle={{paddingBottom: normalize(120), paddingTop: normalize(20)}} data={infoData}
                      keyExtractor={(item, index) => `key-${item.id}`}
                      key={'_'}
                      renderItem={renderActorItem}
                      ListFooterComponent={<PageButtons page={page} setPage={setPage} totalPages={totalPages} extend/>}
            />
        }


      </View>


    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },
  content: {
    flex: 1,
    backgroundColor: 'white',
    padding: normalize(15)
  },
  rowBetween: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
  },

  filterBlock: {
    flexDirection: "row",
    alignContent: "space-around",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: MAIN_RED,
    marginBottom: 15,
  }
})
export default FindScreen;
