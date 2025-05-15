=== api/audio.js ===
```javascript
const express = require('express');
const router = express.Router();
const { logJSON, logToFile } = require('../utils/logger'); // Use the logger

const trendingAudio = require('../data/audio/sample-audio.json');

router.get('/:niche', (req, res) => {
  const { niche } = req.params;
  const audio = trendingAudio[niche] || [];
  if (!audio.length) return res.status(404).json({ success: false });
  logJSON('trending-audio.json', audio);
  logToFile('audio-api.log', `Returned audio for ${niche}`);
  res.json({ success: true, audio });
});
module.exports = router;
