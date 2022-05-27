const express = require("express");
const validate = require("../../middlewares/validate");
const driversValidations = require("../../validations/drivers.validation");
const driversController = require("../../controllers/drivers.controller");

const driversRouter = express.Router();

driversRouter
  .route("/")
  .post(validate(driversValidations.createOne), driversController.post)
  .get(validate(driversValidations.findAll), driversController.get);

driversRouter
  .route("/:id")
  .get(validate(driversValidations.findOne), driversController.getById)
  .patch(validate(driversValidations.updateOne), driversController.patchById)
  .put(validate(driversValidations.replaceOne), driversController.putById)
  .delete(validate(driversValidations.removeOne), driversController.deleteById);

driversRouter
  .route("/:id/team")
  .get(validate(driversValidations.findOne), driversController.getTeam);

module.exports = driversRouter;
