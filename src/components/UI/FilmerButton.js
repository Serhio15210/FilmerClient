import React from 'react';
import {MAIN_RED} from "../../constants";
import {normalize} from "../../responsive/fontSize";
import {StyleSheet, Text, TouchableOpacity} from "react-native";

const FilmerButton = ({text,onPress,style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{...styles.button,...style}}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button:{
    backgroundColor:MAIN_RED,alignItems:'center',justifyContent:'center',width:'100%',borderRadius:10,padding:normalize(15)
  },
  text:{
    color:'white',fontSize:normalize(18)
  }
})
export default FilmerButton;
