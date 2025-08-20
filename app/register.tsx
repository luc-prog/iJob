import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { auth } from '@/firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithCredential } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
     clientId: "870009699798-c6ni62kr11m8f3d4rsjhrqjp9iejp677.apps.googleusercontent.com", // obligatoire
  //iosClientId: "TON_CLIENT_ID_IOS.apps.googleusercontent.com", // optionnel pour iOS
  //androidClientId: "TON_CLIENT_ID_ANDROID.apps.googleusercontent.com", // optionnel pour Android
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        const credential = GoogleAuthProvider.credential(authentication.idToken);
        signInWithCredential(auth, credential)
          .then(userCredential => {
            Alert.alert("Succès", "Connecté avec Google !");
            // userCredential.user contient les infos de l'utilisateur
          })
          .catch(err => Alert.alert("Erreur", err.message));
      }
    }
  }, [response]);

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Succès', 'Inscription réussie!');
      console.log("Utilisateur créé :", userCredential.user);
    } catch (error: any) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require('@/assets/images/logo_ijob.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <ThemedText type="title" style={styles.title}>Créer un compte</ThemedText>

      {/* Formulaire Email/Mot de passe */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={20} color="#666" style={styles.icon} />
        <TextInput
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={handleEmailSignUp}
        disabled={isLoading}
      >
        <ThemedText style={styles.buttonText}>
          {isLoading ? 'Chargement...' : 'S\'inscrire avec Email'}
        </ThemedText>
      </TouchableOpacity>

      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <ThemedText style={styles.separatorText}>OU</ThemedText>
        <View style={styles.separatorLine} />
      </View>

      {/* Bouton Google */}
      <TouchableOpacity 
        style={[styles.socialButton, styles.googleButton]}
        disabled={!request || isLoading}
        onPress={() => promptAsync()}
      >
        <Image 
          source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png" }}
          style={styles.socialIcon}
        />
        <ThemedText style={styles.socialButtonText}>
          Continuer avec Google
        </ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 32 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 8, paddingHorizontal: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#ddd',
  },
  icon: { marginRight: 12 },
  input: { flex: 1, height: 56, fontSize: 16 },
  primaryButton: {
    backgroundColor: '#4a90e2', borderRadius: 8, height: 56,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 8, marginBottom: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  separatorLine: { flex: 1, height: 1, backgroundColor: '#ddd' },
  separatorText: { marginHorizontal: 12, color: '#666' },
  socialButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, height: 56, marginBottom: 16,
  },
  googleButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  socialIcon: { width: 24, height: 24, marginRight: 12 },
  socialButtonText: { fontSize: 16, fontWeight: 'bold' },
});
