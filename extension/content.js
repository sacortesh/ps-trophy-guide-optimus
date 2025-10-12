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
    sendResponse({ status: 'pong', url: window.location.href });
    return true;
  }
});

function extractTrophyData() {
  console.log('🔄 Starting trophy data extraction...');

  // Extract game title
  const gameTitleElement = document.querySelector('main h2');
  const gameTitle = gameTitleElement ? gameTitleElement.textContent.trim() : 'Unknown Game';

  console.log('🎮 Game:', gameTitle);

  // Initialize result structure like your original code
  const result = {
    base: [],
    dlcs: [],
    title: gameTitle,
    gameUrl: window.location.href
  };

  // Find all article elements (like your original code)
  const articleElements = document.querySelectorAll('main article');
  console.log(`📄 Found ${articleElements.length} article elements`);

  let indexStore = 0;
  let currentStore = 'base';

  articleElements.forEach((article, articleIndex) => {
    console.log(`🔍 Processing article ${articleIndex + 1}`);

    // Process children of each article
    const children = Array.from(article.children);

    children.forEach((element, childIndex) => {
      // Check for DLC/game section headers
      if (element.classList.contains('pnl-hd') &&
          element.classList.contains('no-pills') &&
          element.classList.contains('no-pr') &&
          element.classList.contains('game')) {

        console.log('📋 Found game/DLC header');

        if (indexStore === 0) {
          // First section is base game
          result.base = [];
          currentStore = 'base';
          console.log('🎮 Base game section detected');
        } else {
          // Subsequent sections are DLCs
          if (!result.dlcs) {
            result.dlcs = [];
          }

          const dlcTitle = element.querySelector('h2')?.textContent?.trim() || `Unnamed DLC ${indexStore}`;
          result.dlcs.push({
            title: dlcTitle,
            trophies: []
          });

          currentStore = `dlc_${indexStore - 1}`;
          console.log(`📦 DLC section detected: ${dlcTitle}`);
        }

        indexStore++;
      }
      // Check for trophy panels
      else if (element.classList.contains('ach-panels')) {
        console.log('🏆 Found trophy list block');

        if (!indexStore) {
          console.warn('⚠️ No DLC header before trophy list; assuming base game trophies');
          indexStore++;
        }

        const trophyElements = element.querySelectorAll('li');
        console.log(`🏆 Found ${trophyElements.length} trophies in this section`);

        trophyElements.forEach((trophyElement, trophyIndex) => {
          try {
            const trophy = extractTrophyFromElement(trophyElement);
            if (trophy && trophy.title) {
              calculateTrophyScore(trophy);

              // Add to appropriate section
              if (indexStore === 1) {
                // Base game trophies
                result.base.push(trophy);
                console.log(`✅ Added base trophy: ${trophy.title}`);
              } else {
                // DLC trophies
                const dlcIndex = indexStore - 2;
                if (result.dlcs[dlcIndex]) {
                  result.dlcs[dlcIndex].trophies.push(trophy);
                  console.log(`✅ Added DLC trophy: ${trophy.title} to ${result.dlcs[dlcIndex].title}`);
                }
              }
            }
          } catch (error) {
            console.error(`❌ Error extracting trophy ${trophyIndex + 1}:`, error);
          }
        });
      }
    });
  });

  // Apply processing functions to all trophies
  result.base = completeMissingQueries(gameTitle, result.base);
  if (result.dlcs) {
    result.dlcs.forEach(dlc => {
      dlc.trophies = completeMissingQueries(gameTitle, dlc.trophies);
    });
  }

  const totalTrophies = result.base.length + (result.dlcs?.reduce((sum, dlc) => sum + dlc.trophies.length, 0) || 0);
  console.log(`✅ Successfully extracted ${totalTrophies} total trophies`);
  console.log(`   - Base game: ${result.base.length} trophies`);
  console.log(`   - DLCs: ${result.dlcs?.length || 0} sets with ${result.dlcs?.reduce((sum, dlc) => sum + dlc.trophies.length, 0) || 0} trophies`);

  return {
    success: true,
    ...result,
    trophyCount: totalTrophies
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
      if (typeElement.classList.contains('b')) {trophy.type = 'Bronze';}
      else if (typeElement.classList.contains('s')) {trophy.type = 'Silver';}
      else if (typeElement.classList.contains('g')) {trophy.type = 'Gold';}
      else if (typeElement.classList.contains('p')) {trophy.type = 'Platinum';}
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
      const searchQuery = `${gameTitle} ${element.title} trophy guide`;
      const youtubeQuery = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(searchQuery);
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
