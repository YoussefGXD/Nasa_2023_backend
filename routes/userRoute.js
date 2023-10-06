import express from "express";
const router = express.Router();
import { userController } from "../controllers/userAuth.js";

router.post("/register", userController.register);
router.post("/login", userController.login);

export const UserRouter = router;
