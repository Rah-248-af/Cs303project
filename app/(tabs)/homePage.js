import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import BottomNavBar from "../../components/ButtonNavBar";
import Colors from "../../constants/Colors";
import Profile from "../../assets/Profile.png";
import Carousel from "react-native-snap-carousel";
import { router } from "expo-router";
import ProductsDisplayer from "../../components/ProductsDisplayer";

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [banner, setBanner] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get("window").width - 40;

  useEffect(() => {
    const fetchData = async () => {
      await getCategories();
      await getBanner();
      await getProducts();
    };
    fetchData();
  }, []);

  const getCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const fetchedCategories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const getBanner = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "banner"));
      const fetchedBanners = querySnapshot.docs.map((doc) => doc.data());
      setBanner(fetchedBanners);
    } catch (error) {
      console.error("Failed to fetch banner images:", error);
      setBanner([]);
    }
  };

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

  useEffect(() => {
    if (categories.length > 0 && products.length > 0 && banner.length > 0) {
      setLoading(false);
    }
  }, [categories, products, banner]);

  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: Colors.light.backgroundcolor },
        ]}
      >
        <View
          style={[
            styles.innerContainer,
            { backgroundColor: Colors.light.backgroundcolor },
          ]}
        >
          <ActivityIndicator size="large" color={Colors.light.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View name="HeaderRowView" style={styles.HeaderView}>
          <View>
            <Text style={styles.WelcomeText}>Welcome to</Text>
            <Text style={styles.UserName} numberOfLines={1} overflow="hidden">
              Shefaa
            </Text>
          </View>
          <View style={styles.ProfileView}>
            <Image source={Profile} style={styles.ProfileIcon} />
          </View>
        </View>
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          <View style={styles.home}>
            <View style={styles.Banner}>
              <Carousel
                data={banner}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.image }}
                    style={styles.bannerImage}
                  />
                )}
                sliderWidth={screenWidth}
                itemWidth={300}
                loop={true}
                autoplay={true}
                autoplayInterval={10000}
              />
            </View>

            <View name="Categories" style={styles.CategoriesView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: screenWidth,
                  marginLeft: -10,
                }}
              >
                <Text style={styles.CategoryText}>Categories</Text>
                <TouchableOpacity>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: Colors.light.backgroundcolor,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    SHOW ALL
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.LowerView}>
                <FlatList
                  horizontal
                  data={categories}
                  style={{ width: screenWidth }}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.CategoryItem}
                      onPress={() => {
                        router.push("../category/" + item.name);
                        Route.params = {
                          item: item,
                        };
                      }}
                    >
                      <View
                        style={[
                          styles.OneItemContainer,
                          { backgroundColor: item.color },
                        ]}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={styles.categoryImage}
                        />
                      </View>
                      <View style={{ maxWidth: 80, width: 80 }}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.name && item.name.length > 8
                            ? item.name.substring(0, 8) + "..."
                            : item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
            <View name="Products" style={styles.ProductsView}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: screenWidth,
                  marginLeft: -10,
                  marginTop: 10,
                }}
              >
                <Text style={styles.CategoryText}>Products</Text>
                <TouchableOpacity>
                  <Text
                    style={[
                      styles.desc,
                      {
                        color: Colors.light.backgroundcolor,
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    SHOW ALL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <ProductsDisplayer
              products={products}
              screenWidth={screenWidth}
              categories={categories}
              style={styles.CarsList}
            />
          </View>
        </ScrollView>
        <BottomNavBar CurrentScreen={"homePage"} />
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
    paddingBottom: 0,
    minWidth: "100%",
    flex: 1,
    backgroundColor: Colors.main.backgroundcolor,
    alignItems: "center",
  },
  innerContainer: {
    flex: 1,
    minWidth: "100%",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  pText: {
    alignSelf: "center",
    fontSize: 22,
    color: Colors.main.backgroundcolor,
    padding: 10,
  },
  HeaderView: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: 0,
  },
  home: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  Banner: {
    width: "100%",
    height: 200,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.backgroundcolor,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    borderRadius: 20,
  },
  ProfileView: {
    backgroundColor: Colors.dark.backgroundcolor,
    padding: 10,
    height: 70,
    width: 70,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 5,
    borderColor: Colors.main.backgroundcolor,
  },
  ProfileIcon: {
    resizeMode: "contain",
    width: 40,
    height: 40,
  },
  WelcomeText: {
    color: Colors.dark.backgroundcolor,
    fontSize: 25,
  },
  UserName: {
    fontSize: 30,
    color: Colors.dark.backgroundcolor,
    fontWeight: "bold",
  },
  CategoriesView: {
    marginTop: 10,
    minHeight: 140,
    maxHeight: 140,
    alignSelf: "flex-start",
  },
  CategoryItem: {
    borderRadius: 10,
    marginHorizontal: 10,
    flexDirection: "column",
    minWidth: 70,
    maxWidth: 70,
  },
  OneItemContainer: {
    marginTop: 3,
    justifyContent: "flex-end",
    alignItems: "center",
    minHeight: 70,
    maxHeight: 70,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.main.backgroundcolor,
    padding: 15,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  CategoryText: {
    paddingHorizontal: 10,
    marginBottom: 10,
    fontSize: 25,
    fontWeight: "600",
    color: Colors.dark.backgroundcolor,
  },
  itemName: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 5,
    minWidth: 70,
    maxWidth: 70,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "400",
    maxWidth: 60,
  },
  list: {
    width: "100%",
    marginTop: 75,
  },
});
