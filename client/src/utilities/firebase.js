import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY ,
    authDomain: "news-app-bitcoin.firebaseapp.com",
    projectId: "news-app-bitcoin",
    storageBucket: "news-app-bitcoin.appspot.com",
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID ,
    appId: import.meta.env.VITE_APPID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
export const auth = getAuth(app);