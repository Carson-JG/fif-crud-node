const Joi = require("Joi");

module.exports = {
  sortBy: Joi.string().trim(),
  limit: Joi.number().min(0),
  page: Joi.number().min(0),
};
