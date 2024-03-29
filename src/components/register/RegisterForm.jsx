"use client"
import React, { useState, useEffect, useContext } from "react";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import Loader from "@components/loader/Loader";


import { auth, db } from '@firebase/firebase.js';
import { AuthContext } from "@context/AuthContext";
import {
	useCreateUserWithEmailAndPassword,
	useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterForm = () => {
	const {user, loading} = useContext(AuthContext)
	const router = useRouter();
	// FIREBASE HOOKS //

	// eslint-disable-next-line no-unused-vars
	const [createUserWithEmailAndPassword, createLoading, userReg, error] =
		useCreateUserWithEmailAndPassword(auth);
	const [updateProfile] = useUpdateProfile(auth);
	const usersRef = collection(db, "users");
	const [clicked, setClicked] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	// Compressing Images //

	const registerUser = async (e) => {
		e.preventDefault();
		setClicked(true);
		const email = e.target.email.value;
		const password = e.target.password.value;
		const confirmPassword = e.target.confirmPassword.value;
		const username = e.target.username.value;
		if (password === confirmPassword) {
			try {
				const res = await createUserWithEmailAndPassword(email, password);

				await updateProfile({ username });

				await setDoc(doc(usersRef, res?.user?.uid), {
					uid: res?.user.uid,
					username,
					email,
					createdAt: serverTimestamp(),
					profilePicture: 'https://firebasestorage.googleapis.com/v0/b/resuelveme-dev.appspot.com/o/users%2Fundefined%2FprofilePicture.jpeg?alt=media&token=8ba8c063-44ab-4831-be3e-c0c9542ed826',
					profilePictureSmall: 'https://firebasestorage.googleapis.com/v0/b/resuelveme-dev.appspot.com/o/users%2Fundefined%2FprofilePicture.jpeg?alt=media&token=8ba8c063-44ab-4831-be3e-c0c9542ed826',
					attempts: 0,
					playedQuizzes: [],
					solvedQuizzes: [],
					createdQuizzes: [],
					successAttempts: 0,
				});

				router.push('/dashboard');
			} catch (error) {
				console.log(error)
			}
		}
		setClicked(false);
	};

	useEffect(() => {
		const start = () => {
			if (error?.message === 'Firebase: Error (auth/email-already-in-use).') {
				setErrorMessage('El mail ya esta en uso');
			} else if (error?.message === 'Firebase: Error (auth/invalid-email).') {
				setErrorMessage('El mail no es valido');
			} else if (error?.message === 'Firebase: Password should be at least 6 characters (auth/weak-password).') {
				setErrorMessage('La contraseña debe tener al menos 6 caracteres');
			}
			setInterval(() => {
				if(error?.message != ''){
					setErrorMessage('');
				}
			}, 5000);
		};
		return start();
	}, [error?.message]);

	if(loading) {
		return <Loader />;
	}

	if(user) {
		router.push('/dashboard')
		return <Loader />;
	}

	return (
		<>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
			<div className="loginRegisterDiv">
				<div style={{height: 'auto', color: 'white'}}>
					<h1>CREATE ACCOUNT</h1>
				</div>
				<form action="POST" onSubmit={registerUser}>
					<label htmlFor="email">Email</label>
					<input type="email" name="email" id="email" />
					<label htmlFor="username">Username</label>
					<input type="text" name="username" id="username" />
					<label htmlFor="password">Password</label>
					<input type="password" name="password" id="password" />
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassword"
					/>
					<input type="submit" value="Register" />
					<p>
						¿Already have an account? {"   "}
						<Link passHref href="/login">
							Log In
						</Link>
					</p>
				{/* {errorMessage != '' && <p className="errorMessageRegister">{errorMessage}</p>} */}
				<p className={errorMessage != "" ? "errorMessageRegister messageShow": "errorMessageRegister messageHide"}>{errorMessage}</p>

				</form>
				{clicked && (
					<div className="loaderContainer">
						<span className="loader"></span>
					</div>
				)}
			</div>
		</>
	)
}

export default RegisterForm