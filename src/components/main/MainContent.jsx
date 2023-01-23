"use client";
import "@styles/main.css";
import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from '@context/AuthContext'
import { QuizContext } from "@context/QuizContext";

export default function MainContent() {
	const { user, loading } = useContext(AuthContext)
	const { quizzes, quizzesLoading } = useContext(QuizContext)

	if (quizzesLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="containerMain">
			{user && <>
				<h1>Welcome {user.username}</h1>
				{quizzes.map((quiz) => (
					<div key={quiz.token} className="quizCard">
						<h1>{quiz.title}</h1>
						<p>{quiz.description}</p>
						{/* <p>{quiz.questions.length} questions</p>
						<p>Lifes: {quiz.amountLife}</p>
						<p>{quiz.players?.length || 0} Players</p>
						<p>{quiz.solvers?.length || 0} Solvers</p>
						<p>Success attempts: {quiz.successAttempts || 0}</p>
						<p>Attempts: {quiz.attempts || 0}</p> */}
						<div className="createdByAndLinkContainer">
							<p>Created by: <span>{quiz.createdBy}</span></p>
							<Link href="/quiz/[token]" as={`/quiz/${quiz.token}`}>
								Start Quiz
							</Link>
						</div>
					</div>
				))}
			</>}

			{!user &&
				<>
					<h1>Welcome to Quiz App</h1>
					<p>Please <Link href="/login">
						Login
					</Link> or <Link href="/register">
							Register{' '}
						</Link>
						to start a quiz</p>
				</>}


		</div>
	);
};

