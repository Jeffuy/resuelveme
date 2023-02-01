import React from 'react'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@context/AuthContext";
import useQuiz from "@hooks/useQuiz";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@firebase/firebase";
import Image from 'next/image';



const QuizRanking = ({ quiz }) => {

	const [usersNeeded, setUsersNeeded] = useState([]);
	const [usersRanked, setUsersRanked] = useState([]);
	const [show, setShow] = useState(false);

	const { userQuizData, userQuizDataLoading, userQuizDataError, handleAnswer, timeLeft, setTimeLeft } = useQuiz(quiz);
	const { user, loading, userData, userDataLoading } = useContext(AuthContext);


	const usersToRank = async () => {
		if (quiz.solvers) {
			const users = [];
			for (let i = 0; i < quiz.solvers.length; i++) {
				users.push(quiz.solvers[i].user);
			}
			setUsersNeeded(users);
		}
	}


	const getUsersForRanking = async () => {
		const users = [];
		for (let i = 0; i < usersNeeded.length; i++) {
			const user = await getDoc(doc(db, "users", usersNeeded[i]));
			users.push(user.data());
		}
		setUsersRanked(users);
		setShow(true);
	}

	useEffect(() => {
		const sub = () => {
			if (usersNeeded.length === 0) {
				usersToRank();
			}
		}
		return sub();
	}, [usersNeeded])

	useEffect(() => {
		const sub = () => {
			if (usersNeeded.length > 0) {
				getUsersForRanking();
			}
		}
		return sub();
	}, [usersNeeded])


	if (loading || userQuizDataLoading || userDataLoading) {
		return <div>Loading...</div>;
	}

	if (userQuizDataError) {
		return <div>Error</div>;
	}

	return (
		<div className='rankingContainer'>
			<button onClick={usersToRank}>Ranking</button>
			{show &&
				<>
					{usersRanked.map((user, index) => {
						return (
							<div key={user.uid}>
								<div className="rankingItem">
									{
										index < 3 ? <p className={'rankingPosition ' + 'position'+index}>
														<i className='fa fa-award'></i>
													</p> : 
													<p className='rankingPosition'>{index + 1}°</p>
									}
									

									<div style={{ width: "45px", height: "45px", position: "relative" }} className="imageContainer">
										<Image src={user.profilePictureSmall} alt="profile picture" fill />
									</div>
									<div>
										<p>{user.username}</p>
										<p>Solved at: {quiz.solvers[index].date}</p>
									</div>
								</div>
								<hr />
							</div>
						)
					})}
				</>
			}
		</div>
	)
}

export default QuizRanking