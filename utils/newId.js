const nanoid = require("nanoid");

const { VALID_ID_CHARS, VALID_ID_LENGTH } = require("../config");

module.exports = nanoid.customAlphabet(VALID_ID_CHARS, VALID_ID_LENGTH);
