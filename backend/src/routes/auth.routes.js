import express from "express";
import { signup, login, logout, updateProfile, checkAuth} from "../controllers/auth.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";


const router=express.Router();//used in to create a new router object;used to define routes and middleware. 

router.post("/signup",signup);

router.post("/login",login);

router.post("/logout",logout);

router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,checkAuth);//called whenever refreshed


export default router;