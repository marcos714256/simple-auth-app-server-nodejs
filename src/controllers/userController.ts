import { Request, Response } from "express";

const updatePassword = async (req: Request, res: Response) => {
  res.send("Password updated!");
};

export { updatePassword };
