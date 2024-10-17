import { NextFunction, Request, Response } from "express";

import { JWT_ACCESS_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME } from "../config/env.js";
import { CLIENT_SUCCES_MESSAGES } from "../constants.js";
import { validateUser, registerUser, sendResetLink, resetUserPassword } from "../services/authServices.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  try {
    const userSaved = await registerUser(email, password, name);

    const accessToken = await generateAccessToken({ id: userSaved._id });
    const refreshToken = await generateRefreshToken({ id: userSaved._id });

    res.cookie(JWT_ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 1 * 60 * 60 * 1000,
    });

    res.cookie(JWT_REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.registerSuccess });
  } catch (e) {
    next(e);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const userFound = await validateUser(email, password);

    const accessToken = await generateAccessToken({ id: userFound._id });
    const refreshToken = await generateRefreshToken({ id: userFound._id });

    res.cookie(JWT_ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie(JWT_REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.loginSuccess });
  } catch (e) {
    next(e);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie(JWT_ACCESS_TOKEN_NAME, "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
    });

    res.cookie(JWT_REFRESH_TOKEN_NAME, "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 0,
    });

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

    const accessToken = await generateAccessToken({ id: userReset._id });
    const refreshToken = await generateRefreshToken({ id: userReset._id });

    res.cookie(JWT_ACCESS_TOKEN_NAME, accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie(JWT_REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.passwordResetSuccess });
  } catch (e) {
    next(e);
  }
};

export { register, login, logout, forgotPassword, resetPassword };
