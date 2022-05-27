const express = require("express");
const teamsRouter = require("./teams.router");
const driversRouter = require("./drivers.router");

const v1Router = express.Router();

v1Router.use("/teams", teamsRouter);
v1Router.use("/drivers", driversRouter);

module.exports = v1Router;
