// utils/scraper.js

const axios = require('axios');
const cheerio = require('cheerio');
const { logToFile } = require('./logger');

async function scrapeTikTokHashtags(niche) {
  try {
    const url = `https://www.tiktok.com/tag/${niche}`;
    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(response.data);
    const hashtags = [];

    $('a[href*="/tag/"]').each((i, elem) => {
      const tag = $(elem).attr('href').split('/tag/')[1];
      if (tag && !hashtags.includes(tag)) hashtags.push(`#${tag}`);
    });

    logToFile('scraper.log', `TikTok hashtags scraped for ${niche}: ${hashtags.length}`);
    return hashtags;
  } catch (err) {
    logToFile('scraper.log', `TikTok hashtag scrape failed for ${niche}: ${err.message}`);
    return [];
  }
}

async function scrapeInstagramHashtags(niche) {
  try {
    const url = `https://www.instagram.com/explore/tags/${niche}/`;
    const response = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const hashtags = []; // Placeholder: IG uses dynamic JS rendering, hard to scrape statically

    logToFile('scraper.log', `Instagram hashtag scrape simulated for ${niche}`);
    return hashtags; // Placeholder for headless browser scraping (e.g., Puppeteer)
  } catch (err) {
    logToFile('scraper.log', `Instagram hashtag scrape failed for ${niche}: ${err.message}`);
    return [];
  }
}

module.exports = {
  scrapeTikTokHashtags,
  scrapeInstagramHashtags
};
