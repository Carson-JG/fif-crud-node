require("dotenv").config();
const app = require("./app");

const { PORT } = process.env;

const server = app.listen(PORT, () =>
  console.log(`listening @ http://localhost:${PORT}`)
);

process.on("uncaughtException", exitHandler);
process.on("unhandledRejection", exitHandler);
process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) server.close();
});

function exitHandler(err) {
  console.error(err);
  if (server) {
    server.close(() => {
      console.log("Server Closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}
