import React from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {FlatList, StyleSheet, Text, View} from "react-native";
import RenderSimilarItem from "./RenderSimilarItem";
import {normalize} from "../../responsive/fontSize";


const SimilarFilms = ({similarFilms, navigation,isSerial}) => {
  const {screenTheme} = useTheme();
  return (
    <View style={{paddingTop: normalize(20)}}>


      <Text style={styles.title}>{isSerial?"Схожі серіали:":"Схожі фільми:"}</Text>
      <FlatList
        style={{marginBottom: 30}}
        horizontal={true}
        initialNumToRender={5}
        data={similarFilms}
        keyExtractor={(item, index) => `key-${index}`}
        renderItem={({item}) => {
          return (
            <RenderSimilarItem item={item} navigation={navigation} isSerial={isSerial}/>
          );
        }}
      />
    </View>
  );
};
const styles=StyleSheet.create({
  title:{
    color: 'black',
    fontSize: normalize(18),
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom:normalize(20)

  }
})
export default SimilarFilms;
