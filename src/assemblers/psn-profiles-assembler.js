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

function injectThrophyRarity(htmlContent, trophiesData, title) {
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

        let trophyId = $(element).find("a").text().trim();
        let tropUrl = $(element).find("a").attr("href");
        console.log('Assmbling with this data:');
        console.log(JSON.stringify(trophiesData));
        let trophyData = getTrophyData(trophiesData, trophyId);
        
        if(trophyData){
          console.log('valtrop: ' + trophyData);
          trophiesData = addTrophyUrl(trophiesData, trophyId, tropUrl);
          trophiesData = addSuggestedStage(trophiesData, trophyId, i);
  
          if (trophyData.earned) {
            let elem = $(element).find(".trophy.flex.v-align");
            elem.addClass("earned");
          }
  
          let div = $(element).find("div:nth-child(1) > div:nth-child(2)");
  
          let score = tags.getTagsPriority(trophyData.tags);
          console.log('TD:' + trophyData.title + trophyData.psnpRarityValue)
          let value = Math.round(
            parseFloat(trophyData.psnpRarityValue.replace("%", ""))
          );
          score = score + value;
          trophiesData = addTrophyScore(trophiesData, trophyId, score);
  
          console.log("score: " + score);
  
          $(element).attr("scoreValue", score);
  
          let tagsF =
            trophyData.tags.length > 0
              ? trophyData.tags
                  .map((tag) => `<span class="tag">${tag}</span>`)
                  .join("\n")
              : "";
  
          let youtubeQuery =
            "https://www.youtube.com/results?search_query=" +
            title +
            " " +
            trophyData.title +
            " trophy guide";
          youtubeQuery = youtubeQuery.replace(/\s/g, "+");
  
          trophiesData = addTrophyYoutubeQuery(trophiesData, trophyId, youtubeQuery);
  
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
            trophyData.psnpRarityValue +
            " (" +
            trophyData.psnpRarity +
            ")</span>";
  
          $(div).find("div:nth-child(1)").append(spanRarity);
  
        }
        
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
  console.log('Searching ' + title);
  let result = trophies.find((trophy) => trophy.title === title);
  return result;
}

function addTrophyYoutubeQuery(trophies, title, url) {
  let trophyToUpdate = trophies.find((trophy) => trophy.title === title);

  if (trophyToUpdate) {
    trophyToUpdate.youtubeQuery = url;
  }
  return trophies;
}


function addTrophyUrl(trophies, title, url) {
  let trophyToUpdate = trophies.find((trophy) => trophy.title === title);

  if (trophyToUpdate) {
    trophyToUpdate.guideUrl = url;
  }
  return trophies;
}

function addTrophyScore(trophies, title, score) {
  let trophyToUpdate = trophies.find((trophy) => trophy.title === title);

  if (trophyToUpdate) {
    trophyToUpdate.trophyScore = score;
  }
  return trophies;
}

function addSuggestedStage(trophies, title, stage) {
  let trophyToUpdate = trophies.find((trophy) => trophy.title === title);

  if (trophyToUpdate) {
    trophyToUpdate.suggestedStage = stage;
  }
  return trophies;
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
  console.log('LOVA');

  console.log(trophiesPerTag);
  console.log(trophyData);
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
