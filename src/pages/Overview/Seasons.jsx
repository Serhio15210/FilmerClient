import React from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from "react-native";
import {IMG_URI, NONAME_IMG, UNKNOWN_IMG} from "../../api/apiKey";
import {normalize} from "../../responsive/fontSize";
import {useNavigation} from "@react-navigation/native";


const Seasons = ({data,seasonName,seasonId}) => {
  const navigation = useNavigation()
  return (
    <FlatList contentContainerStyle={{marginTop: normalize(15)}} horizontal showsHorizontalScrollIndicator={false}
              data={data} renderItem={({item}) => {
      return <TouchableOpacity style={{marginRight: normalize(10), alignItems: 'center'}} onPress={()=>navigation.navigate('SeasonOverview', {title:`${seasonName}/${item.name}`,id:seasonId,season:item?.season_number})}>
        <Image source={item?.poster_path?{uri: IMG_URI + item?.poster_path}:UNKNOWN_IMG}
               style={{width: normalize(130), height: normalize(200), borderRadius: 5}}  />
        <Text style={{color: 'black',fontSize:normalize(18),fontWeight:'500'}}>{item?.name}</Text>
        <Text style={{color: 'black',fontSize:normalize(14)}}>({item?.episode_count}) серій</Text>
      </TouchableOpacity>
    }}/>
  );
};

export default Seasons;
