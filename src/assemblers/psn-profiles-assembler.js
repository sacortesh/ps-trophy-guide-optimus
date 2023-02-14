const cheerio = require("cheerio");
const tags = require("./tags");

function assembleGuide(htmlContent, trophyData, title) {
  return new Promise((resolve, reject) => {
    try {
      // code for sorting the trophies in the guide based on achievement rate goes here

      trophyData = extractTrophyTags(htmlContent, trophyData);

      htmlContent = injectThrophyRarity(htmlContent, trophyData, title);

      const updatedGuide = {
        htmlContent: htmlContent,
        trophyData: trophyData,
      };
      resolve(updatedGuide);
    } catch (err) {
      reject(err);
    }
  });
}

function injectThrophyRarity(htmlContent, trophyData, title) {
  let i = 1;
  let tableSelctor = "#roadmapStep" + i;
  let $ = cheerio.load(htmlContent);

  while (true) {
    let stage = $(tableSelctor);

    if (stage.length) {
      // found stages
      let containers = $(stage).find(".col-xs-6");
      $(containers).each((index, element) => {
        // div.col-xs-6:nth-child(11) > div:nth-child(1) trophy flex v-align
        // if earned add class earned

        let trop = $(element).find("a").text().trim();
        let tropData = getTrophyData(trophyData, trop);

        if (tropData.earned) {
          let elem = $(element).find(".trophy.flex.v-align");
          elem.addClass("earned");
        }

        let div = $(element).find("div:nth-child(1) > div:nth-child(2)");

        let score = tags.getTagsPriority(tropData.tags);
        let value = Math.round(
          parseFloat(tropData.psnpRarityValue.replace("%", ""))
        );
        score = score + value;

        console.log("score: " + score);

        $(element).attr("scoreValue", score);

        let tagsF =
          tropData.tags.length > 0
            ? tropData.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("\n")
            : "";

        let youtubeQuery =
          "https://www.youtube.com/results?search_query=" +
          title +
          " " +
          tropData.title +
          " trophy guide";
        youtubeQuery = youtubeQuery.replace(/\s/g, "+");

        let youtube =
          '<span class="tag Type">' +
          '<a href="' +
          youtubeQuery +
          '" >Search on YouTube</a>' +
          "</span>";

        let htmlTags = '<div class="ellipsis">' + youtube + tagsF + "</div>";

        $(div).append(htmlTags);

        let spanRarity =
          '<span class="typo-bottom">' +
          tropData.psnpRarityValue +
          " (" +
          tropData.psnpRarity +
          ")</span>";

        $(div).find("div:nth-child(1)").append(spanRarity);
      });

      let containersArray = $(containers)
        .toArray()
        .sort((a, b) => {
          let scoreA = parseInt($(a).attr("scoreValue"));
          let scoreB = parseInt($(b).attr("scoreValue"));
          return scoreB - scoreA;
        });

      let trophyCabinet = $(stage).find(".row.roadmap-trophies");

      if (trophyCabinet.length) {
        $(trophyCabinet).empty();
        containersArray.forEach((element) => {
          console.log("appending");
          $(trophyCabinet).append(element);
        });
      }

      //

      i++;
      tableSelctor = "#roadmapStep" + i;
    } else {
      break;
    }
  }

  let table1 = "#roadmapStep2 > div > div > div";
  return $.html();
}

function getTrophyData(trophies, title) {
  let result = trophies.find((trophy) => trophy.title === title);
  return result || {};
}

function extractTrophyTags(htmlContent, trophyData) {
  const $ = cheerio.load(htmlContent);

  let tableSelector = "#1-overview > div > table > tbody";
  let table = $(tableSelector);
  let rows = table.find("tr");

  let trophiesPerTag = [];

  $(rows).each((index, element) => {
    let tag = $(element).find(".tag").text().trim();
    let links = [];
    $(element)
      .find("td > nobr > a")
      .each((i, elem) => {
        links.push($(elem).text().trim());
      });

    trophiesPerTag.push({
      tag: tag,
      trophies: links,
    });
  });

  let trophies = consolidateTrophyList(trophiesPerTag, trophyData);
  return trophies;
}

function consolidateTrophyList(tags, trophies) {
  trophies.forEach((trophy) => {
    tags.forEach((tag) => {
      if (tag.trophies.includes(trophy.title)) {
        trophy.tags.push(tag.tag);
      }
    });
  });

  return trophies;
}

module.exports = {
  assembleGuide: assembleGuide,
};
