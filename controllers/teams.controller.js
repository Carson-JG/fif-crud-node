const httpStatus = require("http-status");
const catchWithApiError = require("../utils/catchWithApiError");
const Teams = require("../services/teams.service");
const Drivers = require("../services/drivers.service");

const { CREATED } = httpStatus;

module.exports = {
  post: catchWithApiError(async (req, res) => {
    const { body } = req;
    const team = await Teams.create(body);
    return res.status(CREATED).json(team);
  }),

  get: catchWithApiError(async (req, res) => {
    const { query } = req;

    const { name, country, active } = query;
    const where = { name, country, active };

    const { sortBy, limit, page } = query;
    const options = { sortBy, limit, page };

    const teams = await Teams.find(where, options);
    return res.json(teams);
  }),

  getById: catchWithApiError(async (req, res) => {
    const { id } = req.params;
    const team = await Teams.findById(id);
    return res.json(team);
  }),

  getDrivers: catchWithApiError(async (req, res) => {
    const { id } = req.params;
    await Teams.findById(id);
    const drivers = await Drivers.find({ teamId: id });
    return res.json(drivers);
  }),

  patchById: catchWithApiError(async (req, res) => {
    const { params, body } = req;
    const { id } = params;
    const team = await Teams.update(id, body);
    return res.json(team);
  }),

  putById: catchWithApiError(async (req, res) => {
    const { params, body } = req;
    const { id } = params;
    const team = await Teams.replace(id, body);
    return res.json(team);
  }),

  deleteById: catchWithApiError(async (req, res) => {
    const { id } = req.params;
    const team = await Teams.deactivate(id);
    return res.json(team);
  }),
};
