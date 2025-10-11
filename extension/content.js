const TT_TAGS_DICTIONNARY = [
  {
    order: 2,
    description:
      "require a connection to live services, such as Xbox Live, for playing an online game mode, for sharing content, accessing leaderboards, or validating data with a server.",
    name: "Online Game Mode",
    priority: 2000,
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
    priority: 1500,
  },
  {
    order: 12,
    description:
      "can be unlocked at the same time as, or in the course of, earning its more difficult or less difficult counterpart.",
    name: "Stackable",
    priority: 1500,
  },
  {
    order: 13,
    description: "are obtained by exploring the game environment to find a set of unique objects.",
    name: "Collectable",
    priority: 1000,
  },
  {
    order: 14,
    description: "are obtained by repeatedly performing the same action or set of actions over time.",
    name: "Cumulative +",
    priority: 1000,
  },
  {
    order: 19,
    description:
      "are obtained by contact with a player who meets the requirements for spreading it to others.",
    name: "Viral",
    priority: 1250,
  },
  {
    order: 20,
    description: "require a certain TrueSkill rank or a certain position on a Leaderboard to be reached.",
    name: "Online Skill",
    priority: 2500,
  },
  {
    order: 25,
    description: "require at least 20 hours of play time to obtain.",
    name: "Time Consuming",
    priority: 1000,
  },
  {
    order: 13,
    description: "can be missed.",
    name: "Missable",
    priority: 1500,
  },
  {
    order: 27,
    description: "may unlock after the requirements have been met or not at all.",
    name: "Buggy -",
    priority: 1200,
  },
  {
    order: 30,
    description: "have never been possible to unlock legitimately.",
    name: "Unobtainable",
    priority: 4000,
  },
  {
    order: 29,
    description:
      "can no longer be obtained due to closed servers, a bad patch, or other unusual circumstances.",
    name: "Discontinued",
    priority: 4000,
  },
  {
    order: 18,
    description:
      "require the purchase of an item or a series of items as prerequisites from a shop.",
    name: "Shop",
    priority: 1200,
  },
  {
    order: 26,
    description: "may unlock before the requirements have been met.",
    name: "Buggy +",
    priority: 1100,
  },
  {
    order: 17,
    description: "must be obtained by levelling up in-game components.",
    name: "Level",
    priority: 1100,
  },
  {
    order: 8,
    description: "can be unlocked by interactions with a community.",
    name: "Community",
    priority: 1200,
  },
  {
    order: 28,
    description:
      "may no longer be obtainable by players who have not already met specific requirements.",
    name: "Partly Discontinued/Unobtainable",
    priority: 3500,
  },
  {
    order: 23,
    description: "cannot be earned during the initial playthrough.",
    name: "Multiple Playthroughs Required",
    priority: 1100,
  },
  {
    order: 15,
    description:
      "are obtained by repeatedly performing the same action or set of actions over time, but progress can diminish",
    name: "Cumulative -",
    priority: 1500,
  },
  {
    order: 5,
    description:
      "can be obtained by two or more players in a cooperative game mode who have met the achievement requirements.",
    name: "Cooperative",
    priority: 2000,
  },
  {
    order: 6,
    description:
      "can be obtained by two or more players in a face off gamemode who have met the achievement requirements.",
    name: "Versus",
    priority: 2000,
  },
  {
    order: 7,
    description: "are only earned by the host or primary player.",
    name: "Host Only",
    priority: 2000,
  },
  {
    order: 24,
    description:
      "require content outside the game or input devices other than the system default.",
    name: "External Content",
    priority: 3000,
  },
  {
    order: 22,
    description:
      "require you to play the game or perform actions at certain times, within a time limit, or on specific dates.",
    name: "Time/Date",
    priority: 3000,
  },
  {
    order: 21,
    description: "require a minimum number of participating players to attempt.",
    name: "Players Required",
    priority: 2000,
  },
  {
    order: 31,
    description: "require you to obtain all other trophies within the base game.",
    name: "Platinum",
    priority: 5000,
  },
  {
    order: 10,
    description: "are obtained upon completing the story within a game.",
    name: "Story Completed",
    priority: 500,
  },
];

// Debug version of content script with more logging
console.log('🏆 TrueTrophies Data Extractor loaded');
console.log('📍 Current URL:', window.location.href);
console.log('📍 Page title:', document.title);

// Listen for messages from popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('📨 Message received:', request);
  
  if (request.action === 'extractTrophies') {
    console.log('🔄 Starting trophy extraction...');
    
    try {
      const result = extractTrophyData();
      console.log('✅ Extraction result:', result);
      sendResponse(result);
    } catch (error) {
      console.error('❌ Error extracting trophy data:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    }
    return true; // Keep message channel open for async response
  }
  
  // Handle other messages
  if (request.action === 'ping') {
    console.log('🏓 Ping received, responding with pong');
    sendResponse({status: 'pong', url: window.location.href});
    return true;
  }
});

