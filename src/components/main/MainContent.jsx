"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from '@context/AuthContext'

export default function MainContent() {
	const { quizzes, quizzesLoading, quizzesError, user, loading } = useContext(AuthContext)

	if (quizzesLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{user && <><h1>Welcome {user.username}</h1>

				{quizzes.map((quiz) => (
					<div key={quiz.token}>
						<h1>{quiz.title}</h1>
						<p>{quiz.description}</p>
						<Link href="/quiz/[token]" as={`/quiz/${quiz.token}`}>
							Start Quiz
						</Link>
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

