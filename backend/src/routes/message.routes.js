import express from "express";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controllers.js";
import { protectRoute } from "../middlewares/auth.middleware.js";


const router=express.Router();//used in to create a new router object;used to define routes and middleware. 


router.get("/users",protectRoute,getUsersForSidebar);

router.get("/:id",protectRoute,getMessages)

router.post("/send/:id",protectRoute,sendMessage);

export default router;