=== api/trigger.js ===
```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { logToFile } = require('../utils/logger'); // Use the logger

const surgePath = path.join(__dirname, '../data/live/surge-events.json');
router.post('/', (req, res) => {
  const t = req.body;
  const arr = fs.existsSync(surgePath)
    ? JSON.parse(fs.readFileSync(surgePath, 'utf8'))
    : [];
  arr.push({ ...t, time: new Date().toISOString() });
  fs.writeFileSync(surgePath, JSON.stringify(arr, null, 2));
  logToFile('trigger-api.log', `Trigger: ${t.type} for ${t.niche}`);
  res.json({ success: true });
});
module.exports = router;

