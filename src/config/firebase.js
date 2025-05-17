// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVaufD4569DohlX_b3Ss4THd3sBe5w_m4",
  authDomain: "church-5d383.firebaseapp.com",
  projectId: "church-5d383",
  storageBucket: "church-5d383.firebasestorage.app",
  messagingSenderId: "943973474409",
  appId: "1:943973474409:web:7f473f0bd7e0e5350342f8",
  measurementId: "G-9W97EBHG20"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);