// utils/logger.js

const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../data/logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

function logToFile(filename, message) {
  const logPath = path.join(logDir, filename);
  const logMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logPath, logMessage, 'utf8');
}

function logJSON(filename, data) {
  const filePath = path.join(logDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  logToFile,
  logJSON
};
