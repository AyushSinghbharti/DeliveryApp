import React, { useRef, useEffect, useState, useContext } from "react";
import { View, Image, StyleSheet, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import LottieView from "lottie-react-native";
import colours from "../../components/colours";
import { Animated } from "react-native";

const { width, height } = Dimensions.get("window");
const squareSize = Math.min(width, height) / 2;

export default function SplashScreen() {
  const navigation = useNavigation();
  const { user, authToken } = useContext(AuthContext);
  const animation = useRef<LottieView>(null);

  const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);
  const translateX = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    // Navigate after 2 seconds
    const timer = setTimeout(() => {
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" as never }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Auth" as never }],
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (animation.current) {
      animation.current.play();
    }

    Animated.timing(translateX, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (animation.current) {
      animation.current.play();
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.animationContainer}>
        <AnimatedLottieView
          autoPlay
          ref={animation}
          loop
          style={[
            styles.lottieAnimation,
            {
              transform: [{ translateX }, { scaleX: -1 }],
            },
          ]}
          source={require("../../../assets/loadingScreen.json")}
        />
        <View
          style={{ position: "absolute", bottom: 20, alignItems: "center" }}
        >
          <Text
            style={{
              color: colours.splashAccent,
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Welcome!!!
          </Text>
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
    marginBottom: 20,
  },
});
