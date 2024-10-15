import { Router } from "express";
import { login, register, logout, forgotPassword, resetPassword } from "./controller.js";
import validateData from "./middlewares/dataValidator.js";
import { registerSchema } from "./schemas.js";

const router = Router();

router.post("/login", login);
router.post("/register", validateData(registerSchema), register);
// router.get("/verify", verifyAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
