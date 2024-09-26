const CLIENT_SUCCES_MESSAGES = {
  loginSuccess: "Sesión iniciada",
  registerSuccess: "Cuenta creada",
  linkSent: "Enlace enviado",
  passwordResetSuccess: "Contraseña restablecida",
  logoutSuccess: "Sesion cerrada",
};
const CLIENT_ERROR_MESSAGES = {
  invalidMail: "Correo invalido.",
  accountAlreadyExists: "Esta cuenta ya existe.",
  loginError: "Error al iniciar sesion.",
  userNotFound: "Este usuario no existe.",
  incorrectPassword: "Contraseña incorrecta.",
  accountnotFound: "Esta cuenta no existe.",
  passwordIsMatch: "Esta contraseña ya esta en uso.",
  fieldRequired: "Este campo es obligatorio.",
  invalidPasswordLength: "Longitud de contraseña inválida.",
  invalidToken: "Token invalido.",
  unknownError: "Error desconocido en el servidor.",
  invalidData: "Datos invalidos.",
  authError: "Error de autenticacion.",
  expiredSession: "Sesion expirada, porfavor vuelve a iniciar sesion",
  passwordNotMath: "Las contraseñas no coinciden.",
};
export { CLIENT_SUCCES_MESSAGES, CLIENT_ERROR_MESSAGES };
