/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	images: {
		domains: ['i.imgur.com', 'firebasestorage.googleapis.com'],
	},
	env: {
		//firebase
		FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
		FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
		FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
		FIREBASE_STORAGEBUCKET: process.env.FIREBASE_STORAGEBUCKET,
		FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID,
		FIREBASE_APPID: process.env.FIREBASE_APPID,
	},
};

module.exports = nextConfig;
