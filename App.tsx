import * as React from "react";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthLayout from "./src/screen/auth/AuthLayout";
import HomepageLayout from "./src/screen/tabs/HomepageLayout";
import { AuthProvider } from "./src/context/AuthContext";
import { OrderProvider } from "./src/context/OrderContext";
import Register from "./src/screen/auth/Register";
import SplashScreen from "./src/screen/splash/SplashScreen";
import OrderDetail from "./src/screen/tabs/OrderDetail";
import UploadQuery from "./src/components/UploadQuery";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <OrderProvider>
          <Stack.Navigator>
            {/* <Stack.Screen name="UploadQuery" component={UploadQuery} /> */}
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Auth" component={AuthLayout} />
            <Stack.Screen name="Home" component={HomepageLayout} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} />
          </Stack.Navigator>
        </OrderProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}
