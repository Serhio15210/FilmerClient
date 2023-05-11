import React, {useCallback, useState} from 'react';
import AntDesign from "react-native-vector-icons/AntDesign";
import {Modal, View} from "react-native";
import {WebView} from "react-native-webview";
const TrailerModal = ({isOpen,setIsOpen,trailers}) => {
  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      // Alert.alert("video has finished playing!");
    }
  }, []);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={() => {
        setIsOpen(!isOpen);
      }}   >
      <View style={{backgroundColor:'rgba(0,0,0,.9)',flex:1,padding:10,justifyContent:'center'}} onPress={()=>setIsOpen(false)}>
        <AntDesign name="close" color="white" size={30} style={{alignSelf:'flex-end'}} onPress={()=>setIsOpen(false)}/>
        {/*<YoutubePlayer*/}
        {/*       height={300}*/}
        {/*       play={true}*/}
        {/*       videoId={trailers[0].key}*/}
        {/*       onChangeState={onStateChange}*/}
        {/*       */}


        {/*   />*/}
        <WebView
          style={{ height: 200,flex:1,width:'100%',resizeMode:'contain' }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          scalesPageToFit
          source={{ uri: `https://www.youtube.com/embed/${trailers[0]?.key}` }}
          allowsFullscreenVideo={true}

        />

      </View>
    </Modal>
  );
};

export default TrailerModal;
