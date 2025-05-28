import React, { useContext, useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import LoginAdmin from "./LoginAdmin";
import LoginUser from "./LoginUser";
import { AuthContext } from "../../context/AuthContext";
import { ActivityIndicator, View, StyleSheet, StatusBar } from "react-native";
import colours from "../../components/colours";

const Tab = createMaterialTopTabNavigator();

export default function AuthLayout() {
  const { authToken, loading } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) setIsLoading(false);
    else if (authToken) {
      setIsLoading(false);
    }
  }, [authToken, loading]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="LoginUser"
        screenOptions={({ route }) => ({
          tabBarActiveTintColor: route.name === "LoginAdmin" ? 'white' : 'black',
          tabBarInactiveTintColor: route.name === "LoginAdmin" ? 'white' : 'black',
          tabBarStyle: {
            backgroundColor: route.name === "LoginAdmin" ? colours.adminTheme.border : colours.userTheme.primary,
            paddingVertical: 10,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 4,
          },
          tabBarIndicatorStyle: {
            backgroundColor: route.name === "LoginAdmin" ? colours.adminTheme.highlight : "black",
            shadowColor: route.name === "LoginAdmin" ? "colours.adminTheme.highlight" : "black",
            elevation: 20,
            borderRadius: 10,
          },
          tabBarLabelStyle: {
            fontWeight: "bold",
            fontSize: 16,
          },
          swipeEnabled: true,
        })}
      >
        <Tab.Screen
          name="LoginAdmin"
          component={LoginAdmin}
          options={{ tabBarLabel: "Admin" }}
        />
        <Tab.Screen
          name="LoginUser"
          component={LoginUser}
          options={{ tabBarLabel: "User" }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight || 40, // Push content below status bar
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
