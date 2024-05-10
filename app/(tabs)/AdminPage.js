import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../constants/Colors";
import { router } from "expo-router";

const AdminPage = () => {
  const navigateToAddItem = () => {
    router.replace("addItem");
  };

  const navigateToOrders = () => {
    router.replace("Orders");
  };

  const navigateToProducts = () => {
    router.replace("products");
  };

  const navigateToDeleteItem = () => {
    router.replace("deleteItem");
  };

  const navigateToAddCategory = () => {
    router.replace("addcat");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Admin Dashboard</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={navigateToAddItem}>
          <Text style={styles.buttonText}>Add Item</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToAddCategory}>
          <Text style={styles.buttonText}>Add Category</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={navigateToOrders}>
          <Text style={styles.buttonText}>Orders</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToProducts}
        >
          <Text style={styles.buttonText}>Products</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToDeleteItem}
        >
          <Text style={styles.buttonText}>Delete Item</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.main.backgroundcolor,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.light.textcolor,
  },
  buttonContainer: {
    width: "80%",
  },
  button: {
    backgroundColor: Colors.light.backgroundcolor,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.main.backgroundcolor,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AdminPage;