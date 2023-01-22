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

	const updateUserAndQuizAttemps = async (quizId, userId) => {
		const quizRef = doc(db, 'quizzes', quizId);
		const quiz = await getDoc(quizRef);
		const userRef = doc(db, 'users', userId);
		const user = await getDoc(userRef);
		const userQuizRef = doc(db, 'usersQuizzes', userId + quizId);
		const userQuiz = await getDoc(userQuizRef);
		try {
			quiz.data().attempts ? await updateDoc(quizRef, { attempts: quiz.data().attempts + 1 }) : await setDoc(quizRef, { attempts: 1 }, { merge: true });
			user.data().attempts ? await updateDoc(userRef, { attempts: user.data().attempts + 1 }) : await setDoc(userRef, { attempts: 1 }, { merge: true });
			userQuiz.data().attempts ? await updateDoc(userQuizRef, { attempts: userQuiz.data().attempts + 1 }) : await setDoc(userQuizRef, { attempts: 1 }, { merge: true });
		} catch (error) {
			console.log(error);
		}
	};




	const[clicked, setClicked] = useState(false);

	
	return (
		<QuizContext.Provider
			value={{
				clicked,
				setClicked,
				quizzes,
				quizzesLoading,
				quizzesError,
				updateUserAndQuizAttemps,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};