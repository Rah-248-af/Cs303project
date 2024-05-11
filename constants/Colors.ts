const mainColor = "#9CE0FE";
const secondColor = "#2d2d2d";
const thirdColor = "#d2d2d2";

export default {
  main: {
    text: "#000",
    backgroundcolor: "#FFFFFF",
    // blue : #0D47A1
    tint: mainColor,
    tabIconDefault: "#ccc",
    tabIconSelected: mainColor,
  },
  light: {
    text: "#fff",
    backgroundcolor: "#134EAA",
    // light : #E6E6E6
    whiteBackground: "#E9E9E9",
    secondBackground: "#fff",
    // #fff
    tint: secondColor,
    tabIconDefault: "#ccc",
    tabIconSelected: mainColor,
  },
  dark: {
    text: "#fff",
    backgroundcolor: "#262526",
    tint: thirdColor,
    tabIconDefault: "#ccc",
    tabIconSelected: mainColor,
  },
};

export { mainColor, secondColor, thirdColor };