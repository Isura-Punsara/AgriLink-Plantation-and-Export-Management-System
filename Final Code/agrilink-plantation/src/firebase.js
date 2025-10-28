// src/firebase.js
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-vB0lrbud6zeSSV5o_lmPO8NSTkUQueY",
  authDomain: "agrilink-main-cfc36.firebaseapp.com",
  projectId: "agrilink-main-cfc36",
  storageBucket: "agrilink-main-cfc36.firebasestorage.app",
  messagingSenderId: "571930733611",
  appId: "1:571930733611:web:9cd739c03f24e8a5d0ce6e"
};

// Primary app (used by the logged-in user)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Secondary app (used to create worker accounts without switching session)
let secondaryApp;
export function getSecondaryAuth() {
  if (!secondaryApp) {
    secondaryApp = initializeApp(firebaseConfig, "Secondary");
  }
  return getAuth(secondaryApp);
}
