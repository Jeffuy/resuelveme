import React from 'react'
import { useState, useContext, useEffect } from "react";
import { db, auth } from "@firebase/firebase";
//import { useRouter } from "next/router";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { AuthContext } from "@context/AuthContext";
import { QuizContext } from "@context/QuizContext";
import useQuiz from "@hooks/useQuiz";

const QuizContent = ({ quiz }) => {
	const { clicked, userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft } = useQuiz(quiz);
	const { user, loading, userData, userDataLoading } = useContext(AuthContext);


	//const quizId = router.query.token;



	// const handleAnswer = (index) => (e) => {
	// 	setClicked(true)
	// 	e.preventDefault();
	// 	e.target.giveFeedback.value = "";
	// 	if (quiz.questions[index].answers.includes(e.target.giveAnswer.value)) {
	// 		if (userQuizData) {
	// 			const oldQuestionsCompleted = userQuizData.questionsCompleted || [];
	// 			const updateUserQuizzes = async () => {
	// 				await updateDoc(
	// 					doc(db, "usersQuizzes", userData.uid + quiz.token),
	// 					{
	// 						questionsCompleted: [
	// 							...oldQuestionsCompleted,
	// 							index,
	// 						],
	// 					}
	// 				);
	// 				setClicked(false)
	// 			};
	// 			updateUserQuizzes();

	// 		} else {
	// 			const createUserQuizzes = async () => {
	// 				await setDoc(
	// 					doc(db, "usersQuizzes", user.uid + quiz.token),
	// 					{
	// 						questionsCompleted: [index],
	// 					},
	// 					{ merge: true }
	// 				);
	// 				setClicked(false)
	// 			};
	// 			createUserQuizzes();
	// 		}
	// 	} else {
	// 		const handleAttemps = async () => {
	// 			if(!userQuizData){
	// 				await setDoc(
	// 					doc(db, "usersQuizzes", user.uid + quiz.token),
	// 					{
	// 						attempts: 1,
	// 					},
	// 					{ merge: true }
	// 				);
	// 				quiz.attempts ? await updateDoc(doc(db, "quizzes", quiz.token), { attempts: quiz.attempts + 1 }) : await updateDoc(doc(db, "quizzes", quiz.token), { attempts: 1 });
	// 			} else {
	// 			await updateUserAndQuizAttemps(quiz.token, userData.uid);
	// 			}
	// 			e.target.giveFeedback.value = "Respuesta incorrecta";
	// 			setClicked(false)
	// 		};
	// 		handleAttemps();
	// 	}

	// };

	useEffect(() => {
		let timeoutId = null;
		if (timeLeft > 0) {
			timeoutId = setInterval(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);
		}

		if (timeLeft === 0) {
			clearInterval(timeoutId);
		}


		return () => {
			clearInterval(timeoutId);
		}

	}, [timeLeft]);

	if (loading || userQuizDataLoading || userDataLoading) {
		return <div>Loading...</div>;
	}

	if (userQuizDataError) {
		return <div>Error</div>;
	}

	return (
		<>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />

			<div className="container">



				{quiz.successAttempts ? (
					<p>
						Se han hecho {quiz.successAttempts} intentos exitosos en este quiz
					</p>) : (
					<p>
						No se han hecho intentos exitosos en este quiz
					</p>
				)
				}

				{userQuizData?.successAttempts ? (
					<p>
						Tus intentos exitosos en este quiz han sido {userQuizData.successAttempts} en este quiz
					</p>) : (
					<p>
						Tus intentos exitosos en este quiz han sido 0 en este quiz
					</p>
				)
				}


				{quiz.attempts ? (
					<p>
						Se han hecho {quiz.attempts} intentos
					</p>) : (
					<p>
						No se han hecho intentos
					</p>
				)
				}

				{userQuizData?.attempts ? (
					<p>
						Tus intentos en este quiz han sido {userQuizData.attempts}
					</p>) : (
					<p>
						Tus intentos en este quiz han sido 0
					</p>
				)
				}

				{userQuizData ? (
					<p>
						Tus preguntas completadas son {userQuizData.questionsCompleted?.length || 0}/{quiz.questions.length}
					</p>) : (
					<p>
						Tus preguntas completadas son 0/{quiz.questions.length}
					</p>
				)}

				{userQuizData?.questionsCompleted?.length === quiz.questions.length && (
					<p>
						{quiz.solveMessage}
					</p>)
				}

				{userQuizData?.attempts ? (
					<p>
						Te quedan {quiz.amountLife - userQuizData.attempts} intentos
					</p>) : (
					<p>
						Te quedan {quiz.amountLife} intentos
					</p>
				)}


				<div className="infoQuiz">
					<h1>
						<i className="fa fa-star"></i>
						{quiz.title}
						<i className="fa-solid fa-star"></i>
					</h1>
					<p>{quiz.description}</p>
				</div>
				{quiz.questions.map((question, index) => (
					<div key={index} className="questionContainer">
						<p className="numberQuestion">Question #{index + 1}</p>
						<p className="questionText"><li><b>{question.question}</b></li></p>
						<form onSubmit={handleAnswer(index)}>
							{userQuizData?.questionsCompleted?.includes(index) ? (
								<>
									<input type="text" name="answer" id="answer" placeholder={question.answers[0]} disabled />
									<p>Correcto</p>
								</>
							) : (
								<>
									<input type="text" name="giveAnswer" id="giveAnswer" placeholder={userQuizData?.attempts && quiz.amountLife - userQuizData?.attempts <= 0 ? 'Perdiste' : 'Answer'} disabled={quiz.amountLife - userQuizData?.attempts <= 0} />
									<input type="text" name="giveFeedback" id='giveFeedback' disabled />
									<div className="submitContainer">
										{timeLeft > 0 ? (
											<p>Espera {timeLeft} segundos</p>
										) : (
											<input type="submit" value="Submit" />
										)}
									</div>
								</>
							)}
						</form>
					</div>
				))}
			</div>
		</>
	)
}

export default QuizContent