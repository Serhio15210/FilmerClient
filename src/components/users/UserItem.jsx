import React from 'react';
import {normalize} from "../../responsive/fontSize";
import {Text, TouchableOpacity, View} from "react-native";
import {MAIN_RED, MAIN_SUCCESS} from "../../constants";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";

const UserItem = ({item,subscribe,unsubscribe,isSubscribe,onPress}) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        elevation: 5,
        borderRadius: 5,
        height:normalize(70),marginBottom:normalize(15),
        paddingHorizontal:normalize(10)
      }} onPress={onPress}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {item?.avatar ?
          <View/> :
          <View style={{
            width: normalize(50),
            height: normalize(50),
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: MAIN_RED,
            marginRight: normalize(15)
          }}>
            <Text style={{color: 'white', textTransform: 'uppercase'}}>{item?.userName[0]}</Text>
          </View>
        }
        <Text style={{color: 'black', fontSize: normalize(18)}}>{item?.userName}</Text>
      </View>
      {isSubscribe?<TouchableOpacity style={{
          width: normalize(50),
          height: '100%',
          // backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center'
        }} onPress={()=>unsubscribe(item?._id)}>
          <AntDesign name={'checkcircle'} size={24} color={MAIN_SUCCESS}/>
        </TouchableOpacity>:
        <TouchableOpacity style={{
          width: normalize(50),
          height: '100%',
          // backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center'
        }} onPress={()=>subscribe(item?._id)}>
          <Ionicons name={'add-circle-outline'} size={24} color={'black'}/>
        </TouchableOpacity>}
    </TouchableOpacity>
  );
};

export default UserItem;
