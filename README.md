# iJob (Expo) — Project README

Petit guide clair pour démarrer avec ce projet Expo + React Native (TypeScript).

Résumé
- App Expo (file-based routing). Écrite en React Native + Expo + Firebase.
- Dossier principal des écrans : `app/` (ex. `app/register.tsx`, `app/login.tsx`, `app/(tabs)/profile.tsx`).
- Configuration Firebase : `firebaseConfig.ts` à la racine.

Prérequis
- Node.js (LTS) et npm
- Expo CLI (optionnel) : `npm install -g expo-cli`
- Sous Windows, ouvrez PowerShell en Administrateur si vous rencontrez des erreurs de permissions.

Installation
1. Depuis la racine du projet (`c:\Norevia\projet_JobCon\jobconApp\iJob`) :

   powershell> npm install

2. Installer (si nécessaire) les dépendances recommandées pour Firebase/React Native :

   powershell> npm install firebase@latest @react-native-async-storage/async-storage

Lancement
- Démarrer Metro / Expo :

  powershell> npx expo start

- Exécuter sur un appareil Android (dev build / emulator) :

  powershell> npm run android

- Exécuter sur iOS (macOS) :

  powershell> npm run ios

Configuration Firebase (important)
- Le fichier `firebaseConfig.ts` contient la configuration. Vérifiez que vos clés sont correctes (apiKey, authDomain, projectId, storageBucket...).
- Sur React Native, pour que l'état d'auth soit persistant entre sessions, installez `@react-native-async-storage/async-storage` et initialisez l'auth ainsi :

  ```ts
  import { getApp, getApps, initializeApp } from 'firebase/app'
  import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
  import AsyncStorage from '@react-native-async-storage/async-storage'

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  const auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
  ```

  - Si vous utilisez `getAuth(app)` et voyez un warning indiquant l'absence d'AsyncStorage, suivez la configuration ci-dessus.
  - Évitez d'initialiser Firebase plusieurs fois ; utilisez `getApps().length ? getApp() : initializeApp(config)` pour prévenir l'erreur `app/duplicate-app`.

Sauvegarde utilisateur et Realtime DB / Firestore
- Le code d'inscription email utilise `createUserWithEmailAndPassword` (voir `app/register.tsx`).
- Si vous enregistrez des données supplémentaires pour l'utilisateur, vérifiez l'écriture dans Realtime Database (`getDatabase`) ou Firestore (`getFirestore`).

Dépannage rapide
- EPERM / symlink lors de `npm install` (Windows) :
  - Fermez VS Code/éditeurs, désactivez antivirus temporairement.
  - Ouvrez PowerShell en Administrateur et relancez l'installation.
  - Si nécessaire supprimer `node_modules` et `package-lock.json` puis `npm install`.

- Erreur `Firebase App named '[DEFAULT]' already exists`: utilisez la pattern `getApps()/getApp()` ci-dessus.

Structure importante
- `app/` : écrans et navigation
- `components/` : composants réutilisables (`ThemedText`, `ThemedView`, etc.)
- `firebaseConfig.ts` : point d'entrée Firebase

Besoin d'aide
- Si une erreur précise apparaît (log console / message d'erreur), copiez-la ici et je vous aide à la corriger rapidement.

---
Projet créé avec Expo — bonnes pratiques : redémarrez l'app après modification de la configuration Firebase et vérifiez toujours la console Firebase (Auth) pour confirmer les utilisateurs créés.
