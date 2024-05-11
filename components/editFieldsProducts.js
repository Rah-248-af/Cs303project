import React, { useEffect, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  StatusBar,
  doc,
  updateDoc,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import Colors from "../../constants/Colors";
import BottomNavBar from "../../components/ButtonNavBar";

export default function EditProduct({ route }) { // Changed component name and added route parameter
  const { productId } = route.params; // Extract productId from route parameters
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    stockQuantity: "",
  });

  const getProductData = async () => {
    try {
      const docRef = doc(db, "Products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const productData = docSnap.data();
        setInitialValues(productData);
        setImages([productData.imageURL]); // Set initial image
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  const getCategories = async () => {
    // Fetch categories from Firestore
    try {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const fetchedCategories = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(fetchedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
    getProductData(); // Fetch product data on component mount
  }, []);

  const pickImage = async () => {
    // Image picking functionality remains the same
  };

  const handleOnSubmit = async (values) => {
    setLoading(true);

    // Handling image upload remains the same

    // Prepare updated product data
    const updatedProductData = {
      ...values,
      price: parseFloat(values.price), // Ensure price is stored as a number
      stockQuantity: parseInt(values.stockQuantity, 10), // Ensure quantity is stored as an integer
    };

    // Update product in Firestore
    try {
      await updateDoc(doc(db, "Products", productId), updatedProductData);
      alert("Product updated successfully!");
      setLoading(false);
    } catch (error) {
      console.error("Error updating product:", error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Edit Product</Text>
        <ScrollView style={styles.FormView}>
          <Formik
            initialValues={initialValues}
            onSubmit={handleOnSubmit}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setFieldValue,
              errors,
            }) => (
              <View style={styles.formContainer}>
                {images.length > 0 ? (
                  <Image source={{ uri: images[0] }} style={styles.image} />
                ) : (
                  <TouchableOpacity onPress={pickImage}>
                    <Image
                      style={styles.image}
                      source={require("../../assets/9w5zjcx1.png")}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity onPress={pickImage}>
                  <Text style={styles.addMoreImagesText}>Add Images</Text>
                </TouchableOpacity>

                <TextInput
                  style={styles.input}
                  placeholder="Product Name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={values.description}
                  onChangeText={handleChange("description")}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  keyboardType="numeric"
                  value={values.price}
                  onChangeText={handleChange("price")}
                />
                <Picker
                  selectedValue={values.categoryId}
                  onValueChange={(itemValue) =>
                    setFieldValue("categoryId", itemValue)
                  }
                >
                  {categories.map((category) => (
                    <Picker.Item
                      key={category.id}
                      label={category.name}
                      value={category.id}
                    />
                  ))}
                </Picker>
                <TextInput
                  style={styles.input}
                  placeholder="Stock Quantity"
                  keyboardType="numeric"
                  value={values.stockQuantity}
                  onChangeText={handleChange("stockQuantity")}
                />
                <Pressable
                  onPress={handleSubmit}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.5 : 1,
                    },
                    styles.submitButton,
                  ]}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </Pressable>
              </View>
            )}
          </Formik>
        </ScrollView>
        <BottomNavBar CurrentScreen={"addItem"} />
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
    heading: {
      fontWeight: "bold",
      fontSize: 25,
      marginBottom: 20,
    },
    FormView: {
      minWidth: "100%",
      paddingHorizontal: 20,
      marginBottom: 70,
    },
    formContainer: {
      flex: 1,
      width: "100%",
    },
    input: {
      borderWidth: 1,
      borderColor: Colors.dark.backgroundcolor,
      borderRadius: 100,
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 20,
    },
    image: {
      width: 100,
      height: 100,
      marginRight: 10,
      borderRadius: 5,
    },
    addMoreImagesText: {
      color: "blue",
      marginTop: 5,
      marginBottom: 20,
    },
    submitButton: {
      backgroundColor: Colors.light.backgroundcolor,
      paddingVertical: 15,
      borderRadius: 5,
      alignItems: "center",
    },
    submitButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
  });

