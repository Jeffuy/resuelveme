import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "@context/AuthContext.js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@firebase/firebase.js";
import Link from "next/link";
import { useRouter } from "next/router";

const LoginForm = () => {
	const router = useRouter();
	const { user, loading, logout } = useContext(AuthContext);

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

	if (loading) {
		return <div>Loading...</div>;
	}
	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Email</label>
				<input type="email" placeholder="Email" />
				<label htmlFor="password">Password</label>
				<input type="password" placeholder="Password" />
				<button type="submit">Login</button>
				{error && <p>{error}</p>}
			</form>

			<p>
				¿No tienes una cuenta? {"   "}
				<Link passHref href="/register">
					Registrate
				</Link>
			</p>

			{user && <p>Usuario: {user.email}</p>}
			{user && (
				<button onClick={() => logout()}>Cerrar sesión</button>
			)}
		</div>
	);
};

export default LoginForm;
