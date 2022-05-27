const { NOT_FOUND } = require("http-status");
const Team = require("../models/team.model");
let db = require("./db.service");
const newId = require("../utils/newId");
const ApiError = require("../utils/ApiError");

module.exports = {
  async create(data) {
    delete data._id;
    data.id = newId();
    const team = new Team(data);
    await team.save();
    return team;
  },

  async find(where, options) {
    db = await db;
    const results = await db.query("teams", where, options);
    return results.map((result) => new Team(result));
  },

  async findOne(filters, options = {}) {
    options.limit = 1;
    options.page = 1;
    const [team] = await this.find(filters, options);
    return team ? new Team(team) : undefined;
  },

  async findById(id) {
    const result = await this.findOne({ id, active: false });
    if (!result)
      throw new ApiError(NOT_FOUND, "Could not find team with ID " + id);
    return result;
  },

  async update(id, data) {
    const team = await this.findById(id);
    delete data._id;
    data.id = team.id;
    if (data.active == undefined) data.active = team.active;
    Object.assign(team, data);
    await team.save();
    return team;
  },

  async replace(id, data) {
    let team = await this.findById(id);
    data.id = id;
    team = new Team(data);
    await team.save();
    return team;
  },

  async activate(id) {
    return this.update(id, { active: true });
  },

  async deactivate(id) {
    return this.update(id, { active: false });
  },
};
