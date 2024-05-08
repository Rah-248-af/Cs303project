import {
    View,
    Text,
    Button,
    TextInput,
    StyleSheet,
    Pressable,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    FlatList,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { collection, addDoc, getDocs } from "firebase/firestore";
  import { db } from "../../firebase";
  import { Formik } from "formik";
  import { Picker } from "@react-native-picker/picker";
  import * as ImagePicker from "expo-image-picker";
  import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
  import Colors from "../../constants/Colors";
  import BottomNavBar from "../../components/ButtonNavBar";
  
  export default function Add() {
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const getCategories = async () => {
      const querySnapshot = await getDocs(collection(db, "Categories"));
      const fetchedCategories = []; // Changed from categories to fetchedCategories
      querySnapshot.forEach((doc) => {
        fetchedCategories.push({ id: doc.id, name: doc.data().name }); // Ensure you are capturing both id and name
      });
      setCategories(fetchedCategories); // Correct state update pattern
    };
  
    useEffect(() => {
      getCategories();
    }, []);
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        multiple: true,
      });
  
      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        setImages((prevImages) => [...prevImages, ...newImages]);
      }
    };
    const handleOnSubmit = async (values) => {
      setLoading(true);
  
      // Handling image upload
      const storage = getStorage();
      const response = await fetch(images);
      const blob = await response.blob();
      const storageRef = ref(storage, `products/${Date.now()}.jpg`);
      const snapshot = await uploadBytes(storageRef, blob);
      const imageUrl = await getDownloadURL(snapshot.ref);
  
      // Prepare the new product data with the image URL
      const newProduct = {
        ...values,
        imageURL: imageUrl,
        price: parseFloat(values.price), // Ensure price is stored as a number
        stockQuantity: parseInt(values.stockQuantity, 10), // Ensure quantity is stored as an integer
      };
  
      // Add new product to Firestore
      try {
        await addDoc(collection(db, "Products"), newProduct);
        alert("Product added successfully!");
        setImages([]);
        setLoading(false);
      } catch (error) {
        console.error("Error adding product:", error);
        setLoading(false);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.heading}>Add New ITEM</Text>
          <ScrollView style={styles.FormView}>
            <Formik
              initialValues={{
                name: "",
                description: "",
                price: "",
                categoryId: categories[0]?.id || "",
                stockQuantity: "",
                imageURL: "",
              }}
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
                    <FlatList
                      data={images}
                      renderItem={({ item }) => (
                        <TouchableOpacity onPress={pickImage}>
                          <Image source={{ uri: item }} style={styles.image} />
                        </TouchableOpacity>
                      )}
                      horizontal
                    />
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
                    {categories.length > 0 &&
                      categories.map((category) => (
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