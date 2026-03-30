import {Router} from "express";
import { login, logout, logoutAll, register, verifyUser } from "../controllers/auth.controller.js";

const router=Router();

router.post("/register",register)
router.post("/login",login)
router.get("/verify-user",verifyUser)
router.get("/logout",logout)
router.get("/logout-all",logoutAll)


export default router;
