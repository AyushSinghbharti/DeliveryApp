import React, { useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; // Adjust the path as needed

export default function Homepage() {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Homepage</Text>
      {user ? (
        <>
          <Text style={styles.info}>Welcome, {user.name || user.email}!</Text>
          <Button title="Logout" onPress={logout} />
        </>
      ) : (
        <Text style={styles.info}>No user data found.</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 18,
    marginBottom: 16,
  },
});
