import React, { useRef, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Dimensions, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { AuthContext } from "../../context/AuthContext";
import colours from "../../components/colours";

const { width, height } = Dimensions.get("window");
const squareSize = Math.min(width, height) / 2;

export default function SplashScreen() {
  const navigation = useNavigation();
  const { authToken, user } = useContext(AuthContext);
  const redirected = useRef(false);
  const checkInterval = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimer = useRef<NodeJS.Timeout | null>(null);
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    checkInterval.current = setInterval(() => {
      if (redirected.current) return;

      if (authToken || user) {
        redirected.current = true;
        clearTimers();
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" as never }],
        });
      }

      if (!authToken && !user && !fallbackTimer.current) {
        fallbackTimer.current = setTimeout(() => {
          if (!redirected.current) {
            redirected.current = true;
            clearTimers();
            navigation.reset({
              index: 0,
              routes: [{ name: "Auth" as never }],
            });
          }
        }, 3000);
      }
    }, 500);

    return () => clearTimers();
  }, [authToken, user]);

  const clearTimers = () => {
    if (checkInterval.current) clearInterval(checkInterval.current);
    if (fallbackTimer.current) clearTimeout(fallbackTimer.current);
  };

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 2500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <Animated.View
          style={{
            transform: [{ translateX }, { scaleX: -1 }],
            width: "100%",
            height: "100%",
          }}
        >
          <LottieView
            source={require("../../../assets/loadingScreen.json")}
            autoPlay
            loop
            style={{ width: "100%", height: "100%" }}
          />
        </Animated.View>
        <View style={styles.textWrapper}>
          <Text style={styles.welcomeText}>Delivery App!!!</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.splashBackground,
    justifyContent: "center",
    alignItems: "center",
  },
  animationContainer: {
    width: squareSize,
    height: squareSize,
    justifyContent: "center",
    alignItems: "center",
  },
  lottieAnimation: {
    width: "100%",
    height: "100%",
  },
  textWrapper: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  welcomeText: {
    color: colours.splashAccent,
    fontSize: 18,
    fontWeight: "bold",
  },
});
