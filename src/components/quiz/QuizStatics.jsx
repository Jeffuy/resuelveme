import React from 'react'
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import useQuiz from "@hooks/useQuiz";

const QuizStatics = ({ quiz }) => {

	const { userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft } = useQuiz(quiz);
	const { user, loading, userData, userDataLoading } = useContext(AuthContext);

	if (loading || userQuizDataLoading || userDataLoading) {
		return <div>Loading...</div>;
	}

	if (userQuizDataError) {
		return <div>Error</div>;
	}

	return (
		<div>
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
		</div>
	)
}

export default QuizStatics