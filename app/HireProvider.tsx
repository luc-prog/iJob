import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { MaterialIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const { width, height } = Dimensions.get('window');

export default function SignInScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [buttonScale] = useState(new Animated.Value(1));

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'VOTRE_CLIENT_ID_GOOGLE',
    iosClientId: 'VOTRE_CLIENT_ID_IOS',
    androidClientId: 'VOTRE_CLIENT_ID_ANDROID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleSignIn(response.authentication?.accessToken);
    }
  }, [response]);

  const detectInputType = (text: string) => {
    const phoneRegex = /^[0-9+]{8,15}$/;
    const isPhoneInput = phoneRegex.test(text);
    setIsPhone(isPhoneInput);
    setIdentifier(text);
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleSignIn = async () => {
    if (!identifier || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const payload = isPhone 
        ? { phone_number: identifier, password }
        : { email: identifier, password };
      
      // await auth.signInWithEmailAndPassword(payload);
      Alert.alert('Succès', 'Connexion réussie!');
    } catch (error) {
      Alert.alert('Erreur', "Échec de la connexion. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async (token?: string) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      // const credential = auth.GoogleAuthProvider.credential(null, token);
      // await auth().signInWithCredential(credential);
      Alert.alert('Succès', 'Connexion Google réussie!');
    } catch (error) {
      Alert.alert('Erreur', "Échec de la connexion Google");
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

      <ThemedText type="title" style={styles.title}>Connexion</ThemedText>

      <View style={styles.inputContainer}>
        {isPhone ? (
          <MaterialIcons name="phone" size={20} color="#666" style={styles.icon} />
        ) : (
          <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
        )}
        <TextInput
          placeholder={isPhone ? "Numéro de téléphone" : "Email"}
          value={identifier}
          onChangeText={detectInputType}
          keyboardType={isPhone ? "phone-pad" : "email-address"}
          autoCapitalize="none"
          style={styles.input}
          placeholderTextColor="#999"
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
          placeholderTextColor="#999"
        />
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
        <TouchableOpacity 
          style={[styles.primaryButton, isLoading && styles.disabledButton]}
          onPress={handleSignIn}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>
            {isLoading ? 'Connexion...' : `Se connecter avec ${isPhone ? 'téléphone' : 'email'}`}
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.separator}>
        <View style={styles.separatorLine} />
        <ThemedText style={styles.separatorText}>OU</ThemedText>
        <View style={styles.separatorLine} />
      </View>

      <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
        <TouchableOpacity 
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => promptAsync()}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={isLoading || !request}
          activeOpacity={0.8}
        >
          <Image 
            source={require('@/assets/images/logo_ijob.png')}
            style={styles.socialIcon}
          />
          <ThemedText style={[styles.socialButtonText, { color: '#4285F4' }]}>
            Continuer avec Google
          </ThemedText>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.forgotPasswordContainer}>
        <TouchableOpacity>
          <ThemedText style={styles.forgotPasswordText}>Mot de passe oublié ?</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.signUpContainer}>
        <ThemedText style={styles.signUpText}>Pas encore de compte ? </ThemedText>
        <TouchableOpacity>
          <ThemedText style={styles.signUpLink}>S'inscrire</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    alignSelf: 'center',
    marginBottom: height * 0.04,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: height * 0.04,
    textAlign: 'center',
    color: '#2c3e50',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#D79A10',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  separatorText: {
    marginHorizontal: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    height: 56,
    marginBottom: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6c757d',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  signUpText: {
    color: '#6c757d',
  },
  signUpLink: {
    color: '#D79A10',
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});