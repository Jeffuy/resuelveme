"use client"

import { auth, db } from '@firebase/firebase.js';
import { doc } from 'firebase/firestore';
import { createContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, loading] = useAuthState(auth);

	const [userData, userDataLoading, userDataError] = useDocumentData(user ? doc(db, 'users', user.uid) : null, {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const[clicked, setClicked] = useState(false);

	const logout = () => {
		auth.signOut();
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				logout,
				userData,
				userDataLoading,
				userDataError,
				clicked,
				setClicked,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};