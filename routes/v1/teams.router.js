const express = require("express");
const validate = require("../../middlewares/validate");
const teamsValidations = require("../../validations/teams.validation");
const teamsController = require("../../controllers/teams.controller");

const teamsRouter = express.Router();

teamsRouter
  .route("/")
  .post(validate(teamsValidations.createOne), teamsController.post)
  .get(validate(teamsValidations.findAll), teamsController.get);

teamsRouter
  .route("/:id")
  .get(validate(teamsValidations.findOne), teamsController.getById)
  .patch(validate(teamsValidations.updateOne), teamsController.patchById)
  .put(validate(teamsValidations.replaceOne), teamsController.putById)
  .delete(validate(teamsValidations.removeOne), teamsController.deleteById);

teamsRouter
  .route("/:id/drivers")
  .get(validate(teamsValidations.findOne), teamsController.getDrivers);

module.exports = teamsRouter;
