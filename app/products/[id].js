import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import BottomNavBar from "../../components/ButtonNavBar";
import Colors from "../../constants/Colors";
import ProductsDisplayer from "../../components/ProductsDisplayer";
import { useRoute } from "@react-navigation/native";
import { get, set } from "lodash";
import { Dimensions } from "react-native";
import { Route } from "expo-router/build/Route";
import { auth } from "../../firebase";
import { Platform } from "react-native";

export default function Product() {
  const route = useRoute();
  const { productId } = Route?.params;
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [productCategory, setProductCategory] = useState("");
  const screenWidth = Dimensions.get("window").width - 40;
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      try {
        // Corrected to use doc() instead of collection() to get a document reference
        const docRef = doc(db, "Products", productId);
        const docSnapshot = await getDoc(docRef);
        if (docSnapshot.exists()) {
          console.log("Document data:", docSnapshot.data());
          setProduct(docSnapshot.data()); // Assuming you want to display this product
        } else {
          console.log("No such document!");
          setProduct([]); // In case the document does not exist
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct([]);
      }
    };
    getProduct();
  }, [productId]);

  async function HandleAddToCart(productId, quantity) {
    if (quantity > product.stockQuantity) {
      Alert.alert("Error", "Quantity exceeds stock quantity", [{ text: "OK" }]);
      return;
    }
    const cartRef = doc(db, "Cart", auth.currentUser.uid);
    const cartDoc = await getDoc(cartRef);

    if (cartDoc.exists()) {
      let cartItems = cartDoc.data().cartItems;
      let itemExists = false;
      // Check if product exists and update quantity
      cartItems = cartItems.map((item) => {
        if (item.product_id === productId) {
          itemExists = true;
          return {
            ...item,
            product_quantity: item.product_quantity + quantity,
          };
        }
        return item;
      });
      // If product does not exist, add a new one
      if (!itemExists) {
        cartItems.push({ product_id: productId, product_quantity: quantity });
      }
      // Update the document with new or updated cart items
      await setDoc(cartRef, { cartItems });
    } else {
      // Creating a new cart with a single product item
      await setDoc(cartRef, {
        cartItems: [{ product_id: productId, product_quantity: quantity }],
      });
    }
  }

  const checkDataLoaded = () => {
    if (product != {}) {
      setLoading(false);
    }
  };

  const mapCategoryDocIdToName = async (product) => {
    const categoryDocRef = doc(db, "Categories", product.categoryId);
    const categoryDoc = await getDoc(categoryDocRef);
    if (categoryDoc.exists()) {
      setProductCategory(categoryDoc.data().name);
    }
    return product;
  };

  useEffect(() => {
    checkDataLoaded();
    mapCategoryDocIdToName(product);
  }, [product]);

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
        <View style={styles.ProductsList}>
          <View style={styles.imageView}>
            <Image
              source={{ uri: product.imageURL }}
              style={[
                styles.productImage,
                { width: screenWidth, aspectRatio: 4 / 3 },
              ]}
            ></Image>
          </View>
          <View style={styles.productData}>
            <View style={styles.productPriceAndName}>
              <Text style={styles.HeaderName}>{product.name}</Text>
              <Text style={styles.HeaderName}>{product.price} EGP</Text>
            </View>

            <View style={styles.productInfo}>
              <View style={styles.descriptionView}>
                <Text style={styles.descriptionWord}>Description : </Text>
                <Text style={styles.descriptionText}>
                  {product.description}
                </Text>
              </View>
            </View>
            <View style={styles.descriptionView}>
              <Text style={styles.categoryWord}>Category :</Text>
              <Text style={styles.categoryText}>{productCategory}</Text>
            </View>
          </View>
        </View>
        <View style={styles.lowerSection}>
          <View style={styles.QuantityChangeView}>
            <Text style={styles.Text}>Quantity</Text>
            <View style={styles.counter}>
              <TouchableOpacity
                disabled={quantity <= 1}
                onPress={() => setQuantity(quantity - 1)}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.currentQuantity}>{quantity}</Text>
              <TouchableOpacity
                onPress={() => setQuantity(quantity + 1)}
                style={styles.quantityBtn}
              >
                <Text style={styles.quantityBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={styles.addToCartBtn}
            onPress={() => HandleAddToCart(productId, quantity)}
          >
            <Text style={styles.addToCartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    paddingTop: 40,
    minWidth: "100%",
    flex: 1,
    backgroundColor: Colors.main.backgroundcolor,
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    minWidth: "100%",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "100%",
  },
  ProductsList: {
    flex: 1,
    minWidth: "100%",
    alignItems: "center",
  },
  imageView: {
    width: "100%",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    position: "absloute",
    top: 0,
    zIndex: 1,
  },
  productImage: {
    marginTop: 10,
    borderRadius: 10,
  },
  productData: {
    width: "100%",
    paddingHorizontal: 20,
  },

  productPriceAndName: {
    marginTop: -30,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: Colors.main.backgroundcolor,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    // drop shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  HeaderName: {
    color: Colors.dark.backgroundcolor,
    fontSize: 25,
    fontWeight: "bold",
  },
  productInfo: {
    paddingVertical: 20,
  },
  descriptionView: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
  },
  descriptionWord: {
    color: Colors.dark.backgroundcolor,
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionText: {
    color: Colors.dark.backgroundcolor,
    fontSize: 20,
    marginLeft: 10,
    maxWidth: "60%",
  },
  categoryWord: {
    color: Colors.dark.backgroundcolor,
    fontSize: 20,
    fontWeight: "bold",
    padding: 5,
  },
  categoryText: {
    color: Colors.dark.backgroundcolor,
    fontSize: 20,
    padding: 5,
  },

  lowerSection: {
    width: "100%",
    paddingBottom: 30,
  },
  Text: {
    color: Colors.dark.backgroundcolor,
    fontSize: 20,
    padding: 5,
    fontWeight: "bold",
  },
  QuantityChangeView: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: 20,
  },
  counter: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 150,
  },
  quantityBtn: {
    backgroundColor: Colors.light.backgroundcolor,
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityBtnText: {
    color: Colors.dark.backgroundcolor,
    fontSize: 30,
    fontWeight: "bold",
    marginTop: -10,
    alignSelf: "center",
    marginTop: -3,
  },
  currentQuantity: {
    color: Colors.dark.backgroundcolor,
    fontSize: 20,
    padding: 5,
    fontWeight: "bold",
  },
  addToCartBtn: {
    backgroundColor: Colors.light.whiteBackground,
    padding: 10,
    paddingBottom: Platform.OS === "ios" ? 45 : 65,
    borderRadius: 20,
    width: "100%",
    minWidth: "100%",
    alignSelf: "center",
    alignItems: "center",
    // drop shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addToCartText: {
    color: Colors.dark.backgroundcolor,
    fontSize: 20,
    fontWeight: "bold",
  },
});