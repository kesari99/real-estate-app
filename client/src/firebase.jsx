// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-app-20baf.firebaseapp.com",
  projectId: "real-estate-app-20baf",
  storageBucket: "real-estate-app-20baf.appspot.com",
  messagingSenderId: "673929473826",
  appId: "1:673929473826:web:f2e6298e4ad2b546edff7b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);