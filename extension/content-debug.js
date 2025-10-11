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
  
  const trophies = [];
  
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
      trophy.tags = Array.from(tagElements).map(tag => {
        const className = tag.className;
        const tagName = getTagNameFromClass(className);
        const tagData = getTagDataFromName(tagName);
        return {
          name: tagName,
          class: className,
          priority: tagData.priority,
          description: tagData.description
        };
      });
    }

    // Check if trophy is earned (completed)
    if (element.classList.contains('completed') || element.querySelector('.completed')) {
      trophy.earned = true;
    }

    // Generate YouTube query for trophy guide
    trophy.youtubeQuery = `${document.querySelector('main h2')?.textContent || 'Game'} ${trophy.title} trophy guide`;

  } catch (error) {
    console.error('Error extracting trophy data:', error);
  }

  return trophy;
}

function getTagNameFromClass(className) {
  // Map CSS classes to tag names based on your existing tag dictionary
  const tagMap = {
    'flg-1': 'Offline Game Mode',
    'flg-2': 'Online Game Mode', 
    'flg-3': 'Online/Offline',
    'flg-4': 'Single Player',
    'flg-5': 'Cooperative',
    'flg-6': 'Versus',
    'flg-7': 'Host Only',
    'flg-8': 'Community',
    'flg-9': 'Main Storyline',
    'flg-10': 'Story Completed',
    'flg-11': 'Difficulty Specific',
    'flg-12': 'Stackable',
    'flg-13': 'Collectable',
    'flg-14': 'Cumulative +',
    'flg-15': 'Cumulative -',
    'flg-16': 'Level',
    'flg-17': 'Shop',
    'flg-18': 'Viral',
    'flg-19': 'Online Skill',
    'flg-20': 'Players Required',
    'flg-21': 'Time/Date',
    'flg-22': 'External Content',
    'flg-23': 'Multiple Playthroughs Required',
    'flg-24': 'Missable',
    'flg-25': 'Buggy +',
    'flg-26': 'Buggy -',
    'flg-27': 'Discontinued',
    'flg-28': 'Partly Discontinued/Unobtainable',
    'flg-29': 'Unobtainable',
    'flg-30': 'Time Consuming',
    'flg-31': 'Platinum'
  };

  return tagMap[className] || className;
}

function getTagDataFromName(tagName) {
  // Tag dictionary with priority and description from your original code
  const tagDictionary = {
    'Offline Game Mode': { priority: 0, description: 'require play in game modes that do not necessitate a connection to any online services.' },
    'Online Game Mode': { priority: 2000, description: 'require a connection to live services, such as Xbox Live, for playing an online game mode, for sharing content, accessing leaderboards, or validating data with a server.' },
    'Online/Offline': { priority: 0, description: 'can be obtained in either an online or offline game mode.' },
    'Single Player': { priority: 0, description: 'can be obtained by a single player.' },
    'Main Storyline': { priority: 0, description: 'are gained automatically by progressing through the main game modes.' },
    'Difficulty Specific': { priority: 1500, description: 'require that the game be played on a certain difficulty level.' },
    'Stackable': { priority: 1500, description: 'can be unlocked at the same time as, or in the course of, earning its more difficult or less difficult counterpart.' },
    'Collectable': { priority: 1000, description: 'are obtained by exploring the game environment to find a set of unique objects.' },
    'Cumulative +': { priority: 1000, description: 'are obtained by repeatedly performing the same action or set of actions over time.' },
    'Viral': { priority: 1250, description: 'are obtained by contact with a player who meets the requirements for spreading it to others.' },
    'Online Skill': { priority: 2500, description: 'require a certain TrueSkill rank or a certain position on a Leaderboard to be reached.' },
    'Time Consuming': { priority: 1000, description: 'require at least 20 hours of play time to obtain.' },
    'Missable': { priority: 1500, description: 'can be missed.' },
    'Buggy -': { priority: 1200, description: 'may unlock after the requirements have been met or not at all.' },
    'Unobtainable': { priority: 4000, description: 'have never been possible to unlock legitimately.' },
    'Discontinued': { priority: 4000, description: 'can no longer be obtained due to closed servers, a bad patch, or other unusual circumstances.' },
    'Shop': { priority: 1200, description: 'require the purchase of an item or a series of items as prerequisites from a shop.' },
    'Buggy +': { priority: 1100, description: 'may unlock before the requirements have been met.' },
    'Level': { priority: 1100, description: 'must be obtained by levelling up in-game components.' },
    'Community': { priority: 1200, description: 'can be unlocked by interactions with a community.' },
    'Partly Discontinued/Unobtainable': { priority: 3500, description: 'may no longer be obtainable by players who have not already met specific requirements.' },
    'Multiple Playthroughs Required': { priority: 1100, description: 'cannot be earned during the initial playthrough.' },
    'Cumulative -': { priority: 1500, description: 'are obtained by repeatedly performing the same action or set of actions over time, but progress can diminish' },
    'Cooperative': { priority: 2000, description: 'can be obtained by two or more players in a cooperative game mode who have met the achievement requirements.' },
    'Versus': { priority: 2000, description: 'can be obtained by two or more players in a face off gamemode who have met the achievement requirements.' },
    'Host Only': { priority: 2000, description: 'are only earned by the host or primary player.' },
    'External Content': { priority: 3000, description: 'require content outside the game or input devices other than the system default.' },
    'Time/Date': { priority: 3000, description: 'require you to play the game or perform actions at certain times, within a time limit, or on specific dates.' },
    'Players Required': { priority: 2000, description: 'require a minimum number of participating players to attempt.' },
    'Platinum': { priority: 5000, description: 'require you to obtain all other trophies within the base game.' },
    'Story Completed': { priority: 500, description: 'are obtained upon completing the story within a game.' }
  };

  return tagDictionary[tagName] || { priority: 0, description: '' };
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
