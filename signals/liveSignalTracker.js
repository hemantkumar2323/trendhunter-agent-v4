// signals/liveSignalTracker.js

const fs = require('fs');
const path = require('path');
const { logToFile } = require('../utils/logger');

const surgePath = path.join(__dirname, '../data/live/surge-events.json');
const approvedTrendsPath = path.join(__dirname, '../output/approved-trends.json');

function detectSurgeSignals() {
  try {
    if (!fs.existsSync(approvedTrendsPath)) return;

    const trends = JSON.parse(fs.readFileSync(approvedTrendsPath, 'utf8'));
    const surgeEvents = [];

    trends.forEach(trend => {
      if (trend.score >= 97) {
        surgeEvents.push({
          tag: trend.tag,
          niche: trend.niche,
          score: trend.score,
          type: 'SURGE',
          detectedAt: new Date().toISOString()
        });
      }
    });

    if (surgeEvents.length > 0) {
      fs.writeFileSync(surgePath, JSON.stringify(surgeEvents, null, 2));
      logToFile('liveSignalTracker.log', `Surge events detected: ${surgeEvents.length}`);
    } else {
      logToFile('liveSignalTracker.log', 'No surge events detected');
    }
  } catch (err) {
    logToFile('liveSignalTracker.log', `Error detecting surge: ${err.message}`);
  }
}

// Exported so it can be triggered manually or via scheduler
module.exports = {
  detectSurgeSignals
};
