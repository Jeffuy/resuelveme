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
		return <div className="loaderContainer"><span className="loader"></span></div>;
	}

	return (
		<>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
			<div className="containerMain">
				{user && <>
					{quizzes.map((quiz) => (
						<div key={quiz.token} className="quizCard">
							<div className="titleContainer">
								<i className="fa fa-star"></i>
								<h1>{quiz.title}</h1>
								<i className="fa fa-star"></i>
							</div>
							<p className="description">{quiz.description}</p>
							<p><i className="fa-regular fa-circle-question"></i>{quiz.questions.length} Total questions</p>
							<div className="questionsInfo">
								<p><i className="fa fa-retweet"></i>Attemps {quiz.attempts || 0}</p>
								<p><i className="fa-regular fa-circle-check successAttemps"></i>Success {quiz.successAttempts || 0}</p>
							</div>
							<div className="usersInfo">
								<div className="userInfoItemContainer">
									<p className="icon"><i className="fa fa-user"></i></p>
									<p className="number">{quiz.players?.length || 0}</p>
									<p className="players">Players</p>
								</div>
								<div className="userInfoItemContainer">
									<p className="icon"><i className="fa fa-award solvesPlayers"></i></p>
									<p className="number">{quiz.solvers?.length || 0}</p>
									<p className="players">Solvers</p>
								</div>
								<div className="userInfoItemContainer">
									<p className="icon"><i className="fa fa-heart lifes"></i></p>
									<p className="number">{quiz.amountLife}</p>
									<p className="players">Lifes</p>
								</div>
							</div>
							<div className="createdByAndLinkContainer">
								<p>Created by: <span>{quiz.createdBy}</span><br /><span className="createdAt">{quiz.createdAt.toDate().toLocaleDateString('es-ES')}</span></p>
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
		</>
	);
};

