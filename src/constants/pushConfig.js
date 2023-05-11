import {BaseToast} from "react-native-toast-message";
import {MAIN_RED} from "./index";
import {normalize} from "../responsive/fontSize";
import {Text, View} from "react-native";
import React from "react";

export const pushConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: MAIN_RED,width:'90%',height:normalize(55) }}
      contentContainerStyle={{ paddingHorizontal: 15 }}

      text1Style={{
        fontSize: 10,
        color:'black'
      }}
    />
  ),


  tomatoToast: ({ text1, props }) => (
    <View style={{ width: '100%', backgroundColor: 'tomato' }}>
      <Text style={{fontSize:14}}>{text1}</Text>
      <Text>{props.uuid}</Text>
    </View>
  )
};
