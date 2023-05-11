import React from 'react';
import {Image, StyleSheet, Text, View} from "react-native";
import {MAIN_GREY} from "../../constants";
import {normalize} from "../../responsive/fontSize";
import {IMG_URI} from "../../api/apiKey";

const Details = ({data}) => {
  return (
    <View >
      {data?.budget>0&&<View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>бюджет</Text>
        <Text style={{...styles.companyName}}>{data.budget} $</Text>
      </View>}
      {data?.production_companies?.length>0&&<View style={styles.detailBlock}>

        <Text style={styles.detailTitle}>студії</Text>
        {data?.production_companies?.map((item,index)=>{
          return <View style={styles.company} key={index}>
            {item?.logo_path&&<Image source={{uri:IMG_URI+item?.logo_path}} style={styles.logo} resizeMode={'contain'}/>}
            <Text style={styles.companyName}>{item.name}</Text>
          </View>
        })}
      </View>}
      {data?.production_countries?.length>0&&<View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>Країни</Text>
        {data?.production_countries?.map((item,index)=>{
          return <Text key={index} style={{...styles.companyName,marginTop:normalize(10)}}>{item.name}</Text>

        })}
      </View>}
      {original_language&&<View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>оригінальні мови</Text>
        <Text style={{...styles.companyName,textTransform:'uppercase'}}>{data?.original_language}</Text>
      </View>}
      {data?.spoken_languages?.length>0&&<View style={styles.detailBlock}>
        <Text style={styles.detailTitle}>розмовні мови</Text>
        {data?.spoken_languages?.map((item,index)=>{
          return <Text key={index} style={{...styles.companyName,marginTop:normalize(10)}}>{item.name}</Text>

        })}
      </View>}
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
    fontSize:normalize(18)
  },
  company:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:normalize(5)
  },
  logo:{
    width:normalize(50),height:normalize(50),
    marginRight:normalize(10)
  }
})
export default Details;
