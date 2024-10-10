import { generateAccessToken } from "./utils/jwt.js";
import User from "./model.js";
import { registerSchema } from "./schema.js";
import { CLIENT_ERROR_MESSAGES } from "./constant.js";
import { hashPassword } from "./utils/bcrypt.js";
const registerUser = async ({ email, password, name }) => {
    registerSchema.parse({ email, password, name });
    const userFound = await User.findOne({ email });
    if (userFound) {
        throw new Error(CLIENT_ERROR_MESSAGES.accountAlreadyExists);
    }
    const passwordHash = await hashPassword(password, 10);
    const newUser = new User({
        email,
        password: passwordHash,
        name,
    });
    const userSaved = await newUser.save();
    const token = await generateAccessToken({ id: userSaved._id });
    return token;
};
export { registerUser };
