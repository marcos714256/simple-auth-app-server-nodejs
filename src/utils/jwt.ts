import jwt from "jsonwebtoken";

import { SECRET_KEY } from "../config/env.js";

export const generateAccessToken = (payload: { id: string }) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET_KEY, { expiresIn: "16d" }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
};
