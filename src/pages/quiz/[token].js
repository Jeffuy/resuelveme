import { db } from "@firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

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

	const handleAnswer = (index) => (e) => {
		e.preventDefault();
		console.log(e.target.answer.value);
		if(quiz.questions[index].answers.includes(e.target.answer.value)){
			console.log('Correcto');
		} else {
			console.log('Incorrecto');
		}
	};

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
					<label htmlFor='answer'>
						Respuesta
					</label>
					<input type='text' name='answer' id='answer' />
					<input type='submit' value='Submit' />
					</form>
				</div>
			))}
		</>
	);
}
