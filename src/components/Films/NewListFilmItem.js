import React from 'react';
import {useTheme} from "../../providers/ThemeProvider";
import {useNavigation} from "@react-navigation/native";
import Swipable from "react-native-gesture-handler/Swipeable";
import {Dimensions, Image, Text, TouchableOpacity, View} from "react-native";
import {IMG_URI} from "../../api/apiKey";
import unknown from "../../styles/unknown.png";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {normalize} from "../../responsive/fontSize";

const NewListFilmItem = ({item, isSerial,closeRow,index,row,leftAction,swipeAction}) => {
  const {isDarkTheme, screenTheme} = useTheme()
  const navigation = useNavigation()
  const theme = screenTheme
  return (

    <Swipable  ref={ref => row[index] = ref} renderLeftActions={leftAction} useNativeAnimations={true}
               overshootLeft={false} onSwipeableOpen={() => {
      swipeAction(item)
      closeRow(index)
    }} onSwipeableWillOpen={() => {

      closeRow(index)
    }}   >
      <View  style={{
        width: Dimensions.get('window').width-30,
        // justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: isDarkTheme ? 'black' : 'white',
        elevation: 5,
        marginBottom: 20,
        borderRadius: 10,
        marginHorizontal:normalize(5)
      }}>
        <Image
          source={item?.poster?.length !== 0 && item?.poster !== null ? {uri: IMG_URI + item.poster} : unknown}
          style={{
            width: normalize(110),
            height: normalize(160),
            alignSelf: "flex-start",
            borderRadius: 8,
            borderBottomRightRadius: 0,
            borderTopRightRadius: 0
          }} resizeMode="cover"/>

        <View style={{alignItems: "center", justifyContent: "center"  }}>
          <Text
            numberOfLines={2} adjustsFontSizeToFit style={{
            fontSize: normalize(18),
            fontWeight: "bold",
            color:'black',
              marginBottom: 5,
              maxWidth: normalize(200),
              marginHorizontal:normalize(20)

          }}>{item.title}</Text>

        </View>




      </View>
    </Swipable>
  );
};

export default NewListFilmItem;
