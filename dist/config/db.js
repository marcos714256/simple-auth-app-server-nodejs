"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("../config");
// const url = 'mongodb+srv://chris:chris@cluster0.ibnszjj.mongodb.net/simple_login_and_register_website';
// const url = 'mongodb+srv://chris:71jLwAgtLmokH6Ra@cluster0.eecvd.mongodb.net/simple_login_and_register_website';
console.log(config_1.DB_URL);
// mongoose.connect(url);
const connectDB = async () => {
    try {
        await (0, mongoose_1.connect)(config_1.DB_URL);
        console.log('Connected to DB');
    }
    catch (error) {
        console.log('error:', error);
    }
};
exports.connectDB = connectDB;
