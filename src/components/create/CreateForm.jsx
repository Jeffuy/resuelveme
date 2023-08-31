"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "@context/AuthContext";
import { db } from "@firebase/firebase";
import { collection, doc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import Loader from "@components/loader/Loader";

const CreateForm = () => {
	const router = useRouter();

	const quizRef = collection(db, "quizzes");
	const userRef = collection(db, "users");
	const { user, loading, userData } = useContext(AuthContext);
	const [arrayQuestions, setArrayQuestions] = useState([
		{
			question: "",
			answers: [""],
			correct: 0,
		},
	]);
	const { clicked, setClicked } = useContext(AuthContext);

	const createQuiz = async (e) => {
		e.preventDefault();
		setClicked(true);
		let token = await generate_token(32);

		let title = e.target.title.value;
		let description = e.target.description.value;
		let solveMessage = e.target.solveMessage.value;
		let amountLife = parseInt(e.target.amountLife.value);

		if (
			title != "" ||
			description != "" ||
			solveMessage != "" ||
			amountLife != ""
		) {
			try {
				await setDoc(
					doc(quizRef, token),
					{
						token,
						title,
						description,
						solveMessage,
						amountLife: amountLife || 0,
						attempts: 0,
						players: [],
						successAttempts: 0,
						solvers: [],
						questions: arrayQuestions,
						createdBy: userData.username,
						createdAt: serverTimestamp(),
					},
					{ merge: true }
				);
				await updateDoc(doc(userRef, userData.uid), {
					createdQuizzes: [...userData.createdQuizzes, token]
				})
				const push = async () => router.push(`/quiz/${token}`);
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
			newArray[indexQuestion].answers.splice(indexAnswer, 1);
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

	// Generate token para el quiz
	const generate_token = async (length) => {
		//edit the token allowed characters
		let a =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
				""
			);
		let b = [];
		for (let i = 0; i < length; i++) {
			let j = (Math.random() * (a.length - 1)).toFixed(0);
			b[i] = a[j];
		}
		return b.join("");
	};

	if (!user && !loading) {
		router.push('/login');
		return <Loader />;
	}

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<div className="containerCreate">
				<form onSubmit={createQuiz} method="POST">
					<h1>CREATE QUIZ</h1>
					<label htmlFor="title">Title</label>
					<input type="text" name="title" id="title" />
					<label htmlFor="description">Description</label>
					<textarea
						rows={2}
						defaultValue={""}
						name="description"
						id="description"
					/>
					<label htmlFor="solveMessage">Solve Winning message</label>
					<textarea
						rows={2}
						defaultValue={""}
						name="solveMessage"
						id="solveMessage"
					/>
					<label htmlFor="amountLife">Amount of life</label>
					<input
						type="number"
						min={0}
						name="amountLife"
						id="amountLife"
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
									{index > 0 && (
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
					<div className="actionDiv">
						{!clicked && 
							<input 
								type={"submit"} 
								value={"Create"} 
								style={{background: '#16a085'}}
							/>
						}
						{!clicked && (
							<input
								onClick={() => router.push("/")}
								value={"Cancel"}
								style={{background: '#ff3434'}}
							/>
						)}
					</div>
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

export default CreateForm;
