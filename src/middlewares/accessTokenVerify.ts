import jwt from "jsonwebtoken";
import { generateAccessToken, validateAccessToken, validateRefreshToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import User from "../userModel.js";
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TOKEN_NAME,
  ACCESS_TOKEN_COOKIE_EXPIRE_TIME,
} from "../config/env.js";
import { setAuthCookie, removeAuthCookie } from "../utils/cookie.js";

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.auth_refresh_token;
  const accessToken = req.cookies.auth_access_token;

  try {
    await validateAccessToken(accessToken, JWT_ACCESS_SECRET_KEY);
    next();
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      try {
        const decoded = await validateRefreshToken(refreshToken, JWT_REFRESH_SECRET_KEY);

        const userFound = await User.findOne({ _id: decoded.id });

        if (!userFound) {
          removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);

          res.status(404).json({ error: "Error de autenticacion, vuelve a iniciar sesion" });

          return;
        }

        const newAccessToken = await generateAccessToken({ id: userFound._id }, JWT_ACCESS_SECRET_KEY);

        setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, newAccessToken, ACCESS_TOKEN_COOKIE_EXPIRE_TIME);

        next();
      } catch (err) {
        removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);

        res.status(401).json({ error: "Error de autenticacion, vuelve a iniciar sesion" });

        // next(err)
      }
    }
  }
};

export default verifyAccessToken;
