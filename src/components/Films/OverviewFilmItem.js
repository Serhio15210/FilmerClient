import React from 'react';
import {Image, ImageBackground, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {IMG_URI} from "../../api/apiKey";
import unknown from "../../styles/unknown.png";
import {MAIN_RED} from "../../constants/colors";
import Entypo from "react-native-vector-icons/Entypo";

const OverviewFilmItem = ({item, onPress}) => {
  return (

    <TouchableOpacity activeOpacity={0.7} style={{
      marginBottom: normalize(25),
      width: '100%',
      backgroundColor: 'white',
      elevation: 3,
      borderRadius: 20,
      alignSelf: 'center',
      // paddingBottom: normalize(20),

    }} onPress={onPress}>

      <ImageBackground source={{uri: IMG_URI + item?.backdrop_path}} style={{
        width: '100%',
        height: normalize(210),
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


          }} adjustsFontSizeToFit numberOfLines={5}>{item.title || item.name}</Text>
        </View>


      </ImageBackground>


    </TouchableOpacity>

  );
};

export default OverviewFilmItem;
