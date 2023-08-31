"use client"

import React, { useState, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AuthContext } from '@context/AuthContext';
import "@styles/navbar.css"
import "@styles/create.css"

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const { user, userData, loading } = useContext(AuthContext);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<nav className="navbar-container">
			<div className="navbar-logo">
				<Link href="/">
					Resuelve-Me
				</Link>
			</div>
			<div
				className={`navbar-hamburger${isOpen ? ' navbar-hamburger-active' : ''}`}
				onClick={toggleMenu}
			>
				{/* <div className="navbar-line" />
				<div className="navbar-line" />
				<div className="navbar-line" /> */}
				<i className="fa fa-bars  fa-xl" style={{ color: 'white' }} size="large"></i>
			</div>
			<ul className={`navbar-menu${isOpen ? ' navbar-menu-active' : ' navbar-menu-inactive'}`}>
				{user ? (
					<>
						<li>
							<Link className="navbar-link" href="/">
								Home
							</Link>
						</li>
						<li>
							<Link className="navbar-link" href="/dashboard">
								Dashboard
							</Link>
						</li>
						<li className="navbar-avatar">
							<Image src={userData ? userData.profilePictureSmall : "https://placehold.co/40x40"} alt="User Avatar" width={40} height={40} />
						</li>
					</>
				) : (
					<>
						<li>
							<Link className="navbar-link" href="/">
								Home
							</Link>
						</li>
						<li>
							<Link className="navbar-link" href="/login">
								Login
							</Link>
						</li>
						<li>
							<Link className="navbar-link" href="/register">
								Register
							</Link>
						</li>
					</>
				)}
			</ul>
		</nav>
	);
};

export default Navbar;