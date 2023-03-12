import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
//import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
	// apiKey: "AIzaSyBQsppnAaOBQnCRRXUoPwG-QcKhdlO8U_A",
	// authDomain: "resuelveme-9e9bb.firebaseapp.com",
	// projectId: "resuelveme-9e9bb",
	// storageBucket: "resuelveme-9e9bb.appspot.com",
	// messagingSenderId: "660236365643",
	// appId: "1:660236365643:web:73cae8177fe79f255a02ce",
	apiKey: "AIzaSyDIhVxPrHtDvKtVPc_axd5LcB-D6H-5HNU",
	authDomain: "resuelveme-dev.firebaseapp.com",
	projectId: "resuelveme-dev",
	storageBucket: "resuelveme-dev.appspot.com",
	messagingSenderId: "520065532237",
	appId: "1:520065532237:web:b340c5f291020685957704",
	measurementId: "G-QFP5GR4LEM"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage(app);
export const db = getFirestore();
//export const analytics = getAnalytics(app);
