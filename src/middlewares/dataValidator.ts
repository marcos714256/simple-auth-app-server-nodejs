import { ZodError, ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

const validateData = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(400).json({ error: e.errors.map((e) => e.message) });
    }
  }
};

export default validateData;
