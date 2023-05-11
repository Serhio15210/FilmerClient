import React from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {Image, StyleSheet, Text, TouchableOpacity} from "react-native";
import {IMG_URI, NONAME_IMG} from "../../api/apiKey";
import {normalize} from "../../responsive/fontSize";

const RenderCastItem = ({item, navigation, index}) => {
  const {screenTheme} = useTheme();
  const details = screenTheme;

  return (
    <TouchableOpacity key={item.id} style={details.detailCast}
                      onPress={() => {

                        navigation.push("ActorOverview", {
                          id: item.id,
                          title:item?.original_name
                        });
                      }}>
      <Image source={item.profile_path ? {uri: IMG_URI + item.profile_path} : {uri: NONAME_IMG}}
             style={{
               height: normalize(170),
               width: normalize(130),
               borderRadius: 10,

             }}/>


      <Text style={styles.name}>{item.original_name}</Text>
      <Text style={styles.role}>{item.character || item.job}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  name:{
    fontSize:normalize(16),
    color:'black'
  },
  role:{
    fontSize:normalize(17),
    color:'black',
    fontWeight:'600'
  }

});
export default RenderCastItem;
