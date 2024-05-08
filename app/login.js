import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import Input from "../components/input";
import { router } from "expo-router";
import Colors from "../constants/Colors";
import { auth, checkAdmin, login } from "../firebase"; 
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleDontHaveAcc = () => {
    router.navigate("register");
  };

  const handleLogin = async () => {
    try {
      const userCredential = await login(email, password);
      AsyncStorage.setItem("email", email);
      AsyncStorage.setItem("password", password);
      const uid = auth.currentUser.uid;
      const isAdmin = await checkAdmin(uid);
      console.log("Logged in:", userCredential);
      console.log("isAdmin:", isAdmin);
      setIsAdmin(isAdmin);
      if (isAdmin) {
        router.replace("AdminPage");
      } else {
        router.replace("homePage");
      }
      await AsyncStorage.setItem(
        "@rememberUser",
        JSON.stringify({ email, password })
      );
      setIsAuthenticated(true);
      console.log("Logged in successfully");
    } catch (error) {
      console.error("Login error:", error.message);
      // Handle login error (e.g., show an alert)
    }
  };

  const checkLoggedIn = async () => {
    try {
      setLoading(true);
      const storedUser = await AsyncStorage.getItem("@rememberUser");
      const storedUid = await AsyncStorage.getItem("uid");
      const isAdmin = await checkAdmin(storedUid);
      console.log("Stored user:", storedUser);
      if (storedUser) {
        const { email, password } = JSON.parse(storedUser);
        await login(email, password, isAdmin);
        setIsAuthenticated(true);
        console.log("User automatically logged in");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <ActivityIndicator size="large" color={Colors.main.backgroundcolor} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Shefaa</Text>
        <Text style={styles.pText}>وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ</Text>
        <Text style={styles.subHeading}>Login</Text>
        <Input
          placeHolder="Email"
          onChangeText={setEmail}
          value={email}
          style={styles.Input}
          color={Colors.dark.backgroundcolor}
        />
        <Input
          placeHolder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          style={styles.Input}
          color={Colors.dark.backgroundcolor}
        />
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginWithText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.lowerSection}>
          <TouchableOpacity style={styles.forgetPassword}>
            <Text style={styles.secondaryText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.forgetPassword}
            onPress={handleDontHaveAcc}
          >
            <Text style={styles.secondaryText}>
              Don't have an account! Regiser
            </Text>
          </TouchableOpacity>
        </View>
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
  pText: {
    alignSelf: "center",
    fontSize: 22,
    color: Colors.main.backgroundcolor,
    padding: 10,
  },
  subHeading: {
    fontSize: 18,
    color: Colors.light.backgroundcolor,
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
  loginBtn: {
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
  lowerSection: {
    position: "absolute",
    bottom: 0,
    minWidth: "100%",
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  forgetPassword: {
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
  },
  secondaryText: {
    color: Colors.main.backgroundcolor,
    fontSize: 16,
    fontWeight: "bold",
    alignSelf: "center",
  },
});