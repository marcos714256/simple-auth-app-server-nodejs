import User from "./model.js";
import { CLIENT_ERROR_MESSAGES } from "./constants.js";
import { RegisterTypes } from "./interfaces.js";
import { hashPassword } from "./utils/bcrypt.js";

const registerUser = async ({ email, password, name }: RegisterTypes) => {
  const userFound = await User.findOne({ email });

  if (userFound) {
    throw new Error(CLIENT_ERROR_MESSAGES.accountAlreadyExists);
  }

  const passwordHash = await hashPassword(password, 10);

  const newUser = new User({
    email,
    password: passwordHash,
    name,
  });

  const userSaved = await newUser.save();

  return userSaved;
};

export { registerUser };
