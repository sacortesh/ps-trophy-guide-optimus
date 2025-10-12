// Debug popup script with connection testing
const DISABLE_ADVERTISEMENTS = false; // Set to true to disable all advertisements

// Global variable to store game name
let globalGameName = null;

document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractBtn');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const status = document.getElementById('status');
  const detectedGame = document.getElementById('detectedGame');
  const detectedGameName = document.getElementById('detectedGameName');
  const gameInfo = document.getElementById('gameInfo');
  const gameTitle = document.getElementById('gameTitle');
  const trophyCount = document.getElementById('trophyCount');
  
  // Affiliate section elements
  const affiliateSection = document.getElementById('affiliateSection');
  const affiliateGameTitle = document.getElementById('affiliateGameTitle');
  const affiliateGame = document.getElementById('affiliateGame');
  const affiliateAccessories = document.getElementById('affiliateAccessories');
  const affiliateMerch = document.getElementById('affiliateMerch');
  const affiliateCollectibles = document.getElementById('affiliateCollectibles');

  // Call method when popup opens
  onPopupOpened();

  // Test connection first
  testConnection();

  function onPopupOpened() {
    console.log('🚀 Popup opened - initializing...');
    
    // Extract game name from URL
    extractGameNameFromUrl();
    
    console.log('📊 Popup opened at:', new Date().toISOString());
    
    console.log('✅ Popup initialization complete');
  }

  function extractGameNameFromUrl() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      console.log('🔍 Extracting game name from URL:', currentTab.url);
      
      if (currentTab.url.includes('truetrophies.com/game/') && currentTab.url.includes('/trophies')) {
        // Extract game name from URL structure: truetrophies.com/game/[game-name]/trophies
        const urlMatch = currentTab.url.match(/truetrophies\.com\/game\/([^\/]+)\/trophies/);
        if (urlMatch && urlMatch[1]) {
          globalGameName = decodeURIComponent(urlMatch[1].replace(/-/g, ' '));
          console.log('🎮 Game name extracted:', globalGameName);
          
          // Display detected game immediately
          detectedGameName.textContent = globalGameName;
          detectedGame.style.display = 'block';
          
          // Generate affiliate links immediately if advertisements are enabled
          if (!DISABLE_ADVERTISEMENTS) {
            generateAffiliateLinks(globalGameName);
            affiliateSection.style.display = 'block';
          }
        } else {
          globalGameName = 'Unknown Game';
          console.log('⚠️ Could not extract game name from URL');
          detectedGameName.textContent = globalGameName;
          detectedGame.style.display = 'block';
        }
      } else {
        globalGameName = null;
        console.log('⚠️ Not on a TrueTrophies game page');
        detectedGame.style.display = 'none';
        affiliateSection.style.display = 'none';
      }
    });
  }

  // Helper function to get the global game name
  function getGlobalGameName() {
    return globalGameName;
  }

  function testConnection() {
    status.textContent = '🔄 Testing connection...';
    status.className = 'status info';

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      console.log('Current tab:', currentTab.url);
      
      if (currentTab.url.includes('truetrophies.com/game/') && currentTab.url.includes('/trophies')) {
        // Send ping to test connection
        chrome.tabs.sendMessage(tabs[0].id, {action: 'ping'}, function(response) {
          if (chrome.runtime.lastError) {
            console.error('Connection error:', chrome.runtime.lastError);
            status.textContent = '❌ Connection failed: ' + chrome.runtime.lastError.message;
            status.className = 'status error';
            extractBtn.disabled = true;
          } else if (response && response.status === 'pong') {
            console.log('Connection successful:', response);
            status.textContent = '✅ Connected! Ready to extract from: ' + response.url;
            status.className = 'status success';
            extractBtn.disabled = false;
          } else {
            status.textContent = '⚠️ Unexpected response: ' + JSON.stringify(response);
            status.className = 'status error';
            extractBtn.disabled = true;
          }
        });
      } else {
        status.textContent = '⚠️ Please navigate to a TrueTrophies game trophy page';
        status.className = 'status error';
        extractBtn.disabled = true;
      }
    });
  }

  // Extract trophy data
  extractBtn.addEventListener('click', function() {
    status.textContent = '🔄 Extracting trophy data...';
    status.className = 'status info';
    extractBtn.disabled = true;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'extractTrophies'}, function(response) {
        if (chrome.runtime.lastError) {
          console.error('Extraction error:', chrome.runtime.lastError);
          status.textContent = '❌ Error: ' + chrome.runtime.lastError.message;
          status.className = 'status error';
          extractBtn.disabled = false;
          return;
        }

        console.log('Extraction response:', response);

        if (response && response.success) {
          status.textContent = `✅ Extracted ${response.trophyCount} trophies`;
          status.className = 'status success';
          
          // Show game info
          gameTitle.textContent = response.gameTitle || 'Unknown Game';
          trophyCount.textContent = response.trophyCount;
          gameInfo.style.display = 'block';
          
          // Generate and show affiliate links (if advertisements are enabled)
          if (!DISABLE_ADVERTISEMENTS) {
            generateAffiliateLinks(response.gameTitle || 'Unknown Game');
            affiliateSection.style.display = 'block';
          }
          
          // Enable export button
          exportBtn.disabled = false;
          clearBtn.disabled = false;
          
          // Store data for export
          chrome.storage.local.set({
            trophyData: response,
            gameTitle: response.title,
            gameUrl: response.gameUrl
          });
        } else {
          status.textContent = '❌ Failed to extract trophy data: ' + (response?.error || 'Unknown error');
          status.className = 'status error';
        }
        
        extractBtn.disabled = false;
      });
    });
  });

  // Export to CSV
  exportBtn.addEventListener('click', function() {
    chrome.storage.local.get(['trophyData', 'gameTitle', 'gameUrl'], function(data) {
      if (!data.trophyData) {
        status.textContent = '❌ No data to export';
        status.className = 'status error';
        return;
      }

      const csv = generateCSV(data.trophyData, data.trophyData.title);
      const filename = sanitizeFilename(data.trophyData.title || 'trophies') + '.csv';
      
      // Download the CSV file
      chrome.downloads.download({
        url: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv),
        filename: filename,
        saveAs: true
      }, function(downloadId) {
        if (chrome.runtime.lastError) {
          status.textContent = '❌ Download failed: ' + chrome.runtime.lastError.message;
          status.className = 'status error';
        } else {
          status.textContent = '✅ CSV file downloaded successfully!';
          status.className = 'status success';
        }
      });
    });
  });

  // Clear data
  clearBtn.addEventListener('click', function() {
    chrome.storage.local.clear(function() {
      status.textContent = '🗑️ Data cleared';
      status.className = 'status info';
      gameInfo.style.display = 'none';
      detectedGame.style.display = 'none';
      affiliateSection.style.display = 'none';
      exportBtn.disabled = true;
      clearBtn.disabled = true;
    });
  });

  // Generate CSV content using your original format
  function generateCSV(trophyData, gameTitle) {
    // Use the same headers as your original TrueTrophies assembler
    const headers = [
      'Trophy Set',
      'Name',
      'Description',
      'Rarity Value',
      'Type',
      'Tags',
      'Earned',
      'Trophy Score',
      'Guide URL',
      'YouTube Query'
    ];

    const csvRows = [headers.join(';')];
    const allTrophies = [];

    // Process base game trophies
    if (trophyData.base && trophyData.base.length > 0) {
      trophyData.base.forEach(trophy => {
        allTrophies.push({
          ...trophy,
          trophySet: gameTitle || 'Base Game'
        });
      });
    }

    // Process DLC trophies
    if (trophyData.dlcs && trophyData.dlcs.length > 0) {
      trophyData.dlcs.forEach(dlc => {
        if (dlc.trophies && dlc.trophies.length > 0) {
          dlc.trophies.forEach(trophy => {
            allTrophies.push({
              ...trophy,
              trophySet: dlc.title || 'Unknown DLC'
            });
          });
        }
      });
    }

    // Sort all trophies by trophy score (descending) like your original script
    allTrophies.sort((a, b) => b.trophyScore - a.trophyScore);

    allTrophies.forEach(trophy => {
      const tagsDescription = trophy.tags.map(tag => tag.name).join(', ');
      
      const row = [
        escapeCSV(trophy.trophySet || ''),
        escapeCSV(trophy.title || ''),
        escapeCSV(trophy.description || ''),
        escapeCSV(trophy.sonyRarityValue || ''),
        escapeCSV(trophy.type || ''),
        escapeCSV(tagsDescription),
        escapeCSV(trophy.earned ? 'Yes' : 'No'),
        trophy.trophyScore || 0,
        escapeCSV(trophy.guideUrl || ''),
        escapeCSV(trophy.youtubeQuery || '')
      ];
      csvRows.push(row.join(';'));
    });

    return csvRows.join('\n');
  }

  // Escape CSV values
  function escapeCSV(value) {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return '"' + value.replace(/"/g, '""') + '"';
    }
    return value;
  }

  // Sanitize filename
  function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }

  // Generate dynamic affiliate links based on game title
  function generateAffiliateLinks(gameTitle) {
    console.log('🛒 Generating affiliate links for:', gameTitle);
    
    // Clean the game title for search queries
    const cleanTitle = gameTitle.replace(/[^\w\s]/g, '').trim();
    const searchQuery = encodeURIComponent(cleanTitle);
    
    // Your Amazon Associates affiliate ID (replace with your actual ID)
    const affiliateId = 'trophygui-20'; // Replace with your Amazon Associates ID
    
    // Generate different types of affiliate links
    const affiliateLinks = {
      game: `https://amazon.com/s?k=${searchQuery}+PS4+PS5+game&tag=${affiliateId}`,
      accessories: `https://amazon.com/s?k=${searchQuery}+controller+headset+gaming&tag=${affiliateId}`,
      merch: `https://amazon.com/s?k=${searchQuery}+shirt+hoodie+merchandise&tag=${affiliateId}`,
      collectibles: `https://amazon.com/s?k=${searchQuery}+collector+edition+figure&tag=${affiliateId}`
    };
    
    // Update the affiliate section
    affiliateGameTitle.textContent = gameTitle;
    affiliateGame.href = affiliateLinks.game;
    affiliateAccessories.href = affiliateLinks.accessories;
    affiliateMerch.href = affiliateLinks.merch;
    affiliateCollectibles.href = affiliateLinks.collectibles;
    
    console.log('✅ Affiliate links generated:', affiliateLinks);
  }
});
