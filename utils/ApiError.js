const httpStatus = require("http-status");

const { INTERNAL_SERVER_ERROR } = httpStatus;

class ApiError extends Error {
  constructor(status = INTERNAL_SERVER_ERROR, message, stack = "") {
    super(message || httpStatus[status]);
    this.status = status;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
