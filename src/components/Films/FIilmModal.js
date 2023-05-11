import React, {useCallback, useEffect, useState} from 'react';
import {Modal, View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {WebView} from "react-native-webview";

const FilmModal = ({isOpen,setIsOpen,filmSrc}) => {
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
          source={{ uri: `
    <html>
      <head>
         
      </head>
      <body>
        <iframe src="//9.annacdn.cc/aXW5LraATxRb?kp_id=666" width="640" height="480" frameborder="0" allowfullscreen></iframe>
      </body>
    </html>
    ` }}
          allowsFullscreenVideo={true}

        />

      </View>
    </Modal>
  );
};

export default FilmModal;
