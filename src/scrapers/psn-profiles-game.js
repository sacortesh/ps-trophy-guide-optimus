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
        Completed: ${trophyData.earned ? "Yes" : "No"} 

`);
}

function replaceDomain(url){
  let result = 'https://webcache.googleusercontent.com/search?q=cache:';
  let urlUpd = result + url;
  return urlUpd;
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
    earned: false,
    suggestedStage: 10,
    trophyScore: 0,
    guideUrl: '',
    youtubeQuery: ''
  };

  if ($row.hasClass("completed")) {
    trophy.earned = true;
  }

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

async function scrapeTrophies(gameUrl, usr = "") {
  try {
    let formatUsr = "";
    if (usr) {
      formatUsr = "/" + usr;
    }

    let secretModQury = "";//"?secret=show";
    let url = gameUrl + formatUsr + secretModQury;
    console.log("Querying: " + replaceDomain(url));
    const response = await axios.get(replaceDomain(url));
    const htmlContent = response.data;
    const $ = cheerio.load(htmlContent);

    let userFoundSelector = "#content > div.row > div.col-xs > table";

    let userFound = $(userFoundSelector).length;

    // Extract the base game and DLC trophy information
    const base = [];
    const dlcs = [];

    let baseTableIndex = 4;
    if (userFound) {
      console.log("User progress detected.");
      baseTableIndex = 5;
    }

    let baseTableContainer =
      "#content > div.row > div.col-xs > div:nth-child(" + baseTableIndex + ")";

    let hasDLC = false;

    if ($(baseTableContainer).find("table").length > 1) {
      hasDLC = true;
    }

    let baseTableId = "table:nth-child(" + (hasDLC ? "3" : "1") + ")";

    let rows = $(baseTableId).find("tr");

    $(rows).each((index, element) => {
      let trophy = extractTrophyData(element, $);

      prettyLogTrophy(trophy);
      base.push(trophy);
    });

    if (hasDLC) {
      // extract DLCs
      let i = 6;
      let dlcCounter = 0;
      let dlcTableFirstSelector =
        "#content > div.row > div.col-xs > div:nth-child(6)";

      while (true) {
        let table = $(dlcTableFirstSelector);
        if (table.length === 0) {
          console.log("No more DLC found");
          break;
        }

        dlcCounter++;
        console.log("Found DLC " + dlcCounter);

        i += 2;
        dlcTableFirstSelector =
          "#content > div.row > div.col-xs > div:nth-child(" + i + ")";
      }
    }

    let gameTitleSelector =
      "#content > div.row > div.col-xs > div.title.flex.v-align.center > div > h3";
    let title = $(gameTitleSelector).text().trim();
    title = title.replace("Trophies", "").trim();
    console.log("Detected game: " + title);

    return {
      base,
      dlcs,
      title,
    };
  } catch (err) {
    throw new Error("Game scrape failed: " + err.message);
  }
}

module.exports = {
  scrapeTrophies,
};
