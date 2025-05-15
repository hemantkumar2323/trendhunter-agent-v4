=== api/trends.js ===
```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { logToFile } = require('../utils/logger'); // Use the logger

router.get('/', (req, res) => {
  const p = path.join(__dirname, '../output/approved-trends.json');
  if (!fs.existsSync(p)) return res.status(404).json({ success: false });
  const trends = JSON.parse(fs.readFileSync(p, 'utf8'));
  logToFile('trends-api.log', `Fetched ${trends.length} trends`);
  res.json({ success: true, trends });
});
module.exports = router;
