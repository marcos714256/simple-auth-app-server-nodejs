import { connect, MongooseError } from "mongoose";

import { DB_URL } from "./env.js";

// const URL: string = "12345"

const connectDB = async (): Promise<void> => {
  try {
    await connect(DB_URL);
    console.log("Connected to DB");
  } catch (e) {
    if (e instanceof MongooseError)
      // console.error(e);
      throw new Error(e.message);
  }
};

export default connectDB;
