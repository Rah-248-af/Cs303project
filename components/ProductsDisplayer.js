import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Colors from "../constants/Colors";
import { router } from "expo-router";
import { Route } from "expo-router/build/Route";
import {
  addDoc,
  updateDoc,
  setDoc,
  getDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { get } from "lodash";

const ProductsDisplayer = ({ products, screenWidth, categories }) => {
  const MapCategoryIdToName = (id) => {
    let name = "";
    categories.forEach((category) => {
      if (category.id === id) {
        name = category.name;
      }
    });
    return name;
  };

  async function HandleAddToCart(productId) {
    console.log("productId", productId);
    const cartRef = doc(db, "Cart", auth.currentUser.uid);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      let cartItems = cartDoc.data().cartItems;
      let itemExists = false;
      // Check if product exists and update quantity
      cartItems = cartItems.map((item) => {
        if (item.product_id === productId) {
          itemExists = true;
          return { ...item, product_quantity: item.product_quantity + 1 };
        }
        return item;
      });
      // If product does not exist, add a new one
      if (!itemExists) {
        cartItems.push({ product_id: productId, product_quantity: 1 });
      }
      // Update the document with new or updated cart items
      await setDoc(cartRef, { cartItems });
    } else {
      // Creating a new cart with a single product item
      await setDoc(cartRef, {
        cartItems: [{ product_id: productId, product_quantity: 1 }],
      });
    }
  }

  return (
    <View style={styles.LowerView}>
      <FlatList
        numColumns={2}
        data={products}
        style={[
          styles.ProductsList,
          {
            width: screenWidth,
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
          },
        ]}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.ProductItem,
              {
                width: screenWidth / 2 - 10,
                maxWidth: 300,
                minHeight: 235,
                maxHeight: 235,
                margin: 5,
                padding: 10,
              },
            ]}
            onPress={() => {
              router.push("../products/" + item.id);
              Route.params = {
                productId: item.id,
              };
              console.log("item.id", item.id);
            }}
          >
            <View
              style={[
                {
                  backgroundColor: Colors.light.backgroundcolor,
                  minHeight: 120,
                  maxHeight: 120,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Image source={{ uri: item.imageURL }} style={styles.productImage} />
            </View>
            <View
              style={{
                maxWidth: screenWidth / 2 - 30,
                width: screenWidth / 2 - 30,
              }}
            >
              <Text>
                <Text
                  style={{
                    marginTop: 3,
                    color: Colors.light.backgroundcolor,
                  }}
                >
                  {MapCategoryIdToName(item.categoryId)}
                </Text>
              </Text>
              <Text style={styles.ProductName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.priceView}>
                <View>
                  <Text style={styles.productPrice}>{item.price} EGP</Text>
                </View>
                <View style={styles.AddToCartBotton}>
                  <TouchableOpacity
                    style={styles.AddToCartBotton}
                    onPress={() => {
                      HandleAddToCart(item.id);
                    }}
                  >
                    <Text style={styles.AddToCartText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  LowerView: {
    width: "100%",
  },
  list: {
    width: "100%",
    marginBottom: 35,
    marginTop: 75,
  },
  ProductsView: {
    marginTop: 10,
    minHeight: 140,
    alignSelf: "flex-start",
  },
  ProductsList: {
    marginTop: 0,
    maxHeight: 1100,
    minHeight: 1100,
    alignSelf: "flex-start",
  },
  ProductItem: {
    minHeight: 250,
    maxHeight: 250,
    borderRadius: 20,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: Colors.light.secondBackground,
  },
  productImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  desc: {
    fontSize: 16,
    marginBottom: 5,
  },
  ProductName: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.dark.backgroundcolor,
    marginVertical: 7,
  },
  productPrice: {
    fontSize: 16,
    color: Colors.dark.backgroundcolor,
    fontWeight: "bold",
  },
  priceView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  AddToCartBotton: {
    backgroundColor: Colors.light.backgroundcolor,
    borderRadius: 10,
    width: 35,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  AddToCartText: {
    color: Colors.light.secondBackground,
    fontSize: 25,
    fontWeight: "bold",
    marginTop: -3,
    marginLeft: -1,
  },
});

export default ProductsDisplayer;
