import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyATdjyam5cHw_KcEAbMxYkrzxMCXaGDnJE",
  authDomain: "greensync-6537a.firebaseapp.com",
  databaseURL: "https://greensync-6537a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "greensync-6537a",
  storageBucket: "greensync-6537a.firebasestorage.app",
  messagingSenderId: "600150034458",
  appId: "1:600150034458:web:dbcb0fe33ea1a61db769a3",
  measurementId: "G-V7JZ865KXZ"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
