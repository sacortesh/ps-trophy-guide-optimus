const axios = require("axios");
const cheerio = require("cheerio");

function prettyLogTrophy(trophyData = {}) {
    console.log(`
        Title: ${trophyData.title}
        Description: ${trophyData.description}
        Sony Rarity: ${trophyData.sonyRarity} (${trophyData.sonyRarityValue})
        PSNP Rarity: ${trophyData.psnpRarity} (${trophyData.psnpRarityValue})
        Type: ${trophyData.type}
        Tags: ${trophyData.tags}
`);
}

function extractTrophyData(elem, $) {
  let $row = $(elem);
  let trophy = {
    title: "",
    description: "",
    sonyRarity: "",
    sonyRarityValue: "",
    psnpRarity: "",
    psnpRarityValue: "",
    type: "",
    tags: [],
  };

  // Check if this is a base game or DLC trophy
  trophy.title = $row.find("td:nth-child(2) > a:nth-child(1)").text().trim();
  let description = $row.find("td:nth-child(2)").text().trim();
  trophy.description = description.replace(trophy.title, "").trim();

  trophy.psnpRarityValue = $row
    .find("td.hover-hide > span > span.typo-top")
    .text()
    .trim();
  trophy.psnpRarity = $row
    .find("td.hover-hide > span > span.typo-bottom")
    .text()
    .trim();

  trophy.sonyRarityValue = $row
    .find("td.hover-show > span > span.typo-top")
    .text()
    .trim();
  trophy.sonyRarity = $row
    .find("td.hover-show > span > span.typo-bottom")
    .text()
    .trim();

  let imageSelector = "td:nth-child(6) > span > img";
  let img = $row.find(imageSelector);
  if (img.length > 0) {
    trophy.type = img.attr("title").trim();
  } else {
    console.log("Image element not found");
  }

  return trophy;
}

async function scrapeTrophies(gameUrl) {
    try {
        let secretModQury = '?secret=show';
        const response = await axios.get(gameUrl + secretModQury);
        const htmlContent = response.data;
        const $ = cheerio.load(htmlContent);

        // Extract the base game and DLC trophy information
        const base = [];
        const dlcs = [];

        let baseTableAnchor = "div.box:nth-child(5)";
        let baseTitle = "div.box:nth-child(5) > table:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)";

        let baseTable = "#content > div.row > div.col-xs > div:nth-child(4) > table:nth-child(3)"
        let rows = $(baseTable).find("tr");


        $(rows).each((index, element) => {
            let trophy = extractTrophyData(element, $);

            prettyLogTrophy(trophy);
            base.push(trophy);
        });


        // extract DLCs
        let i = 6;
        let dlcCounter = 0;
        let dlcTableFirstSelector = "#content > div.row > div.col-xs > div:nth-child(6)";
        let header = "table:nth-child(1)";
        let content = "table:nth-child(2)";

        while (true) {
            let table = $(dlcTableFirstSelector);
            if (table.length === 0) {
                console.log('No more DLC found');
                break;
            }

            dlcCounter++;
            console.log('Found DLC ' + dlcCounter);

            i += 2;
            dlcTableFirstSelector = "#content > div.row > div.col-xs > div:nth-child(" + i + ")";
        }


        return {
            base,
            dlcs
        };
    } catch (err) {
        throw new Error("Game scrape failed: " + err.message);
    }
}

module.exports = {
    scrapeTrophies
};