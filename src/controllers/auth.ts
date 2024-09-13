import type { Request, Response } from 'express';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail';

import { SECRET_KEY } from '../config';
import User from '../models/auth';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userFound = await User.findOne({ email });

  if (!userFound) {
    // "Este usuario no existe."
    res.status(400).json({ message: 'Contraseña incorrecta.' });
    return;
  }

  const isMatch = await compare(password, userFound.password);

  if (!isMatch) {
    res.status(400).json({ message: 'Contraseña incorrecta.' });
    return;
  }

  const generateToken = async (payload: { userId: String }) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '16d' });
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

const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  const userFound = await User.findOne({ email });

  if (userFound) {
    res.status(400).json({ message: 'Esta cuenta ya existe.' });
    return;
  }

  const passwordHash = await hash(password, 0);

  const newUser = new User({
    email,
    password: passwordHash,
    name,
  });

  const userSaved = await newUser.save();

  const generateToken = async (payload: { userId: String }) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '16d' });
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

const verifyAccessToken = async (req: Request, res: Response): Promise<void> => {
  const userToken = req.cookies['auth_token'];

  if (!userToken) {
    res.status(401).json({ message: 'Token no encontrado.' });
    return;
  }

  jwt.verify(userToken, SECRET_KEY, async (error: any, user: any) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findById(user.userId);

    if (!userFound) return res.status(400).json({ message: 'Usuario no encontrado' });

    return res.json({
      userId: userFound._id,
      name: userFound.name,
      email: userFound.email,
    });
  });
};

const logout = async (req: Request, res: Response) => {
  try {
    res.cookie('auth_token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: new Date(0),
    });

    // process.env.NODE_ENV === "production"

    res.status(200).json({ message: 'Sesion cerrada' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  const userFound = await User.findOne({ email });

  if (!userFound) {
    res.status(400).json({ error: 'Esta cuenta no existe.' });
    return;
  }

  const generateToken = async (payload: { userId: String }) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
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
    await sgMail.send(msg);
    res.status(200).json({ message: 'Enlace enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
};

const resetPassword = async (req: Request, res: Response) => {
  const newPassword = req.body.newPassword;
  const token = req.headers['authorization']?.split(' ')[1] as string;

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);

    const userFound = await User.findById(decoded.userId);

    if (userFound !== null) {
      const isMatch = await compare(newPassword, userFound.password);

      if (isMatch) {
        res.status(400).json({ error: 'Esta contraseña ya esta en uso.' });
        return;
      }
    }

    const passwordHash = await hash(newPassword, 0);

    try {
      await User.findByIdAndUpdate(decoded.userId, { password: passwordHash }, { new: true });
      res.status(200).json({ message: 'Contraseña restablecida' });
    } catch (error) {
      res.status(500).json({ error: 'Error' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error' });
  }
};

export { login, register, verifyAccessToken, logout, forgotPassword, resetPassword };
