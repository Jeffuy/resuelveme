import React from 'react'
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import useQuiz from "@hooks/useQuiz";

const QuizStatics = ({ quiz, show }) => {

	const { userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft } = useQuiz(quiz);
	const { user, loading, userData, userDataLoading } = useContext(AuthContext);

	if (loading || userQuizDataLoading || userDataLoading) {
		return <div>Loading...</div>;
	}

	if (userQuizDataError) {
		return <div>Error</div>;
	}

	return (
		<div className={show ? 'containerStatic showStats' : 'containerStatic hiddenStats'}>

			{/* Create Date */}
			{quiz.createdAt &&
				<p style={{marginBottom: '3px'}}>Creado el {quiz.createdAt}</p>
			}

			<div>
				<i className='fa-regular fa-circle-check'></i>
				{
					quiz.successAttempts ? (<p>Success attempts: {quiz.successAttempts}</p>) : (<p>Success attempts: 0</p>)
				}
			</div>

			<div>
				<i className='fa fa-retweet'></i>
				{
					quiz.attempts ? ( <p>Total attempts: {quiz.attempts}</p>) : (<p>Total attempts: 0</p>)
				}
			</div>

			<div>
				<i className="fa fa-rotate-right"></i>
				{
					userQuizData?.attempts ? (<p>My attempts: {userQuizData.attempts}</p>) : (<p>My attempts: 0</p>)
				}
			</div>
			
			<div>
				<i className='fa fa-award'></i>
				{	
					quiz.solvers ? (<p>Total solvers: {quiz.solvers?.length}</p>) : (<p>Total solvers: 0</p>)
				}
			</div>

			{userQuizData?.questionsCompleted?.length === quiz.questions.length && (
				<p>
					{quiz.solveMessage}
				</p>)
			}

			
		</div>
	)
}

export default QuizStatics