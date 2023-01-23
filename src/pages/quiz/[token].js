import "@styles/quiz.css"
import QuizContent from "@components/quiz/QuizContent";
import QuizStatics from "@components/quiz/QuizStatics";
import QuizRanking from "@components/quiz/QuizRanking";
import { useEffect, useState, useContext } from "react";
import { db, auth } from "@firebase/firebase";
import { AuthContextProvider } from "@context/AuthContext";
import { QuizContextProvider } from "@context/QuizContext";
//import { useRouter } from "next/router";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
} from "firebase/firestore";

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
	return (
		<AuthContextProvider>
			<QuizContextProvider>
				<QuizStatics quiz={quiz} />
				<QuizContent quiz={quiz} />
				<QuizRanking quiz={quiz} />
			</QuizContextProvider>
		</AuthContextProvider>
	)
}

export async function getServerSideProps({ params }) {
	const quizRef = collection(db, "quizzes");
	const quiz = await getDoc(doc(quizRef, params.token));
	return { props: { quiz: quiz.data() } };	
}
