import jwt from "jsonwebtoken";
import { generateAccessToken, validateAccessToken, validateRefreshToken } from "../utils/jwt.js";
import { Request, Response, NextFunction } from "express";
import { decodedTokenTypes } from "../userInterfaces.js";
import User from "../userModel.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";
import { JWT_ACCESS_TOKEN_NAME, JWT_REFRESH_TOKEN_NAME } from "../config/env.js";

const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.auth_refresh_token;
  const accessToken = req.cookies.auth_access_token;

  try {
    await validateAccessToken(accessToken);
    next();
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      try {
        const decoded = (await validateRefreshToken(refreshToken)) as decodedTokenTypes;

        if (decoded) {
          const userFound = await User.findOne({ _id: decoded.id });

          if (!userFound) {
            throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);
          }

          const newAccessToken = await generateAccessToken({ id: userFound._id });

          res.cookie(JWT_ACCESS_TOKEN_NAME, newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1 * 60 * 60 * 1000,
          });

          next();
        }
      } catch (e) {
        console.error("Error lanzado por validateRefreshToken:", e);

        res.cookie(JWT_REFRESH_TOKEN_NAME, "", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 0,
        });

        res.status(401).json({ error: "Error de autenticacion, vuelve a iniciar sesion" });
      }
    }

    console.error("Error lanzado por validateAccessToken:", e);
  }
};

export default verifyAccessToken;

// Esto no es necesario creo
// La funcion del Middleware deberia ser verifyAccessToken no verifyAuth
// const verifyRefreshToken = async () => {
//   try {
//     const decoded = await validateRefreshToken(refreshToken);
//     console.log(decoded);
//     next();
//   } catch (e) {
//     // Aqui cerrar sesion
//     next(e); // Mandara al middleware si validateRefreshToken lanza un error
//   }
// };

// if (await validateRefreshToken(refreshToken)) {
//   const decoded = (await validateRefreshToken(refreshToken)) as decodedTokenTypes;

//   const userFound = await User.findOne({ _id: decoded.id });

//   if (!userFound) {
//     throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);
//   }

//   const newAccessToken = await generateAccessToken({ id: userFound._id });
//   console.log(newAccessToken);

//   // res.cookie(JWT_ACCESS_TOKEN_NAME, newAccessToken, {
//   //   httpOnly: true,
//   //   secure: true,
//   //   sameSite: "none",
//   //   maxAge: 16 * 24 * 60 * 60 * 1000,
//   // });

//   next();
// } else {
//   // Aqui cerrar sesion ya que hay un problema con el token de actualizacion
//   // Si no hay token next(), si esta alterado cerrar sesion
// }
