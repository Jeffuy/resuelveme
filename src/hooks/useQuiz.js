import React from 'react'
import { useState, useContext, useEffect } from "react";
import { db } from "@firebase/firebase";
//import { useRouter } from "next/router";
import {
	doc,
	getDoc,
	serverTimestamp,
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
		if (userQuizData?.successAttempts === quiz.questions.length && !userQuizData?.solved) {
			await updateDoc(doc(db, "usersQuizzes", userData.uid + quiz.token), {
				solved: true,
				solvedDate: serverTimestamp(),
			});
			await updateDoc(doc(db, "users", userData.uid), { solvedQuizzes: [...userData.solvedQuizzes, { quiz: quiz.token, date: new Date(), title: quiz.title }] })

			await updateDoc(doc(db, "quizzes", quiz.token), { solvers: [...quiz.solvers, { user: userData.uid, date: new Date(), username: userData.username }] })
		}
	}

	const updateUserAndQuizAttemps = async () => {
		setTimeLeft(7)
		const quizRef = doc(db, 'quizzes', quiz.token);
		const quizDoc = await getDoc(quizRef);
		const userRef = doc(db, 'users', userData.uid);
		const user = await getDoc(userRef);
		const userQuizRef = doc(db, 'usersQuizzes', userData.uid + quiz.token);
		const userQuiz = await getDoc(userQuizRef);
		try {
			await updateDoc(quizRef, { attempts: quizDoc.data().attempts + 1 })
			await updateDoc(userRef, { attempts: user.data().attempts + 1 })
			await updateDoc(userQuizRef, { attempts: userQuiz.data().attempts + 1 })
		} catch (error) {
			console.log(error);
		}
	};

	const updateUserAndQuizCorrectAttempts = async (index) => {
		const oldQuestionsCompleted = userQuizData?.questionsCompleted;

		const updateUserQuizzes = async () => {
			try {
			await updateDoc(
				doc(db, "usersQuizzes", userData.uid + quiz.token),
				{
					questionsCompleted: [
						...oldQuestionsCompleted,
						index,
					],
					successAttempts: userQuizData.successAttempts + 1,
				}
			);
			await updateUserAndQuizCorrectPoints(index)
			} catch (error) {
				console.log(error);
			}
		};
		updateUserQuizzes();
	};

	const updateUserAndQuizCorrectPoints = async (index) => {
		const quizRef = doc(db, 'quizzes', quiz.token);
		const quizDoc = await getDoc(quizRef);
		const userRef = doc(db, 'users', userData.uid);
		const user = await getDoc(userRef);
		const userQuizRef = doc(db, 'usersQuizzes', userData.uid + quiz.token);
		const userQuiz = await getDoc(userQuizRef);

		try {
			await updateDoc(quizRef, {
				successAttempts: quizDoc.data().successAttempts + 1,
				questions: quizDoc.data().questions.map((question, i) => {
					if (i === index) {
						return {
							...question,
							correct: question.correct + 1
						}
					}
					return question;
				})
			})

			await updateDoc(userRef, { successAttempts: user.data().successAttempts + 1 })

		} catch (error) {
			console.log(error);
		}

		await updateUserAndQuizAttemps()
	};

	const handleAnswer = (index) => async (e) => {

		e.preventDefault();
		e.target.giveFeedback.value = "";

		//REVISO SI ES LA PRIMER VEZ QUE PARTICIPA EN EL QUIZ
		if (!userQuizData) {
			const addPlayer = async () => {
				await updateDoc(doc(db, "quizzes", quiz.token), {
					players: [...quiz.players, userData.uid],
				});
			};

			const addQuiz = async () => {
				await updateDoc(doc(db, "users", userData.uid), {
					playedQuizzes: [...userData.playedQuizzes, quiz.token],
				});
			};

			const createUserQuizzes = async () => {
				await setDoc(
					doc(db, "usersQuizzes", userData.uid + quiz.token),
					{
						questionsCompleted: [],
						attempts: 0,
						successAttempts: 0,
						solved: false,
						solvedDate: null,
					},
					{ merge: true }
				);
			};

			await addPlayer();
			await addQuiz();
			await createUserQuizzes();
		}

		// REVISO SI LA RESPUESTA ES CORRECTA
		if (quiz.questions[index].answers.includes(e.target.giveAnswer.value)) {
			updateUserAndQuizCorrectAttempts(index)
		} else {
			//RESPUESTA INCORRECTA
			const handleAttemps = async () => {
				e.target.giveFeedback.value = "Respuesta incorrecta";
				await updateUserAndQuizAttemps();
			};
			await handleAttemps();
		}
	};

	useEffect(() => {
		isQuizSolved();
	}, [userQuizData?.successAttempts]);

	return { userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft };
}
