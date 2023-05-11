import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import {colors} from "./styles";
import Login from "./Auth/Login";
import Signup from "./Auth/SignUp";

import {createStackNavigator} from "@react-navigation/stack";
import {  useTheme} from "../providers/ThemeProvider";
import {useAuth} from "../providers/AuthProvider";

import {store} from "../redux/store";
import {Provider} from "react-redux";
import {Drawer} from "../navigation/DrawerMain";
import Tabs from "../navigation/Tabs";
import {Root} from "../navigation/Root";
import {ActivityIndicator, Image, View} from "react-native";
import {MAIN_RED} from "../constants";
import {normalize} from "../responsive/fontSize";
const Stack = createStackNavigator();
const Welcome = () => {
    const {theme}=useTheme()
    const { isAuth,isNewUser,isLoaded } = useAuth();

    return (
        !isLoaded?<View style={{flex:1,backgroundColor: 'white',alignItems:'center',justifyContent:'center'}}>
              <Image source={require('../assets/1961-movie-loading.gif')} style={{flex:1}} resizeMode={'contain'}/>
          </View>:
        <NavigationContainer theme={theme} >
          {!isAuth?
            <Stack.Navigator

                initialRouteName={"Login"}
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.primary,
                        shadowColor: "transparent",
                        shadowRadius: 0,
                        borderBottomWidth: 0,

                    },
                  headerTransparent: true,
                  headerMode:"float",
                    headerTintColor: "white",
                  backgroundColor: colors.primary,
                }}
            >

                <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
                <Stack.Screen name="Signup" component={Signup} options={{headerTitle:''}}/>

            </Stack.Navigator>:
            <Stack.Navigator

              initialRouteName={"Login"}
              screenOptions={{
                  headerStyle: {
                      backgroundColor: colors.primary,
                      shadowColor: "transparent",
                      shadowRadius: 0,
                      borderBottomWidth: 0,
                      elevation:0

                  },
                  headerTransparent: true,
                  headerMode:"float",
                  headerTintColor: "white",

                  backgroundColor: colors.primary,
              }}
            >
                <Stack.Screen name="Home" component={Root} options={{headerShown:false}}/>

            </Stack.Navigator>
          }
        </NavigationContainer>

    );
};

export default Welcome;
