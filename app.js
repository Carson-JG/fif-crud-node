const httpStatus = require("http-status");
const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const ApiError = require("./utils/ApiError");
const v1Router = require("./routes/v1");

const { NODE_ENV } = process.env;

const IN_PRODUCTION = NODE_ENV === "production";

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(compression());
app.use(cors());
app.options("*", cors());

app.use("/v1", v1Router);

app.use((req, res, next) => {
  const { NOT_FOUND } = httpStatus;
  next(new ApiError(NOT_FOUND));
});

app.use((err, req, res, next) => {
  const { INTERNAL_SERVER_ERROR } = httpStatus;

  let { status = INTERNAL_SERVER_ERROR } = err;
  const isServerError = status >= 500;

  let { message = httpStatus[status] } = err;
  if (IN_PRODUCTION && isServerError)
    message = httpStatus[INTERNAL_SERVER_ERROR];

  const payload = { status, message };
  if (!IN_PRODUCTION && err.stack) payload.stack = err.stack;

  return res.status(status).json(payload);
});

module.exports = app;
