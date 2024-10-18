import { CLIENT_ERROR_MESSAGES } from "../constants";

interface CustomErrorTypes extends Error {
  publicError: boolean;
}

class AppError extends Error implements CustomErrorTypes {
  publicError: boolean;
  statusCode: number;

  constructor(message: string, publicError: boolean, statusCode: number) {
    super(message);

    this.publicError = publicError;
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  getMessage() {
    if (this.publicError) {
      return this.message;
    }
    return CLIENT_ERROR_MESSAGES.unknownError;
  }
}

export default AppError;
