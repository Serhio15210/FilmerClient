import React from 'react';
import {FlatList, StyleSheet, View} from "react-native";
import OverviewFilmItem from "../components/Films/OverviewFilmItem";
import {normalize} from "../responsive/fontSize";

const MenuFullList = ({route,navigation}) => {

  return (
    <View style={styles.container}>
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
const styles=StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white',
    padding:normalize(15)
  }
})
export default MenuFullList;
