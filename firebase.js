import { app } from "./firebaseConfig";

// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getDocs, getFirestore, where } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const auth = getAuth(app); // Get the authentication object
const db = getFirestore(app);
const storage = getStorage(app);

onAuthStateChanged(auth, (user) => {
  if (user != null) {
    console.log("We are authenticated now!");
  } else {
    console.log("We are not authenticated now!");
  }
});

async function register(email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred;
}

async function login(email, password, isAdmin) {
  await signInWithEmailAndPassword(auth, email, password);
  AsyncStorage.setItem("uid", auth.currentUser.uid);
  if (isAdmin) {
    router.replace("AdminPage");
  } else {
    router.replace("homePage");
  }
}

async function logout() {
  await signOut(auth);
}

const getUserDocId = async (userId) => {
  console.log("this is getdocid", userId);
  const usersCollectionRef = collection(db, "Users");
  try {
    console.log("User ID:", userId);
    const q = query(usersCollectionRef, where("userID", "==", userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No documents found!");
      return null;
    } else {
      for (const doc of querySnapshot.docs) {
        console.log(doc.id, " => ", doc.data());
        return doc.id;
      }
    }
  } catch (error) {
    console.error("Failed to fetch documents: ", error);
    return null;
  }
};

async function checkAdmin(userId) {
  console.log("Checking admin status for user:", userId);
  const docId = await getUserDocId(userId);
  console.log("Document ID:", docId);
  if (docId === null) {
    console.log("No document found for user:", userId);
    return false;
  }
  const userDocRef = doc(db, "Users", docId);
  console.log("this is doc id " + docId);
  const userDocSnapshot = await getDoc(userDocRef);
  if (userDocSnapshot.exists()) {
    console.log("Document data:", userDocSnapshot.data());
    const userData = userDocSnapshot.data();
    if (!userData.isAdmin) {
      console.log("User is not an admin");
      return false;
    } else {
      console.log("User is an admin");
      return true;
    }
  } else {
    console.log("No such document!");
    return false;
  }
}

export { register, login, logout, checkAdmin };

export { auth, db, storage }; // Export the authentication object