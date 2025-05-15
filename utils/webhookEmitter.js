// utils/webhookEmitter.js

const axios = require('axios');
const { logToFile } = require('./logger');

const endpoints = {
  creativeAgent: "https://your-domain.com/creative-agent/api/receiveTrends",
  postMortemAgent: "https://your-domain.com/postmortem-agent/api/trendLog",
  schedulerAgent: "https://your-domain.com/scheduler-agent/api/immediatePush"
};

async function emitToWebhooks(finalTrends) {
  try {
    const payload = { trends: finalTrends };

    // Send to CreativeAgent
    await axios.post(endpoints.creativeAgent, payload);
    logToFile('webhookEmitter.log', `Sent trends to CreativeAgent`);

    // Send to PostMortemAgent
    await axios.post(endpoints.postMortemAgent, payload);
    logToFile('webhookEmitter.log', `Sent trends to PostMortemAgent`);

    // Optional: Send to Scheduler if score > threshold
    const hotTrends = finalTrends.filter(t => t.score >= 95);
    if (hotTrends.length > 0) {
      await axios.post(endpoints.schedulerAgent, { trends: hotTrends });
      logToFile('webhookEmitter.log', `Urgent push to SchedulerAgent: ${hotTrends.length} items`);
    }

  } catch (err) {
    logToFile('webhookEmitter.log', `Error sending to webhook: ${err.message}`);
  }
}

module.exports = {
  emitToWebhooks
};
