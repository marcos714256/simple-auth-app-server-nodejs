import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import sgMail from "@sendgrid/mail";
import helmet from "helmet";

import { CLIENT_URL, API_KEY, PORT } from "./config/env.js";
import auth from "./route.js";
import connectDB from "./config/db.js";

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
sgMail.setApiKey(API_KEY);
app.use(helmet());

app.use("/api", auth);

// await connectDB()

// app.listen(PORT, () => {
//   console.log("Servidor iniciado");
// })

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

// export default app;

// import app from "./app.js";

// const main = async () => {
//   try {
//     await connectDB();
//     app.listen(PORT);
//     console.log(`Entorno: ${process.env.NODE_ENV}`);
//   } catch (e) {
//     console.error(e);
//   }
// };

// main();
