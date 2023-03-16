"use client"
import React, { useContext, useState, useEffect } from 'react';
import Compressor from 'compressorjs';
import { AuthContext } from '@context/AuthContext';
import { useRouter } from 'next/navigation';
import { storage, auth, db } from '@firebase/firebase.js';
import { ref as storageRef, getDownloadURL, uploadBytes } from 'firebase/storage';
import { useUpdateProfile } from 'react-firebase-hooks/auth';
import { doc, updateDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';


const DashboardMain = () => {
	const router = useRouter();
	const { user, loading, logout, userData, userDataLoading } = useContext(AuthContext);

	//const profilePicture = storageRef(storage, `users/${user?.uid}/profilePicture.jpeg`);

	//const profilePictureSmall = storageRef(storage, `users/${user?.uid}/profilePictureSmall.jpeg`);
	const [edit, setEdit] = useState(false);

	// eslint-disable-next-line no-unused-vars
	const [updateProfile, updating, updateProfileError] = useUpdateProfile(auth);


	const [selectedFile, setSelectedFile] = useState(null);
	const [previewURLimage, setPreviewURLimage] = useState('');
	const [username, setUsername] = useState(userData?.username);

	const [error, setError] = useState("");

	async function updatePhotoSmall(photoSmall) {
		await updateDoc(doc(db, 'users', user.uid), { profilePictureSmall: photoSmall });
	}

	async function updatePhotoUrl(photoURL) {
		await updateDoc(doc(db, 'users', user.uid), { profilePicture: photoURL });
	}

	const upload = async (selectedFile, size) => {
		if (selectedFile) {
			let ref;
			if (size == 'big') {
				ref = storageRef(storage, `users/${user?.uid}/profilePicture.jpeg`);
			} else if (size == 'small') {
				ref = storageRef(storage, `users/${user?.uid}/profilePictureSmall.jpeg`);
			}
			const result = await uploadBytes(ref, selectedFile).then(snapshot => {
				getDownloadURL(snapshot.ref).then(url => {
					if (size == 'big') {
						updateProfile({ photoURL: url });
						updatePhotoUrl(url);
					} else if (size == 'small') {
						updatePhotoSmall(url);
					}
				});
			});
			if (result) {
				console.count('DONE');
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (username != userData?.username && username != '') {
			await updateDoc(doc(db, 'users', user.uid), { username: username });
		}

		console.log(e);
		if (selectedFile) {
			const image = selectedFile;
			new Compressor(image, {
				quality: 0.2,
				success: compressedResult => {
					upload(compressedResult, 'big');
				},
			});

			const imageSmall = selectedFile;
			new Compressor(imageSmall, {
				quality: 0.05,
				success: compressedResult2 => {
					upload(compressedResult2, 'small');
				},
			});
			setSelectedFile(null);
		}
		else {
			console.log("no cambio la imagen")
		}
		setEdit(!edit);
	}


	// useEffect(() => {
	// 	if (userData) {
	// 		userData?.profilePicture === "https://firebasestorage.googleapis.com/v0/b/resuelveme-dev.appspot.com/o/users%2Fundefined%2FprofilePicture.jpeg?alt=media&token=8ba8c063-44ab-4831-be3e-c0c9542ed826" ? null :
	// 			getDownloadURL(profilePicture).then(url => setImageURL(url));
	// 	}
	// }, [userData?.profilePicture])

	if (loading || userDataLoading) {
		return <div className="loaderContainer"><span className="loader"></span></div>;
	}

	if (!user) {
		router.push('/login');
		return <div className="loaderContainer"><span className="loader"></span></div>;
	}

	const openFileSelected = async () => {
		document.getElementById('inputFile').click();
	}

	const cancelEdit = async () => {
		setPreviewURLimage('');
		setEdit(!edit);
	}

	return (
		<>
			<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" />
			<div className='containerDiv'>
				{userData &&
					<div className="imageContainer">
						<Image priority src={userData.profilePicture && previewURLimage == '' ? userData.profilePicture : previewURLimage} width={200} height={200} alt="profile picture" />
						{edit && <button type="button" onClick={openFileSelected}>
							<i className="fa fa-pencil"></i>
						</button>}
					</div>
				}

				{!edit && user && <h1>{userData?.username}</h1>}
				{!edit && user &&
					<>
						<li><label className='dataLabel'>Member Since : <span>{userData?.createdAt?.toDate().toLocaleDateString('es-ES')}</span></label></li>
						<li><label className='dataLabel'>Solved Quizzes : <span>{userData?.solvedQuizzes?.length || 0}</span></label></li>
						<li><label className='dataLabel'>Created Quizzes : <span>{userData?.createdQuizzes?.length || 0}</span></label></li>
						<li><label className='dataLabel'>Played Quizzes : <span>{userData?.playedQuizzes?.length || 0}</span></label></li>
						<li><label className='dataLabel'>Total attempts : <span>{userData?.attempts || 0}</span></label></li>
						<li><label className='dataLabel'>Correct attempts : <span>{userData?.successAttempts || 0}</span></label></li>
						<li><label className='dataLabel'>Correct answers ratio : <span>{userData?.attempts ? Math.round((userData?.successAttempts / userData?.attempts) * 100) : 0}%</span></label></li>
						<li><label className='dataLabel'>Solved ratio : <span>
							{userData?.solvedQuizzes?.length ? Math.round((userData?.solvedQuizzes.length / userData?.playedQuizzes?.length) * 100) : 0}
							%</span></label></li>

						{/* TODO: ARREGLAR ESTILO DE CREAR QUIZ */}
						<Link href="/create" prefetch={false} style={{ background: 'red', fontSize: '6.5rem' }}>
							Create a Quiz
						</Link>

						{/* TODO: CREAR SECCION DE VER QUIZ CREADOS */}
						<Link href="/create" style={{ background: 'red', fontSize: '6.5rem' }}>
							Ver mis quiz
						</Link>
					</>
				}

				<form onSubmit={handleSubmit} className={edit ? 'editForm' : null} >
					<input type="file" onChange={e => {
						const file = e.target.files ? e.target.files[0] : undefined;
						setSelectedFile(file);
						setPreviewURLimage(URL.createObjectURL(file));
					}}
						id="inputFile"
						style={{ display: 'none' }}
					/>
					{error && <p>{error}</p>}
					{edit && user &&
						<>
							<label htmlFor="">Username</label>
							<input type="text" defaultValue={userData.username} onChange={e => setUsername(e.target.value)} />
							{/* <label htmlFor="">Email</label>
							<input type="text" />
							<label htmlFor="">New password</label>
							<input type="password" />
							<label htmlFor="">Repeat new password</label>
							<input type="password" /> */}
						</>
					}
					<input type="submit" style={{ display: 'none' }} id="submitButton" />
				</form>
				<div className="actionsContainer">
					{user && !edit && <button onClick={() => setEdit(!edit)} className="edit">Edit</button>}
					{user && edit && <button onClick={cancelEdit} className="edit">Cancel</button>}
					{edit && user && <button onClick={() => document.getElementById('submitButton').click()} className="save">Save</button>}
					{user && !edit && <button onClick={() => logout()} className="logout">Logout</button>}
				</div>
			</div>
		</>
	);
};

export default DashboardMain;
