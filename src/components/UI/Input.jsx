import React from 'react';
import {normalize} from "../../responsive/fontSize";
import {TextInput, View} from "react-native";
import {MAIN_GREY_FADE} from "../../constants";
import Feather from "react-native-vector-icons/Feather";

const Input = ({query,setQuery}) => {
  return (
    <View style={{
      backgroundColor: 'white',
      flex:1,
      maxHeight: normalize(50),
      elevation: 5,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: normalize(10)
    }}>
      <TextInput style={{width: '100%',color:'black'}} value={query} onChangeText={setQuery} placeholder={'Search...'}
                 placeholderTextColor={MAIN_GREY_FADE}/>
      <Feather name={'search'} color={'black'} size={20} style={{position: 'absolute', right: normalize(10)}}/>
    </View>
  );
};

export default Input;
