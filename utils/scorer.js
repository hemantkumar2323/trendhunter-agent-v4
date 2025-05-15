// utils/scorer.js

const { logToFile } = require('./logger');

/**
 * Simulate scoring logic for each hashtag or trend.
 * Real scoring can include views, growth rate, velocity, sentiment, etc.
 */
function scoreTrends(hashtags, platform = "tiktok", niche = "general") {
  const scored = hashtags.map(tag => {
    // Simulate score between 50-100 based on tag length (placeholder logic)
    const score = 50 + Math.floor((Math.random() * 50));
    return {
      tag,
      platform,
      niche,
      score,
      timestamp: new Date().toISOString()
    };
  });

  logToFile('scorer.log', `Scored ${scored.length} trends for ${platform} (${niche})`);
  return scored;
}

module.exports = {
  scoreTrends
};
