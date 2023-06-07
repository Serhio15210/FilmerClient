import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {normalize} from "../../responsive/fontSize";
import {FAVORITE_LIST_IMG, IMG_URI, NONAME_IMG, UNKNOWN_IMG} from "../../api/apiKey";
import AntDesign from "react-native-vector-icons/AntDesign";
import {MAIN_SUCCESS} from "../../constants/colors";
import unknown from "../../styles/unknown.png"
import {useTheme} from "../../providers/ThemeProvider";
import {themeColors} from "./themeColors";

const ListPreview = ({data, isFavorite=false,onPress}) => {
  const films = isFavorite?data:data?.films
  const {i18n,appTheme}=useTheme()
  const style = styles(themeColors[appTheme]);
  return (
    <TouchableOpacity activeOpacity={0.7} style={{marginRight:normalize(30)}} onPress={onPress}>
      {isFavorite? <Text style={style.title}>{i18n.t('favorite')} <AntDesign name="heart" size={20}
        color={MAIN_SUCCESS}/> </Text>:
        <Text style={style.title}>{data?.name}</Text>
      }
      {films?.length>=3?<View style={style.filmsRow}>

          <Image source={{uri: IMG_URI + films[0]?.poster}} style={{
            width: normalize(150),
            height: normalize(200),
            position: 'absolute',
            left: 0,
            zIndex: 3,
            borderRadius: 10,

          }}/>
          <Image source={{uri: IMG_URI + films[1]?.poster}} style={{
            width: normalize(150),
            height: normalize(190),
            position: 'absolute',
            left: normalize(60),
            zIndex: 2,
            borderRadius: 10,

          }}/>
          <Image source={{uri: IMG_URI + films[2]?.poster}} style={{
          width: normalize(150),
          height: normalize(180),
          position: 'absolute',
          left: normalize(110),
          zIndex: 1,
          borderRadius: 10,

        }}/>


      </View>:
        <Image source={!isFavorite&&films?.length===0?unknown:{uri: isFavorite?FAVORITE_LIST_IMG:IMG_URI + films[0]?.poster}} style={{
        width: normalize(180),
        height: normalize(200),
        borderRadius: 10,

      }}/>
      }
    </TouchableOpacity>
  );
};
export const styles = (theme) => StyleSheet.create({
  title: {
    fontSize: normalize(24),
    color: theme.titleColor,
    fontWeight: '500',
    marginBottom: 5
  },
  filmsRow: {
    flexDirection: 'row', alignItems: 'center', width: normalize(300), height: normalize(200)
  }
})
export default ListPreview;
