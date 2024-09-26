import { z } from "zod";
import { CLIENT_ERROR_MESSAGES } from "../constans.js";
const registerSchema = z.object({
    name: z.string({ required_error: CLIENT_ERROR_MESSAGES.fieldRequired }),
    email: z
        .string({ required_error: CLIENT_ERROR_MESSAGES.fieldRequired })
        .email({ message: CLIENT_ERROR_MESSAGES.invalidMail }),
    password: z
        .string({ required_error: CLIENT_ERROR_MESSAGES.fieldRequired })
        .min(8, { message: CLIENT_ERROR_MESSAGES.invalidPasswordLength }),
});
const loginSchema = z.object({
    email: z.string({ required_error: CLIENT_ERROR_MESSAGES.fieldRequired }),
    password: z.string({ required_error: CLIENT_ERROR_MESSAGES.fieldRequired }),
});
const resetPasswordSchema = z
    .object({
    newPassword: z
        .string({ required_error: CLIENT_ERROR_MESSAGES.fieldRequired })
        .min(8, { message: CLIENT_ERROR_MESSAGES.invalidPasswordLength }),
    confirmNewPassword: z.string({ required_error: CLIENT_ERROR_MESSAGES.fieldRequired }),
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: CLIENT_ERROR_MESSAGES.passwordNotMath,
    path: ["confirmNewPassword"],
});
export { registerSchema, loginSchema, resetPasswordSchema };
