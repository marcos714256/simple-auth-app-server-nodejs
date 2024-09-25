import { z } from "zod";
import { clientMessages } from "../constans.js";
const registerSchema = z.object({
  name: z.string({ required_error: clientMessages.fieldRequired }),
  email: z.string({ required_error: clientMessages.fieldRequired }).email({ message: "Correo invalido." }),
  password: z
    .string({ required_error: clientMessages.fieldRequired })
    .min(8, { message: "Logitud de contraseña invalida." }),
});
const loginSchema = z.object({
  email: z.string({ required_error: clientMessages.fieldRequired }),
  password: z.string({ required_error: clientMessages.fieldRequired }),
});
const resetPasswordSchema = z
  .object({
    newPassword: z
      .string({ required_error: clientMessages.fieldRequired })
      .min(8, { message: "Longitud de contraseña inválida." }),
    confirmNewPassword: z.string({ required_error: clientMessages.fieldRequired }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmNewPassword"],
  });
export { registerSchema, loginSchema, resetPasswordSchema };
