import { Pressable, StyleSheet, Text, View } from "react-native";

import React from "react";

export default function Btn({
  text,
  style,
  onPress,
  color,
  type,
  fontSize,
  textColor,
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        {
          backgroundColor: color || "#008080",
          opacity: pressed ? 0.2 : 1,
        },
        styles.btn,
        styles[`btn${type}`],
        style || {},
      ]}
      onPress={onPress}
    >
      <Text style={[styles.btnText, { fontSize: fontSize, color: textColor }]}>
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 100,
    width: 380,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLink: {
    backgroundColor: "white",
    width:"100%",
  },
  btnText: {
    color: "white",
    fontSize: 20,
  },
});
