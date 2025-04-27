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

function generateCSVGuide(storeData){
  guide = ''; //empty CSV
  let trophiesSubSet = storeData.base; // select base trophies

  // provision headers
  guide += _provisionHeaders();

  const processTrophies = (title, trophies) => {
    trophies.sort((a, b) => b.trophyScore - a.trophyScore); // Sort trophies
    trophies.forEach(trophy => {
      guide += _parseCSVTrophySection(title, trophy); // Add each trophy
    });
  };

  processTrophies(storeData.title, storeData.base);

  storeData.dlcs.forEach(dlc => {
    processTrophies(dlc.title, dlc.trophies);
  });

  //done
  return guide;
}

function _provisionHeaders() {
  return '"Trophy Set","Name","Description","Rarity Value","Type","Tags","Earned","Trophy Score","Guide URL","YouTube Query"\n';
}

function _parseCSVTrophySection(title, trophy) {
  const escapeCSV = (str) => `"${String(str).replace(/"/g, '""')}"`;
  const tagsDescription = trophy.tags.map(tag => tag.name).join('- ');

  return `${escapeCSV(title)},${escapeCSV(trophy.title)},${escapeCSV(trophy.description)},${escapeCSV(trophy.sonyRarityValue)},${escapeCSV(trophy.type)},${escapeCSV(tagsDescription)},${escapeCSV(trophy.earned)},${trophy.trophyScore},${escapeCSV(trophy.guideUrl)},${escapeCSV(trophy.youtubeQuery)}\n`;
}

function completeTrophiesScore(trophiesData) {
  trophiesData.forEach((element) => {
    calculateTrophyScore(element);
  });
  return trophiesData;
}

function calculateTrophyScore(trophy) {
  let score = parseInt(trophy.sonyRarityValue);

  for (let i = 0; i < trophy.tags.length; i++) {
    const element = trophy.tags[i];
    if (element.name == 'Main Storyline' || element.name == 'Story Completed') {
      score = parseInt(trophy.sonyRarityValue); + 200;
      break;
    } else {
      score += parseInt(element.priority) + 1000;
    }
  }

  trophy.trophyScore = score;
}

function parseTrophySection(trophy) {
  let result = "";
  let tags = "**Tags:**\n";

  trophy.tags.forEach((tag) => {
    tags += `- ${tag.name}: ${tag.description}\n`;
  });

  tags += `\n`;

  result += `## >${trophy.title}\n\n`;
  result += `**Description:** ${trophy.description}\n\n`;
  result += `**Rarity:** ${trophy.type}\n\n`;
  result += `**Trophy Score:** ${trophy.trophyScore}\n\n`;
  result += tags;
  result += `**Youtube Guide Link:** [Guide Link](${removeParenthesesFromString(trophy.youtubeQuery)})\n\n`;
  result += `---\n\n`;

  return result;
}

function removeParenthesesFromString(inputString) {
  // Use a regular expression to match parentheses and replace them with an empty string
  return inputString.replace(/[()]/g, '');
}

module.exports = {
  generateMarkdownGuide: generateMarkdownGuide,
  completeTrophiesScore: completeTrophiesScore,
  generateCSVGuide: generateCSVGuide
};
