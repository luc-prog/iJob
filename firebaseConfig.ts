import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyAgC1SW_NScE8WL1DfFK3Y70Y-9A93NH7M",
  authDomain: "jobcon-74cfa.firebaseapp.com",
  projectId: "jobcon-74cfa",
  storageBucket: "jobcon-74cfa.appspot.com",
  messagingSenderId: "868903290150",
  appId: "1:868903290150:web:19b45b1a47cb2ec44bade7",
  measurementId: "G-LLNDGR0CB9"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services que tu veux utiliser
export const auth = getAuth(app);
export const db = getDatabase(app); // Realtime Database
export const firestore = getFirestore(app); // Firestore
export const storage = getStorage(app);