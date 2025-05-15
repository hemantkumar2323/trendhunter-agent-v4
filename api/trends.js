=== api/feedback.js ===
```javascript
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { logToFile } = require('../utils/logger'); // Use the logger

const feedbackPath = path.join(__dirname, '../data/feedback/performance.json');
router.post('/', (req, res) => {
  const fb = req.body;
  let existing = {};
  if (fs.existsSync(feedbackPath)) existing = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
  Object.assign(existing, fb);
  fs.writeFileSync(feedbackPath, JSON.stringify(existing, null, 2));
  logToFile('feedback-api.log', `Updated feedback for ${Object.keys(fb).length} items`);
  res.json({ success: true });
});
module.exports = router;

