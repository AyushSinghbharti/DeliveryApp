import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { RouteProp, useRoute } from "@react-navigation/native";
import colours from "../../components/colours";
import CustomButton from "../../components/Button";
import Button from "../../components/Button";

type RoleType = "admin" | "user";
type RegisterRouteProp = RouteProp<
  { Register: { role: RoleType } },
  "Register"
>;

export default function Register({navigation}: {navigation: any}) {
  const route = useRoute<RegisterRouteProp>();
  const { role } = route.params;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const theme = role === "admin" ? colours.adminTheme : colours.userTheme;

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, role, name);
      alert("Please log in to continue");
    } catch (error) {
      alert("Registration failed");
      console.warn("Error during registration:", error);
    }
    setLoading(false);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Create Account
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Sign up to get started!
        </Text>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Full Name
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.cardBackground,
                color: theme.textPrimary,
              },
            ]}
            placeholder="Enter your name"
            placeholderTextColor={theme.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Email
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.cardBackground,
                color: theme.textPrimary,
              },
            ]}
            placeholder="Enter your email"
            placeholderTextColor={theme.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Password
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.cardBackground,
                color: theme.textPrimary,
              },
            ]}
            placeholder="Enter your password"
            placeholderTextColor={theme.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            Confirm Password
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.border,
                backgroundColor: theme.cardBackground,
                color: theme.textPrimary,
              },
            ]}
            placeholder="Confirm your password"
            placeholderTextColor={theme.textSecondary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <Button
          title={"Register as " + (role === "admin" ? "Admin" : "User")}
          onPress={handleRegister}
          styleButton={[styles.button, { backgroundColor: theme.primary }]}
          styleText={styles.buttonText}
        />
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => {navigation.goBack()}}>
            <Text style={[styles.footerLink, { color: theme.primary }]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 16,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    elevation: 2,
    shadowColor: "white",
  },
  button: {
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
    borderColor: colours.adminTheme.textPrimary,
    shadowColor: "white",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  footerText: {
    fontSize: 15,
  },
  footerLink: {
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 15,
  },
});
