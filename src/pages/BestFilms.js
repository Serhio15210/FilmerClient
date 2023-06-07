import React, {useEffect, useRef, useState} from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import {normalize} from "../responsive/fontSize";
import OverviewFilmItem from "../components/Films/OverviewFilmItem";
import {useTheme} from "react-native-paper";
import GetFilms from "../api/GetFilms";
import Loading from "../components/UI/Loading";
import PageButtons from "../components/UI/PageButtons";

const BestFilms = ({navigation}) => {
  const [page,setPage]=useState(1)

  let scrollRef=useRef()
  const [data, setData] = useState([])
  const { screenTheme,isDarkTheme } = useTheme()
  const [loading,setLoading]=useState(true)
  const [totalPages,setTotalPages]=useState(1)
  useEffect(()=>{
    try {
      scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 });
      GetFilms.getBestFilms(page).then(res => {
        console.log(res)
        setData(res.results)
        setTotalPages(res.total_pages>500?500:res.total_pages)
        setLoading(false)
      })
    }catch (e) {
      setLoading(false)
    }

  },[page])
  return (
    <View style={styles.container}>
      {loading?<Loading/>:
      <FlatList  ref={scrollRef} contentContainerStyle={{paddingBottom:normalize(10)}} showsVerticalScrollIndicator={false} data={data} renderItem={({item,index})=>{
        return <OverviewFilmItem item={item} onPress={()=>navigation.navigate('FilmOverview',{title:item.title,id:item.id})}/>
      }} ListFooterComponent={<PageButtons page={page} setPage={setPage} extend totalPages={totalPages} />}/>}
    </View>
  );
};
const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
    padding:normalize(15)
  }
})
export default BestFilms;
