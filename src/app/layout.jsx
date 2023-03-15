import React, { useContext } from "react";
import "./globals.css";
import Navbar from "@components/navbar/Navbar";
import { AuthContextProvider } from "@context/AuthContext";


export default function RootLayout({ children }) {
	return (
		<html lang="en">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head />
			<AuthContextProvider>
				<Navbar />
			</AuthContextProvider>
			<body>{children}</body>
		</html>
	);
}
