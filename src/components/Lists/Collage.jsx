import React from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {IMG_URI} from "../../api/apiKey";
import {normalize} from "../../responsive/fontSize";

const Collage = ({listData, name}) => {
  return (
    < View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
      <LinearGradient
        colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']}
        style={styles.gradient}/>
      {listData?.films?.slice(0, 4)?.map((item, index) => {
        const source = {uri: IMG_URI + item?.poster};
        if (item?.poster) {
          return (

            <Image key={index} source={source} style={{width: '50%', height: normalize(150)}}
                   resizeMode={'cover'}/>

          )
        }
      })}
      <View style={styles.imgTitleRow}>
        <Text style={styles.imgTitle} numberOfLines={2} adjustsFontSizeToFit>{name}</Text>
        <Text style={styles.white16} numberOfLines={1}
              adjustsFontSizeToFit>Subscribers: {listData?.subscribers?.length}</Text>
      </View>
    </View>
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
export default Collage;
