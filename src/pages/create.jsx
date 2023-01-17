import { async } from "@firebase/util";
import "@styles/create.css";
import { useState } from "react";
import Router from "next/router";
import { db } from "@firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const Create = () => {
	const quizRef = collection(db, "quizzes");
	const [arrayQuestions, setArrayQuestions] = useState([
		{
			question: "",
			answers: [""],
		},
	]);

	const createQuiz = async (e) => {
		e.preventDefault();
		let token = await generate_token(32);

		let title = e.target.title.value;
		let description = e.target.description.value;
		let solveMessage = e.target.solveMessage.value;
		let amountLife = e.target.amountLife.value;

		try {
			await setDoc(
				doc(quizRef, token),
				{
					token,
					title,
					description,
					solveMessage,
					amountLife,
					questions: JSON.stringify(arrayQuestions),
					createdAt: new Date(),
				},
				{ merge: true }
			);
			Router.push(`/quiz/${token}`);
		} catch (error) {
			console.error(error);
		}
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
		newArray.push({ question: "", answers: [""] });
		setArrayQuestions(newArray);
	};

	// Generate token para el quiz
	const generate_token = async (length) => {
		//edit the token allowed characters
		var a =
			"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split(
				""
			);
		var b = [];
		for (var i = 0; i < length; i++) {
			var j = (Math.random() * (a.length - 1)).toFixed(0);
			b[i] = a[j];
		}
		return b.join("");
	};

	return (
		<>
			<meta charSet="UTF-8" />
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0"
			/>
			<title>Create Quiz</title>
			<link
				rel="stylesheet"
				href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
			/>
			<div>
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
															indexAnswer +
															"-" +
															answer
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
															onClick={() =>
																addAndRemoveAnswerToQuestion(
																	index,
																	indexAnswer
																)
															}
														>
															<i
																className={`fa ${
																	indexAnswer >
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

						{/* <div>
              <label htmlFor="question1">Question #1</label>
              <button>
                <i className="fa fa-ban" />
              </button>
              <textarea rows={2} defaultValue={""} id="question1" />
              <section>
                <label htmlFor="answer1question1">Answer</label>
                <input type="text" id="answer1question1" />
                <button>
                  <i className="fa fa-plus" />
                </button>
                <input type="text" />
                <button>
                  <i className="fa fa-minus" />
                </button>
              </section>
            </div> */}
					</div>
					<input type={"submit"} value={"Create"} />
				</form>
			</div>
		</>
	);
};

export default Create;
