/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	images: {
		domains: ['i.imgur.com', 'firebasestorage.googleapis.com', "placehold.co"],
	},
	env: {
		//firebase
		FIREBASE_APIKEY: process.env.FIREBASE_APIKEY,
		FIREBASE_AUTHDOMAIN: process.env.FIREBASE_AUTHDOMAIN,
		FIREBASE_PROJECTID: process.env.FIREBASE_PROJECTID,
		FIREBASE_STORAGEBUCKET: process.env.FIREBASE_STORAGEBUCKET,
		FIREBASE_MESSAGINGSENDERID: process.env.FIREBASE_MESSAGINGSENDERID,
		FIREBASE_APPID: process.env.FIREBASE_APPID,
		FIREBASE_APIKEY_DEV: process.env.FIREBASE_APIKEY_DEV,
		FIREBASE_AUTHDOMAIN_DEV: process.env.FIREBASE_AUTHDOMAIN_DEV,
		FIREBASE_PROJECTID_DEV: process.env.FIREBASE_PROJECTID_DEV,
		FIREBASE_STORAGEBUCKET_DEV: process.env.FIREBASE_STORAGEBUCKET_DEV,
		FIREBASE_MESSAGINGSENDERID_DEV: process.env.FIREBASE_MESSAGINGSENDERID_DEV,
		FIREBASE_APPID_DEV: process.env.FIREBASE_APPID_DEV,
	},
};

module.exports = nextConfig;
