const axios = require("axios");
const cheerio = require("cheerio");

function replaceDomain(url){
    let result = 'https://webcache.googleusercontent.com/search?q=cache:';
    let urlUpd = result + url;
    return urlUpd;
}

async function scrapeGuide(url) {
    try {
        const baseUrl = new URL(url).origin;

        const response = await axios.get(replaceDomain(url));
        let htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        // Extract the guide information
        const gameUrl = baseUrl + $(".game-image-holder > a:nth-child(1)").attr("href");
        console.log('Detected url: ' + gameUrl);

        //#bN015htcoyT__google-cache-hdr
        $('#bN015htcoyT__google-cache-hdr').remove();
        htmlContent = $.html();
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