"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// import mongoose from 'mongoose';
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
    },
    createdAt: { type: Date },
}, {
    versionKey: false,
});
const User = (0, mongoose_2.model)('User', UserSchema, 'users');
exports.User = User;
