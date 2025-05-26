import React, { createContext, useState, useEffect, ReactNode, use } from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getIdToken,
  User,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../providers/firebase";

interface AuthContextType {
  user: User | null;
  authToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  authToken: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await getIdToken(currentUser);
        await AsyncStorage.setItem("authToken", token);
        setUser(currentUser);
        setAuthToken(token);
      } else {
        await AsyncStorage.removeItem("authToken");
        setUser(null);
        setAuthToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    console.log("Logging in with email:", email);
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await getIdToken(userCredential.user);
    await AsyncStorage.setItem("authToken", token);
    setUser(userCredential.user);
    setAuthToken(token);
  };

  const register = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await getIdToken(userCredential.user);
    await AsyncStorage.setItem("authToken", token);
    setUser(userCredential.user);
    setAuthToken(token);
  };

  const logout = async () => {
    await auth.signOut();
    await AsyncStorage.removeItem("authToken");
    setUser(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, authToken, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
