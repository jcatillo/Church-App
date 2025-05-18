import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBVaufD4569DohlX_b3Ss4THd3sBe5w_m4",
  authDomain: "church-5d383.firebaseapp.com",
  projectId: "church-5d383",
  storageBucket: "church-5d383.firebasestorage.app",
  messagingSenderId: "943973474409",
  appId: "1:943973474409:web:7f473f0bd7e0e5350342f8",
  measurementId: "G-9W97EBHG20"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
