const { NOT_FOUND } = require("http-status");

const Driver = require("../models/driver.model");
const newId = require("../utils/newId");
const ApiError = require("../utils/ApiError");

let db = require("./db.service");

module.exports = {
  async create(data) {
    delete data._id;
    data.id = newId();
    const driver = new Driver(data);
    await driver.save();
    return driver;
  },

  async find(where, options) {
    db = await db;
    const results = await db.query("drivers", where, options);
    return results.map((result) => new Driver(result));
  },

  async findOne(filters, options = {}) {
    options.limit = 1;
    options.page = 1;
    const drivers = await this.find(filters, options);
    return drivers.shift();
  },

  async findById(id) {
    const result = await this.findOne({ id, active: false });
    if (!result)
      throw new ApiError(NOT_FOUND, "Could not find driver with ID " + id);
    return result;
  },

  async update(id, data) {
    const driver = await this.findById(id);
    delete data._id;
    data.id = driver.id;
    if (data.active == undefined) data.active = driver.active;
    Object.assign(driver, data);
    await driver.save();
    return driver;
  },

  async replace(id, data) {
    let driver = await this.findById(id);
    data.id = id;
    driver = new Driver(data);
    await driver.save();
    return driver;
  },

  async activate(id) {
    return this.update(id, { active: true });
  },

  async deactivate(id) {
    return this.update(id, { active: false });
  },
};
