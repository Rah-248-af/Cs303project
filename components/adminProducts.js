import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import Colors from "../constants/Colors.ts";
import { router } from "expo-router";
import { Route } from "expo-router/build/Route";
import {
  addDoc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
  doc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { get } from "lodash";
import { useState,useEffect } from "react";
import { Dimensions } from "react-native";
const adminProducts = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const screenWidth = Dimensions.get("window").width - 40;
    useEffect(() => {
        const fetchData = async () => {
          await getProducts();
        };
        fetchData();
      }, []);

      const getProducts = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "Products"));
          const fetchedProducts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProducts(fetchedProducts.slice(0, 10)); // Limit to 10 products
        } catch (error) {
          console.error("Failed to fetch products:", error);
          setProducts([]);
        }
      };
    const MapCategoryIdToName = (id) => {
    let name = "";
    categories.forEach((category) => {
      if (category.id === id) {
        name = category.name;
      }
    });
    return name;
  };

  const handleDeleteProduct = async (productId) => {
    try {
      // Delete the product document from Firestore
      await deleteDoc(doc(db, "Products", productId));
      
      // Update the products state to reflect the deletion
      const updatedProducts = products.filter((product) => product.id !== productId);
      setProducts(updatedProducts);
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  };

  return (
    <SafeAreaView>
    <ScrollView  style={styles.container}>
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
                        handleDeleteProduct(item.id);
                      }}
                    >
                      <Text style={styles.DeleteProductText}>-</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
  };

const styles = StyleSheet.create({
  container:{
    padding:20,
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
    minHeight: 1100,
    alignSelf: "flex-start",
  },
  ProductItem: {
    minHeight: 250,
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
  DeleteProductText: {
    color: Colors.light.secondBackground,
    fontSize: 25,
    fontWeight: "bold",
    marginTop: -7,
    marginLeft: -1,
  },
});

export default adminProducts;
