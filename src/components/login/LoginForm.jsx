"use client"

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@context/AuthContext.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@firebase/firebase.js";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginForm = () => {
	const router = useRouter();
	const { user, loading, logout, language, changeLanguage, traductor } = useContext(AuthContext);

	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const email = e.target[0].value;
		const password = e.target[1].value;
		try {
			// eslint-disable-next-line no-unused-vars
			const result = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			router.push("/dashboard");
		} catch (err) {
			if (err.code === "auth/wrong-password") {
				setError("Contraseña incorrecta");
			} else if (err.code === "auth/user-not-found") {
				setError("Usuario no encontrado");
			} else {
				setError("Error al iniciar sesión");
			}
		}
	};

	// Esto se hace en el header
	// const setLanguage = () => {
	// 	let aux = localStorage.getItem("language") == "es" ? "en" : "es"
	// 	changeLanguage(aux)
	// }

	if (loading) {
		return <div className="loaderContainer"><span className="loader"></span></div>;	
	}

	if (user) {
		router.push("/dashboard")
		return <div className="loaderContainer"><span className="loader"></span></div>;
	}
	return (
		<div>
			{/* HACER ESTO EN EL HEADER */}
			{/* <button onClick={setLanguage}>Cambiar</button>
			<p>{language}</p> */}

			<img src="https://pngimg.com/d/letter_r_PNG93939.png" className="loginImage"/>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Email</label>
				<input type="email" placeholder={traductor.example + "@gmail.com"} />
				<label htmlFor="password">{ traductor.password }</label>
				<input type="password" />
				<input type="submit" value={traductor.login} />
				{error && <p>{error}</p>}
			
				<p>
					 {traductor.notAccount}
					<Link passHref href="/register">
						{traductor.registerNow}
					</Link>
				</p>

			</form>

			{user && <p>Usuario: {user.email}</p>}
			{user && (
				<button onClick={() => logout()}>Cerrar sesión</button>
			)}
		</div>
	);
};

export default LoginForm;
