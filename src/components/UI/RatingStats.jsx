import React from 'react';
import {Text, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {MAIN_GREY, MAIN_RED} from "../../constants/colors";
import {normalize} from "../../responsive/fontSize";

const RatingStats = ({data}) => {
  return (
    <View style={{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',maxHeight:normalize(200),marginTop:normalize(20)}}>
      <AntDesign name={'star'} color={MAIN_RED} style={{marginRight:normalize(10)}}/>

        {/*<View style={{backgroundColor:MAIN_GREY,flex:1,marginRight:normalize(5),height:data?.film0>0?`${(data?.film0*100)/data?.all}%`:0.5}}/>*/}
        <View style={{backgroundColor:MAIN_GREY,flex:1,marginRight:normalize(5),height:data?.film1>0?`${(data?.film1*100)/data?.all}%`:0.5}}/>
        <View style={{backgroundColor:MAIN_GREY,flex:1,marginRight:normalize(5),height:data?.film2>0?`${(data?.film2*100)/data?.all}%`:0.5}}/>
        <View style={{backgroundColor:MAIN_GREY,flex:1,marginRight:normalize(5),height:data?.film3>0?`${(data?.film3*100)/data?.all}%`:0.5}}/>
        <View style={{backgroundColor:MAIN_GREY,flex:1,marginRight:normalize(5),height:data?.film4>0?`${(data?.film4*100)/data?.all}%`:0.5}}/>
        <View style={{backgroundColor:MAIN_GREY,flex:1,marginRight:normalize(5),height:data?.film5>0?`${(data?.film5*100)/data?.all}%`:0.5}}/>


      <View style={{flexDirection:'row',marginLeft:normalize(5)}}>
        <AntDesign name={'star'} color={MAIN_RED}/>
        <AntDesign name={'star'} color={MAIN_RED}/>
        <AntDesign name={'star'} color={MAIN_RED}/>
        <AntDesign name={'star'} color={MAIN_RED}/>
        <AntDesign name={'star'} color={MAIN_RED}/>
      </View>
      {/*<Text style={{color:'black'}}>{data?.film}</Text>*/}
    </View>
  );
};

export default RatingStats;
