import { connect } from "mongoose";

import { DB_URL } from "../config";

const connectDB = async (): Promise<void> => {
  try {
    await connect(DB_URL);
    console.log("Connected to DB");
  } catch (error) {
    console.log("error:", error);
  }
};

export default connectDB;
