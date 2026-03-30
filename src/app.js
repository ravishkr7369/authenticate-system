import express from "express";
import authRoute from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import morgan from "morgan";


const app=express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoute);






export default app;