import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    Platform,
    FlatList,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import BottomNavBar from "../../components/ButtonNavBar";
  import { SafeAreaView } from "react-native-safe-area-context";
  import Colors from "../../constants/Colors";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import { router } from "expo-router";
  import {
    getDocs,
    collection,
    where,
    query,
    doc,
    getDoc,
  } from "firebase/firestore";
  import { auth, db } from "../../firebase";
  import ProfileIcon from "../../assets/Profileicon.png";
  export default function profile() {
    const [user, setUser] = useState([]);
    const [userDocId, setUserDocId] = useState("");
    const [currentUser, setCurrentUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = auth.currentUser.uid;
  
    const handleLogout = () => {
      AsyncStorage.removeItem("@rememberUser");
      AsyncStorage.removeItem("uid");
      router.navigate("login");
    };
  
    useEffect(() => {
      const getCurrentUserDocId = async () => {
        try {
          const q = query(collection(db, "Users"), where("userID", "==", userId));
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            setUserDocId(doc.id);
          });
        } catch (error) {
          console.error("Error getting documents: ", error);
        }
      };
      getCurrentUserDocId();
    }, [userId]);
  
    useEffect(() => {
      const getUser = async () => {
        if (!userDocId) return; // Ensure that userDocId is not empty
  
        try {
          const docRef = doc(db, "Users", userDocId);
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            console.log("Document data:", docSnapshot.data());
            setUser(docSnapshot.data());
          } else {
            console.log("No such document!");
            setUser([]); // Handle non-existent document
          }
        } catch (error) {
          console.error("Failed to fetch product:", error);
          setUser([]);
        }
      };
  
      if (userDocId) {
        // Only run getUser if userDocId is set
        getUser();
      }
    }, [userId, userDocId]);
  
    useEffect(() => {
      const checkDataLoaded = () => {
        if (user && userDocId) {
          setLoading(false);
        }
      };
      checkDataLoaded();
    }, [user]);
  
    if (loading) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.innerContainer}>
            <ActivityIndicator size="large" color={Colors.light.primary} />
          </View>
        </SafeAreaView>
      );
    }
  
    return (
        <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Image source={ProfileIcon} style={styles.profileIcon} />
          <Text style={styles.title}>Profile</Text>
          <View style={styles.profileInfo}>
            <View style={styles.triangle} />
            <Text style={styles.info}>Name: {user.name}</Text>
            <View style={styles.triangle} />
            <Text style={styles.info}>Email: {user.email}</Text>
            <View style={styles.triangle} />
            <Text style={styles.info}>Phone Number: {user.phoneNumber}</Text>
            <View style={styles.triangle} />
            <Text style={styles.info}>Address: {user.street}, {user.region}</Text>
            <View style={styles.triangle} />
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
          <BottomNavBar CurrentScreen="profile" />
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.dark.backgroundcolor,
      alignItems: "center",
      paddingTop: 40,
    },
    innerContainer: {
      flex: 1,
      width: "100%",
      alignItems: "center",
    
    },
    profileIcon: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    title: {
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 20,
      color: Colors.dark.text,
    },
    profileInfo: {
      width: "100%",
      paddingHorizontal: 20,
    },
    triangle: {
      width: 0,
      height: 0,
      borderTopWidth: 10,
      borderTopColor: "transparent",
      borderRightWidth: 20,
      borderRightColor: Colors.light.backgroundcolor,
      borderBottomWidth: 10,
      borderBottomColor: "transparent",
      position: "absolute",
      left: -20,
      zIndex: 1,
    },
    info: {
      fontSize: 18,
      color: Colors.dark.text,
      paddingVertical: 10,
      paddingLeft: 20,
      paddingRight: 40, // to accommodate the triangle
      position: "relative",
    },
    logoutButton: {
      marginTop: 20,
      backgroundColor: Colors.light.primary,
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "100%", // Ensure button stretches across the screen
    },
    logoutText: {
      fontSize: 18,
      fontWeight: "bold",
      color: Colors.dark.text,
    },
  });