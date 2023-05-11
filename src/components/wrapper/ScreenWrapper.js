import React, {useEffect} from 'react';
import {RefreshControl, ScrollView, View} from "react-native";
import {useAuth} from "../../providers/AuthProvider";
import NotificationModal from "./NotificationModal";
import {useSelector} from "react-redux";
import {setOpenNotification, setRefresh} from "../../redux/authReducer";

const ScreenWrapper = ({children,refreshing=()=>{},ref=null}) => {

  const {
    openNotification,refresh
  } = useSelector((state) => state.auth);
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }
  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    wait(500).then(() => {
      refreshing()
      setRefresh(false)
      // navigation.reset({
      //     index: 0,
      //     routes: [{ name: 'HomeDrawer' }],
      // });
    });
  }, []);
  useEffect(()=>{
    console.log(openNotification)
  },[openNotification])
  return (
    <>
      {/*<NotificationModal  />*/}
      <ScrollView refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={onRefresh}
        />
      } ref={ref}>

        {children}
      </ScrollView>

    </>
  );
};

export default ScreenWrapper;
