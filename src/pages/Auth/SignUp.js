import React, {useEffect, useState} from "react";

// UI elements
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView, Alert, ActivityIndicator, Image, Animated
} from "react-native";


// Custom styles
import {basic, form, colors} from "../styles";
import {useAuth} from "../../providers/AuthProvider";

import {useTheme} from "../../providers/ThemeProvider";
import AntDesign from "react-native-vector-icons/AntDesign";
import logo from "../../assets/logo.png";
import {header} from "./Login";
import {normalize} from "../../responsive/fontSize";
import {signUp} from "../../api/auth";



const Signup = ({navigation}) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [translateY, setTranslateY] = useState(new Animated.Value(normalize(300)))
  const [paddingBottom, setPaddingBottom] = useState(new Animated.Value(normalize(45)))

  const {isDarkTheme} = useTheme()
  const {isNewUser,setIsNewUser}=useAuth()
  const handleSubmit = async () => {

    if (
      email === "" ||
      username === "" ||
      rePassword === "" ||
      password === ""
    ) {
      setMessage("Fill in all fields");
    } else if (password !== rePassword) {
      setMessage("Passwords do not match!");
    } else {
      setLoading(true)
      try {
        const response=await signUp(username,email, password)
        if (response?.success){
          // SweetAlert.showAlertWithOptions({
          //   title: `User ${username} was successfully created`,
          //   subTitle: '',
          //   confirmButtonTitle: 'OK',
          //   confirmButtonColor: '#dedede',
          //   style:'success',
          //
          //   otherButtonColor: '#dedede',
          //   cancellable: true
          // })
          setIsNewUser(true)
          navigation.goBack()
        }else {
          setMessage(response.toString())
        }

      } catch (err) {
        setMessage(err.message)

      } finally {
        setLoading(false)
      }
    }

  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        navigation.setOptions({
          headerTransparent: false,
          headerTintColor: "black"
        });
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
        navigation.setOptions({
          headerTransparent: true,
          headerTintColor: "white"
        });
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: normalize(300),
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

    <View style={{flex: 1}}>
      <Animated.View style={{...header.container, height: translateY, paddingBottom: paddingBottom}}>
        <View style={header.inner}>
          <Text style={{
            ...header.title,
            color: !isDarkTheme ? 'white' : 'black',
          }}>Реєстрація</Text>
          <View style={header.icon}>
            <AntDesign name={'adduser'} color={'white'} size={50}/>
          </View>

        </View>
        <View style={header.logo}>
          <Image source={logo} style={{width: '100%', height: '100%'}} resizeMode={'contain'}/>
        </View>
      </Animated.View>
      <ScrollView>

        <KeyboardAvoidingView
          style={{backgroundColor: isDarkTheme ? '#333333' : 'white', flex: 1}}
          behavior="padding"
          enabled
        >


          <View style={form.field}>
            <Text style={{...form.label, color: isDarkTheme ? 'white' : 'black'}}>Нікнейм</Text>
            <TextInput
              onChangeText={value => setUsername(value)}
              name="username"
              style={{
                ...form.input,
                color: isDarkTheme ? 'white' : 'black',
                borderBottomColor: isDarkTheme ? 'white' : 'black'
              }}
              value={username}
              autoCapitalize="none"
            />
          </View>

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
            <TextInput
              onChangeText={value => setPassword(value)}
              name="password"
              style={{
                ...form.input,
                color: isDarkTheme ? 'white' : 'black',
                borderBottomColor: isDarkTheme ? 'white' : 'black'
              }}
              secureTextEntry={!showPassword}
              value={password}
              autoCapitalize="none"
            />

          </View>

          <View style={form.field}>
            <Text style={{...form.label, color: isDarkTheme ? 'white' : 'black'}}>Підтвердження паролю</Text>
            <TextInput
              onChangeText={value => setRePassword(value)}
              name="rePassword"
              style={{
                ...form.input,
                color: isDarkTheme ? 'white' : 'black',
                borderBottomColor: isDarkTheme ? 'white' : 'black'
              }}
              secureTextEntry={!showPassword}
              value={rePassword}
              autoCapitalize="none"
            />
          </View>
          {message && <Text style={form.message}>{message}</Text>}


          <View style={form.field}>
            <TouchableOpacity onPress={handleSubmit}
                              disabled={!email||
                                !username||
                                !rePassword||
                                !password}
                              style={{
                                ...form.button,
                                backgroundColor:(!email||
                                  !username||
                                  !rePassword||
                                  !password)?"black": isDarkTheme ? '#DAA520' : '#DC143C'
                              }}>
              {isLoading ?
                <View style={{
                  flex: 1,
                  justifyContent: "center",
                }}>
                  <ActivityIndicator size="large"
                                     color="white"/></View> :
                <Text style={form.buttonText}>Регістрація</Text>}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>

  );
};

export default Signup;
