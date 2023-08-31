
import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import MainContent from "@components/main/MainContent";
import { AuthContextProvider } from "@context/AuthContext";
import { QuizContextProvider } from "@context/QuizContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<AuthContextProvider>
			<QuizContextProvider>
				<main className={styles.main}>
					<MainContent />
				</main>
			</QuizContextProvider>
		</AuthContextProvider>
	);
}
