import { NextFunction, Request, Response } from "express";

import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TOKEN_NAME,
} from "../config/env.js";
import { CLIENT_SUCCES_MESSAGES } from "../constants.js";
import { validateUser, registerUser, sendResetLink, resetUserPassword } from "../services/authServices.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { removeAuthCookie, setAuthCookie } from "../utils/cookie.js";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body;

    if (req.cookies.auth_access_token) removeAuthCookie(res, JWT_ACCESS_TOKEN_NAME);
    if (req.cookies.auth_refresh_token) removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);

    const userSaved = await registerUser(email, password, name);

    const accessToken = await generateAccessToken({ id: userSaved._id }, JWT_ACCESS_SECRET_KEY);
    const refreshToken = await generateRefreshToken({ id: userSaved._id }, JWT_REFRESH_SECRET_KEY);

    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, "1h");
    setAuthCookie(res, JWT_REFRESH_TOKEN_NAME, refreshToken, "7d");

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.registerSuccess });
  } catch (e) {
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (req.cookies.auth_access_token) removeAuthCookie(res, JWT_ACCESS_TOKEN_NAME);
    if (req.cookies.auth_refresh_token) removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);

    const userFound = await validateUser(email, password);

    const accessToken = await generateAccessToken({ id: userFound._id }, JWT_ACCESS_SECRET_KEY);
    const refreshToken = await generateRefreshToken({ id: userFound._id }, JWT_REFRESH_SECRET_KEY);

    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, "1h");
    setAuthCookie(res, JWT_REFRESH_TOKEN_NAME, refreshToken, "7d");

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.loginSuccess });
  } catch (e) {
    next(e);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    removeAuthCookie(res, JWT_ACCESS_TOKEN_NAME);
    removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.logoutSuccess });
  } catch (e) {
    next(e);
  }
};

const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const email = req.body.email;

    sendResetLink(email);

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.linkSent });
  } catch (e) {
    next(e);
  }
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newPassword = req.body.newPassword;
    const heeaderToken = req.headers.authorization?.split(" ")[1] as string;

    const userReset = await resetUserPassword(heeaderToken, newPassword);

    const accessToken = await generateAccessToken({ id: userReset._id }, JWT_ACCESS_SECRET_KEY);
    const refreshToken = await generateRefreshToken({ id: userReset._id }, JWT_REFRESH_SECRET_KEY);

    setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, accessToken, "1h");
    setAuthCookie(res, JWT_REFRESH_TOKEN_NAME, refreshToken, "7d");

    return res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.passwordResetSuccess });
  } catch (e) {
    next(e);
  }
};

export { register, login, logout, forgotPassword, resetPassword };
