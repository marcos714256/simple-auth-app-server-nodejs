import app from "./app.js";
import connectDB from "./config/db.js";
import { PORT } from "./config.js";
const main = async () => {
    try {
        await connectDB();
        app.listen(PORT);
        console.log(`Entorno: ${process.env.NODE_ENV}`);
    }
    catch (error) {
        console.log(error);
    }
};
main();
