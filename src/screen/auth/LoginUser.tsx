import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import colours from "../../components/colours"; // make sure this file exports the palette provided earlier
import Button from "../../components/Button";

export default function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password, "user");
      navigation.navigate("Home" as never);
    } catch (error: any) {
      alert(error.message);
      navigation.reset({
        index: 0,
        routes: [{ name: "Auth" as never }],
      });
      console.warn("Error during login:", error);
    }
  };

  const handleRegister = async () => {
    navigation.navigate("Register" as never, { role: "user" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colours.userTheme.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colours.userTheme.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        onPress={handleLogin}
        styleButton={styles.button}
        styleText={styles.buttonText}
        title="Log In"
        theme="user"
      />

      <Button
        onPress={handleRegister}
        title="Register"
        styleButton={styles.registerButton}
        styleText={styles.registerButtonText}
      />
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.userTheme.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
    color: colours.userTheme.textPrimary,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: colours.userTheme.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: colours.userTheme.textPrimary,
    backgroundColor: "#fff",
    borderRightWidth: 2.5,
    borderBottomWidth: 2.5,
  },
  button: {
    width: "100%",
    height: 48,
    backgroundColor: colours.userTheme.primary,
    borderColor: colours.userTheme.textPrimary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: 'black',
  },
  buttonText: {
    color: colours.userTheme.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    width: "100%",
    height: 48,
    backgroundColor: colours.userTheme.secondary,
    borderColor: colours.userTheme.textPrimary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  registerButtonText: {
    color: colours.userTheme.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
