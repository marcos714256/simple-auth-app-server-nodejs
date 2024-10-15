import { Date } from "mongoose";

interface UserTypes {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  _id: string;
}

interface RegisterTypes {
  email: string;
  password: string;
  name: string;
}

interface decodedTokenTypes {
  id: string;
  iat: number;
  exp: number;
}

export { UserTypes, RegisterTypes, decodedTokenTypes };
