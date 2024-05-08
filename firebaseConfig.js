// Your web app's Firebase configuration
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAY9QTXB-nqlw481fTzmyLWqKawnd-R_ZM",
  authDomain: "project-1edee.firebaseapp.com",
  databaseURL: "https://project-1edee-default-rtdb.firebaseio.com",
  projectId: "project-1edee",
  storageBucket: "project-1edee.appspot.com",
  messagingSenderId: "516823133079",
  appId: "1:516823133079:web:35091b791b16fcf9f072d2",
  measurementId: "G-R9VEYXPPGK",
};



// Initialize Firebase
export const app = initializeApp(firebaseConfig);