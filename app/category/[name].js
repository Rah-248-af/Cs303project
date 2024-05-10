import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import BottomNavBar from "../../components/ButtonNavBar";
import Colors from "../../constants/Colors";
import ProductsDisplayer from "../../components/ProductsDisplayer";
import { useRoute } from "@react-navigation/native"; // Assuming you're using React Navigation
import { get, set } from "lodash";
import { Dimensions } from "react-native";
export default function Category() {
  const route = useRoute();
  const { CategoryId } = route.params;
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "Products"),
          where("CategoryId", "==", CategoryId)
        );
        const fetchedProducts = [];
        console.log("querySnapshot", querySnapshot);
        if (querySnapshot != undefined) {
          querySnapshot.forEach((doc) => {
            const product = doc.data();
            if (product.CategoryId === CategoryId) {
              fetchedProducts.push(product);
            }
          });
          setProducts(fetchedProducts);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
    };
    const getCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Categories"));
        const fetchedCategories = [];
        console.log("querySnapshot", querySnapshot);
        if (querySnapshot != undefined) {
          querySnapshot.forEach((doc) => {
            const category = doc.data();
            fetchedCategories.push(category);
          });
          console.log("fetchedCategories", fetchedCategories);
          setCategories(fetchedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setCategories([]);
      }
    };
    getProducts();
    getCategories();
  }, [CategoryId]);

  const checkDataLoaded = () => {
    if (products.length > 0 && categories.length > 0) {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDataLoaded();
  }, [products, categories]);

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
    <ScrollView>
      <View style={styles.innerContainer}>
        <ProductsDisplayer
          products={products}
          categories={categories}
          screenWidth={screenWidth}
        />
        <BottomNavBar />
      </View>
    </ScrollView>
    <BottomNavBar />
  </SafeAreaView>
);
};// 

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.whiteBackground,
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    minWidth: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  ProductsList: {
    flex: 1,
    minWidth: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
});
