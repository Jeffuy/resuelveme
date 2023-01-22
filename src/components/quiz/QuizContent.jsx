import React from 'react'
import { useState, useContext } from "react";
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
import { useAuthState } from "react-firebase-hooks/auth";
import { AuthContext } from "@context/AuthContext";
import { QuizContext } from "@context/QuizContext";

const QuizContent = ({ quiz }) => {
	const [clicked, setClicked] = useState(false);
	const { userData, userDataLoading } = useContext(AuthContext);

	const { updateUserAndQuizAttemps } = useContext(QuizContext);

	const [user, loading] = useAuthState(auth);

	//const quizId = router.query.token;

	const [userQuizData, userQuizDataLoading, userQuizDataError] =
		useDocumentData(
			user ? doc(db, "usersQuizzes", user.uid + quiz?.token) : null,
			{
				snapshotListenOptions: { includeMetadataChanges: true },
			}
		);

	const handleAnswer = (index) => (e) => {
		setClicked(true)
		e.preventDefault();
		if (quiz.questions[index].answers.includes(e.target.giveAnswer.value)) {
			if (userQuizData) {
				const oldQuestionsCompleted = userQuizData.questionsCompleted;
				const updateUserQuizzes = async () => {
					await updateDoc(
						doc(db, "usersQuizzes", userData.uid + quiz.token),
						{
							questionsCompleted: [
								...oldQuestionsCompleted,
								index,
							],
						}
						);
						setClicked(false)
				};
				updateUserQuizzes();

			} else {
				const createUserQuizzes = async () => {
					await setDoc(
						doc(db, "usersQuizzes", user.uid + quiz.token),
						{
							questionsCompleted: [index],
						},
						{ merge: true }
					);
					setClicked(false)
				};
				createUserQuizzes();
			}
		} else {
			const handleAttemps = async () => {
				await updateUserAndQuizAttemps(quiz.token, userData.uid);
				setClicked(false)
			};
			handleAttemps();
		}
		
	};

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
						Tus intentos han sido {userQuizData.attempts}
					</p>) : (
					<p>
						Tus intentos han sido 0
					</p>
				)
				}

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
									<input type="text" name="giveAnswer" id="giveAnswer" placeholder="Answer" />
									<div className="submitContainer">
										{!clicked && <input type="submit" value="Submit" />}
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