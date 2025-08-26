// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCks2V5QRoZ1_gPzpvuv5vU21IwqzEpOuM",
  authDomain: "ammstroweb.firebaseapp.com",
  projectId: "ammstroweb",
  storageBucket: "ammstroweb.firebasestorage.app",
  messagingSenderId: "579107996009",
  appId: "1:579107996009:web:08dcfa0c7079fc57413df8",
  measurementId: "G-1F7WYKEC96"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;