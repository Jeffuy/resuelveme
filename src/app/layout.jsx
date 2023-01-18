import React, {useContext} from 'react'
import { AuthContextProvider } from "@context/AuthContext";
import { AuthContext } from '@context/AuthContext';
import './globals.css'



export default function RootLayout({ children }) {
  const {clicked } = useContext(AuthContext);
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.jsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <AuthContextProvider>
			
      <body>{children}</body>
	</AuthContextProvider>
    </html>
  )
}
