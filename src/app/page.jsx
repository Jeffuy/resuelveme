import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	return (
		<main className={styles.main}>
			<Link passHref href="/register">
				Register
			</Link>
			<Link passHref href="/login">
				Login
			</Link>
			<div>
				<Link href="/quiz/[token]" as={`/quiz/kPxvZ1swgyACLP14CzgrG5LLO8gqf9Yj`}>
					Go to quiz
				</Link>
			</div>
		</main>
	);
}
