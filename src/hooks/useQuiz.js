import React from 'react'
import { useState, useContext, useEffect } from "react";
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

	const isQuizSolved = async () => {
		console.log(userQuizData?.successAttempts)
		if (userQuizData?.successAttempts === quiz.questions.length && !userQuizData?.solved) {
			await updateDoc(doc(db, "usersQuizzes", userData.uid + quiz.token), {
				solved: true,
				solvedDate: new Date(),
			});
			userData.solvedQuizzes ? await updateDoc(doc(db, "users", userData.uid), { solvedQuizzes: [...userData.solvedQuizzes, { quiz: quiz.token, date: new Date()}] }) : await setDoc(doc(db, "users", userData.uid), { solvedQuizzes: [{ quiz: quiz.token, date: new Date()}] }, { merge: true });
			quiz.solvers ? await updateDoc(doc(db, "quizzes", quiz.token), { solvers: [...quiz.solved, { user: userData.uid, date: new Date()}] }) : await setDoc(doc(db, "quizzes", quiz.token), { solvers: [{ user: userData.uid, date: new Date()}] }, { merge: true });
		}
	}

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
		if (!userQuizData) {
			const addPlayer = async () => {
				if (quiz.players) {
					await updateDoc(doc(db, "quizzes", quiz.token), {
						players: [...quiz.players, user.uid],
					});
				} else {
					await setDoc(
						doc(db, "quizzes", quiz.token),
						{
							players: [user.uid],
						},
						{ merge: true }
					);
				}
			};
			const addQuiz = async () => {
				if (user.playedQuizzes) {
					await updateDoc(doc(db, "users", user.uid), {
						playedQuizzes: [...user.playedQuizzes, quiz.token],
					});
				} else {
					await setDoc(
						doc(db, "users", user.uid),
						{
							playedQuizzes: [quiz.token],
						},
						{ merge: true }
					);
				}
			};
			addPlayer();
			addQuiz();
		}
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

	useEffect(() => {
		isQuizSolved();
	}, [userQuizData?.successAttempts]);

	return { userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft };
}
