import React from 'react';
import {Image, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {IMG_URI} from "../api/apiKey";
import unknown from "../styles/unknown.png";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import {normalize} from "../responsive/fontSize";
import {MAIN_RED} from "../constants";
import Entypo from "react-native-vector-icons/Entypo";

const SelectFilmItem = ({item,onPress,isSelected,isOld}) => {
  return (
    <TouchableOpacity disabled={isOld} activeOpacity={0.7} style={{
      marginBottom: normalize(25),
      width: '100%',
      backgroundColor: 'white',
      elevation: 3,
      borderRadius: 20,
      alignSelf: 'center',
      opacity:isOld?0.6:1
      // paddingBottom: normalize(20),

    }} onPress={onPress}>

      <ImageBackground source={{uri: IMG_URI + item?.backdrop_path}} style={{
        width: '100%',
        height: normalize(230),
        alignItems: 'center',
        justifyContent: 'center',


      }} imageStyle={{borderRadius: 20}} blurRadius={10} resizeMethod={'scale'} resizeMode={'cover'}>
        <View style={{
          flexDirection: 'row',
          padding: normalize(15),
          // justifyContent:'space-between',
          alignItems:'center',
          backgroundColor:'rgba(0, 0, 0, 0.4)',
          flex:1,
          width:'100%',
          borderRadius: 20,
        }}>
          <Image source={item.poster_path ? {uri: IMG_URI + item.poster_path} : unknown}
                 style={{width: normalize(120), height: normalize(180), borderRadius: 10}} resizeMode={'contain'}/>
          <Text style={{
            color: 'white',
            textAlign: 'center',
            fontSize: normalize(18),
            marginHorizontal:normalize(15),
            flexWrap: 'wrap',
            flex:1,


          }} adjustsFontSizeToFit numberOfLines={5}>{item.title || item.name}{item.id}</Text>
        </View>


      </ImageBackground>
      {isSelected&&<View style={{
        backgroundColor: MAIN_RED,
        width: normalize(30),
        height: normalize(30),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius:100,
        position:'absolute',
        top:normalize(10),
        right:normalize(10)
      }}>
        <Entypo name={'check'} size={20} color={'white'}/>
      </View>}

    </TouchableOpacity>



  );
};

export default SelectFilmItem;
