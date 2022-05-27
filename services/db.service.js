const httpStatus = require("http-status");
const sqlite3 = require("sqlite3").verbose();

const ApiError = require("../utils/ApiError");

const VALID_SORT_DIRECTIONS = ["ASC", "DESC"];

const db = new sqlite3.Database(":memory:");

function upsert(table, data) {
  for (const key in data) {
    const value = data[key];
    if (!value && value !== false) delete data[key];
  }

  const queryParts = ["REPLACE INTO", table];

  const keys = Object.keys(data);
  queryParts.push("(" + keys.join(",") + ")");

  const $keys = keys.map((key) => "$" + key);
  queryParts.push("VALUES (" + $keys.join(",") + ")");

  const query = queryParts.join(" ");

  const params = keys.reduce((result, key) => {
    const value = data[key];
    const $key = "$" + key;
    result[$key] = value;
    return result;
  }, {});

  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function query(table, where = {}, options = {}) {
  const queryParts = ["SELECT * FROM", table, "WHERE 1=1"];
  const params = {};

  const allowDeactivated = where.active === false;
  if (allowDeactivated) {
    delete where.active;
  } else {
    where.active = 1;
  }

  for (const key in where) {
    const value = where[key];
    if (value || value === false) {
      const $key = "$" + key;
      params[$key] = value;
      queryParts.push("AND " + key + " = " + $key);
    }
  }

  const { sortBy = "" } = options;
  if (sortBy) {
    const sorts = sortBy
      .split(",")
      .map((str) => str.trim())
      .filter((str) => str);

    const sortParts = [];
    for (const sort of sorts) {
      let [column, direction = "ASC"] = sort.split(" ").filter((str) => str);
      direction = direction.toUpperCase();
      const directionIsValid = VALID_SORT_DIRECTIONS.includes(direction);
      if (directionIsValid) {
        sortParts.push(column + " " + direction);
      }
    }

    if (sortParts.length) {
      queryParts.push("ORDER BY");
      queryParts.push(sortParts.join(", "));
    }
  }

  const { limit = 0, page = 0 } = options;
  const hasPagination = limit > 0;
  if (hasPagination) {
    params.$limit = limit;
    queryParts.push(`LIMIT $limit`);
    const notFirstPage = page > 1;
    if (notFirstPage) {
      const pageIndex = page - 1;
      params.$offset = pageIndex * limit;
      queryParts.push(`OFFSET $offset`);
    }
  } else if (page > 0) {
    const { UNPROCESSABLE_ENTITY } = httpStatus;
    const message = "pagination requires that limit be defined";
    throw new ApiError(UNPROCESSABLE_ENTITY, message);
  }

  const query = queryParts.join(" ");

  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function createTable(name, columns) {
  columns = columns.join(", ");
  return new Promise((resolve, reject) => {
    db.run(`CREATE TABLE IF NOT EXISTS ${name} (${columns});`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

async function init() {
  const teams = createTable("teams", [
    "id TEXT PRIMARY KEY",
    "active BOOL NOT NULL",
    "name TEXT NOT NULL",
    "country TEXT NOT NULL",
  ]);

  const drivers = createTable("drivers", [
    "id TEXT PRIMARY KEY",
    "teamId TEXT NOT NULL",
    "active BOOL NOT NULL",
    "firstName TEXT NOT NULL",
    "lastName TEXT NOT NULL",
    "country TEXT NOT NULL",
  ]);

  const tables = [teams, drivers];

  await Promise.all(tables);
  return { upsert, query };
}

module.exports = init();
