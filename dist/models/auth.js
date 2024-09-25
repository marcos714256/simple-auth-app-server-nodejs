import { Schema, model } from "mongoose";
const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    createdAt: { type: Date },
  },
  {
    versionKey: false,
  }
);
const User = model("User", UserSchema, "users");
export default User;
