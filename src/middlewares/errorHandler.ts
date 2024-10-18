import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { CLIENT_ERROR_MESSAGES } from "../constants";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError";

const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    next();
  } else if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({ error: CLIENT_ERROR_MESSAGES.authError });
  } else if (err instanceof AppError) {
    console.error(err);
    res.status(err.statusCode).json({ error: err.getMessage() });
  }
};

export default handleError;
