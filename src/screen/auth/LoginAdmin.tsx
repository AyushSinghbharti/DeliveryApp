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
import colours from "../../components/colours";
import Button from "../../components/Button";

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password, "admin");
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

  const handleRegister = () => {
    navigation.navigate("Register" as never, { role: "admin" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Admin</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colours.adminTheme.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={colours.adminTheme.textSecondary}
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
    backgroundColor: colours.adminTheme.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    color: colours.adminTheme.highlight,
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: colours.adminTheme.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: colours.adminTheme.textPrimary,
    backgroundColor: colours.adminTheme.cardBackground,
    borderRightWidth: 3.5,
    borderBottomWidth: 3.5,
    elevation: 2.5,
    shadowColor: 'white',
  },
  button: {
    borderColor: colours.adminTheme.textPrimary,
    width: "100%",
    height: 48,
    backgroundColor: colours.adminTheme.primary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: 'white',
  },
  buttonText: {
    color: colours.adminTheme.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  registerButton: {
    borderColor: colours.adminTheme.textSecondary,
    width: "100%",
    height: 48,
    backgroundColor: colours.adminTheme.secondary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  registerButtonText: {
    color: colours.adminTheme.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
