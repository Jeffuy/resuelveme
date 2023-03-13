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



export default function QuizPage({ quiz }) {
	const [showRanking, setShowRanking] = useState(false);
	const [showStats, setShowStats] = useState(false);

	const showRankingDiv = () => {
		setShowStats(false);
		setShowRanking(!showRanking);
	}
	const showStatsDiv = () => {
		setShowRanking(false);
		setShowStats(!showStats);
	}

	return (
		<AuthContextProvider>
			<QuizContextProvider>
				<QuizContent quiz={quiz} />
				<div className="actionsContainerButtons">
					<button onClick={showRankingDiv} className="buttonShowRankStats">{'Show ranking'}</button>
					<button onClick={showStatsDiv} className="buttonShowRankStats">{'Show Statics'}</button>
				</div>
				<QuizStatics quiz={quiz} show={showStats} />
				<QuizRanking quiz={quiz} show={showRanking} />
			</QuizContextProvider>
		</AuthContextProvider>
	)
}

export async function getServerSideProps({ params }) {
	const quizRef = collection(db, "quizzes");
	const quiz = await getDoc(doc(quizRef, params.token));
	const createdAt = quiz.data().createdAt;
	let solvers = null
	if (quiz.data().solvers) {
		solvers = quiz.data().solvers;
		for (let i = 0; i < solvers.length; i++) {
			let date = solvers[i].date;
			if (typeof date === 'object') {
				solvers[i].date = date.toDate().toLocaleTimeString('es-UY', { year: 'numeric', month: 'long', day: 'numeric' });
			}
		}
		quiz.data().solvers = solvers;
	}

	return { props: { quiz: { ...quiz.data(), createdAt: createdAt.toDate().toLocaleTimeString('es-UY', { year: 'numeric', month: 'long', day: 'numeric' }), solvers: solvers } } };
}
