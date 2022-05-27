const Joi = require("joi");

const VALID_ID = require("./id.validation");
const QUERY_OPTIONS = require("./queryOptions.validation");
const { VALID_ID_LENGTH } = require("../config");

const STRING = Joi.string();
const STRING_REQ = STRING.required();
const BOOL = Joi.boolean();

const FIELDS_CREATE = {
  firstName: STRING_REQ,
  lastName: STRING_REQ,
  country: STRING_REQ,
  teamId: VALID_ID,
};

const FIELDS_READ = {
  firstName: STRING,
  lastName: STRING,
  country: STRING,
  teamId: STRING.uppercase().alphanum().length(VALID_ID_LENGTH),
  active: BOOL,
};

const FIELDS_IDENTIFY = { id: VALID_ID };

const FIELDS_QUERY = Object.assign(FIELDS_READ, QUERY_OPTIONS);

const OBJECT = Joi.object();
const SCHEMA_CREATE = OBJECT.keys(FIELDS_CREATE);
const SCHEMA_QUERY = OBJECT.keys(FIELDS_QUERY);
const SCHEMA_UPDATE = OBJECT.keys(FIELDS_READ).min(1);
const SCHEMA_IDENTIFY = OBJECT.keys(FIELDS_IDENTIFY);

module.exports = {
  createOne: { body: SCHEMA_CREATE },
  findAll: { query: SCHEMA_QUERY },
  findOne: { params: SCHEMA_IDENTIFY },
  updateOne: { params: SCHEMA_IDENTIFY, body: SCHEMA_UPDATE },
  replaceOne: { params: SCHEMA_IDENTIFY, body: SCHEMA_CREATE },
  removeOne: { params: SCHEMA_IDENTIFY },
};
