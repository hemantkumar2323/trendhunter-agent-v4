// api/trends.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { logToFile } = require('../utils/logger');

const approvedTrendsPath = path.join(__dirname, '../output/approved-trends.json');

router.get('/', (req, res) => {
  try {
    if (!fs.existsSync(approvedTrendsPath)) {
      return res.status(404).json({ success: false, message: 'No approved trends available yet.' });
    }

    const data = JSON.parse(fs.readFileSync(approvedTrendsPath, 'utf8'));
    logToFile('trends-api.log', `Fetched ${data.length} approved trends.`);
    res.json({ success: true, trends: data });
  } catch (err) {
    logToFile('trends-api.log', `Error reading approved trends: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

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
