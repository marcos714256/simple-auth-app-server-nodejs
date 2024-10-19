import User from "../userModel.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";
import { hashPassword, validatePassword } from "../utils/bcrypt.js";
import { generateAccessToken, validateAccessToken } from "../utils/jwt.js";
import { IS_GITHUB_REPO, CLIENT_URL, GITHUB_REPO_NAME, JWT_ACCESS_SECRET_KEY } from "../config/env.js";
import sgMail from "@sendgrid/mail";
import { UserTypes } from "../userInterfaces.js";
// import {AppError} from "../utils/criticalErrorHandler.js";
// import { MongooseError } from "mongoose";

const registerUser = async (email: string, password: string, name: string): Promise<UserTypes> => {
  const userFound = await User.findOne({ email });

  if (userFound) throw new Error(CLIENT_ERROR_MESSAGES.accountAlreadyExists);

  const passwordHash = await hashPassword(password, 10);

  const newUser = new User({
    email,
    password: passwordHash,
    name,
  });

  const userSaved = await newUser.save();

  return userSaved;
};

const validateUser = async (email: string, password: string): Promise<UserTypes> => {
  const userFound = await User.findOne({ email });

  if (!userFound) throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);

  const isMatch = await validatePassword(password, userFound.password);

  if (!isMatch) throw new Error(CLIENT_ERROR_MESSAGES.incorrectPassword);

  return userFound;
};

const sendResetLink = async (email: string) => {
  let resetLink: string;

  const userFound = await User.findOne({ email });

  if (!userFound) throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);

  const accessToken = await generateAccessToken({ id: userFound._id }, JWT_ACCESS_SECRET_KEY);

  if (IS_GITHUB_REPO) {
    resetLink = `${CLIENT_URL}/${GITHUB_REPO_NAME}/reset-password.html?token=${accessToken}`;
  } else {
    resetLink = `${CLIENT_URL}/reset-password.html?token=${accessToken}`;
  }

  const msg = {
    to: email,
    from: "destructordemundos3@outlook.com",
    subject: "Restablecer contraseña",
    html: `
      <h1>Restablece tu contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">Restablecer contraseña</a>
      <p>Este enlace es válido por 1 hora.</p>
    `,
  };

  await sgMail.send(msg);
};

const resetUserPassword = async (heeaderToken: string, newPassword: string): Promise<UserTypes> => {
  const decoded = await validateAccessToken(heeaderToken, JWT_ACCESS_SECRET_KEY);

  const userFound = await User.findById(decoded.id);

  if (!userFound) throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);

  const isMatch = await validatePassword(newPassword, userFound.password);

  if (isMatch) throw new Error(CLIENT_ERROR_MESSAGES.passwordIsMatch);

  const passwordHash = await hashPassword(newPassword, 10);

  const userReset = (await User.findByIdAndUpdate(decoded.id, { password: passwordHash }, { new: true })) as UserTypes;

  return userReset;
};

export { registerUser, validateUser, sendResetLink, resetUserPassword };
