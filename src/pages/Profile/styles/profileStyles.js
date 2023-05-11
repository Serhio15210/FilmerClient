import {StyleSheet} from "react-native";
import {normalize} from "../../../responsive/fontSize";
import {MAIN_GREY, MAIN_GREY_FADE, MAIN_RED} from "../../../constants";

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  userName: {
    color: 'white',
    fontSize: normalize(24)
  },
  title: {
    color: MAIN_GREY,
    fontSize: normalize(18),
    textTransform: 'capitalize'
  },
  text: {
    color: 'black',
    fontSize: normalize(18),
    textTransform: 'capitalize'
  },
  profileHeader: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: MAIN_GREY_FADE,
    backgroundColor:MAIN_RED,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(20),
    paddingTop:normalize(60)
    // backgroundColor:'white',
    // elevation:20
  },
  block: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: MAIN_GREY_FADE,
    padding: normalize(15)
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: normalize(20)
  },
  activityImg:{
    width: normalize(100), height: normalize(120),borderRadius:5
  }

})
