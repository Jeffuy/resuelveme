"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from '@context/AuthContext'

export default function MainContent(){
	const { quizzes, quizzesLoading, quizzesError } = useContext(AuthContext)
	
	if (quizzesLoading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{quizzes.map((quiz) => (
				<div key={quiz.token}>
					<h1>{quiz.title}</h1>
					<p>{quiz.description}</p>
					<Link href="/quiz/[token]" as={`/quiz/${quiz.token}`}>
						Start Quiz
					</Link>
				</div>
			))}
		</div>
	);
};

