=== utils/webhookEmitter.js ===
```javascript
const axios = require('axios');
const { logToFile } = require('./logger'); // Use the logger
async function emitToWebhooks(trends) {
  const webhookUrls = [
    // Add your webhook URLs here
    //'[https://your-webhook-url-1.com](https://your-webhook-url-1.com)',
    //'[https://your-webhook-url-2.com](https://your-webhook-url-2.com)',
  ];

  if (!webhookUrls.length) {
    logToFile('webhookEmitter.log', 'No webhooks configured. Skipping.');
    return;
  }

  for (const url of webhookUrls) {
    try {
      await axios.post(url, { trends });
      logToFile('webhookEmitter.log', `Successfully emitted trends to webhook: ${url}`);
    } catch (error) {
      let errorMessage = `Error emitting to webhook ${url}: `;
        if (error.response) {
            errorMessage += `Status ${error.response.status}: ${error.response.data}`;
        } else if (error.request) {
            errorMessage += 'No response received from webhook.';
        } else {
            errorMessage += error.message;
        }
      logToFile('webhookEmitter.log', errorMessage);
    }
  }
}

module.exports = { emitToWebhooks };
