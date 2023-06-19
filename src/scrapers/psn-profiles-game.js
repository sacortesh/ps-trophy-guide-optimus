const axios = require("axios");
const cheerio = require("cheerio");

const TT_TAGS_DICTIONNARY = [
  {
    order: 2,
    description:
      "require a connection to live services, such as Xbox Live, for playing an online game mode, for sharing content, accessing leaderboards, or validating data with a server.",
    name: "Online Game Mode",
    priority: 250,
  },
  {
    order: 1,
    description:
      "require play in game modes that do not necessitate a connection to any online services.",
    name: "Offline Game Mode",
    priority: 0,
  },
  {
    order: 3,
    description: "can be obtained in either an online or offline game mode.",
    name: "Online/Offline",
    priority: 0,
  },
  {
    order: 4,
    description: "can be obtained by a single player.",
    name: "Single Player",
    priority: 0,
  },
  {
    order: 9,
    description: "are gained automatically by progressing through the main game modes.",
    name: "Main Storyline",
    priority: 0,
  },
  {
    order: 11,
    description: "require that the game be played on a certain difficulty level.",
    name: "Difficulty Specific",
    priority: 250,
  },
  {
    order: 12,
    description:
      "can be unlocked at the same time as, or in the course of, earning its more difficult or less difficult counterpart.",
    name: "Stackable",
    priority: 250,
  },
  {
    order: 13,
    description: "are obtained by exploring the game environment to find a set of unique objects.",
    name: "Collectable",
    priority: 150,
  },
  {
    order: 14,
    description: "are obtained by repeatedly performing the same action or set of actions over time.",
    name: "Cumulative +",
    priority: 150,
  },
  {
    order: 19,
    description:
      "are obtained by contact with a player who meets the requirements for spreading it to others.",
    name: "Viral",
    priority: 200,
  },
  {
    order: 20,
    description: "require a certain TrueSkill rank or a certain position on a Leaderboard to be reached.",
    name: "Online Skill",
    priority: 300,
  },
  {
    order: 25,
    description: "require at least 20 hours of play time to obtain.",
    name: "Time Consuming",
    priority: 200,
  },
  {
    order: 13,
    description: "can be missed.",
    name: "Missable",
    priority: 200,
  },
  {
    order: 27,
    description: "may unlock after the requirements have been met or not at all.",
    name: "Buggy -",
    priority: 200,
  },
  {
    order: 30,
    description: "have never been possible to unlock legitimately.",
    name: "Unobtainable",
    priority: 300,
  },
  {
    order: 29,
    description:
      "can no longer be obtained due to closed servers, a bad patch, or other unusual circumstances.",
    name: "Discontinued",
    priority: 300,
  },
  {
    order: 18,
    description:
      "require the purchase of an item or a series of items as prerequisites from a shop.",
    name: "Shop",
    priority: 50,
  },
  {
    order: 26,
    description: "may unlock before the requirements have been met.",
    name: "Buggy +",
    priority: 100,
  },
  {
    order: 17,
    description: "must be obtained by levelling up in-game components.",
    name: "Level",
    priority: 100,
  },
  {
    order: 8,
    description: "can be unlocked by interactions with a community.",
    name: "Community",
    priority: 200,
  },
  {
    order: 28,
    description:
      "may no longer be obtainable by players who have not already met specific requirements.",
    name: "Partly Discontinued/Unobtainable",
    priority: 250,
  },
  {
    order: 23,
    description: "cannot be earned during the initial playthrough.",
    name: "Multiple Playthroughs Required",
    priority: 100,
  },
  {
    order: 15,
    description:
      "are obtained by repeatedly performing the same action or set of actions over time, but progress can diminish",
    name: "Cumulative -",
    priority: 150,
  },
  {
    order: 5,
    description:
      "can be obtained by two or more players in a cooperative game mode who have met the achievement requirements.",
    name: "Cooperative",
    priority: 200,
  },
  {
    order: 6,
    description:
      "can be obtained by two or more players in a face off gamemode who have met the achievement requirements.",
    name: "Versus",
    priority: 200,
  },
  {
    order: 7,
    description: "are only earned by the host or primary player.",
    name: "Host Only",
    priority: 200,
  },
  {
    order: 24,
    description:
      "require content outside the game or input devices other than the system default.",
    name: "External Content",
    priority: 300,
  },
  {
    order: 22,
    description:
      "require you to play the game or perform actions at certain times, within a time limit, or on specific dates.",
    name: "Time/Date",
    priority: 100,
  },
  {
    order: 21,
    description: "require a minimum number of participating players to attempt.",
    name: "Players Required",
    priority: 200,
  },
  {
    order: 31,
    description: "require you to obtain all other trophies within the base game.",
    name: "Platinum",
    priority: 0,
  },
  {
    order: 10,
    description: "are obtained upon completing the story within a game.",
    name: "Story Completed",
    priority: 0,
  },
];

function tagFetcher(tagClass) {
  let classesDetected = [];

  let zeroString = "00000000000000000000000000000000";
  let binaryTagClass = (
    zeroString + parseInt(tagClass.replace("flg-", ""), 16).toString(2)
  ).slice(-zeroString.length);

  // Iterate over the binary string
  for (var n = 0; n < binaryTagClass.length; ++n) {
    // If the binary digit is "1", push the corresponding flag data to the array
    if (binaryTagClass[n] === "1") {
      classesDetected.push(TT_TAGS_DICTIONNARY[n]);
    }
  }

  return classesDetected;
}

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

