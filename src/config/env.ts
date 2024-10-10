import { config } from "dotenv";

const isProduction = process.env.NODE_ENV === "production";
const envFile = isProduction ? ".env.prod" : ".env.dev";

config({ path: envFile });

const CLIENT_URL = process.env.CLIENT_URL;
const API_KEY = process.env.API_KEY as string;
const SECRET_KEY = process.env.SECRET_KEY as string;
const DB_URL = process.env.DB_URL as string;
const PORT = process.env.PORT;
const TOKEN_NAME = process.env.TOKEN_NAME as string;
const IS_GITHUB_REPO = process.env.IS_GITHUB_REPO as string;
const GITHUB_REPO_LINK = process.env.GITHUB_REPO_LINK as string;

export { CLIENT_URL, API_KEY, SECRET_KEY, DB_URL, PORT, TOKEN_NAME, IS_GITHUB_REPO, GITHUB_REPO_LINK };
