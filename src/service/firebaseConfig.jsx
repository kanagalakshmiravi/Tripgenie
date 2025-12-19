// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjZVEbrBw1qzokXkJ8zkkC3OtwOMXd7NM",
  authDomain: "travelplan-ef4ac.firebaseapp.com",
  databaseURL: "https://travelplan-ef4ac-default-rtdb.firebaseio.com",
  projectId: "travelplan-ef4ac",
  storageBucket: "travelplan-ef4ac.firebasestorage.app",
  messagingSenderId: "76322795650",
  appId: "1:76322795650:web:26783e3ea2503051f7049b",
  measurementId: "G-871WC9DTKP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const analytics = getAnalytics(app);