import React, {useContext, useEffect, useState} from "react";
import * as NavigationDefaultTheme from "../pages/styles";
import * as PaperDefaultTheme from "../pages/styles";
import * as NavigationDarkTheme from "../pages/styles";
import * as PaperDarkTheme from "../pages/styles";
import {DarkThemeStyles} from "../styles/darkstyles";
import {DefaultStyles} from "../styles/defaultstyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
const ThemeContext = React.createContext(null);

const ThemeProvider=({children})=>{
    const[isDarkTheme,setIsDarkTheme]=useState(null)
    useEffect(()=>{
        AsyncStorage.getItem('theme').then(res=>{
            if (res===null){
                setIsDarkTheme(false)
            }else if (res==='true') {
                console.log(res)
                setIsDarkTheme(true)
            }else {
                setIsDarkTheme(false)
            }
        })
    },[])
    const CustomDefaultTheme = {

        colors: {

            background: 'white',
            text: 'black'

        }
    }
    const CustomDarkTheme = {
        ...NavigationDarkTheme,
        ...PaperDarkTheme,
        colors: {
            ...NavigationDarkTheme.colors,
            ...PaperDarkTheme.colors,
            background: '#333333',
            text: '#DAA520'
        }
    }

    const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;
    const screenTheme = isDarkTheme ? DarkThemeStyles : DefaultStyles;

    return (
        <ThemeContext.Provider
            value={{
                isDarkTheme,setIsDarkTheme,theme,screenTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}
const useTheme = () => {
    const auth = useContext(ThemeContext);
    if (auth == null) {
        throw new Error("useTheme() called outside of a ThemeProvider?");
    }
    return auth;
};

export {ThemeProvider, useTheme};