function extractTrophyData() {
  console.log('🔄 Starting trophy data extraction...');
  
  // Extract game title
  const gameTitleElement = document.querySelector('main h2');
  const gameTitle = gameTitleElement ? gameTitleElement.textContent.trim() : 'Unknown Game';
  
  console.log('🎮 Game:', gameTitle);
  
  // Find all trophy elements
  const trophyElements = document.querySelectorAll('main article .ach-panels li');
  console.log(`🏆 Found ${trophyElements.length} trophy elements`);
  
  // Debug: Log the first few trophy elements
  trophyElements.forEach((element, index) => {
    if (index < 3) { // Only log first 3 for debugging
      console.log(`Trophy ${index + 1} element:`, element);
      console.log(`Trophy ${index + 1} title:`, element.querySelector('.title')?.textContent);
    }
  });
  
  let trophies = [];
  
  trophyElements.forEach((element, index) => {
    try {
      const trophy = extractTrophyFromElement(element);
      if (trophy && trophy.title) {
        // Calculate trophy score using your original logic
        calculateTrophyScore(trophy);
        trophies.push(trophy);
        console.log(`✅ Extracted trophy ${index + 1}: ${trophy.title} (Score: ${trophy.trophyScore})`);
      } else {
        console.log(`⚠️ Skipped trophy ${index + 1}: no title found`);
      }
    } catch (error) {
      console.error(`❌ Error extracting trophy ${index + 1}:`, error);
    }
  });
  
  // Apply your original processing functions
  trophies = completeMissingQueries(gameTitle, trophies);
  
  console.log(`✅ Successfully extracted ${trophies.length} trophies`);
  
  return {
    success: true,
    trophies: trophies,
    trophyCount: trophies.length,
    gameTitle: gameTitle,
    gameUrl: window.location.href
  };
}

function extractTrophyFromElement(element) {
  const trophy = {
    title: '',
    description: '',
    sonyRarity: '',
    sonyRarityValue: '',
    psnpRarity: '',
    psnpRarityValue: '',
    type: '',
    tags: [],
    earned: false,
    suggestedStage: 10,
    trophyScore: 0,
    guideUrl: '',
    youtubeQuery: ''
  };

  try {
    // Extract title
    const titleElement = element.querySelector('.title');
    if (titleElement) {
      trophy.title = titleElement.textContent.trim();
    }

    // Extract description
    const descriptionElement = element.querySelector('.t');
    if (descriptionElement) {
      trophy.description = descriptionElement.textContent.trim();
    }

    // Extract trophy type (Bronze, Silver, Gold, Platinum)
    const typeElement = element.querySelector('.t');
    if (typeElement) {
      if (typeElement.classList.contains('b')) trophy.type = 'Bronze';
      else if (typeElement.classList.contains('s')) trophy.type = 'Silver';
      else if (typeElement.classList.contains('g')) trophy.type = 'Gold';
      else if (typeElement.classList.contains('p')) trophy.type = 'Platinum';
    }

    // Extract rarity data
    const progressBar = element.querySelector('.progress-bar');
    if (progressBar) {
      const dataAf = progressBar.getAttribute('data-af');
      if (dataAf) {
        // Extract percentage from data-af attribute
        const percentageMatch = dataAf.match(/(\d+(?:,\d+)?)%/);
        if (percentageMatch) {
          trophy.sonyRarityValue = percentageMatch[1];
          trophy.sonyRarity = percentageMatch[1] + '%';
        }
      }
    }

    // Extract tags
    const infoElement = element.querySelector('div.info');
    if (infoElement) {
      const tagElements = infoElement.querySelectorAll('i');
      const tagClass = tagElements[0].className;
      const trophyTags = getTagsFromClass(tagClass);
      trophy.tags = trophyTags;
    }

    // Check if trophy is earned (completed)
    if (element.classList.contains('completed') || element.querySelector('.completed')) {
      trophy.earned = true;
    }

  } catch (error) {
    console.error('Error extracting trophy data:', error);
  }

  return trophy;
}

function getTagsFromClass(tagClass) {
  if (!tagClass || !tagClass.startsWith('flg-')) {
    return [];
  }

  const detectedTags = [];
  const hexValue = tagClass.replace('flg-', '');
  const flagValue = parseInt(hexValue, 16);
  
  if (isNaN(flagValue)) {
    return [];
  }

  const binaryString = flagValue.toString(2).padStart(32, '0');

  for (let bitIndex = 0; bitIndex < binaryString.length; bitIndex++) {
    if (binaryString[bitIndex] === '1' && TT_TAGS_DICTIONNARY[bitIndex]) {
      detectedTags.push(TT_TAGS_DICTIONNARY[bitIndex]);
    }
  }

  return detectedTags;
}

function calculateTrophyScore(trophy) {
  let score = parseInt(trophy.sonyRarityValue) || 0;

  for (let i = 0; i < trophy.tags.length; i++) {
    const element = trophy.tags[i];
    if (element.name == 'Main Storyline' || element.name == 'Story Completed') {
      score = parseInt(trophy.sonyRarityValue) + 200;
      break;
    } else {
      score += parseInt(element.priority) + 1000;
    }
  }

  trophy.trophyScore = score;
}

function completeMissingQueries(gameTitle, trophiesData) {
  trophiesData.forEach((element) => {
    if (!element.youtubeQuery) {
      let youtubeQuery = "https://www.youtube.com/results?search_query=" + 
                        gameTitle + " " + element.title + " trophy guide";
      youtubeQuery = youtubeQuery.replace(/\s/g, "+");
      element.youtubeQuery = youtubeQuery;
    }
  });
  return trophiesData;
}

// Auto-detect when page is ready and notify popup
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🏆 Page loaded, ready for extraction');
  });
} else {
  console.log('🏆 Page already loaded, ready for extraction');
}
