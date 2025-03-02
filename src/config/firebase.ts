// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCnAfciIgBEIXGAjqo7AIX6XcSw0kydD9w",
  authDomain: "two-factor-authentication-2025.firebaseapp.com",
  projectId: "two-factor-authentication-2025",
  storageBucket: "two-factor-authentication-2025.firebasestorage.app",
  messagingSenderId: "823174855126",
  appId: "1:823174855126:web:1682d55c05a1ae153bcc77",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const firebaseAuth = getAuth(firebaseApp);
