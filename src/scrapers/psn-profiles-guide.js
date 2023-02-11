const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeGuide(url) {
    try {
        const baseUrl = new URL(url).origin;
        const response = await axios.get(url);
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        // Extract the guide information
        const gameUrl = baseUrl + $(".game-image-holder > a:nth-child(1)").attr("href");
        console.log('Detected url: ' + gameUrl);

        return {
            htmlContent,
            gameUrl
        };
    } catch (err) {
        throw new Error("Guide scrape failed: " + err.message);
    }
}

module.exports = {
    scrapeGuide
};