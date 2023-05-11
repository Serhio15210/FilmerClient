import React, {useContext, useEffect, useState} from 'react';
import {

  View,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Image,
  Animated
} from 'react-native';


import {useAuth} from "../../providers/AuthProvider";
import {useTheme} from "../../providers/ThemeProvider";
import logo from "../../assets/logo.png"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {MAIN_RED, MAIN_YELLOW} from "../../constants";
import AntDesign from "react-native-vector-icons/AntDesign";
import {signIn} from "../../api/auth";
import {normalize} from "../../responsive/fontSize";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [termsCheck, setTermsCheck] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {setAuthToken,setIsAuth}=useAuth()
  const {isDarkTheme} = useTheme()
  const [translateY, setTranslateY] = useState(new Animated.Value(normalize(350)))
  const [paddingBottom, setPaddingBottom] = useState(new Animated.Value(normalize(45)))

  const handleSubmit = async () => {
    setLoading(true)
    if (email === "" || password === "") {
      setMessage("Fill in all fields");
    } else {

      const response = await signIn(email, password)
      console.log(response)
      if (response?.success) {
        setMessage("")
        setAuthToken(response?.token)

      } else {
        setMessage(response.toString())
      }

    }
    setLoading(false)
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: 0,
            // easing: Easing.back(),
            duration: 200,
            useNativeDriver: false
          }),
          Animated.timing(paddingBottom, {
            toValue: 0,
            // easing: Easing.back(),
            duration: 200,
            useNativeDriver: false
          })
        ]).start()
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: normalize(350),
            // easing: Easing.back(),
            duration: 200,
            useNativeDriver: false
          }),
          Animated.timing(paddingBottom, {
            toValue: normalize(45),
            // easing: Easing.back(),
            duration: 200,
            useNativeDriver: false
          })
        ]).start()

      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  return (
    <ScrollView>
      <Animated.View style={{...header.container, height: translateY, paddingBottom: paddingBottom}}>
        <View style={header.inner}>
          <Text style={{
            ...header.title,
            color: !isDarkTheme ? 'white' : 'black',
          }}>Авторизація</Text>
          <View style={header.icon}>
            <AntDesign name={'login'} color={'white'} size={50}/>
          </View>

        </View>
        <View style={header.logo}>
          <Image source={logo} style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
        </View>
      </Animated.View>

      <View style={{...basic.container, backgroundColor: isDarkTheme ? '#333333' : 'white'}}>


        <View style={form.field}>
          <Text style={{...form.label, color: isDarkTheme ? 'white' : 'black'}}>Пошта</Text>
          <TextInput
            onChangeText={value => setEmail(value)}
            name="email"
            style={{
              ...form.input,
              color: isDarkTheme ? 'white' : 'black',
              borderBottomColor: isDarkTheme ? 'white' : 'black'
            }}
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />

        </View>

        <View style={form.field}>
          <Text style={{...form.label, color: isDarkTheme ? 'white' : 'black'}}>Пароль</Text>
          <View style={form.passwordBlock}>
            <TextInput
              onChangeText={value => setPassword(value)}
              name="password"
              style={{
                ...form.input,
                color: isDarkTheme ? 'white' : 'black',
                borderBottomColor: 'transparent',
                width: '90%',
              }}
              secureTextEntry={!showPassword}
              value={password}
              autoCapitalize="none"
            />
            <FontAwesome5 name={!showPassword ? 'eye-slash' : 'eye'} color={'black'} style={form.eye} onPress={() => {
              setShowPassword(!showPassword)
            }}/>

          </View>


        </View>

        {message && <Text style={form.message}>{message}</Text>}
        <View style={form.field}>

          <TouchableOpacity onPress={handleSubmit} disabled={!email || !password} style={{
            ...form.button,
            backgroundColor: !email || !password ? "black" : isDarkTheme ? MAIN_YELLOW : MAIN_RED
          }}>
            {isLoading ?
              <View style={{
                flex: 1,
                justifyContent: "center",
              }}>
                <ActivityIndicator size="large"
                                   color={isDarkTheme ? "#DAA520" : "white"}/></View> :
              <Text style={form.buttonText}>Увійти</Text>}
          </TouchableOpacity>

        </View>

        <View style={[form.field, form.field1]}>
          <Text style={{...form.text, color: isDarkTheme ? 'white' : 'black'}}>Не маєте акаунту?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={{...form.button1}}
          >
            <Text style={{...form.buttonText1, color: isDarkTheme ? '#DAA520' : '#DC143C'}}>Зареєструватись</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

export const header = StyleSheet.create({
  container: {
    paddingBottom: 45, height: 350
  },
  inner: {
    backgroundColor: 'black',
    height: '100%',
    width: '100%',
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
    justifyContent: 'center'
  },
  title: {
    fontSize: normalize(32),
    marginTop: normalize(30),
    fontWeight: "bold",
    paddingLeft: 15
  },
  icon: {
    backgroundColor: MAIN_RED,
    width: normalize(150),
    height: normalize(150),
    position: 'absolute',
    right: 0,
    top: 0,
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 100,
    // backgroundColor: 'white',
    width: normalize(100),
    height: normalize(100),
    alignSelf: 'center',
    // borderWidth: 2,
    // borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
export const basic = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(15),
    paddingTop: 0,

  },
  image: {
    width: "100%",
    height: "60%",
    resizeMode: "cover"
  }
});

export const form = StyleSheet.create({
  field: {
    padding: normalize(15),
    paddingVertical: normalize(15),
    position: "relative"
  },
  heading: {
    fontSize: normalize(32),
    fontWeight: "bold",
    paddingTop: 0,

  },
  label: {
    color: "black"
  },
  input: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
    paddingVertical: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    fontSize: 15,

    zIndex: 1
  },
  eye: {
    fontSize: normalize(18),
    color: 'black',
    zIndex: 2

  },

  button: {
    borderRadius: 5,
    alignContent: "center",
    backgroundColor: MAIN_RED,
    padding: normalize(15)
  },
  disabled: {
    backgroundColor: "black"
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    color: 'white',
    fontSize: 15
  },
  button1: {
    backgroundColor: 'transparent',
    padding: normalize(15)
  },
  field1: {
    flexDirection: "row",
    alignItems: "center"
  },
  text: {
    color: "black",
    fontSize: 15
  },
  buttonText1: {
    fontWeight: "bold",
    color: 'white',
    fontSize: 15
  },

  icon: {
    position: "absolute",
    top: 8,
    left: 15,
    paddingLeft: 0
  },

  message: {
    textAlign: "center",
    fontSize: 13,
    color: "tomato"
  },
  passwordBlock: {
    borderBottomWidth: 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
  }
});
export default Login;
