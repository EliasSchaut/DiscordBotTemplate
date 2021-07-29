// ===============================
// This file creates and exports the logger.
// it can be used by require this file.
// See also: https://discordjs.guide/miscellaneous/useful-packages.html#winston
// ===============================

// require winston.js for logging
const winston = require("winston");
const config = require("../config/config.json");
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: config.log_file_name }),
    ],
    format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
})

module.exports = { logger }
