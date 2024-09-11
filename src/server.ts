import { app } from './app.js';
import { connectDB } from './config/db.js';
import { PORT } from './config.js';

app.listen(PORT);

connectDB();
