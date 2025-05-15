// api/feedback.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const { logToFile } = require('../utils/logger');

const feedbackPath = path.join(__dirname, '../data/feedback/performance.json');

router.post('/', (req, res) => {
  const feedback = req.body;

  try {
    if (!feedback || typeof feedback !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid feedback payload' });
    }

    let existing = {};
    if (fs.existsSync(feedbackPath)) {
      existing = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
    }

    // Merge or update
    Object.keys(feedback).forEach(tag => {
      existing[tag] = {
        ...existing[tag],
        ...feedback[tag]
      };
    });

    fs.writeFileSync(feedbackPath, JSON.stringify(existing, null, 2));
    logToFile('feedback-api.log', `Feedback updated for ${Object.keys(feedback).length} trends.`);

    res.json({ success: true, message: 'Feedback saved.' });
  } catch (err) {
    logToFile('feedback-api.log', `Error saving feedback: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
