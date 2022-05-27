const httpStatus = require("http-status");
const Joi = require("joi");

let db = require("../services/db.service");
const Drivers = require("../services/drivers.service");

const ApiError = require("../utils/ApiError");
const VALID_ID = require("../validations/id.validation");

class Team {
  constructor(params) {
    let { id, name, country, active = true } = params;
    active = !!active;
    Object.assign(this, { id, name, country, active });
  }

  static validate(team) {
    const validSchema = {
      id: VALID_ID.required(),
      name: Joi.string().required(),
      country: Joi.string().required(),
      active: Joi.boolean().required(),
    };

    const validator = Joi.compile(validSchema).prefs({
      errors: { label: "key" },
      convert: false,
    });

    return validator.validate(team);
  }

  get errors() {
    const { error } = Team.validate(this);
    if (!error) return false;
    const { details } = error;
    return details.map(({ message }) => message);
  }

  getDrivers(options = {}) {
    return Drivers.find({ teamId: this.id }, options);
  }

  async save() {
    if (this.errors) {
      const { UNPROCESSABLE_ENTITY } = httpStatus;
      const message = this.errors.join(", ");
      throw new ApiError(UNPROCESSABLE_ENTITY, message);
    }
    const { id, active, name, country } = this;
    db = await db;
    await db.upsert("teams", { id, active, name, country });
  }
}

module.exports = Team;
