const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Ensuring the logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a logger instance with configuration
const logger = winston.createLogger({
  // Define the levels of logs and their corresponding colors
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    // Add a timestamp to each log message
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    // Format the log output
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  // Define transports (methods of logging)
  transports: [
    // Console transport for logging to the console
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    }),
    // File transport for logging to a file
    new winston.transports.File({
      level: 'error',
      // Define the log file path and name
      filename: path.join(logsDir, 'error.log'),
      format: winston.format.combine(
        winston.format.uncolorize(),
        winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
      )
    }),
    // More transports can be added here for detailed logging, like warning logs, debug logs, etc.
  ],
  // Handle exceptions with a dedicated file transport
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    })
  ]
});

module.exports = logger;