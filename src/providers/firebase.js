import "firebase/firestore";
import "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBUIDmpfBleDOf4kS9Q6lyiiB4sdOcWbp8",
  authDomain: "deliveryapp-fef4e.firebaseapp.com",
  projectId: "deliveryapp-fef4e",
  storageBucket: "deliveryapp-fef4e.firebasestorage.app",
  messagingSenderId: "694386441419",
  appId: "1:694386441419:web:1f4a586a4b905ec07e2f4e"
};

const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);

export { app, auth, db };