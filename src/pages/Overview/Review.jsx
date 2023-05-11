import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED, MAIN_SUCCESS} from "../../constants";
import {normalize} from "../../responsive/fontSize";
import {generateRandomColor} from "../../styles/randomColors";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useNavigation} from "@react-navigation/native";

const Review = ({item}) => {
  const navigation=useNavigation()
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.avatarBlock} onPress={()=>navigation.navigate('UserOverview',{title:item?.userId?.userName,id:item?.userId?._id})}>
      <Text style={styles.avatarSymbol}>{item?.userId?.userName[0]}</Text>
      </TouchableOpacity>
      <View style={styles.review}>
        <View style={styles.reviewHeader}>
          <Text style={styles.userName}>{item?.userId?.userName}</Text>
          <Rating rate={item?.rate} isFavorite={item?.isFavorite}/>
        </View>
        {item?.comment&&<Text style={styles.comment}>{item?.comment}</Text>}
      </View>
    </View>
  );
};
const Rating=({rate=0,isFavorite=false})=>{
  const array=Array.from({length:rate},()=>1)
  return (
    <View style={{flexDirection:'row',alignItems:'center'}}>
      {array?.map((item,index)=>{
        return <AntDesign name={'star'} color={MAIN_RED} style={{marginRight:normalize(10)}}/>
      })}
      {isFavorite&&<AntDesign name={'heart'} color={MAIN_SUCCESS}/>}
    </View>
  )
}
const styles = StyleSheet.create({
  container:{
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex:1,
    marginVertical:normalize(15)
  },
  avatarBlock:{
    width: normalize(50),
    height: normalize(50),
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:generateRandomColor(),
    marginRight:normalize(20)
  },
  avatarSymbol:{
    color:'white',fontSize:normalize(24),top:-2
  },
  review:{
    borderBottomWidth: 1,
    borderColor: MAIN_GREY_FADE,
    paddingBottom:normalize(15),flex:1
  },
  reviewHeader:{
    flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:normalize(15)
  },
  userName:{
    color:MAIN_GREY,fontSize:normalize(20),fontWeight:'600'
  },
  comment:{
    color:'black',fontSize:normalize(16),fontWeight:'500'
  }
})
export default Review;
