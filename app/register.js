import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Platform,
  } from "react-native";
  import React, { useState } from "react";
  import Input from "../components/input";
  import Btn from "../components/btn";
  import { router } from "expo-router";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { auth } from "../firebase";
  import Colors from "../constants/Colors";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import login from "../firebase";
  
  export default function register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setconfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
  
    
  
    const handleAlreadyHasAcc = () => {
      router.navigate("login");
    };
    const handleRegister = () => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          AsyncStorage.setItem("email", email);
          AsyncStorage.setItem("password", password);
          login(email, password);
          router.navigate("homePage");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          if (email.length === 0 && password.length === 0) {
            setError("Please Enter Username And Password");
          } else {
            setError(errorCode);
          }
        });
    };
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Shefaa</Text>
          <View style={styles.inputView}>
            <Input
              placeHolder="Email"
              onChangeText={setEmail}
              value={email}
              style={styles.Input}
            />
            <Input
              placeHolder="Name"
              onChangeText={setName}
              value={name}
              style={styles.Input}
            />
            <Input
              placeHolder="Password"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={true}
              style={styles.Input}
            />
            <Input
              placeHolder="Confirm Password"
              onChangeText={setconfirmPassword}
              value={confirmpassword}
              secureTextEntry={true}
              style={styles.Input}
            />
          </View>
  
          <TouchableOpacity style={styles.registerBtn} onPress={handleRegister}>
            <Text style={styles.loginWithText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAlreadyHasAcc}
            style={styles.haveAccBtn}
          >
            <Text style={styles.secondaryText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
          <Text style={styles.error}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      bottom: 0,
      paddingTop: 40,
      paddingBottom: 20,
      minWidth: "100%",
      flex: 1,
      backgroundColor: Colors.light.backgroundcolor,
      alignItems: "center",
    },
    innerContainer: {
      padding: 20,
      flex: 1,
      minWidth: "100%",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    },
    heading: {
      color: Colors.main.backgroundcolor,
      fontSize: 60,
      fontWeight: "bold",
      marginVertical: 15,
    },
    inputView: {
      minWidth: "100%",
      alignItems: "center",
      gap: -15,
    },
    error: {
      color: "red",
      fontSize: 18,
      marginTop: 10,
    },
    Input: {
      borderRadius: 100,
      marginTop: 20,
      maxHeight: 60,
      marginVertical: 10,
      fontSize: 18,
      backgroundColor: Colors.main.backgroundcolor,
      color: Colors.light.backgroundcolor,
    },
    registerBtn: {
      minWidth: "100%",
      justifyContent: "center",
      alignContent: "center",
      marginTop: 10,
      marginBottom: 20,
      maxHeight: 60,
      backgroundColor: Colors.main.backgroundcolor,
      fontSize: 18,
      minHeight: 60,
      borderRadius: 100,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    loginWithText: {
      color: Colors.light.backgroundcolor,
      fontSize: 20,
      fontWeight: "bold",
      alignSelf: "center",
    },
    haveAccBtn: {
      backgroundColor: Colors.light.backgroundcolor,
      fontSize: 16,
      minWidth: "100%",
      marginTop: 10,
      maxHeight: 40,
      minHeight: 40,
      padding: -5,
      borderWidth: 2,
      borderColor: Colors.main.backgroundcolor,
      borderRadius: 100,
      justifyContent: "center",
      alignContent: "center",
      position: "absolute",
      bottom: Platform.OS === "ios" ? 0 : 20,
    },
    secondaryText: {
      color: Colors.main.backgroundcolor,
      fontSize: 16,
      fontWeight: "bold",
      alignSelf: "center",
    },
  });