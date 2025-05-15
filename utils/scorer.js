=== utils/reinforcement.js ===
```javascript
const { logToFile } = require('./logger'); // Use the logger

let weights = {
  views: 0.3,
  likes: 0.2,
  saves: 0.5
};

function applyReinforcement(trends, niche) {
  if (!trends || trends.length === 0) {
    return [];
  }
  const reinforcedTrends = trends.map(trend => {
    let overallScore = 0;
      if(trend.views){
        overallScore += (parseInt(trend.views) || 0) * weights.views;
      }
      if (trend.likes){
        overallScore += (parseInt(trend.likes) || 0) * weights.likes;
      }
      if (trend.saves){
        overallScore += (parseInt(trend.saves) || 0) * weights.saves;
      }
    const boostedScore = overallScore * 1.2;
    logToFile('reinforcement.log', `Applied reinforcement to trend ${trend.title} in niche ${niche}.  Original score: ${overallScore}, boosted score: ${boostedScore}`);
    return { ...trend, score: boostedScore };
  });
  return reinforcedTrends;
}

module.exports = { applyReinforcement };
