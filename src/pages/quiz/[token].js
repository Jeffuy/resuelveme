import { useEffect, useState } from "react";
import { db, auth, } from "@firebase/firebase";
import { useRouter } from "next/router";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';

export default function QuizPage({ quizToken }) {
	const router = useRouter();

	const [user, loading] = useAuthState(auth);

	const quizId = router.query.token;

	const [quiz, quizLoading, quizError] = useDocumentData(
		quizId ? doc(db, "quizzes", quizId) : null,
		{
			snapshotListenOptions: { includeMetadataChanges: true },
		}
	);

	const [userQuizData, userQuizDataLoading, userQuizDataError] =
		useDocumentData(
			user ? doc(db, "usersQuizzes", user.uid + quiz?.token) : null,
			{
				snapshotListenOptions: { includeMetadataChanges: true },
			}
		);

	const handleAnswer = (index) => (e) => {
		e.preventDefault();
		console.log(e.target.giveAnswer.value);
		if (quiz.questions[index].answers.includes(e.target.giveAnswer.value)) {
			if (userQuizData) {
				const oldQuestionsCompleted = userQuizData.questionsCompleted;
				const updateUserQuizzes = async () => {
					await updateDoc(
						doc(db, "usersQuizzes", user.uid + quiz.token),
						{
							questionsCompleted: [...oldQuestionsCompleted, index],
						}
					);
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
				};
				createUserQuizzes();
			}
		} else {
			console.log("Incorrecto");
		}
	};

	useEffect(() => {
		console.log(userQuizData);
	}, [userQuizData]);


	if (loading  || userQuizDataLoading || quizLoading) {
		return <div>Loading...</div>;
	}

	if (quizError || userQuizDataError) {
		return <div>Error</div>;
	}

	return (
		<>
			<div>
				<p>Title: {quiz?.title}</p>
			</div>
			<div>
				<p>Descripcion: {quiz?.description}</p>
			</div>
			{quiz?.questions?.map((question, index) => (
				<div key={index}>
					<p>
						Pregunta #{index + 1}: {question.question}
					</p>
					<form onSubmit={handleAnswer(index)}>
						<label htmlFor="giveAnswer">Respuesta</label>
						{userQuizData?.questionsCompleted?.includes(index) ? (
							<>
								<input type="text" name="answer" id="answer" placeholder={question.answers[0]} disabled />
								<p>Correcto</p>
							</>
						) : (
							<>
								<input type="text" name="giveAnswer" id="giveAnswer" />
								<input type="submit" value="Submit" />
							</>
						)}
					</form>
				</div>
			))}
		</>
	);
}
