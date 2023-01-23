import React from 'react'
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import useQuiz from "@hooks/useQuiz";

const QuizRanking = ({ quiz }) => {

	const { userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft } = useQuiz(quiz);
	const { user, loading, userData, userDataLoading } = useContext(AuthContext);

	if (loading || userQuizDataLoading || userDataLoading) {
		return <div>Loading...</div>;
	}

	if (userQuizDataError) {
		return <div>Error</div>;
	}

	return (
		<div>
			<h1 style={
				{ color: "red", textAlign: "center", fontSize: "2rem", fontWeight: "bold", fontFamily: "sans-serif", textShadow: "2px 2px 2px black", background: "white", marginBottom: "60px" }
			}>RANKING</h1>
			<h2 style={{ color: "red", textAlign: "center", fontSize: "1.5rem", fontWeight: "bold", fontFamily: "sans-serif", textShadow: "2px 2px 2px black", background: "white" }}>
				DE VERDAD PENSASTE QUE YA IBA A HACER EL RANKING???? ANDA A MIMIR</h2>

			<h3 style={{ color: "red", textAlign: "center", fontSize: "1rem", fontWeight: "bold", fontFamily: "sans-serif", textShadow: "2px 2px 2px black", background: "white", marginTop: "50px" }}>
				TE QUIERO 💚</h3>
		</div>
	)
}

export default QuizRanking