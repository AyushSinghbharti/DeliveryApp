import * as React from "react";
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
import AdminHomepage from "./src/screen/tabs/AdminHomePage";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <OrderProvider>
          <Stack.Navigator>
            {/* <Stack.Screen name="UploadQuery" component={UploadQuery} options={{ headerShown: false }} /> */}
            <Stack.Screen name="AdminHomePage" component={AdminHomepage} options={{ headerShown: false }} />
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Auth" component={AuthLayout} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomepageLayout} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} options={{ headerShown: false }} />
          </Stack.Navigator>
        </OrderProvider>
      </AuthProvider>
    </NavigationContainer>
  );
}