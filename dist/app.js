"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mail_1 = __importDefault(require("@sendgrid/mail"));
const config_js_1 = require("./config.js");
// console.log(API_KEY);
const auth_js_1 = require("./routes/auth.js");
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)({
    origin: config_js_1.CLIENT_URL,
    credentials: true,
    exposedHeaders: ['Authorization'],
}));
app.use((0, cookie_parser_1.default)());
mail_1.default.setApiKey(config_js_1.API_KEY);
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello world' });
});
app.use('/api/auth', auth_js_1.router);
