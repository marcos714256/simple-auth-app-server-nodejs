import { Router } from "express";

import { updatePassword } from "../controllers/userController";
import verifyAccessToken from "../middlewares/accessTokenVerify";

const router = Router();

router.post("/update-password", verifyAccessToken, updatePassword);
// router.post("/delete-account", verifyAccessToken, deleteAccount);

export default router;
