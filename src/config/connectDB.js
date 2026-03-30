import config from "./config.js";
import mongoose from "mongoose";

 export const connectDB=async()=>{
	try {
		await mongoose.connect(config.MONGODB_URI);
		console.log("Database is connected successfully")
	} catch (error) {
		console.log(error?.message)
	}
}