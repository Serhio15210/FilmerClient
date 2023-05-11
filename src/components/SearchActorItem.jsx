import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from "react-native";
import {normalize} from "../responsive/fontSize";
import {IMG_URI} from "../api/apiKey";

const SearchActorItem = ({item,index,onPress}) => {
  return (
    <TouchableOpacity style={{
      backgroundColor: 'white',
      elevation: 3,
      maxWidth: '50%',

      flex:1,

      borderRadius: 10,
      marginBottom: normalize(20),
      marginRight:index%2===0?normalize(10):0,
      alignItems:'center'

    }} onPress={onPress}>
      <Image source={{uri:IMG_URI+item?.profile_path}} style={{width:'100%',height:normalize(200),borderTopRightRadius:10,borderTopLeftRadius:10}} resizeMode={'cover'}/>
      <Text style={{color:'black',fontSize:normalize(18),fontWeight:'600',paddingHorizontal:normalize(5)}} numberOfLines={2} adjustsFontSizeToFit>{item?.name}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

  },

})
export default SearchActorItem;
