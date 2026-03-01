// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7B5E4ly6AtlCO6yutvYZGWXiVZhJI1dc",
  authDomain: "mytrackerapp-c0125.firebaseapp.com",
  projectId: "mytrackerapp-c0125",
  storageBucket: "mytrackerapp-c0125.firebasestorage.app",
  messagingSenderId: "690711860793",
  appId: "1:690711860793:web:11fd53cc7e4f312ec45fe8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);
