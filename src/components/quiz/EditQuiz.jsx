"use client";

import "@styles/create.css";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@context/AuthContext";
import { db } from "@firebase/firebase";
import { collection, doc, setDoc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";

const EditQuiz = ({ quiz, setEdit }) => {
	const router = useRouter();

	const quizRef = collection(db, "quizzes");
	const userRef = collection(db, "users");

	const { user, loading, userData } = useContext(AuthContext);
	const [arrayQuestions, setArrayQuestions] = useState(quiz.questions);
	const { clicked, setClicked } = useContext(AuthContext);

	const editQuiz = async (e) => {
		e.preventDefault();
		setClicked(true);


		let title = e.target.title.value;
		let description = e.target.description.value;
		let solveMessage = e.target.solveMessage.value;
		//let amountLife = parseInt(e.target.amountLife.value);

		if (
			title != "" ||
			description != "" ||
			solveMessage != ""
		) {
			try {
				await updateDoc(
					doc(quizRef, quiz.token),
					{
						title,
						description,
						solveMessage,
						questions: arrayQuestions,
					},
				);
				setEdit(false)
				const push = async () => router.push(`/quiz/${quiz.token}`);
				await push();

			} catch (error) {
				console.error(error);
			}
		}
		setClicked(false);
	};

	// Change value of question and answer
	const changeArrayQuestionValue = (index, event) => {
		let newArray = [...arrayQuestions];
		newArray[index].question = event.target.value;
		setArrayQuestions(newArray);
	};

	const changeArrayAnswerValue = (indexQuestion, indexAnswer, event) => {
		let newArray = [...arrayQuestions];
		newArray[indexQuestion].answers[indexAnswer] = event.target.value;
		//evitar que el foco se vaya del input
		setArrayQuestions(newArray);
	};

	// Add and remove answer -> si el indexAnswer es 0, se agrega un nuevo input, si es mayor a 0, se elimina
	const addAndRemoveAnswerToQuestion = async (indexQuestion, indexAnswer) => {

		let newArray = [...arrayQuestions];
		if (indexAnswer == 0) {
			newArray[indexQuestion].answers.push("");
		} else {
			let questionTotalAnswers = await getDoc(doc(quizRef, quiz.token))
				.then((doc) => doc.data().questions[indexQuestion]?.answers.length)
			if ((indexAnswer > 0 && indexAnswer >= questionTotalAnswers) || (indexAnswer > 0 && !questionTotalAnswers)) {
				newArray[indexQuestion].answers.splice(indexAnswer, 1);
			}
		}
		setArrayQuestions(newArray);
	};

	// Add and remove question
	const removeQuestion = async (index) => {
		let newArray = [...arrayQuestions];
		newArray.splice(index, 1);
		setArrayQuestions(newArray);
	};
	const addQuestion = async () => {
		let newArray = [...arrayQuestions];
		newArray.push({ question: "", answers: [""], correct: 0 });
		setArrayQuestions(newArray);
	};


	if (!user && !loading) {
		router.push('/login');
		return <div className="loaderContainer"><span className="loader"></span></div>;
	}

	if (loading) {
		return <div className="loaderContainer"><span className="loader"></span></div>;
	}

	return (
		<>
			<div className="container">
				<form onSubmit={editQuiz} method="POST">
					<h1>CREATE QUIZ</h1>
					<label htmlFor="title">Title</label>
					<input type="text" name="title" id="title" defaultValue={quiz.title} />
					<label htmlFor="description">Description</label>
					<textarea
						rows={2}
						name="description"
						id="description"
						defaultValue={quiz.description}
					/>
					<label htmlFor="solveMessage">Solve Winning message</label>
					<textarea
						rows={2}
						defaultValue={quiz.solveMessage}
						name="solveMessage"
						id="solveMessage"
					/>
					<label htmlFor="amountLife">Amount of life</label>
					<input
						type="number"
						min={0}
						name="amountLife"
						id="amountLife"
						defaultValue={quiz.amountLife}
					/>
					<br />
					<hr />
					<div>
						<h1>
							Questions
							<button
								type="button"
								className="quiz-form-btn"
								onClick={() => addQuestion()}
							>
								<i className="fa fa-plus" />
							</button>
						</h1>

						{arrayQuestions.map((question, index) => {
							return (
								<div key={index}>
									<label htmlFor="">
										Question #{index + 1}
									</label>
									{index >= quiz.questions.length && (
										<button
											type="button"
											onClick={() =>
												removeQuestion(index)
											}
										>
											<i className="fa fa-ban" />
										</button>
									)}

									<textarea
										rows={2}
										value={question.question}
										onChange={(event) =>
											changeArrayQuestionValue(
												index,
												event
											)
										}
									/>
									<section>
										<label htmlFor="">Answer</label>

										{question.answers.map(
											(answer, indexAnswer) => {
												return (
													<div
														key={
															indexAnswer
														}
													>
														<input
															type="text"
															value={answer}
															onChange={(event) =>
																changeArrayAnswerValue(
																	index,
																	indexAnswer,
																	event
																)
															}
														/>
														<button
															type="button"
															onClick={() =>
																addAndRemoveAnswerToQuestion(
																	index,
																	indexAnswer
																)
															}
														>
															<i
																className={`fa ${indexAnswer >
																	0
																	? "fa-minus"
																	: "fa-plus"
																	}`}
															/>
														</button>
													</div>
												);
											}
										)}
									</section>
								</div>
							);
						})}
					</div>
					{!clicked && <input type={"submit"} value={"Save changes"} />}
					{!clicked && (
						<button
							type="button"
							onClick={() => router.push("/")}
						>
							Cancel
						</button>
					)}
				</form>

				{clicked && (
					<div className="loaderContainer">
						<span className="loader"></span>
					</div>
				)}
			</div>
		</>
	);
};

export default EditQuiz;
