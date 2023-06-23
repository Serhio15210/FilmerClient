import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from "react-native";
import {IMG_URI} from "../../api/apiKey";
import LinearGradient from "react-native-linear-gradient";
import {normalize} from "../../responsive/fontSize";

const OneImage = ({listData, name}) => {
  const gradient = listData?.films?.length === 0 ? ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.5)'] : ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']
  return (
    <ImageBackground source={{uri: IMG_URI + listData?.films[0]?.poster}} style={styles.imageBg}  >
      <LinearGradient
        colors={gradient}
        style={styles.gradient}/>
      {listData?.films?.length === 0 &&
        <Text style={{fontSize: normalize(50), color: 'black', alignSelf: 'center', textAlign: 'center'}}
              numberOfLines={3}
              adjustsFontSizeToFit>{name}</Text>}
      <View style={styles.imgTitleRow}>
        <Text style={styles.imgTitle} numberOfLines={2} adjustsFontSizeToFit>{listData?.name}</Text>
        {/*<Text style={styles.white16} numberOfLines={1}*/}
        {/*      adjustsFontSizeToFit>Subscribers: {listData?.subscribers?.length}</Text>*/}
      </View>

    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1
  },
  imageBg: {
    height: normalize(300), width: '100%', flexDirection: 'row', justifyContent: 'center', backgroundPositionX: "50%",
    backgroundPositionY: "50%",
  },
  imgTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', padding: normalize(15),
    position: 'absolute', bottom: 0, zIndex: 2
  },
  imgTitle: {
    color: 'white', fontSize: normalize(24), marginRight: normalize(10)
  },
  white16: {
    color: 'white', fontSize: normalize(16)
  },
})
export default OneImage;
