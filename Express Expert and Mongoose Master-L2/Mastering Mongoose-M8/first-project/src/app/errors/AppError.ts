class AppError extends Error {
  public statusCode: number;
  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); //captureStackTrace is built in || this.constructor for getting precise error bz error stack can be huge
    }
  }
}

export default AppError;
