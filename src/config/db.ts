import { connect } from 'mongoose';

import { DB_URL } from "../config"

// const url = 'mongodb+srv://chris:chris@cluster0.ibnszjj.mongodb.net/simple_login_and_register_website';

// const url = 'mongodb+srv://chris:71jLwAgtLmokH6Ra@cluster0.eecvd.mongodb.net/simple_login_and_register_website';

console.log(DB_URL)

// mongoose.connect(url);

const connectDB = async (): Promise<void> => {
  try {
    await connect(DB_URL);
    console.log('Connected to DB');
  } catch (error) {
    console.log('error:', error);
  }
};

export { connectDB };
