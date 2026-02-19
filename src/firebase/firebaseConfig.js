import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwJOczOrV8FzJWMuZcTc_i2JBfGV4jOd4",
  authDomain: "supermarket-checklist.firebaseapp.com",
  projectId: "supermarket-checklist",
  storageBucket: "supermarket-checklist.firebasestorage.app",
  messagingSenderId: "11246207072",
  appId: "1:11246207072:web:06ca6de0991e076fb08305",
  measurementId: "G-NY4NM9JM0N"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


/*
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwJOczOrV8FzJWMuZcTc_i2JBfGV4jOd4",
  authDomain: "supermarket-checklist.firebaseapp.com",
  projectId: "supermarket-checklist",
  storageBucket: "supermarket-checklist.firebasestorage.app",
  messagingSenderId: "11246207072",
  appId: "1:11246207072:web:06ca6de0991e076fb08305",
  measurementId: "G-NY4NM9JM0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);*/