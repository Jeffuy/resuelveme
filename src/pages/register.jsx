import React, { useState, useEffect, useRouter } from "react";
import { collection, doc, setDoc } from "firebase/firestore";

import {
	useCreateUserWithEmailAndPassword,
	useUpdateProfile,
} from "react-firebase-hooks/auth";
import { auth, db } from "@firebase/firebase";

const Register = () => {
	// FIREBASE HOOKS //

	// eslint-disable-next-line no-unused-vars
	const [createUserWithEmailAndPassword, createLoading, userReg, error] =
		useCreateUserWithEmailAndPassword(auth);
	const [updateProfile] = useUpdateProfile(auth);
	const usersRef = collection(db, "users");
	const [clicked, setClicked] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

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
				});
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

	return (
		<>
			<form action="" onSubmit={registerUser}>
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
				{!clicked && <button type="submit"> Register </button>}
				{errorMessage != '' && <p>{errorMessage}</p>}
			</form>
		</>
	);
};
export default Register;
