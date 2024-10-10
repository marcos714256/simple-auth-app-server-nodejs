import bcrypt from "bcrypt";

export const hashPassword = async (password: string, saltRounds: number) => {
  const passwordHash = await bcrypt.hash(password, saltRounds);

  return passwordHash;
};
