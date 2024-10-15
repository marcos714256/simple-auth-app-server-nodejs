import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
// import { VerifyErrors, NotBeforeError, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { CLIENT_ERROR_MESSAGES } from "../constants";
import jwt from "jsonwebtoken";

const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return next();
  } else if (err instanceof jwt.JsonWebTokenError) {
    console.error(err);
    return res.status(401).json({ error: CLIENT_ERROR_MESSAGES.authError })
  } else {
    console.error(err);
    return res.status(500).json({ error: CLIENT_ERROR_MESSAGES.unknownError });
  }
};

export default handleError;
