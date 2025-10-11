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
