import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";

export default function Input({
  value,
  onChangeText,
  style,
  placeHolder,
  placeholderTextColor = "#999",
  secureTextEntry
}) {
  return (
    <View>
      <TextInput
        placeholder={placeHolder}
        placeholderTextColor={placeholderTextColor}
        style={[styles.input, style || {}]}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderRadius: 10,
    width: 380,
    height: 70,
    color: "black",
    fontSize: 30,
    marginTop: 20,
    paddingLeft : 30,
  },
});