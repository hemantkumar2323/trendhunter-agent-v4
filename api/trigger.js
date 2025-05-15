// api/trigger.js

const express = require('express');
const router = express.Router();
const { logToFile } = require('../utils/logger');
const fs = require('fs');
const path = require('path');

const surgeSignalPath = path.join(__dirname, '../data/live/surge-events.json');

router.post('/', (req, res) => {
  const trigger = req.body;

  try {
    if (!trigger || typeof trigger !== 'object' || !trigger.type || !trigger.niche) {
      return res.status(400).json({ success: false, message: 'Invalid trigger format' });
    }

    let current = [];
    if (fs.existsSync(surgeSignalPath)) {
      current = JSON.parse(fs.readFileSync(surgeSignalPath, 'utf8'));
    }

    current.push({ ...trigger, receivedAt: new Date().toISOString() });
    fs.writeFileSync(surgeSignalPath, JSON.stringify(current, null, 2));

    logToFile('trigger-api.log', `Trigger received: ${trigger.type} for ${trigger.niche}`);
    res.json({ success: true, message: 'Trigger recorded.' });
  } catch (err) {
    logToFile('trigger-api.log', `Error processing trigger: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
