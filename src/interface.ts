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

export { UserTypes, RegisterTypes };