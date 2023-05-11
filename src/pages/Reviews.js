import React, {useEffect, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../responsive/fontSize";
import {MAIN_GREY_FADE, MAIN_RED} from "../constants";
import Review from "./Overview/Review";

const Reviews = ({route}) => {
const {reviews}=route.params
  const [isSub,setIsSub]=useState(false)
  const [array,setArray]=useState(reviews?.all)
  useEffect(()=>{
    console.log(reviews)
    isSub?setArray(reviews?.subs):setArray(reviews?.all)
  },[isSub])
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{...styles.headerButton,borderColor:isSub?MAIN_GREY_FADE:MAIN_RED}} onPress={()=>setIsSub(false)}>
          <Text style={styles.headerText}>Усі</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{...styles.headerButton,borderColor:!isSub?MAIN_GREY_FADE:MAIN_RED}} onPress={()=>setIsSub(true)}>
          <Text style={styles.headerText}>Підписки</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1}}>
        <View style={{flex:1,padding:normalize(15)}}>
          {array?.map((item,index)=>{
            return (
              <Review item={item} key={index}/>
            )
          })}
        </View>

      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'white'
  },
  header:{
    flexDirection:'row',
    alignItems:'center',
    width:'100%'
  },
  headerButton:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    padding:normalize(10),
    borderBottomWidth:1,
    borderColor:MAIN_GREY_FADE
  },
  headerText:{
    color:'black',
    fontSize:normalize(18)
  }
})
export default Reviews;
