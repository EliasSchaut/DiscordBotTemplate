// ===============================
// This file creates and exports the logger.
// it can be used by require this file.
// See also: https://discordjs.guide/miscellaneous/useful-packages.html#winston
// ===============================

// require winston.handler for logging
const winston = require("winston");
const config = require("../../config/config.json");

// create logger; if enable_logging is true, logger will also log in file
const logger = (config.enable_logging) ?
    winston.createLogger({
        transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: config.log_file_name })
        ],
        format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
    }) :
    winston.createLogger({
        transports: [
            new winston.transports.Console()
        ],
        format: winston.format.printf(log => `[${log.level.toUpperCase()}] - ${log.message}`),
    })

// export logger
module.exports = { logger }
