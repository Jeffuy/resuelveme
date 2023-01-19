import { db, auth, } from "@firebase/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { useAuthState } from 'react-firebase-hooks/auth';



export async function getStaticProps({ params }) {
	const quizRef = collection(db, "quizzes");
	const quiz = await getDoc(doc(quizRef, params.token));
	return { props: { quiz: quiz.data() } };
}

export async function getStaticPaths() {
	const quizRef = collection(db, "quizzes");
	const quizzes = await getDocs(quizRef);
	console.log(quizzes);
	const paths = quizzes.docs.map((doc) => ({
		params: { token: doc.id },
	}));
	console.log(paths);
	return { paths, fallback: false };
}

export default function QuizPage({ quiz }) {
	const [user, loading] = useAuthState(auth);

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

	if (loading  || userQuizDataLoading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<div>
				<p>Title: {quiz.title}</p>
			</div>
			<div>
				<p>Descripcion: {quiz.description}</p>
			</div>
			{quiz.questions.map((question, index) => (
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
