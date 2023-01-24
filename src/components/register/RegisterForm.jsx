"use client"
import React, { useState, useEffect, useContext } from "react";
import { collection, doc, setDoc } from "firebase/firestore";
import { auth, db } from '@firebase/firebase.js';
import { AuthContext } from "@context/AuthContext";
import {
	useCreateUserWithEmailAndPassword,
	useUpdateProfile,
} from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";

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
					createdAt: new Date(),
					profilePicture: 'https://firebasestorage.googleapis.com/v0/b/resuelveme-9e9bb.appspot.com/o/users%2Fundefined%2FprofilePicture.jpeg?alt=media&token=0d5c9a21-6767-4687-8063-73d04a44e30d',
					profilePictureSmall: 'https://firebasestorage.googleapis.com/v0/b/resuelveme-9e9bb.appspot.com/o/users%2Fundefined%2FprofilePicture.jpeg?alt=media&token=0d5c9a21-6767-4687-8063-73d04a44e30d',
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
		};
		return start();
	}, [error?.message]);

	if(loading) {
		return <div> loading...</div> 
	}

	if(user) {
		router.push('/dashboard')
		return <div> loading...</div>
	}

	return (
		<>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
			<div>
				<div>
					<img src="https://educacion30.b-cdn.net/wp-content/uploads/2019/06/homer.gif" className="registerImage" />
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
					{errorMessage != '' && <p>{errorMessage}</p>}
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