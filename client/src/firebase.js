// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-75609.firebaseapp.com",
  projectId: "mern-blog-75609",
  storageBucket: "mern-blog-75609.firebasestorage.app",
  messagingSenderId: "341336230055",
  appId: "1:341336230055:web:5ae76d244ee82386ddb382"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);