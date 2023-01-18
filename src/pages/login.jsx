import React from "react";
import { AuthContextProvider } from "@context/AuthContext";
import LoginForm from "@components/login/LoginForm";
import "@styles/loginRegister.css";


const Login = () => {
	return (
		<AuthContextProvider>
			<LoginForm />
		</AuthContextProvider>
	);
};

export default Login;
