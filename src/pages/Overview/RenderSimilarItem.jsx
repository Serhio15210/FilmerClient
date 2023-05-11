import React from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {ImageBackground, Text, TouchableOpacity} from "react-native";
import {IMG_URI, UNKNOWN_IMG} from "../../api/apiKey";
import {normalize} from "../../responsive/fontSize";

const RenderSimilarItem = ({item, isSerial, navigation}) => {
  const {screenTheme} = useTheme()
  // const navigation=useNavigation()
  const details = screenTheme;
  return (
    <TouchableOpacity key={item.id} style={{marginRight: normalize(20), width: normalize(200)}}
                      onPress={() => navigation.push(isSerial ? "SerialOverview" : "FilmOverview", {
                        id: item.id,
                        title: isSerial ? item.name : item.title
                      })}>
      <ImageBackground source={item?.poster_path?{uri: IMG_URI + item?.poster_path}:UNKNOWN_IMG}
                       style={{
                         height: normalize(260),
                         width: normalize(190),

                         backgroundSize: "cover",
                         backgroundPositionX: "50%",
                         backgroundPositionY: "50%",
                       }} imageStyle={{borderRadius: 10}}/>


      <Text style={{
        color: 'black',
        fontSize: normalize(18),
        textAlign: 'center'
      }}>{isSerial ? item.name : item.title}</Text>

    </TouchableOpacity>
  );
};

export default RenderSimilarItem;
