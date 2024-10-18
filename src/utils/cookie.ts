import { Response } from "express";

// Tirar error si no se recibe "1h" o "7d"
const setAuthCookie = (res: Response, name: string, value: string, maxAgeString: string) => {
  let maxAgeNumber;
  // const localDate = new Date()

  if (maxAgeString === "1h") maxAgeNumber = 1 * 60 * 60 * 1000;
  if (maxAgeString === "7d") maxAgeNumber = 7 * 24 * 60 * 60 * 1000;

  console.log(maxAgeNumber)

  const cookieOptions = {
    httpOnly: process.env.NODE_ENV !== "development",
    secure: process.env.NODE_ENV !== "development",
    sameSite: false,
    maxAge: maxAgeNumber,
  };

  res.cookie(name, value, cookieOptions);
};

const removeAuthCookie = (res: Response, name: string) => {
  res.cookie(name, "", { maxAge: 0 });
};

export { setAuthCookie, removeAuthCookie };

// if (maxAge === "1h") Number(maxAge = 1 * 60 * 60 * 1000)
// if (maxAge === "1h") parseFloat(maxAge = 1 * 60 * 60 * 1000)
