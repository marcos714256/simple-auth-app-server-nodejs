"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.verifyAccessToken = exports.register = exports.login = void 0;
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_1 = require("../config");
const auth_1 = __importDefault(require("../models/auth"));
const login = async (req, res) => {
    const { email, password } = req.body;
    const userFound = await auth_1.default.findOne({ email });
    if (!userFound) {
        // "Este usuario no existe."
        res.status(400).json({ message: 'Contraseña incorrecta.' });
        return;
    }
    const isMatch = await (0, bcrypt_1.compare)(password, userFound.password);
    if (!isMatch) {
        res.status(400).json({ message: 'Contraseña incorrecta.' });
        return;
    }
    const generateToken = async (payload) => {
        return jsonwebtoken_1.default.sign(payload, config_1.SECRET_KEY, { expiresIn: '16d' });
    };
    const token = await generateToken({ userId: userFound._id });
    res.header('Authorization', `Bearer ${token}`);
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    // process.env.NODE_ENV === "production"
    res.status(200).json({ message: 'Sesion iniciada' });
};
exports.login = login;
const register = async (req, res) => {
    const { email, password, name } = req.body;
    const userFound = await auth_1.default.findOne({ email });
    if (userFound) {
        res.status(400).json({ message: 'Esta cuenta ya existe.' });
        return;
    }
    const passwordHash = await (0, bcrypt_1.hash)(password, 0);
    const newUser = new auth_1.default({
        email,
        password: passwordHash,
        name,
    });
    const userSaved = await newUser.save();
    const generateToken = async (payload) => {
        return jsonwebtoken_1.default.sign(payload, config_1.SECRET_KEY, { expiresIn: '16d' });
    };
    const token = await generateToken({ userId: userSaved._id });
    console.log('token:', token);
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    });
    // process.env.NODE_ENV === "production"
    res.status(200).json({ message: 'Cuenta creada' });
};
exports.register = register;
const verifyAccessToken = async (req, res) => {
    const userToken = req.cookies['auth_token'];
    if (!userToken) {
        res.status(401).json({ message: 'Token no encontrado.' });
        return;
    }
    jsonwebtoken_1.default.verify(userToken, config_1.SECRET_KEY, async (error, user) => {
        if (error)
            return res.sendStatus(401);
        const userFound = await auth_1.default.findById(user.userId);
        if (!userFound)
            return res.status(400).json({ message: 'Usuario no encontrado' });
        return res.json({
            userId: userFound._id,
            name: userFound.name,
            email: userFound.email,
        });
    });
};
exports.verifyAccessToken = verifyAccessToken;
const logout = async (req, res) => {
    try {
        res.cookie('auth_token', '', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            expires: new Date(0),
        });
        // process.env.NODE_ENV === "production"
        res.status(200).json({ message: 'Sesion cerrada' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};
exports.logout = logout;
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const userFound = await auth_1.default.findOne({ email });
    if (!userFound) {
        res.status(400).json({ error: 'Esta cuenta no existe.' });
        return;
    }
    const generateToken = async (payload) => {
        return jsonwebtoken_1.default.sign(payload, config_1.SECRET_KEY, { expiresIn: '1h' });
    };
    const token = await generateToken({ userId: userFound._id });
    const resetLink = `http://localhost:5500/reset-password.html?token=${token}`;
    const msg = {
        to: email,
        from: 'destructordemundos3@outlook.com',
        subject: 'Restablecer contraseña',
        html: `
      <h1>Restablece tu contraseña</h1>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}">Restablecer contraseña</a>
      <p>Este enlace es válido por 1 hora.</p>
    `,
    };
    try {
        await mail_1.default.send(msg);
        res.status(200).json({ message: 'Enlace enviado' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al enviar el correo' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    const newPassword = req.body.newPassword;
    const token = req.headers['authorization']?.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.SECRET_KEY);
        const userFound = await auth_1.default.findById(decoded.userId);
        if (userFound !== null) {
            const isMatch = await (0, bcrypt_1.compare)(newPassword, userFound.password);
            if (isMatch) {
                res.status(400).json({ error: 'Esta contraseña ya esta en uso.' });
                return;
            }
        }
        const passwordHash = await (0, bcrypt_1.hash)(newPassword, 0);
        try {
            await auth_1.default.findByIdAndUpdate(decoded.userId, { password: passwordHash }, { new: true });
            res.status(200).json({ message: 'Contraseña restablecida' });
        }
        catch (error) {
            res.status(500).json({ error: 'Error' });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error' });
    }
};
exports.resetPassword = resetPassword;
