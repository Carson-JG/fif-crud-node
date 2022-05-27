const httpStatus = require("http-status");
const Joi = require("joi");

let db = require("../services/db.service");

const ApiError = require("../utils/ApiError");
const VALID_ID = require("../validations/id.validation");

class Driver {
  constructor(params) {
    let { id, firstName, lastName, teamId, country, active = true } = params;
    active = !!active;
    Object.assign(this, { id, firstName, lastName, teamId, country, active });
  }

  static validate(driver) {
    const validSchema = {
      id: VALID_ID,
      teamId: VALID_ID,
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      country: Joi.string().required(),
      active: Joi.boolean().required(),
    };

    const validator = Joi.compile(validSchema).prefs({
      errors: { label: "key" },
      convert: false,
    });

    return validator.validate(driver);
  }

  get errors() {
    const { error } = Driver.validate(this);
    if (!error) return false;
    const { details } = error;
    return details.map(({ message }) => message);
  }

  async save() {
    if (this.errors) {
      const { UNPROCESSABLE_ENTITY } = httpStatus;
      const message = this.errors.join(", ");
      throw new ApiError(UNPROCESSABLE_ENTITY, message);
    }

    const { id, active, firstName, lastName, teamId, country } = this;
    db = await db;
    await db.upsert("drivers", {
      id,
      active,
      firstName,
      lastName,
      teamId,
      country,
    });
  }
}

module.exports = Driver;
