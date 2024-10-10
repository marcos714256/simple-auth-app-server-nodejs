import bcrypt from "bcrypt";
export const hashPassword = async (password, saltRounds) => {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    return passwordHash;
};
