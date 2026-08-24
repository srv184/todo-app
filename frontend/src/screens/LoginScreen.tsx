import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    // Validate locally before requesting authentication so avoidable failures
    // do not require a round trip to the backend.
    if (!email || !password) {
      Alert.alert('Missing info', 'Please enter both email and password.');
      return;
    }
    try {
      setSubmitting(true);
      // The Context persists a successful session; AppNavigator then switches
      // to the authenticated task flow from the updated user state.
      await login(email, password);
    } catch (err: any) {
      // Prefer the API's credential error while retaining a safe fallback for
      // network or unexpected failures.
      Alert.alert('Login failed', err?.response?.data?.message ?? 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={submitting}>
        <Text style={styles.buttonText}>{submitting ? 'Logging in...' : 'Log In'}</Text>
      </TouchableOpacity>
      {submitting && (
        <Text style={styles.hint}>
          First request can take up to a minute — the free backend wakes up from sleep.
        </Text>
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#0F1115' },
  title: { fontSize: 28, fontWeight: '700', color: '#fff', marginBottom: 24 },
  input: {
    backgroundColor: '#1C1F26',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { color: '#A29BFE', marginTop: 18, textAlign: 'center' },
  hint: { color: '#9AA0AC', fontSize: 12, marginTop: 12, textAlign: 'center' },
});
