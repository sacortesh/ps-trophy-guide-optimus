function generateMarkdownGuide(storeData) {
  let trophies = storeData.base;
  let guide = `# Trophy Guide for ${storeData.title}\n\n`;

  // Sort trophies by trophy score in descending order
  trophies.sort((a, b) => b.trophyScore - a.trophyScore);


  // Iterate through each trophy
  trophies.forEach((trophy) => {
    guide += parseTrophySection(trophy);
  });

  storeData.dlcs.forEach(dlc => {
    guide += `# Trophy Guide for DLC ${dlc.title}\n\n`;
    trophies = dlc.trophies;
    trophies.sort((a, b) => b.trophyScore - a.trophyScore);
    trophies.forEach((trophy) => {
      guide += parseTrophySection(trophy);
    });
  });

  // TODO if dlc,
  // loop over evey dlc, do the same thing
  // append.

  return guide;
}

function completeTrophiesScore(trophiesData) {
  trophiesData.forEach((element) => {
    calculateTrophyScore(element);
  });
  return trophiesData;
}

function calculateTrophyScore(trophy) {
  let score = parseInt(trophy.sonyRarityValue);
  trophy.tags.forEach((element) => {
    score += parseInt(element.priority);
  });

  trophy.trophyScore = score;
}

function parseTrophySection(trophy) {
  let result = "";
  let tags = "**Tags:**\n";

  trophy.tags.forEach((tag) => {
    tags += `- ${tag.name}: ${tag.description}\n`;
  });

  tags += `\n`;

  result += `## ${trophy.title}\n\n`;
  result += `**Description:** ${trophy.description}\n\n`;
  result += `**Rarity:** ${trophy.type}\n\n`;
  result += `**Trophy Score:** ${trophy.trophyScore}\n\n`;
  result += tags;
  result += `**Youtube Guide Link:** [Guide Link](${trophy.youtubeQuery})\n\n`;
  result += `---\n\n`;

  return result;
}

module.exports = {
  generateMarkdownGuide: generateMarkdownGuide,
  completeTrophiesScore: completeTrophiesScore,
};
