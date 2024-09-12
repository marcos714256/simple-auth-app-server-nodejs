"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const db_js_1 = __importDefault(require("./config/db.js"));
const config_js_1 = require("./config.js");
const main = async () => {
    try {
        await (0, db_js_1.default)();
        app_js_1.default.listen(config_js_1.PORT);
        console.log(`Entorno: ${process.env.NODE_ENV}`);
    }
    catch (error) {
        console.log(error);
    }
};
main();
