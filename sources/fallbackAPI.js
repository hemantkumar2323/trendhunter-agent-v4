// sources/fallbackAPI.js

const { logToFile } = require('../utils/logger');

/**
 * Fallback source (mocked). Real usage: call Trendpop, TikTok API, etc.
 */
async function fetchFallbackTrends(niche, platform = 'tiktok') {
  logToFile('fallbackAPI.log', `Fallback triggered for ${niche} on ${platform}`);

  // Simulated fallback trends
  return [
    { tag: '#fallback1', platform, niche, score: 72 },
    { tag: '#fallback2', platform, niche, score: 67 },
    { tag: '#fallback3', platform, niche, score: 74 }
  ];
}

module.exports = {
  fetchFallbackTrends
};

// utils/deltaLogger.js

const fs = require('fs');
const path = require('path');
const { logToFile } = require('./logger');

const logPath = path.join(__dirname, '../data/logs/delta-trends.json');

function logNewTrends(currentTrends) {
  let existing = [];
  if (fs.existsSync(logPath)) {
    existing = JSON.parse(fs.readFileSync(logPath, 'utf8'));
  }

  const newTrends = currentTrends.filter(t => !existing.find(e => e.tag === t.tag));
  const updated = [...existing, ...newTrends];

  fs.writeFileSync(logPath, JSON.stringify(updated.slice(-100), null, 2));
  logToFile('deltaLogger.log', `Logged ${newTrends.length} new trends.`);
}

module.exports = {
  logNewTrends
};

// utils/proxyRouter.js

const proxies = [
  'http://proxy1.example.com',
  'http://proxy2.example.com',
  'http://proxy3.example.com'
];

let index = 0;

function getNextProxy() {
  const proxy = proxies[index];
  index = (index + 1) % proxies.length;
  return proxy;
}

module.exports = {
  getNextProxy
};

// utils/trendNicheClassifier.js

function classifyTrendToNiche(tag) {
  const map = {
    feminine: 'FemSpeak',
    cozy: 'CozyHouse',
    mental: 'MindTonic',
    luxe: 'LuxeLoop'
  };

  const lowerTag = tag.toLowerCase();
  for (const keyword in map) {
    if (lowerTag.includes(keyword)) return map[keyword];
  }
  return 'Uncategorized';
}

module.exports = {
  classifyTrendToNiche
};

// utils/watchdog.js

const fs = require('fs');
const path = require('path');
const { logToFile } = require('./logger');

const expectedPaths = [
  '../output/approved-trends.json',
  '../data/live/surge-events.json',
  '../data/feedback/performance.json'
];

function verifySystemHealth() {
  let allClear = true;

  expectedPaths.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (!fs.existsSync(fullPath)) {
      logToFile('watchdog.log', `MISSING FILE: ${file}`);
      allClear = false;
    }
  });

  if (allClear) {
    logToFile('watchdog.log', 'All critical system files verified.');
  }

  return allClear;
}

module.exports = {
  verifySystemHealth
};
