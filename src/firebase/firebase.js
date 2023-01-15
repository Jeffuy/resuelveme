import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	apiKey: "AIzaSyBQsppnAaOBQnCRRXUoPwG-QcKhdlO8U_A",
	authDomain: "resuelveme-9e9bb.firebaseapp.com",
	projectId: "resuelveme-9e9bb",
	storageBucket: "resuelveme-9e9bb.appspot.com",
	messagingSenderId: "660236365643",
	appId: "1:660236365643:web:73cae8177fe79f255a02ce",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore();
//export const analytics = getAnalytics(app);
