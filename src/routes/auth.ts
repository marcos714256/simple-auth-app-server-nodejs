import { Router } from "express";
import {
  login,
  register,
  verifyAccessToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify", verifyAccessToken);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
