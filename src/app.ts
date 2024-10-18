import express, { Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import sgMail from "@sendgrid/mail";
import helmet from "helmet";

import { CLIENT_URL, SENDGRID_API_KEY, PORT } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import handleError from "./middlewares/errorHandler.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(cookieParser());
sgMail.setApiKey(SENDGRID_API_KEY);
app.use(helmet());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use(handleError);

app.all("*", (req: Request, res: Response) => {
  return res.status(404).json({ error: `Ruta ${req.originalUrl} no encontrada` });
});

process.on("uncaughtException", (e) => {
  console.error(e);
  console.log("Fin del programa.");
  process.exit(1);
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("Servidor iniciado");
    });
  } catch (e) {
    console.error(e);
  }
};

startServer();
