const Joi = require("joi");
const { VALID_ID_LENGTH } = require("../config");

module.exports = Joi.string()
  .required()
  .alphanum()
  .uppercase()
  .length(VALID_ID_LENGTH);