function replaceDomain(url) {
  let result = "https://webcache.googleusercontent.com/search?q=cache:";
  let urlUpd = result + url;
  return urlUpd;
}

function extractTrophyDataPSNProfiles(elem, $) {
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
    guideUrl: "",
    youtubeQuery: "",
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

function extractTrophyDataTrueProfiles(elem, $) {
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
    guideUrl: "",
    youtubeQuery: "",
  };

  //scrape title
  //scrape description
  // scrape sony rarity -> tt rarity
  // scrape type (bronce etc)

  trophy.title = $row.find(".title").text();
  trophy.description = $row.find(".t").text();

  if ($row.find(".t").hasClass("p")) trophy.type = "Platinum";
  if ($row.find(".t").hasClass("b")) trophy.type = "Bronze";
  if ($row.find(".t").hasClass("g")) trophy.type = "Gold";
  if ($row.find(".t").hasClass("s")) trophy.type = "Silver";

  let data = $row.find(".progress-bar").attr("data-af");

  const regexProgress = /(\d+(?:,\d+)?)%\s-\s/; // Regular expression pattern
  const matchProgress = data.match(regexProgress);
  const percentageValue = matchProgress[1];
  trophy.sonyRarityValue = percentageValue;

  const tagRawData = $row.find("div.info").html();
  const regexTags = /<i\s+class="([^"]+)">/i;
  const matchTags = regexTags.exec(tagRawData);
  const tagClass = matchTags[1];
  let tags = tagFetcher(tagClass);

  trophy.tags = tags;

  return trophy;
}

function isTrophyValid(tropphy) {
  let res = tropphy.title != "" && tropphy.psnpRarityValue != "";
  return res;
}

async function scrapeTrophies(gameUrl, source = "psnprofiles", usr = "") {
  let result = {
    base: [],
    dlcs: [],
    title: "",
  };

    if (source === "psnprofiles") {
      let formatUsr = "";
      if (usr) {
        formatUsr = "/" + usr;
      }

      let secretModQury = ""; //"?secret=show";
      let url = gameUrl + formatUsr + secretModQury;
      console.log("Querying: " + replaceDomain(url));
      const response = await axios.get(replaceDomain(url));
      const htmlContent = response.data;
      const $ = cheerio.load(htmlContent);

      let userFoundSelector = "#content > div.row > div.col-xs > table";

      let userFound = $(userFoundSelector).length;

      // Extract the base game and DLC trophy information
      let baseTableIndex = 4;
      if (userFound) {
        console.log("User progress detected.");
        baseTableIndex = 5;
      }

      let baseTableContainer =
        "#content > div.row > div.col-xs > div:nth-child(" +
        baseTableIndex +
        ")";

      let hasDLC = false;

      if ($(baseTableContainer).find("table").length > 1) {
        hasDLC = true;
      }

      let baseTableId = "table:nth-child(" + (hasDLC ? "3" : "1") + ")";

      let rows = $(baseTableId).find("tr");

      $(rows).each((index, element) => {
        let trophy = extractTrophyDataPSNProfiles(element, $);

        if (isTrophyValid(trophy)) {
          prettyLogTrophy(trophy);
          result.base.push(trophy);
        }
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
      result.title = title.replace("Trophies", "").trim();
      console.log("Detected game: " + result.title);
    } else if (source === "truetrophies") {
      console.log("Querying: " + gameUrl);
      let patternQuery = /\?.*/;
      gameUrl = gameUrl.replace(patternQuery, "");
      const response = await axios.get(replaceDomain(gameUrl));
      const htmlContent = response.data;

      const $ = cheerio.load(htmlContent);

      let hasDLC = false;

      const TRUE_TROPHIES_TROPHY_LIST_CONTENT = "main";
      const TRUE_TROPHIES_TROPHY_DLC_SELECTOR = ".pnl-hd.no-pills .info";
      const TRUE_TROPHIES_TROPHY_TITLE_SELECTOR = "ul.ach-panels li";
      const TRUE_TROPHIES_GAME_TITLE_SELECTOR = "h1.gh";

      let store = {
        base: [],
        dlcs: [],
        title: '',
        source: 'truetrophies'
      };
      let currentStore = "base";
      let indexStore = 0;
      let titleFound = false;

      $(TRUE_TROPHIES_TROPHY_LIST_CONTENT)
        .children()
        .each((index, element) => {
          const textContent = $(element).text();
          const htmlContent = $(element).html();

          if ($(element).hasClass("game") && !titleFound) {
            let title = $(element).find("h2").text();
            store.title = title;
            titleFound = true;
          } else if ($(element).hasClass("pnl-hd no-pills no-pr game")) {
            if(indexStore===0){
              store['base'] = [];
            } else {
              if(!store.dlcs){
                store.dlcs = [];
              }
              currentStore = 'DLC' + indexStore;
              store.dlcs.push({
                title: $(element).find("h2").text(),
                trophies: [],
              });
            }

            indexStore++;
            
          } else if ($(element).hasClass("ach-panels")) {
            if (!indexStore){
              console.warn('This game does not have DLC');
              indexStore++;
            }
            $(element)
              .find("li")
              .each((index, trophy) => {
                let trophyData = extractTrophyDataTrueProfiles(trophy, $);
                if(indexStore===1){
                  store[currentStore].push(trophyData);
                } else {
                  console.warn('Adding to DLC store');
                  store.dlcs[indexStore-2].trophies.push(trophyData);
                }
              });
          } else {
          }
        });
        return store;
    }


    return result;
  
}

module.exports = {
  scrapeTrophies,
};
