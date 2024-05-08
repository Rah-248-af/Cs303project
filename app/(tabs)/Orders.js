import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView, ActivityIndicator } from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import Colors from "../../constants/Colors";

const Orders = () => {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchCartItems();
  }, []);

  const fetchOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Orders"));
      const fetchedOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
      setLoading(false);
      console.log("Orders fetched successfully:", fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
      setLoading(false);
    }
  };

  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "cart"));
      const fetchedCartItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(fetchedCartItems);
      console.log("Cart items fetched successfully:", fetchedCartItems);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItems([]);
    }
  };

  const MapOrderItemsToCartItems = (orderItems) => {
    const mappedCartItems = [];
    orderItems.forEach((orderId) => {
      cartItems.forEach((cartItem) => {
        if (cartItem.id === orderId) {
          mappedCartItems.push(cartItem);
        }
      });
    });
    return mappedCartItems;
  };

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
        <Text style={styles.heading}>Orders</Text>
        {orders.length === 0 ? (
          <Text style={styles.noOrdersText}>No orders available</Text>
        ) : (
          <FlatList
            data={orders}
            renderItem={({ item }) => (
              <View style={styles.orderItem}>
                <Text style={styles.orderId}>Order ID: {item.id}</Text>
                <Text style={styles.orderDetails}>Order Details: {JSON.stringify(item)}</Text>
                <Text style={styles.cartItems}>Associated Cart Items: {JSON.stringify(MapOrderItemsToCartItems(item.orderItems))}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.backgroundcolor,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colors.light.textcolor,
  },
  noOrdersText: {
    fontSize: 18,
    color: Colors.light.textcolor,
  },
  orderItem: {
    marginBottom: 10,
    backgroundColor: Colors.light.backgroundcolor,
    padding: 10,
    borderRadius: 10,
    width: "100%",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.dark.textcolor,
  },
  orderDetails: {
    fontSize: 14,
    color: Colors.dark.textcolor,
  },
  cartItems: {
    fontSize: 14,
    color: Colors.dark.textcolor,
  },
});

export default Orders;