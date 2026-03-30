import dotenv from 'dotenv'
dotenv.config();


if(!process.env.PORT){
	throw new Error("Port is not defined in env file")
}


if (!process.env.MONGODB_URI) {
  throw new Error("MongoDB URI is not defined in env file");
}


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in env file");
}

if (!process.env.GOOGLE_USER) {
  throw new Error("GOOGLE_USER is not defined in env file");
}


if (!process.env.GOOGLE_USER_NAME) {
  throw new Error("GOOGLE_USER_NAME is not defined in env file");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not defined in env file");
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("GOOGLE_CLIENT_SECRET is not defined in env file");
}

if (!process.env.GOOGLE_REFRESH_TOKEN) {
  throw new Error("GOOGLE_REFRESH_TOKEN is not defined in env file");
}




const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_USER_NAME:process.env.GOOGLE_USER_NAME,
  GOOGLE_USER: process.env.GOOGLE_USER,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REFRESH_TOKEN: process.env.GOOGLE_REFRESH_TOKEN,
};


export default config;