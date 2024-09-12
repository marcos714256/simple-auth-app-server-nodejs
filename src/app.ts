import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import sgMail from "@sendgrid/mail";
import helmet from "helmet";

import { CLIENT_URL, API_KEY } from "./config.js";
import auth from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
sgMail.setApiKey(API_KEY);
app.use(helmet());

// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello world' });
// });

app.use("/api/auth", auth);

export default app;
