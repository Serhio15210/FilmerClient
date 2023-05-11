import React from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import {IMG_URI} from "../../api/apiKey";
import {normalize} from "../../responsive/fontSize";
import {MAIN_GREY} from "../../constants";

const Genres = ({data}) => {
  return (
    <View >

      <View style={styles.detailBlock}>

        <Text style={styles.detailTitle}>жанри</Text>
        {data?.map((item,index)=>{
          return <View style={styles.company} key={index}>

            <Text style={styles.companyName}>{item.name}</Text>
          </View>
        })}
      </View>

    </View>
  );
};
const styles = StyleSheet.create({
  detailBlock:{
    borderBottomWidth:1,
    borderColor:MAIN_GREY,
    paddingVertical:normalize(15)
  },
  detailTitle:{
    color:MAIN_GREY,
    fontSize:normalize(16),
    textTransform:'uppercase',
    marginBottom:normalize(10)
  },
  companyName:{
    color:'black',
    fontSize:normalize(18),
    textTransform:"uppercase"
  },
  company:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:normalize(5)
  }
})
export default Genres;
