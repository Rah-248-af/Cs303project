import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import Search from "../assets/Search.png";
import Profile from "../assets/Profile.png";
import SelectedProfile from "../assets/SelectedProfile.png";
import { router } from "expo-router";
import Svg, { Path } from "react-native-svg";
import Home from "../assets/Home.png";

const ButtonNavBar = ({ CurrentScreen, ColorTheme }) => {
  const CurrentColor = ColorTheme || Colors.main.backgroundcolor;
  return (
    <View style={styles.outerContainer}>
      <View style={[styles.container, { borderColor: CurrentColor }]}>
        <TouchableOpacity
          onPress={() => {
            router.navigate("addItem");
          }}
          style={[
            styles.iconWrapper,
            CurrentScreen === "addItem" && [
              styles.activeIcon,
              { backgroundColor: CurrentColor },
            ],
          ]}
        >
          <Svg
            width={35}
            height={35}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm-8 6a8 8 0 1 1 14.32 4.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 0 1 2 10z"
              fill={
                CurrentScreen === "addItem"
                   ? Colors.light.backgroundcolor
                 : CurrentColor
              }
            />
          </Svg>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            router.navigate("homePage");
          }}
          style={[
            styles.iconWrapper,
            CurrentScreen === "homePage" && [
              styles.activeIcon,
              { backgroundColor: CurrentColor },
            ],
          ]}
        >
          <Svg
            width={35}
            height={35}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M18 18V7.132l-8-4.8-8 4.8V18h4v-2.75a4 4 0 1 1 8 0V18h4zm-6 2v-4.75a2 2 0 1 0-4 0V20H2a2 2 0 0 1-2-2V7.132a2 2 0 0 1 .971-1.715l8-4.8a2 2 0 0 1 2.058 0l8 4.8A2 2 0 0 1 20 7.132V18a2 2 0 0 1-2 2h-6z"
              fill={
                CurrentScreen === "homePage"
                  ? Colors.light.backgroundcolor
                  : CurrentColor
              }
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.navigate("addToCart");
          }}
          style={[
            styles.iconWrapper,
            CurrentScreen === "cart" && [
              styles.activeIcon,
              { backgroundColor: CurrentColor },
            ],
          ]}
        >
          <Svg
            width={35}
            height={35}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M4.78571 5H18.2251C19.5903 5 20.5542 6.33739 20.1225 7.63246L18.4558 12.6325C18.1836 13.4491 17.4193 14 16.5585 14H6.07142M4.78571 5L4.74531 4.71716C4.60455 3.73186 3.76071 3 2.76541 3H2M4.78571 5L6.07142 14M6.07142 14L6.25469 15.2828C6.39545 16.2681 7.23929 17 8.23459 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17C10.1046 17 11 17.8954 11 19Z"
              fill={
                CurrentScreen === "cart"
                  ? Colors.light.backgroundcolor
                  : CurrentColor
              }
            />
          </Svg>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.navigate("./profile");
          }}
          style={[
            styles.iconWrapper,
            CurrentScreen === "profile" && [
              styles.activeIcon,
              { backgroundColor: CurrentColor },
            ],
          ]}
        >
          <Svg
            width={35}
            height={35}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Path
              d="M6.75 6.5C6.75 3.6005 9.1005 1.25 12 1.25C14.8995 1.25 17.25 3.6005 17.25 6.5C17.25 9.3995 14.8995 11.75 12 11.75C9.1005 11.75 6.75 9.3995 6.75 6.5Z M4.25 18.5714C4.25 15.6325 6.63249 13.25 9.57143 13.25H14.4286C17.3675 13.25 19.75 15.6325 19.75 18.5714C19.75 20.8792 17.8792 22.75 15.5714 22.75H8.42857C6.12081 22.75 4.25 20.8792 4.25 18.5714Z"
              fill={
                CurrentScreen === "profile"
                  ? Colors.light.backgroundcolor
                  : CurrentColor
              }
            />
          </Svg>
        </TouchableOpacity>

       
      </View>
    </View>
  );
  80;
};

const styles = StyleSheet.create({
  outerContainer: {
    maxHeight: Platform.OS === "ios" ? 100 : 80,
    minHeight: Platform.OS === "ios" ? 100 : 80,
    justifyContent: Platform.OS === "ios" ? "flex-start" : "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 40,
    bottom: Platform.OS === "ios" ? -40 : 0,
    zIndex: 999,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 15,
    backgroundColor: Colors.light.backgroundcolor,
    maxHeight: Platform.OS === "ios" ? 110 : 80,
    minHeight: Platform.OS === "ios" ? 110 : 80,
    width: "100%",
    position: "absolute",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
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
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  activeIcon: {
    backgroundColor: Colors.main.backgroundcolor,
    width: "30%",
    marginHorizontal: -20,
    height: 50,
  },
  icon: {
    width: 35,
    height: 35,
  },
  ProfileIcon: {
    width: 35,
    height: 42.61,
  },
});

export default ButtonNavBar;