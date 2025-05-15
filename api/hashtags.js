// api/hashtags.js

const express = require('express');
const router = express.Router();

const { scrapeTikTokHashtags, scrapeInstagramHashtags } = require('../utils/scraper');
const { classifyHashtags } = require('../utils/hashtagClassifier');
const { scoreTrends } = require('../utils/scorer');
const { applyReinforcement } = require('../utils/reinforcement');
const { emitToWebhooks } = require('../utils/webhookEmitter');
const { logToFile, logJSON } = require('../utils/logger');

router.get('/:niche', async (req, res) => {
  const { niche } = req.params;
  const platform = req.query.platform || 'tiktok';

  try {
    // Step 1: Scrape
    const rawHashtags = platform === 'instagram'
      ? await scrapeInstagramHashtags(niche)
      : await scrapeTikTokHashtags(niche);

    // Step 2: Classify
    const classified = classifyHashtags(rawHashtags, niche);

    // Step 3: Score each tag in each group
    const scored = [];
    Object.values(classified).flat().forEach(tag => {
      const tagScore = scoreTrends([tag], platform, niche)[0];
      scored.push(tagScore);
    });

    // Step 4: Reinforce with memory
    const finalTrends = applyReinforcement(scored, niche);

    // Step 5: Save and send
    logJSON(`../output/${niche}-approved-trends.json`, finalTrends);
    await emitToWebhooks(finalTrends);

    res.json({ success: true, trends: finalTrends });
  } catch (err) {
    logToFile('hashtags-api.log', `Error in /api/hashtags/${niche}: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
