const scraperGuide = require("./src/scrapers/psn-profiles-guide");
const scraperGame = require("./src/scrapers/psn-profiles-game");

const assemblerGuide = require("./src/assemblers/psn-profiles-assembler");
const trueTrophiesAssemblerGuide = require("./src/assemblers/true-trophies-assembler");


const printer = require("./src/printers/printer");
const utilsTrophies = require("./src/utils/trophies");

async function main(url) {
  // Scrape the guide information
  try {
    const parts = url.split(/#/);
    const cleanedUrl = parts[0];

    const guide = await scraperGuide.scrapeGuide(cleanedUrl);
    const trophyData = await scraperGame.scrapeTrophies(guide.gameUrl, guide.source);

    console.log(
      "Found the following base trophies. Count " + trophyData.base.length
    );
    trophyData.dlcs.forEach((dlc) => {
      console.log(
        "Found the following dlc trophies for DLC " +
          dlc.title +
          ". Count" +
          dlc.length
      );
    });

    console.log('Starting assmbly');

    if(guide.source === 'psnprofiles'){
      const updatedGuide = await assemblerGuide.assembleGuide(
        guide.htmlContent,
        trophyData.base,
        trophyData.title
      );
  
      const result = await printer.printAsPdf(
        updatedGuide.htmlContent,
        cleanedUrl,
        trophyData.title
      );
  
      trophyData.base = utilsTrophies.cleanTrophies(trophyData.base);
      trophyData.base = utilsTrophies.completeMissingQueries(
        trophyData.title,
        trophyData.base
      );
      trophyData.base = utilsTrophies.appendGuideUrl(cleanedUrl, trophyData.base);
  
      printer.printAsCSV(trophyData.base, trophyData.title);
  
      console.log("Operation finished! File saved in " + result.path);
    } else {
      trophyData.base = utilsTrophies.completeMissingQueries(
        trophyData.title,
        trophyData.base
      );

      trophyData.base = trueTrophiesAssemblerGuide.completeTrophiesScore(
        trophyData.base
      );

      trophyData.dlcs.forEach((dlc) => {
        dlc.trophies = utilsTrophies.completeMissingQueries(
          trophyData.title,
          dlc.trophies
        );
        dlc.trophies = trueTrophiesAssemblerGuide.completeTrophiesScore(
          dlc.trophies
        );
      });

      let guide = trueTrophiesAssemblerGuide.generateMarkdownGuide(trophyData);
      printer.printAsMD(guide, trophyData.title);

      console.log('Guide created');

    }


    
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
