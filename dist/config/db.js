"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
const connectDB = async () => {
    try {
        await (0, mongoose_1.connect)(config_1.DB_URL);
        console.log("Connected to DB");
    }
    catch (error) {
        console.log("error:", error);
    }
};
exports.default = connectDB;
