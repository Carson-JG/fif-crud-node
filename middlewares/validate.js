const Joi = require("joi");
const ApiError = require("../utils/ApiError");
const pick = require("../utils/pick");

function validate(schema) {
  return function (req, res, next) {
    const validSchema = pick(schema, ["params", "query", "body"]);
    const requestData = pick(req, Object.keys(validSchema));

    const validator = Joi.compile(validSchema).prefs({
      errors: { label: "key" },
    });

    const { value: validatedData, error: validationError } =
      validator.validate(requestData);

    if (validationError) {
      const { details } = validationError;
      const messages = details.map(({ message }) => message);
      const message = messages.join(", ");
      const apiError = new ApiError(400, message);
      return next(apiError);
    }

    Object.assign(req, validatedData);

    return next();
  };
}

module.exports = validate;
