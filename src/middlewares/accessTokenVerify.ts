import jwt from "jsonwebtoken";
import { generateAccessToken, validateAccessToken, validateRefreshToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import User from "../userModel.js";
import {
  JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_NAME,
  JWT_REFRESH_SECRET_KEY,
  JWT_REFRESH_TOKEN_NAME,
} from "../config/env.js";
import { setAuthCookie, removeAuthCookie } from "../utils/cookie.js";

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.auth_refresh_token;
  const accessToken = req.cookies.auth_access_token;

  try {
    await validateAccessToken(accessToken, JWT_ACCESS_SECRET_KEY);
    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      try {
        const decoded = await validateRefreshToken(refreshToken, JWT_REFRESH_SECRET_KEY);

        if (decoded) {
          const userFound = await User.findOne({ _id: decoded.id });

          if (!userFound) return res.status(404).json({ error: "Error de autenticacion, vuelve a iniciar sesion" });

          const newAccessToken = await generateAccessToken({ id: userFound._id }, JWT_ACCESS_SECRET_KEY);

          setAuthCookie(res, JWT_ACCESS_TOKEN_NAME, newAccessToken, "1H");

          next();
        }
      } catch (e) {
        removeAuthCookie(res, JWT_REFRESH_TOKEN_NAME);

        res.status(401).json({ error: "Error de autenticacion, vuelve a iniciar sesion" });
      }
    }
  }
};

export default verifyAccessToken;
