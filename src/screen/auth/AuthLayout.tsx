import React, { useContext, useEffect } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginAdmin from "./LoginAdmin";
import LoginUser from "./LoginUser";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function AuthLayout() {
  const navigation = useNavigation();
  const { user, authToken, loading } = useContext(AuthContext);

  useEffect(() => {
    if (loading) {
      <ActivityIndicator size="large" color="#0000ff" />;
    } if (authToken) {
      navigation.navigate("Home");
    }
  }, [authToken]);

  return (
    <Tab.Navigator>
      <Tab.Screen name="LoginAdmin" component={LoginAdmin} />
      <Tab.Screen name="LoginUser" component={LoginUser} />
    </Tab.Navigator>
  );
}