=== utils/logger.js ===
```javascript
const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const DailyRotateFile = require('winston-daily-rotate-file');

//const logDir = path.join(__dirname, '../logs');  // No longer needed, winston creates dir
//if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFormat = combine(
    timestamp(),
    json()
);

const logger = winston.createLogger({
    format: logFormat,
    transports: [
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            level: 'info'
        }),
        new winston.transports.Console({ level: 'debug' }) // Also log to console
    ]
});
function logToFile(file, msg) {
  logger.info({message: msg, file: file});
}

function logJSON(file, data) {
  logger.info({message: 'JSON data', file: file, data: data});
}
module.exports = { logToFile, logJSON, logger }; // Export the logger instance
