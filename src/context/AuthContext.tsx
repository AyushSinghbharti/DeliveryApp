// useEffect(() => {
//   const checkAuthToken = async () => {
//     const token = await AsyncStorage.getItem("authToken");
//     if (token) {
//       await setAuthToken(token)
//     } else {
//       setAuthToken(null);
//     }
//   }
//   checkAuthToken();
// }, []);

import React, { createContext, useState, useEffect, ReactNode } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getIdToken,
  User,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../providers/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  authToken: string | null;
  loading: boolean;
  role: string | null;
  login: (
    email: string,
    password: string,
    role: "admin" | "user"
  ) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: "admin" | "user"
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authToken: null,
  loading: true,
  role: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await getIdToken(currentUser);
        await AsyncStorage.setItem("authToken", token);
        setUser(currentUser);
        setAuthToken(token);

        console.log("User authenticated:", currentUser);

        // Fetch role from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role || null);
        } else {
          setRole(null);
        }
      } else {
        await AsyncStorage.removeItem("authToken");
        setUser(null);
        setAuthToken(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: "admin" | "user"
  ) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await getIdToken(user);
    await AsyncStorage.setItem("authToken", token);
    setUser(user);
    setAuthToken(token);

    // Get role from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().role === role) {
      // setRole(userDoc.data().role || null);
      // if(role === "admin") {
        
      // }

    }
  };

  const register = async (
    email: string,
    password: string,
    role: "admin" | "user"
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await getIdToken(user);
    await AsyncStorage.setItem("authToken", token);
    setUser(user);
    setAuthToken(token);
    setRole(role);

    // Save role in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role,
    });
  };

  const logout = async () => {
    await auth.signOut();
    await AsyncStorage.removeItem("authToken");
    setUser(null);
    setAuthToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, authToken, loading, role, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};