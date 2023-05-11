/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import {StyleSheet, useColorScheme,} from 'react-native';
import {AuthProvider} from "./src/providers/AuthProvider";
import {ThemeProvider} from "./src/providers/ThemeProvider";
import Welcome from "./src/pages/Welcome";
import {store} from "./src/redux/store";
import {Provider} from "react-redux";

import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyDt_xdiAzb_kQrUgpQhbiaBMMmwyZJgdIc",
      authDomain: "firebaseapp.com",
      projectId: "filmer-98352",
      storageBucket: "filmer-98352.appspot.com",
      messagingSenderId: "187608040384",
      appId: "1:187608040384:android:fe46d9f7cec5ccbff87e25",
      databaseURL: "https://filmer-98352-default-rtdb.firebaseio.com"
    });
  }


  return (
    <Provider store={store}>
    <AuthProvider>
      <ThemeProvider>
        <Welcome/>
      </ThemeProvider>
    </AuthProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
