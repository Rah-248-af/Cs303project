import { Link } from "expo-router";
import { Pressable, StyleSheet, Text } from "react-native";


const MyLink = ({ bodyStyle, titleStyle, title, href }) => {
    return (
        <Pressable style={[bodyStyle, styles.body]}>
        <Link href = {href}>
                <Text style={[titleStyle, styles.title]} >{title}</Text>
        </Link>
        </Pressable>
    );
}

export default MyLink;

const styles = StyleSheet.create({
    body: {
        display: 'flex',
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#008080"
    },

    title: {
        fontWeight: 'bold',
        textAlign: 'center',
    }
});