import User from "../userModel.js";
import { CLIENT_ERROR_MESSAGES } from "../constants.js";
import { hashPassword, validatePassword } from "../utils/bcrypt.js";
import { generateAccessToken, validateAccessToken } from "../utils/jwt.js";
import { IS_GITHUB_REPO, CLIENT_URL, GITHUB_REPO_NAME } from "../config/env.js";
import sgMail from "@sendgrid/mail";
import { decodedTokenTypes } from "../userInterfaces.js";

const registerUser = async (email: string, password: string, name: string) => {
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

const validateUser = async (email: string, password: string) => {
  const userFound = await User.findOne({ email });

  if (!userFound) throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);

  const isMatch = await validatePassword(password, userFound.password);

  if (!isMatch) throw new Error(CLIENT_ERROR_MESSAGES.passwordNotMath);

  return userFound;
};

const sendResetLink = async (email: string) => {
  let resetLink;

  const userFound = await User.findOne({ email });

  if (!userFound) throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);

  const accessToken = await generateAccessToken({ id: userFound._id });

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

const resetUserPassword = async (heeaderToken: string, newPassword: string) => {
  const decoded = (await validateAccessToken(heeaderToken)) as decodedTokenTypes;

  const userFound = await User.findById(decoded.id);

  if (!userFound) throw new Error(CLIENT_ERROR_MESSAGES.accountNotFound);

  const isMatch = await validatePassword(newPassword, userFound.password);

  if (isMatch) throw new Error(CLIENT_ERROR_MESSAGES.passwordIsMatch);

  const passwordHash = await hashPassword(newPassword, 10);

  const userReset = await User.findByIdAndUpdate(decoded.id, { password: passwordHash }, { new: true });

  return userReset;
};

export { registerUser, validateUser, sendResetLink, resetUserPassword };
