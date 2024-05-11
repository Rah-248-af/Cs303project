import { ScrollView, SafeAreaView, StatusBar, StyleSheet, View, useWindowDimensions, TouchableOpacity, Text } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import Btn from "../../components/btn";
import { useEffect, useState } from "react";
import editFieldsProduct from "../components/editFieldsProducts";
import GlobalStyles from "../../style/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Brand from "../../controllers/Brand";
// import Car from "../../controllers/Car";
import Loading from "../../components/Loading";
import Colors from "../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import ProductsDisplayer from "./ProductsDisplayer";

const editProducts = () => {
    const { width, height } = useWindowDimensions();

    const { id } = useLocalSearchParams();
    const product = new ProductsDisplayer(id);

    const [isLoading, setIsLoading] = useState(true);
    const [brands, setBrands] = useState([]);
    const [productData, setProductData] = useState(null);
    const [updatedprductData, setUpdatedProductData] = useState(null);

    console.log(productData);

    const attributeNames = [
        {
            name: 'name',
            placeHolder: 'Name',
        },
        {
            name: 'description',
            placeHolder: 'Description',
        },
        {
            name: 'price',
            placeHolder: 'Price',
        },
        
    ]

    const getProduct = async () => {
        try {
            const productData = await product.get();
            setProductData(productData); 
            await AsyncStorage.setItem('product', JSON.stringify({ id: id, name: productData.name, images: productData.images }));
        } catch (error) {
            console.log(error);
        }
    }

    // const getBrands = async () => {
    //     try {
    //         const brands = await Brand.getBrands();
    //         setBrands(brands);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const getData = async () => {
        try {
            setIsLoading(true);
            await getProduct();
            //await getBrands();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const updateProduct = async () => {
        try {
            if (updateProduct != null) {
                setIsLoading(true);
                const carId = await car.update(updateProduct);
                console.log(`Product with id ${carId} is updated!`);
            }
    
            await AsyncStorage.removeItem('product');
            console.log("The Product was romoved from AasyncStorage!");
                    
            router.replace("/");
        } catch (error) {
            console.log(error);
        }
    }

    const deleteProduct = async () => {
        try {
            setIsLoading(true);
            const carId = await car.delete();
            console.log(carId, 'deleted!');
            router.replace('/');
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    const fields = attributeNames.map(item =>
        <EditCarField
            attributeName={item.name}
            placeHolder={item.placeHolder}
            carData={carData}
            //updatedProductDataController={{updatedCarData, setUpdatedCarData}}
            flexDirection={item.name === 'brand' ? 'column' : 'row'}
            multiline={item.name === 'description' ? true : false}
            choices={item.name === 'brand' ? brands : []}
            key={item.name + 'Attr'}
        />
    );

    useEffect(() => {
        getData();
    }, []);

    if (isLoading)
        return <Loading />

    return (
        <SafeAreaView style={[GlobalStyles.container, {width: width, backgroundColor: Colors.light.whiteBackground, }]}>
             <TouchableOpacity
            onPress={() => router.back()}
            style={{width:"100%"}}
          >
            <AntDesign style={{marginLeft:"5%"}} name="back" size={44} color="black" />
          </TouchableOpacity>
            <ScrollView style={{ flex: 1, width: width, paddingHorizontal: 10 }} >
                {fields}
            </ScrollView>

            <View style={styles.buttons}>
                <Btn style={styles.button} text='Update' onPress={updateProduct} />
                <Btn style={styles.button} text='Delete' onPress={deleteProduct} color={'rgb(255, 50, 70)'} />
            </View>

            <StatusBar hidden />
        </SafeAreaView>
    )
}

export default editProducts;

const styles = StyleSheet.create({
    buttons: {
        flex: .1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    button: {
        marginHorizontal: 5,
        padding: 5,
        fontSize: 15,
        flex: 1,
    }
});