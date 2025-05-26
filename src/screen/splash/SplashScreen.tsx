import React, { useEffect, useState, useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";

const logos = [
  require("../../../assets/logo1.png"),
  require("../../../assets/logo2.png"),
  require("../../../assets/logo3.png"),
];

export default function SplashScreen() {
  const navigation = useNavigation();
  const [logoIndex, setLogoIndex] = useState(0);
  const { user, authToken } = useContext(AuthContext);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * logos.length);
    setLogoIndex(randomIndex);

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
          routes: [{ name: "Auth" as never}],
        });
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={logos[logoIndex]}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 180,
    height: 180,
  },
});
