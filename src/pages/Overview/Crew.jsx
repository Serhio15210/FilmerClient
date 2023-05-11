import React from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {FlatList, StyleSheet, Text, View} from "react-native";
import {normalize} from "../../responsive/fontSize";

import {MAIN_RED} from "../../constants";
import RenderCastItem from "./RenderCastItem";

const Crew = ({crew, cast, navigation}) => {
  const {screenTheme} = useTheme();
  const details = screenTheme;
  return (
    <View  style={styles.container}>
      <Text style={styles.castTitle}>Каст:</Text>
      <FlatList

        horizontal={true}
        data={cast}
        keyExtractor={(item, index) => 'key'+index}
        showsHorizontalScrollIndicator={false}
        renderItem={({item,index}) =>
          <RenderCastItem item={item} navigation={navigation} index={index}/>
        }
        initialNumToRender={10}
      />
      {crew.length!==0&&
        <Text style={styles.castTitle}>Режисери та сценаристи:</Text>}
      <FlatList

        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => 'key'+index}
        data={crew.filter(item => item.job === "Screenplay" || item.job === "Director" || item.job === "Producer" || item.job === "Original Music Composer")}
        renderItem={({item, index}) =>
          <RenderCastItem  item={item} index={index} navigation={navigation}/>
        }
        initialNumToRender={5}
      />


    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex:1
  },

  castTitle:{
    color: 'black',
    fontSize: normalize(18),
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom:normalize(20),
    marginTop:normalize(30)
  }

});
export default Crew;
