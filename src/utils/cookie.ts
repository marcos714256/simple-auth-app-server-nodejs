import { Response } from "express";

const setAuthCookie = (res: Response, name: string, value: string, maxAge: number) => {
  console.log("maxAge:", maxAge);

  const cookieOptions = {
    httpOnly: process.env.NODE_ENV !== "development",
    secure: process.env.NODE_ENV === "development",
    sameSite: false,
    maxAge: maxAge,
  };

  res.cookie(name, value, cookieOptions);
};

const removeAuthCookie = (res: Response, name: string) => {
  res.cookie(name, "", { maxAge: 0 });
};

export { setAuthCookie, removeAuthCookie };
