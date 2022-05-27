const Joi = require("joi");

const QUERY_OPTIONS = require("./queryOptions.validation");
const VALID_ID = require("./id.validation");

const VALID_ID_REQ = VALID_ID.required();
const STRING = Joi.string();
const STRING_REQ = STRING.required();
const BOOL = Joi.boolean();

const FIELDS_CREATE = {
  name: STRING_REQ,
  country: STRING_REQ,
};

const FIELDS_READ = {
  name: STRING,
  country: STRING,
  active: BOOL,
};

const FIELDS_IDENTIFY = { id: VALID_ID_REQ };

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
