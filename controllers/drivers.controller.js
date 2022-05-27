const httpStatus = require("http-status");
const catchWithApiError = require("../utils/catchWithApiError");
const Drivers = require("../services/drivers.service");
const Teams = require("../services/teams.service");

const { CREATED } = httpStatus;

module.exports = {
  post: catchWithApiError(async (req, res) => {
    const { body } = req;

    const { teamId } = body;
    await Teams.findById(teamId);

    const driver = await Drivers.create(body);
    return res.status(CREATED).json(driver);
  }),

  get: catchWithApiError(async (req, res) => {
    const { query } = req;

    const { firstName, lastName, country, active } = query;
    const where = { firstName, lastName, country, active };

    const { sortBy, limit, page } = query;
    const options = { sortBy, limit, page };

    const drivers = await Drivers.find(where, options);
    return res.json(drivers);
  }),

  getById: catchWithApiError(async (req, res) => {
    const { id } = req.params;
    const driver = await Drivers.findById(id);
    return res.json(driver);
  }),

  getTeam: catchWithApiError(async (req, res) => {
    const { id } = req.params;
    const { teamId } = await Drivers.findById(id);
    const team = await Teams.findById(teamId);
    return res.json(team);
  }),

  patchById: catchWithApiError(async (req, res) => {
    const { params, body } = req;

    const { teamId } = body;
    await Teams.findById(teamId);

    const { id } = params;
    const driver = await Drivers.update(id, body);
    return res.json(driver);
  }),

  putById: catchWithApiError(async (req, res) => {
    const { params, body } = req;

    const { teamId } = body;
    await Teams.findById(teamId);

    const { id } = params;
    const driver = await Drivers.replace(id, body);
    return res.json(driver);
  }),

  deleteById: catchWithApiError(async (req, res) => {
    const { id } = req.params;
    const driver = await Drivers.deactivate(id);
    return res.json(driver);
  }),
};
