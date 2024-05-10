import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { collection, getDocs, getDoc ,doc } from "firebase/firestore";
import { db } from "../../firebase";
import Colors from "../../constants/Colors";
import ButtonNavBar from "../../components/ButtonNavBar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Cart"));
      const fetchedItems = querySnapshot.docs.map((doc) => doc.data().cartItems).flat();
      setCartItems(fetchedItems);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItems([]);
      setLoading(false);
    }
  };

  const mapCartToProducts = async (cart) => {
    try {
      const productDetails = await Promise.all(
        cart.map(item =>
          db.collection('Products').doc(item.product_id).get()
            .then(doc => {
                
              if (doc.exists) {
                console.log("Product found for ID:", item.product_id);
                return { ...doc.data(), product_quantity: item.product_quantity };
              } else {
                console.log("No product found for ID:", item.product_id);
                throw new Error('No product found with ID ' + item.product_id);
              }
            })
            .catch(error => {
              console.error("Error fetching product details:", error);
              return null;
            })
        )
      );
     
      return productDetails;
    } catch (error) {
      console.error("Error fetching product details:", error);
      return [];
    }
  };
  
  useEffect(() => {
    mapCartToProducts(cartItems).then(setProducts);
  }, [cartItems]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>{item.product_id}</Text>
      <Text>Quantity: {item.product_quantity}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text>No items in cart</Text>
          <BottomNavBar CurrentScreen="cart" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id} // Assuming the product document has an 'id' field
        />
        <ButtonNavBar CurrentScreen="cart" />
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
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray,
  },
});

export default Cart;
