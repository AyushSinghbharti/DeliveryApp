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
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

interface AuthContextType {
  user: User | null;
  userInfo: Record<string, any>;
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
    role: "admin" | "user",
    name: string,
    isNew?: boolean
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userInfo: {},
  authToken: null,
  loading: false,
  role: null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<Object | null>();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        const token = await getIdToken(currentUser);
        await AsyncStorage.setItem("authToken", token);
        setUser(currentUser);
        setAuthToken(token);

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
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

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().role === role) {
      setRole(role);
      if (userDoc.data().role === "admin") {
        navigation.reset({
          index: 0,
          routes: [{ name: "AdminHomePage" as never }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" as never }],
        });
      }
    } else if (userDoc.exists() && userDoc.data().role !== role) {
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" as never }],
      });
      alert(`You are logged in as a ${userDoc.data().role}, not as a ${role}.`);
      alert("Please log in with the correct credentials.");
    }
  };

  const register = async (
    email: string,
    password: string,
    role: "admin" | "user",
    name: string,
    isNew: boolean = true
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

    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      name: name,
      role: role,
      createdAt: serverTimestamp(),
      isNew: isNew,
      age: 0,
      gender: "male",
      address: "missing",
      phone: "+91 1234567890",
      orderid: [],
      id: user.uid,
    });

    navigation.goBack();
  };

  const logout = async () => {
    await auth.signOut();
    await AsyncStorage.removeItem("authToken");
    setUser(null);
    setAuthToken(null);
    setRole(null);
    navigation.reset({
      index: 0,
      routes: [{ name: "Auth" as never }],
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        loading,
        role,
        login,
        register,
        logout,
        userInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
