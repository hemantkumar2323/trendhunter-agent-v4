// signals/scrapeScheduler.js

const fs = require('fs');
const path = require('path');
const { logToFile } = require('../utils/logger');

const queuePath = path.join(__dirname, '../data/scheduler/queue.json');
const supportedNiches = ["FemSpeak", "CozyHouse", "MindTonic", "LuxeLoop"];

function rotateScrapeQueue() {
  try {
    let queue = [];
    if (fs.existsSync(queuePath)) {
      queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
    }

    const lastNiche = queue.length ? queue[queue.length - 1] : null;
    const nextIndex = lastNiche ? (supportedNiches.indexOf(lastNiche) + 1) % supportedNiches.length : 0;
    const nextNiche = supportedNiches[nextIndex];

    queue.push(nextNiche);
    fs.writeFileSync(queuePath, JSON.stringify(queue.slice(-20), null, 2)); // keep only recent 20

    logToFile('scrapeScheduler.log', `Next scrape scheduled for: ${nextNiche}`);
    return nextNiche;
  } catch (err) {
    logToFile('scrapeScheduler.log', `Error rotating scrape queue: ${err.message}`);
    return null;
  }
}

module.exports = {
  rotateScrapeQueue
};
