"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const db_js_1 = require("./config/db.js");
const config_js_1 = require("./config.js");
app_js_1.app.listen(config_js_1.PORT);
(0, db_js_1.connectDB)();
