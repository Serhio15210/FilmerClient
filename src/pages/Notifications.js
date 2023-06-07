import React, {useCallback, useEffect, useRef, useState} from 'react';
import {FlatList, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {MAIN_GREY_FADE, MAIN_RED, MAIN_RED_FADE} from "../constants/colors";
import {normalize} from "../responsive/fontSize";
import Review from "./Overview/Review";
import {useSelector} from "react-redux";
import RateStars from "../components/UI/RateStars";
import {readNotification} from "../api/notifications";
import moment from 'moment'

const Notifications = ({navigation}) => {

  const {
    user, refresh, userList, notifications
  } = useSelector((state) => state.auth);
  const [visibleArray, setVisibleArray] = useState(notifications?.filter(item => !item?.isRead))

  const onViewableItemsChanged = useCallback(
    ({viewableItems}) => {
      notifications.map(item => {
        console.log(!!viewableItems?.find(view => view.item._id === item?._id))
        if (!!viewableItems?.find(view => view.item._id === item?._id)) {
          readNotification(item?._id).then(res=>{
            console.log(res)
          })
          // console.log('v', visibleArray?.find(view => view._id === item?._id))
          setVisibleArray((prev) => prev.filter(ar => ar?._id !== item?._id))
        }
      })
    },
    []
  );

  const isUnRead = (id) => {
    return !!visibleArray?.find(view => view._id === id)
  }
  const viewabilityConfigCallbackPairs = useRef([
    {onViewableItemsChanged},
  ]);
  return (
    <View style={styles.container}>
      {notifications?.length === 0 ? <View style={{alignItems: 'center', flex: 1, justifyContent: 'center'}}>
          <Text style={{color: MAIN_GREY_FADE, textAlign: 'center'}}>Немає повідомлень</Text>
        </View> :
        <FlatList

          viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
          viewabilityConfig={{viewAreaCoveragePercentThreshold: 95}}
          data={notifications}
          contentContainerStyle={{paddingTop:normalize(10)}}
          renderItem={({item, index}) => {
            return (
              <Pressable style={{
                alignSelf: 'center',
                padding: normalize(10),
                marginBottom: normalize(15),
                backgroundColor: 'white',
                elevation: 5,
                borderRadius: 5,
                width: '98%',

              }} onPress={() => {
                if (item?.imdb_id) {

                  navigation.navigate('FilmOverview', {id: item?.imdb_id, title: item?.filmTitle})
                }
              }}>
                {isUnRead(item._id) && <View style={{
                  width: 10,
                  height: 10,
                  backgroundColor: MAIN_RED,
                  borderRadius: 50,
                  position: 'absolute',
                  top: 0
                }}></View>}
                <Text style={{color:MAIN_GREY_FADE,fontSize:normalize(10)}}>{moment(item?.updatedAt).format('D MMMM, HH:mm')}</Text>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Text style={{color: 'black', fontSize: normalize(16), flex: 1,fontWeight:'600'}}
                        numberOfLines={2}>{item?.title}</Text>


                    {item?.rate>0 && <RateStars rate={item?.rate} size={15} position={"flex-end"}/>}


                </View>

                {item?.text && <Text style={{color: 'black', fontSize: normalize(1)}}
                                     numberOfLines={1}>{item?.text}</Text>}
              </Pressable>
            )
          }}/>}


    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: normalize(15)
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  headerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(10),
    borderBottomWidth: 1,
    borderColor: MAIN_GREY_FADE
  },
  headerText: {
    color: 'black',
    fontSize: normalize(18)
  }
})

export default Notifications;
