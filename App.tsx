import * as React from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthLayout from "./src/screen/auth/AuthLayout";
import HomepageLayout from "./src/screen/tabs/HomepageLayout";
import { AuthProvider } from "./src/context/AuthContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Auth" component={AuthLayout} />
          <Stack.Screen name="Home" component={HomepageLayout} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
