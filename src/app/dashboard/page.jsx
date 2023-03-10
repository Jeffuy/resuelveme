import React from "react";
import { AuthContextProvider } from "@context/AuthContext";
import DashboardMain from "@components/dashboard/DashboardMain";
import "@styles/dashboard.css";

const Login = () => {
	return (
		<AuthContextProvider>
			<DashboardMain />
		</AuthContextProvider>
	);
};

export default Login;
