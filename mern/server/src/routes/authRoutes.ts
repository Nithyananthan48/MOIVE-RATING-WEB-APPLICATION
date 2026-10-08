import { Router } from "express";
import { register, login, getMe, updateProfile } from "../controllers/authController.js";
import { authUser } from "../middleware/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authUser, getMe);
router.put("/profile", authUser, updateProfile);

export default router;
