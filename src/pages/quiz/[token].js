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
	console.log(quizzes)
	const paths = quizzes.docs.map((doc) => ({
		params: { token: doc.id },
	}));
	console.log(paths)
	return { paths, fallback: false };
}

export default function QuizPage({ quiz }) {
	return <div>{quiz.description}</div>;
}
