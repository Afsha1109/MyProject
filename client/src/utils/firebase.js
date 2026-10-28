
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "interviewprepai-11963.firebaseapp.com",
  projectId: "interviewprepai-11963",
  storageBucket: "interviewprepai-11963.firebasestorage.app",
  messagingSenderId: "152874381835",
  appId: "1:152874381835:web:73294dd0e715bfa81d0d0e"
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider };