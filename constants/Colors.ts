const mainColor = "#9CE0FE";
const secondColor = "#2d2d2d";
const thirdColor = "#d2d2d2";

export default {
  main: {
    text: "#000",
    backgroundcolor: "#E6E6E6",
    // blue : #3D6CF3
    tint: mainColor,
    tabIconDefault: "#ccc",
    tabIconSelected: mainColor,
  },
  light: {
    text: "#fff",
    backgroundcolor: "#3E68B2",
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