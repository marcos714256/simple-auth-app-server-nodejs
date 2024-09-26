import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";
import { z } from "zod";
import { SECRET_KEY, TOKEN_NAME, CLIENT_URL, IS_GITHUB_REPO, GITHUB_REPO_LINK } from "../config.js";
import User from "../models/auth.js";
import { registerSchema, loginSchema, resetPasswordSchema } from "../schemas/auth.js";
import { CLIENT_ERROR_MESSAGES, CLIENT_SUCCES_MESSAGES } from "../constans.js";
const register = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        registerSchema.parse({ email, password, name });
        const userFound = await User.findOne({ email });
        if (userFound) {
            res.status(400).json({ message: CLIENT_ERROR_MESSAGES.accountAlreadyExists });
            return;
        }
        const passwordHash = await hash(password, 10);
        const newUser = new User({
            email,
            password: passwordHash,
            name,
        });
        const userSaved = await newUser.save();
        const generateAccessToken = async (payload) => {
            return jwt.sign(payload, SECRET_KEY, { expiresIn: "16d" });
        };
        const token = await generateAccessToken({ id: userSaved._id });
        res.cookie(TOKEN_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 16 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.registerSuccess });
    }
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error(e.errors.map((e) => e.message));
            return res.status(400).json({
                message: CLIENT_ERROR_MESSAGES.invalidData,
            });
        }
        console.error(e);
        res.status(500).json({ message: CLIENT_ERROR_MESSAGES.unknownError });
    }
};
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        loginSchema.parse({ email, password });
        const userFound = await User.findOne({ email });
        if (!userFound) {
            res.status(400).json({ message: CLIENT_ERROR_MESSAGES.accountnotFound });
            return;
        }
        const isMatch = await compare(password, userFound.password);
        if (!isMatch) {
            res.status(400).json({ message: CLIENT_ERROR_MESSAGES.incorrectPassword });
            return;
        }
        const generateAccessToken = async (payload) => {
            return jwt.sign(payload, SECRET_KEY, { expiresIn: "16d" });
        };
        const token = await generateAccessToken({ id: userFound._id });
        res.cookie(TOKEN_NAME, token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 16 * 24 * 60 * 60 * 1000,
        });
        res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.loginSuccess });
    }
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error(e.errors.map((e) => e.message));
            return res.status(400).json({
                message: CLIENT_ERROR_MESSAGES.invalidData,
            });
        }
        console.error(e);
        res.status(500).json({ message: CLIENT_ERROR_MESSAGES.unknownError });
    }
};
const verifyAccessToken = async (req, res) => {
    const token = req.cookies.auth_token;
    if (!token) {
        res.status(401).json({ message: CLIENT_ERROR_MESSAGES.authError });
        return;
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (typeof decoded === "string")
            return console.log("String");
        const userFound = await User.findById(decoded.id);
        if (!userFound) {
            res.status(400).json({ message: CLIENT_ERROR_MESSAGES.accountnotFound });
            return;
        }
        return res.status(200).json({
            id: userFound._id,
            name: userFound.name,
            email: userFound.email,
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: CLIENT_ERROR_MESSAGES.unknownError });
    }
};
const logout = async (req, res) => {
    try {
        res.cookie(TOKEN_NAME, "", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            expires: new Date(0),
        });
        res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.logoutSuccess });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: CLIENT_ERROR_MESSAGES.unknownError });
    }
};
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    let resetLink;
    try {
        const userFound = await User.findOne({ email });
        if (!userFound) {
            res.status(400).json({ message: CLIENT_ERROR_MESSAGES.accountnotFound });
            return;
        }
        const generateAccessToken = async (payload) => {
            return jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
        };
        const token = await generateAccessToken({ id: userFound._id });
        if (IS_GITHUB_REPO) {
            resetLink = `${CLIENT_URL}/${GITHUB_REPO_LINK}/reset-password.html?token=${token}`;
        }
        else {
            resetLink = `${CLIENT_URL}/reset-password.html?token=${token}`;
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
        res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.linkSent });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: CLIENT_ERROR_MESSAGES.unknownError });
    }
};
const resetPassword = async (req, res) => {
    const { newPassword, confirmNewPassword } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: CLIENT_ERROR_MESSAGES.authError });
    }
    try {
        resetPasswordSchema.parse({ newPassword, confirmNewPassword });
        const decoded = jwt.verify(token, SECRET_KEY);
        if (typeof decoded === "string") {
            res.status(404).json({ message: CLIENT_ERROR_MESSAGES.unknownError });
            return;
        }
        const userFound = await User.findById(decoded.id);
        if (!userFound) {
            res.status(400).json({ message: CLIENT_ERROR_MESSAGES.unknownError });
            return;
        }
        const isMatch = await compare(newPassword, userFound.password);
        if (isMatch) {
            res.status(400).json({ message: CLIENT_ERROR_MESSAGES.passwordIsMatch });
            return;
        }
        const passwordHash = await hash(newPassword, 10);
        await User.findByIdAndUpdate(decoded.id, { password: passwordHash }, { new: true });
        return res.status(200).json({ message: CLIENT_SUCCES_MESSAGES.passwordResetSuccess });
    }
    catch (e) {
        if (e instanceof z.ZodError) {
            console.error(e.errors.map((e) => e.message));
            return res.status(400).json({
                message: CLIENT_ERROR_MESSAGES.invalidData,
            });
        }
        if (e instanceof jwt.JsonWebTokenError) {
            console.error(e);
            return res.status(401).json({ message: CLIENT_ERROR_MESSAGES.invalidToken });
        }
        console.error(e);
        res.status(500).json({ message: CLIENT_ERROR_MESSAGES.unknownError });
    }
};
export { register, login, verifyAccessToken, logout, forgotPassword, resetPassword };
