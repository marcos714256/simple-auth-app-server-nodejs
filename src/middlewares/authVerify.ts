import { JsonWebTokenError } from "jsonwebtoken";
import { generateAccessToken, validateAccessToken, validateRefreshToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import { decodedTokenTypes } from "../interfaces.js";
import User from "../model.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";
import { JWT_ACCESS_TOKEN_NAME } from "../config/env.js";

const verifyAuth = (err: any, req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.auth_refresh_token;
  const accessToken = req.cookies.auth_access_token;

  // Esto no es necesario creo
  // La funcion del Middleware deberia ser verifyAccessToken no verifyAuth
  const verifyRefreshToken = async () => {
    try {
      const decoded = await validateRefreshToken(refreshToken);
      console.log(decoded);
      next();
    } catch (e) {
      // Aqui cerrar sesion
      next(e); // Mandara al middleware si validateRefreshToken lanza un error
    }
  };

  const verifyAccessToken = async () => {
    try {
      const decoded = (await validateAccessToken(accessToken)) as decodedTokenTypes;
      console.log(decoded);
      next();
    } catch (e) {
      // Si hay algun un error con el token de acceso:

      if (e instanceof JsonWebTokenError) {
        if (await validateRefreshToken(refreshToken)) {
          const decoded = (await validateAccessToken(accessToken)) as decodedTokenTypes;

          const userFound = await User.findOne({ _id: decoded.id });

          if (!userFound) {
            throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);
          }

          const newAccessToken = await generateAccessToken({ id: userFound._id });
          console.log(newAccessToken);

          res.cookie(JWT_ACCESS_TOKEN_NAME, newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 16 * 24 * 60 * 60 * 1000,
          });

          next();
        } else {
          // Aqui cerrar sesion ya que hay un problema con el token de actualizacion
        }
      }

      next(e);
    }
  };

  verifyAccessToken();
};

export default verifyAuth;
