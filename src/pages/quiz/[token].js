import { useEffect, useState } from "react";
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
import "@styles/quiz.css"
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

// export async function getStaticProps({ params }) {
// 	const quizRef = collection(db, "quizzes");
// 	const quiz = await getDoc(doc(quizRef, params.token));
// 	return { props: { quiz: quiz.data() } };
// }

// export async function getStaticPaths() {
// 	const quizRef = collection(db, "quizzes");
// 	const quizzes = await getDocs(quizRef);
// 	console.log(quizzes);
// 	const paths = quizzes.docs.map((doc) => ({
// 		params: { token: doc.id },
// 	}));
// 	console.log(paths);
// 	return { paths, fallback: false };
// }

export default function QuizPage({ quiz }) {
	//const router = useRouter();

	const [user, loading] = useAuthState(auth);

	//const quizId = router.query.token;

	const [userQuizData, userQuizDataLoading, userQuizDataError] =
		useDocumentData(
			user ? doc(db, "usersQuizzes", user.uid + quiz.token) : null,
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
							questionsCompleted: [
								...oldQuestionsCompleted,
								index,
							],
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

	if (loading || userQuizDataLoading) {
		return <div>Loading...</div>;
	}

	if (userQuizDataError) {
		return <div>Error</div>;
	}

	return (
		<>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
			<div className="container">
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
									<input type="text" name="giveAnswer" id="giveAnswer" placeholder="Answer"/>
									<div className="submitContainer">
										<input type="submit" value="Submit" />
									</div>
								</>
							)}
						</form>
					</div>
				))}
			</div>
		</>
	);
}

export async function getServerSideProps({ params }) {
	const quizRef = collection(db, "quizzes");
	const quiz = await getDoc(doc(quizRef, params.token));
	return { props: { quiz: quiz.data() } };
}
