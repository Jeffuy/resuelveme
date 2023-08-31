import React from 'react'
import EditQuiz from './EditQuiz'
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";
import useQuiz from "@hooks/useQuiz";
import Loader from "@components/loader/Loader";


const QuizContent = ({ quiz }) => {
	const { userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft } = useQuiz(quiz);
	const { user, loading, userData, userDataLoading } = useContext(AuthContext);
	const [edit, setEdit] = useState(false);

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
		return <Loader />;
	}

	if (userQuizDataError) {
		return <div>Error</div>;
	}

	return (
		<>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />

			{userData?.createdQuizzes.includes(quiz.token) && <button onClick={() => setEdit(!edit)}>EDIT QUIZ</button>}

			{edit ? (
				<EditQuiz quiz={quiz} setEdit={setEdit} />
			) : (
				<>
					<div className="containerQuiz">
						<div className="infoQuiz">
							<h1>
								{quiz.title}
							</h1>
							<p>{quiz.description}</p>
						</div>

						<>
							{quiz.questions.map((question, index) => (
								<div key={index} className="questionContainer">
									<div className='questionNumberContainer'>
										<p className="numberQuestion">Question #{index + 1}</p>
										<p className='attempsNumber'><span>Solved {question.correct || 0} times</span></p>
									</div>
									<p className="questionText"><li><b>{question.question}</b></li></p>
									<form onSubmit={handleAnswer(index)}>
										{userQuizData?.questionsCompleted?.includes(index) ? (
											<>
												<input type="text" name="answer" id="answer" placeholder={question.answers[0]} disabled />
												<p className='correctAnswer'>Correcto</p>
											</>
										) : (
											<>
												<input type="text" name="giveAnswer" id="giveAnswer" placeholder={userQuizData?.attempts && quiz.amountLife - userQuizData?.attempts <= 0 ? 'Perdiste' : 'Answer'} disabled={quiz.amountLife - userQuizData?.attempts <= 0} />
												<div className="submitContainer">
													<input type="text" name="giveFeedback" id='giveFeedback' disabled />
													{timeLeft > 0 ? (
														<input type="submit" value={"Espera " + timeLeft + " segundos"} disabled />
													) : (
														<input type="submit" value="Submit" />
													)}
												</div>
											</>
										)}
									</form>
								</div>
							))}
						</>
					</div >
				</>
			)}
		</>
	)
}

export default QuizContent