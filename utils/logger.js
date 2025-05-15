=== utils/scraper.js ===
```javascript
const axios = require('axios');
const cheerio = require('cheerio');
const { logToFile } = require('./logger'); // Use the logger

const MAX_RETRIES = 3; // Define a constant for maximum retries
const DELAY_BETWEEN_RETRIES = 1000; // Define a constant for delay (in ms)

async function scrapeTikTokHashtags(niche) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const res = await axios.get(`https://www.tiktok.com/tag/${niche}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' // Add a user agent
        }
      });
      res.raiseForStatus(); // Check for HTTP status codes 200-299
      const $ = cheerio.load(res.data);
      const tags = new Set();
      $('a[href*="/tag/"]').each((i, e) => tags.add($(e).text()));
      const list = Array.from(tags);
      logToFile('scraper.log', `TikTok scraped ${list.length} hashtags for "${niche}"`);
      return list;
    } catch (error) {
      let errorMessage = `Error scraping TikTok for "${niche}" (Attempt ${retries + 1}): `;
      if (error.response) {
        errorMessage += `Status ${error.response.status}: ${error.response.data}`;
        if (error.response.status === 429) {
          errorMessage += ' - Rate limiting detected. Retrying...';
          logToFile('scraper.log', errorMessage);
          retries++;
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_RETRIES)); //simple delay
          continue; // Retry the request
        }
      } else if (error.request) {
        errorMessage += 'No response received from TikTok.';
      } else {
        errorMessage += error.message;
      }
      logToFile('scraper.log', errorMessage);
      // Only reject after all retries have failed
      if (retries >= MAX_RETRIES -1) {
        throw new Error(errorMessage);
      }
      retries++;
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_RETRIES));
    }
  }
  return []; //Should not reach here
}

async function scrapeInstagramHashtags(niche) {
  logToFile('scraper.log', `IG stub for ${niche}`);
  return [];
}

module.exports = { scrapeTikTokHashtags, scrapeInstagramHashtags };
