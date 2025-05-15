// utils/reinforcement.js

const fs = require('fs');
const path = require('path');
const { logToFile } = require('./logger');

const feedbackPath = path.join(__dirname, '../data/feedback/performance.json');

function applyReinforcement(trendScores, niche) {
  let feedback = {};

  // Load feedback memory
  try {
    if (fs.existsSync(feedbackPath)) {
      feedback = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }
  } catch (err) {
    logToFile('reinforcement.log', `Error loading feedback for ${niche}: ${err.message}`);
  }

  // Adjust scores
  const adjusted = trendScores.map(trend => {
    const history = feedback[trend.tag] || {};
    const boost = history.successRate ? Math.floor(history.successRate * 10) : 0;
    const finalScore = Math.min(100, trend.score + boost);
    return { ...trend, score: finalScore };
  });

  logToFile('reinforcement.log', `Applied reinforcement for ${niche}: ${adjusted.length} trends`);
  return adjusted;
}

module.exports = {
  applyReinforcement
};
