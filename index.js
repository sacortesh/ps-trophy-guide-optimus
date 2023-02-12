const scraperGuide = require("./src/scrapers/psn-profiles-guide");
const scraperGame = require("./src/scrapers/psn-profiles-game");

const assemblerGuide = require("./src/asemblers/psn-profiles-assembler");

const printer = require("./src/printers/printer")


async function main(url) {
  // Scrape the guide information
  try {
    const guide = await scraperGuide.scrapeGuide(url);
    const trophyData = await scraperGame.scrapeTrophies(guide.gameUrl);

  console.log("Found the following base trophies. Count " + trophyData.base.length);
  trophyData.dlcs.forEach(dlc => {
    console.log("Found the following dlc trophies for DLC " + dlc.name + ". Count" + dlc.length);

  });


  const updatedGuide = await assemblerGuide.assembleGuide(guide.htmlContent, trophyData);

  console.log('guide:' + updatedGuide);

  const result = await printer.printAsPdf(updatedGuide.htmlContent);

  console.log("Operation finished! File saved in " + result.path);


  } catch (err) {
    console.error("Operation failed!", err);
  }

}

const url = process.argv[2];

if (!url) {
  console.error("A target URL must be provided as an argument");
  process.exit(1);
}

main(url);