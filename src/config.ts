import { config } from 'dotenv';

const envFile = '.env.dev';

config({ path: envFile });

const CLIENT_URL = process.env.CLIENT_URL;
const API_KEY = process.env.API_KEY as string;
const SECRET_KEY = process.env.SECRET_KEY as string;
const DB_URL = process.env.DB_URL as string;
const PORT = process.env.PORT;

export { CLIENT_URL, API_KEY, SECRET_KEY, DB_URL, PORT };
