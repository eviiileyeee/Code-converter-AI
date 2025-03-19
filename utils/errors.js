/**
 * Custom error class for application-specific errors
 */
class CustomError extends Error {
    constructor(message, statusCode = 500, errorCode = null) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      this.errorCode = errorCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  module.exports = {
    CustomError
  };
  