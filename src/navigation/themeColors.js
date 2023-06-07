import {BLACK, MAIN_GREY, MAIN_GREY_FADE, MAIN_RED, MAIN_RED_FADE, MAIN_YELLOW, WHITE} from "../constants/colors";

export const themeColors={
  'light':{
    backgroundColor:WHITE,
    titleColor:BLACK,
    notificationButtonBg:MAIN_RED,
    tabBackground:MAIN_RED,
    tabContent:['transparent', 'rgba(220, 20, 60, 0.2)', MAIN_RED_FADE, MAIN_RED],
    drawerAvatarBlock:WHITE,
    drawerTitleColor:'rgba(28,28,30,0.68)',
    localeTitleColor:MAIN_RED
  },
  'dark':{
    backgroundColor:MAIN_GREY,
    titleColor:WHITE,
    notificationButtonBg:MAIN_YELLOW,
    tabBackground:MAIN_YELLOW,
    tabContent:['transparent', 'rgba(220, 20, 60, 0.2)', MAIN_YELLOW, MAIN_YELLOW],
    drawerAvatarBlock:MAIN_YELLOW,
    themeButtonColor:WHITE,
    drawerTitleColor:MAIN_GREY_FADE,
    localeTitleColor:MAIN_YELLOW
  }
}
