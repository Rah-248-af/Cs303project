import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Welcome from "./welcome";
import Login from "./login";
import Register from "./register";
import HomePage from "./(tabs)/homePage"; 
import AdminPage from "./(tabs)/AdminPage";
export default function index() {
  return <Register />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});