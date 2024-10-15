import jwt from "jsonwebtoken";

import { JWT_ACCESS_SECRET_KEY, JWT_REFRESH_SECRET_KEY } from "../config/env.js";

const generateAccessToken = (payload: { id: string }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_ACCESS_SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const generateRefreshToken = (payload: { id: string }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, JWT_REFRESH_SECRET_KEY, { expiresIn: "7d" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const validateAccessToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_ACCESS_SECRET_KEY, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

const validateRefreshToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_REFRESH_SECRET_KEY, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};

export { generateAccessToken, generateRefreshToken, validateAccessToken, validateRefreshToken };

/*

Refresh token:

- Revocable
- Durarero
- Seguro

Al iniciar sesion se envian ambos token

SI se accede a la pagina de configuracion y no se tiene un access token se genera otro mediante el refresh token es valido

El refresh token es solo para generar mas access token, no se envia en cada solicitud (a menos que no haya un access token)

Si el refresh token no se usa durante un tiempo se invalida

Cada vez que se genera un access token tambien mandar un nuevo refresh token?

Si se cambia la contraseña invalidar el refresh token

Renovar cada vez que expira un refresh token durante 6 periodos 

Cookie name:
auth_refresh_token
auth_acceses_token

En una sola peticion el middleware verifica los token, si el de access no esta, verifica que el de actualizacion sea
valido, si lo es lo crea y continua, si no manda el error a handleError y cierra sesion

Primero pasa por verifyAuth si hay error se manda a handleError

*/
