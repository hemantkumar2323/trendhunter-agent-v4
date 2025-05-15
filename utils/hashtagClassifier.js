=== utils/scorer.js ===
```javascript
const { logToFile } = require('./logger'); // Use the logger
function scoreTrends(trend, platform, niche) {
  let score = 0;
  if (trend.title) {
    score += trend.title.length * 5;
  }
  if (trend.audio) {
    score += 20;
  }
  if (platform === 'tiktok') {
    score += 10;
  }
  logToFile('scorer.log', `Scored trend ${trend.title} for ${niche} on ${platform} with score ${score}`);
  return {...trend, score};
}
module.exports = {scoreTrends};
