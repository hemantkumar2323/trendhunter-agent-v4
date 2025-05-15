// api/audio.js

const express = require('express');
const router = express.Router();

const { logToFile, logJSON } = require('../utils/logger');

// Simulated weekly trending audio by niche (would be scraped or fetched via API in production)
const trendingAudio = {
  FemSpeak: [
    { sound: "soft piano loop", usage: 12200 },
    { sound: "motivational female voiceover", usage: 10800 },
    { sound: "emotional strings fade", usage: 9500 }
  ],
  CozyHouse: [
    { sound: "cozy lo-fi beat", usage: 18000 },
    { sound: "rain + typing sounds", usage: 9400 },
    { sound: "minimal instrumental", usage: 8900 }
  ],
  MindTonic: [
    { sound: "whispers + thoughts", usage: 13800 },
    { sound: "slow heartbeat bass", usage: 12400 },
    { sound: "calm narration", usage: 9100 }
  ],
  LuxeLoop: [
    { sound: "trap luxury remix", usage: 22000 },
    { sound: "boss vibe instrumental", usage: 16000 },
    { sound: "slow fashion echo", usage: 9700 }
  ]
};

router.get('/:niche', (req, res) => {
  const { niche } = req.params;
  const audio = trendingAudio[niche];

  if (!audio) {
    logToFile('audio-api.log', `Audio trends not found for niche: ${niche}`);
    return res.status(404).json({ success: false, message: `No audio trends for ${niche}` });
  }

  logJSON(`../output/${niche}-trending-audio.json`, audio);
  logToFile('audio-api.log', `Returned ${audio.length} audio clips for ${niche}`);

  res.json({ success: true, audio });
});

module.exports = router;
