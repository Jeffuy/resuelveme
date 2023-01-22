"use client"

import { auth, db } from '@firebase/firebase.js';
import { doc, collection, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { createContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocumentData, useCollectionData } from 'react-firebase-hooks/firestore';
import { useState } from 'react';

export const QuizContext = createContext();

export const QuizContextProvider = ({ children }) => {
	const [quizzes, quizzesLoading, quizzesError] = useCollectionData(collection(db, 'quizzes'), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const[clicked, setClicked] = useState(false);

	
	return (
		<QuizContext.Provider
			value={{
				quizzes,
				quizzesLoading,
				quizzesError,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};