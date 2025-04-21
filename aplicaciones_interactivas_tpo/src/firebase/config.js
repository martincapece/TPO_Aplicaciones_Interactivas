// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8JWE0TM9pqe4VK4_-oRZ_R30Qdpulh34",
  authDomain: "apis-proyecto-535fb.firebaseapp.com",
  projectId: "apis-proyecto-535fb",
  storageBucket: "apis-proyecto-535fb.firebasestorage.app",
  messagingSenderId: "17986087371",
  appId: "1:17986087371:web:7c0c62c546369ca7926e4e",
  measurementId: "G-5B57WD1746"
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);

export const FirebaseAuth = getAuth(FirebaseApp);