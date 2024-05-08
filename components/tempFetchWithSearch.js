import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import Input from "../components/input";
import Btn from "../components/btn";
import { list } from "firebase/storage";

export default function Home() {
  const [data, setData] = useState([]);
  const [searchKey,setSearchKey]=useState();
  const [filteredData, setFilteredData] = useState([]);

  const handleSearch=(txt)=>{
    setFilteredData(data.filter((item)=>item.name.includes(txt)));
  };

  const getUsers = async () => {
    try {
      const response = await fetch("https://dz36w.wiremockapi.cloud/products");
      const json = await response.json();
      setData(json);
      setFilteredData(json);
    } catch (error) {
      console.log(error.code);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable style={styles.itemContainer}>
      <Image style={styles.image} source={{ uri: item.images[0] }} />
      <Text style={styles.itemText}>{item.name}</Text>
      <Text>Price: {item.price}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <TextInput placeholder="Search" placeholderTextColor="#ccc" style={styles.input} value={searchKey}onChangeText={setSearchKey} />
        <Pressable onPress={()=>handleSearch(searchKey)} style={styles.searchBtn}>
          <Text>Search</Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredData}
        style={styles.list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()} // Assuming id is unique
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  list: {
    width: "100%",
  },
  image: {
    width: 80,
    height: 80,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
  inputBox: {
    width: "100%",
    // flex:1,
    flexDirection: "row",
    // alignItems:'center',
    justifyContent:'center',
  },
  input: {
    width: "70%",
    padding: 10,
    borderWidth: 1,
    borderColor:"#ccc",
    borderBottomLeftRadius:10,
    borderTopLeftRadius:10,
  },
  searchBtn: {
    width: "30%",
    // color:'blue',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#008080',
    borderBottomRightRadius:10,
    borderTopRightRadius:10,
    borderWidth:1,
    borderColor:"#008080",
  },
});
