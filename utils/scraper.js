=== utils/hashtagClassifier.js ===
```javascript
const { logToFile } = require('./logger'); // Use the logger

function classifyHashtags(tags, niche) {
  const classified = {
    large: [],
    mid: [],
    small: []
  };
  // Improved classification logic (example - adapt as needed)
  tags.forEach(tag => {
    const cleanedTag = tag.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); // Basic cleaning
    let volume = 0;
    if (cleanedTag.length > 0){
      volume = cleanedTag.length * 1000; // Just for test
    }
    if (volume > 1000000) {
      classified.large.push(tag);
    } else if (volume > 100000) {
      classified.mid.push(tag);
    } else {
      classified.small.push(tag);
    }
  });
  logToFile('hashtagClassifier.log', `Classified ${tags.length} hashtags for ${niche}: ${classified.large.length} large, ${classified.mid.length} mid, ${classified.small.length} small`);
  return classified;
}

module.exports = { classifyHashtags };
