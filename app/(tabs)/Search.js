import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import Colors from '../../constants/Colors';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            return;
        }

        try {
            setLoading(true);
            const productsRef = collection(db, "Products");
            const q = query(productsRef, where("name", ">=", searchQuery.trim()), where("name", "<=", searchQuery.trim() + '\uf8ff'));
            const querySnapshot = await getDocs(q);
            const fetchedProducts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(fetchedProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            getProducts();
        }
    }, [searchQuery]);

    const getProducts = async () => {
        try {
            setLoading(true);
            const productsRef = collection(db, "Products");
            const q = query(productsRef, orderBy("name"), limit(10));
            const querySnapshot = await getDocs(q);
            const fetchedProducts = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProducts(fetchedProducts);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.searchText}>Search</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={(text) => setSearchQuery(text)}
                />
                <TouchableOpacity style={styles.button} onPress={handleSearch}>
                    <Text style={styles.buttonText}>Search</Text>
                </TouchableOpacity>
            </View>
            {loading ? (
                <ActivityIndicator style={styles.loadingIndicator} size="large" color={Colors.light.primary} />
            ) : (
                <FlatList
                    data={products}
                    renderItem={({ item }) => (
                        <View style={styles.productItem}>
                            <Text>{item.name}</Text>
                            {/* Add more details here if needed */}
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    style={styles.productList}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
    },
    searchText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.dark.backgroundcolor,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.dark.backgroundcolor,
        borderRadius: 100,
        paddingVertical: 10,
        paddingHorizontal: 15,
        flex: 1,
        marginRight: 10,
    },
    button: {
        backgroundColor: Colors.light.backgroundcolor,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 100,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    productList: {
        marginTop: 20,
    },
    productItem: {
        borderWidth: 1,
        borderColor: Colors.dark.backgroundcolor,
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    loadingIndicator: {
        marginTop: 20,
    },
});

export default Search;
