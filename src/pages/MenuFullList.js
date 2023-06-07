import React from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import OverviewFilmItem from "../components/Films/OverviewFilmItem";
import {normalize} from "../responsive/fontSize";
import {BLACK, MAIN_GREY, MAIN_RED, WHITE} from "../constants/colors";
import {useTheme} from "../providers/ThemeProvider";
export const themeColors={
  'light':{
    backgroundColor:WHITE,
  },
  'dark':{
    backgroundColor:MAIN_GREY,
  }
}
const MenuFullList = ({route,navigation}) => {
  const {appTheme}=useTheme()
  const style =styles(themeColors[appTheme])
  return (
    <View style={style.container}>
      <FlatList showsVerticalScrollIndicator={false} data={route.params.data} renderItem={({item,index})=>{
        return <OverviewFilmItem item={item} onPress={()=>{
          if (route.params?.isSerial){
            navigation.navigate('SerialOverview',{title:item.name,id:item.id})
          }else  navigation.navigate('FilmOverview',{title:item.title,id:item.id})

        }}/>
      }}/>
    </View>
  );
};
const styles=(theme)=>StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:theme.backgroundColor,
    padding:normalize(15)
  }
})
export default MenuFullList;
