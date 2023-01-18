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
			<img src="https://pngimg.com/d/letter_r_PNG93939.png" className="loginImage"/>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Email</label>
				<input type="email" placeholder="example@gmail.com" />
				<label htmlFor="password">Password</label>
				<input type="password" />
				<input type="submit" value="Login" />
				{error && <p>{error}</p>}
			
				<p>
					¿No tienes una cuenta? {"   "}
					<Link passHref href="/register">
						Registrate
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
