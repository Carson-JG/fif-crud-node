const ApiError = require("./ApiError");

function catchWithApiError(controllerHandler) {
  return async (req, res, next) => {
    try {
      await controllerHandler(req, res, next);
    } catch (err) {
      const isApiError = err instanceof ApiError;
      err = isApiError ? err : new ApiError(500, err.message, err.stack);
      next(err);
    }
  };
}

module.exports = catchWithApiError;
