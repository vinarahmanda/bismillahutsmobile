// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";  // Import untuk Firebase Functions

const firebaseConfig = {
  apiKey: "AIzaSyDQiYJ4BEfevcbd59BlpVzVDYb60bkAUxE",
  authDomain: "web-mobile-vina.firebaseapp.com",
  projectId: "web-mobile-vina",
  storageBucket: "web-mobile-vina.appspot.com",
  messagingSenderId: "897968370751",
  appId: "1:897968370751:web:258ab80ae4f04bd1ed348a",
  measurementId: "G-TYKVY5JEPG"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);

// Inisialisasi Firestore dan Firebase Functions
const db = getFirestore(app);
const functions = getFunctions(app);  // Inisialisasi Firebase Functions

export { db, functions };  // Pastikan functions diexport juga
