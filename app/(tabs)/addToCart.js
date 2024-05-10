import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image } from "react-native";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Colors from "../../constants/Colors";
import BottomNavBar from "../../components/ButtonNavBar";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Cart"));
      const fetchedItems = [];

      for (const docRef of querySnapshot.docs) {
        const cartItems = docRef.data().cartItems;

        for (const item of cartItems) {
          const productDocRef = doc(db, "Products", item.product_id);
          const productDocSnapshot = await getDoc(productDocRef);

          if (productDocSnapshot.exists()) {
            fetchedItems.push({
              cartItem: item,
              product: productDocSnapshot.data(),
            });
          }
        }
      }

      setCartItems(fetchedItems);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch cart items:", error);
      setCartItems([]);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.product.imageURL }} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.quantity}>Quantity: {item.cartItem.product_quantity}</Text>
        <Text style={styles.price}>Price: ${item.product.price}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.product.id}-${index}`}
      />
      <BottomNavBar CurrentScreen="cart" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.main.backgroundcolor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.gray,
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color:"black",
  },
  quantity: {
    fontSize: 14,
    color: "black",
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    color:"black",
    marginTop: 4,
  },
});

export default Cart;
