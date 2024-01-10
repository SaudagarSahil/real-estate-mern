// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBSE_API_KEY,
  authDomain: "sahil-real-estate.firebaseapp.com",
  projectId: "sahil-real-estate",
  storageBucket: "sahil-real-estate.appspot.com",
  messagingSenderId: "172062625193",
  appId: "1:172062625193:web:08878ec5c3386b9c49c8b8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);