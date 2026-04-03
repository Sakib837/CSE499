import { API_MESSAGES } from '../config/constants.js';

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message = API_MESSAGES.BAD_REQUEST) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = API_MESSAGES.NOT_FOUND) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = API_MESSAGES.UNAUTHORIZED) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = API_MESSAGES.FORBIDDEN) {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message = API_MESSAGES.CONFLICT) {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  console.error(`[${new Date().toISOString()}] ${err.name}:`, message);

  res.status(statusCode).json({
    success: false,
    error: err.name,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default { errorHandler, AppError, ValidationError, NotFoundError, UnauthorizedError, ForbiddenError, ConflictError };
