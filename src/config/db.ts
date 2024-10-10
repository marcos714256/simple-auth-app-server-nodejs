import { connect } from "mongoose";

import { DB_URL } from "./env.js";

const connectDB = async (): Promise<void> => {
  try {
    await connect(DB_URL);
    console.log("Connected to DB");
  } catch (e) {
    console.error(e);
  }
};

export default connectDB;
