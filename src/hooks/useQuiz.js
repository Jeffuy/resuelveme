import React from 'react'
import { useState, useContext } from "react";
import { db } from "@firebase/firebase";
//import { useRouter } from "next/router";
import {
	doc,
	getDoc,
	
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { AuthContext } from "@context/AuthContext";


export default function useQuiz(quiz) {

	
	const [timeLeft, setTimeLeft] = useState(0);

	const { user, userData } = useContext(AuthContext);


	//const quizId = router.query.token;

	const [userQuizData, userQuizDataLoading, userQuizDataError] =
		useDocumentData(
			user ? doc(db, "usersQuizzes", user.uid + quiz?.token) : null,
			{
				snapshotListenOptions: { includeMetadataChanges: true },
			}
		);

	const updateUserAndQuizFailedAttemps = async (success) => {
		setTimeLeft(7)
		const quizRef = doc(db, 'quizzes', quiz.token);
		const quizDoc = await getDoc(quizRef);
		const userRef = doc(db, 'users', userData.uid);
		const user = await getDoc(userRef);
		const userQuizRef = doc(db, 'usersQuizzes', userData.uid + quiz.token);
		const userQuiz = await getDoc(userQuizRef);
		try {
			quizDoc.data().attempts ? await updateDoc(quizRef, { attempts: quizDoc.data().attempts + 1 }) : await setDoc(quizRef, { attempts: 1 }, { merge: true });
			user.data().attempts ? await updateDoc(userRef, { attempts: user.data().attempts + 1 }) : await setDoc(userRef, { attempts: 1 }, { merge: true });
			!success ? await updateDoc(userQuizRef, { attempts: userQuiz.data().attempts + 1 }) : null;
		} catch (error) {
			console.log(error);
		}
	};

	const updateUserAndQuizCorrectAttempts = async (index) => {
		if (userQuizData) {
			console.log(index)
			//Si ya existe
			const oldQuestionsCompleted = userQuizData.questionsCompleted || [];
			const updateUserQuizzes = async () => {
				await updateDoc(
					doc(db, "usersQuizzes", userData.uid + quiz.token),
					{
						questionsCompleted: [
							...oldQuestionsCompleted,
							index,
						],
						attempts: userQuizData.attempts + 1 || 1,
						successAttempts: userQuizData.successAttempts + 1 || 1,
					}
				);
				await updateUserAndQuizCorrectPoints()
				
			};
			updateUserQuizzes();
		} else {
			//Si es la primera vez
			const createUserQuizzes = async () => {
				await setDoc(
					doc(db, "usersQuizzes", userData.uid + quiz.token),
					{
						questionsCompleted: [index],
						attempts: 1,
						successAttempts: 1,
					},
					{ merge: true }
				);
				await updateUserAndQuizCorrectPoints()

			};
			createUserQuizzes();
		}
	};

	const updateUserAndQuizCorrectPoints = async () => {
		const quizRef = doc(db, 'quizzes', quiz.token);
		const quizDoc = await getDoc(quizRef);
		const userRef = doc(db, 'users', userData.uid);
		const user = await getDoc(userRef);
		try {
			quizDoc.data()?.successAttempts ? await updateDoc(quizRef, { successAttempts: quizDoc.data().successAttempts + 1 }) : await setDoc(quizRef, { successAttempts: 1 }, { merge: true });
			user.data()?.successAttempts ? await updateDoc(userRef, { successAttempts: user.data().successAttempts + 1 }) : await setDoc(userRef, { successAttempts: 1 }, { merge: true });
		} catch (error) {
			console.log(error);
		}
		await updateUserAndQuizFailedAttemps(true)
	};


	const handleAnswer = (index) => (e) => {
		
		e.preventDefault();
		e.target.giveFeedback.value = "";
		// Respuesta Correcta
		if (quiz.questions[index].answers.includes(e.target.giveAnswer.value)) {
			updateUserAndQuizCorrectAttempts(index)
		} else {
			//Respuesta Incorrecta
			const handleAttemps = async () => {
				if (!userQuizData) {
					e.target.giveFeedback.value = "Respuesta incorrecta";
					setTimeLeft(7)
					await setDoc(
						doc(db, "usersQuizzes", user.uid + quiz.token),
						{
							attempts: 1,
						},
						{ merge: true }
					);
					quiz.attempts ? await updateDoc(doc(db, "quizzes", quiz.token), { attempts: quiz.attempts + 1 }) : await updateDoc(doc(db, "quizzes", quiz.token), { attempts: 1 });
				} else {
					e.target.giveFeedback.value = "Respuesta incorrecta";
					await updateUserAndQuizFailedAttemps();
				}
				
				
			};
			handleAttemps();
		}
	};

	return { userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft };
}
