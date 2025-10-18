const DISABLE_ADVERTISEMENTS = false;

// Global variable to store game name
let globalGameName = null;

document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractBtn');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const hltbBtn = document.getElementById('hltbBtn');
  const status = document.getElementById('status');
  const detectedGame = document.getElementById('detectedGame');
  const detectedGameName = document.getElementById('detectedGameName');
  const gameInfo = document.getElementById('gameInfo');
  const gameTitle = document.getElementById('gameTitle');
  const trophyCount = document.getElementById('trophyCount');

  // Affiliate section elements
  const affiliateSection = document.getElementById('affiliateSection');
  const affiliateGame = document.getElementById('affiliateGame');
  const affiliateAccessories = document.getElementById('affiliateAccessories');
  const affiliateMerch = document.getElementById('affiliateMerch');
  const affiliateGuides = document.getElementById('affiliateGuides');

  // Feature suggestion elements
  const kofiButton = document.getElementById('kofiButton');
  const featureSuggestionSection = document.getElementById('featureSuggestionSection');
  const suggestFeatureBtn = document.getElementById('suggestFeatureBtn');

  // Call method when popup opens
  onPopupOpened();

  // Test connection first
  testConnection();

  // Check if user has clicked donation button
  checkDonationButtonClick();

  // Set up donation button click tracking
  setupDonationTracking();

  // Set up feature suggestion functionality
  setupFeatureSuggestion();

  function onPopupOpened() {
    extractGameNameFromUrl();
  }

  function extractGameNameFromUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];

      if (currentTab.url.includes('truetrophies.com/game/') && currentTab.url.includes('/trophies')) {
        const urlMatch = currentTab.url.match(/truetrophies\.com\/game\/([^\/]+)\/trophies/);
        if (urlMatch && urlMatch[1]) {
          globalGameName = decodeURIComponent(urlMatch[1].replace(/-/g, ' '));

          detectedGameName.textContent = globalGameName;
          detectedGame.style.display = 'block';
          hltbBtn.disabled = false;

          if (!DISABLE_ADVERTISEMENTS) {
            generateAffiliateLinks(globalGameName);
            affiliateSection.style.display = 'block';
          }
        } else {
          globalGameName = 'Unknown Game';
          detectedGameName.textContent = globalGameName;
          detectedGame.style.display = 'block';
          hltbBtn.disabled = false;
        }
      } else {
        globalGameName = null;
        detectedGame.style.display = 'none';
        affiliateSection.style.display = 'none';
        hltbBtn.disabled = true;
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

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentTab = tabs[0];

      if (currentTab.url.includes('truetrophies.com/game/') && currentTab.url.includes('/trophies')) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'ping' }, function(response) {
          if (chrome.runtime.lastError) {
            status.textContent = '❌ Connection failed: ' + chrome.runtime.lastError.message;
            status.className = 'status error';
            extractBtn.disabled = true;
          } else if (response && response.status === 'pong') {
            status.textContent = '✅ Connected! Ready to extract for: ' + globalGameName;
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

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'extractTrophies' }, function(response) {
        if (chrome.runtime.lastError) {
          status.textContent = '❌ Error: ' + chrome.runtime.lastError.message;
          status.className = 'status error';
          extractBtn.disabled = false;
          return;
        }

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
          hltbBtn.disabled = false;

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
      hltbBtn.disabled = true;
    });
  });

  // How Long to Beat button
  hltbBtn.addEventListener('click', function() {
    if (!globalGameName) {
      status.textContent = '❌ No game detected';
      status.className = 'status error';
      return;
    }

    const cleanTitle = globalGameName.replace(/[^\w\s]/g, '').trim();
    const hltbUrl = `https://howlongtobeat.com/?q=${encodeURIComponent(cleanTitle)}`;
    
    chrome.tabs.create({
      url: hltbUrl,
      active: true
    });

    status.textContent = '⏱️ Opening HowLongToBeat...';
    status.className = 'status info';
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
    const cleanTitle = gameTitle.replace(/[^\w\s]/g, '').trim();
    const searchQuery = encodeURIComponent(cleanTitle);
    const affiliateId = 'sacortes-20';

    const affiliateLinks = {
      game: `https://amazon.com/s?k=${searchQuery}&tag=${affiliateId}`,
      accessories: `https://amazon.com/s?k=${searchQuery}+figure&tag=${affiliateId}`,
      merch: `https://amazon.com/s?k=${searchQuery}+shirt+hoodie&tag=${affiliateId}`,
      guides: `https://amazon.com/s?k=${searchQuery}+guide&tag=${affiliateId}`
    };

    affiliateGame.href = affiliateLinks.game;
    affiliateAccessories.href = affiliateLinks.accessories;
    affiliateMerch.href = affiliateLinks.merch;
    affiliateGuides.href = affiliateLinks.guides;
  }

  // Check if user has clicked donation button
  function checkDonationButtonClick() {
    chrome.storage.local.get(['donationButtonClicked'], function(result) {
      if (result.donationButtonClicked) {
        featureSuggestionSection.style.display = 'block';
      }
    });
  }

  // Set up donation button click tracking
  function setupDonationTracking() {
    kofiButton.addEventListener('click', function() {
      chrome.storage.local.set({
        donationButtonClicked: true,
        donationButtonClickDate: new Date().toISOString()
      }, function() {
        featureSuggestionSection.style.display = 'block';

        const originalText = kofiButton.textContent;
        kofiButton.textContent = '✅ Thank you!';
        kofiButton.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';

        setTimeout(() => {
          kofiButton.textContent = originalText;
          kofiButton.style.background = 'linear-gradient(45deg, #29ABE0, #1E88E5)';
        }, 2000);
      });
    });
  }

  // Set up feature suggestion functionality
  function setupFeatureSuggestion() {
    suggestFeatureBtn.addEventListener('click', function() {
      const githubIssuesUrl = 'https://github.com/sacortesh/ps-trophy-guide-optimus/issues/new?template=feature_request.md&title=Feature%20Request:%20';

      chrome.tabs.create({
        url: githubIssuesUrl,
        active: true
      });

      const originalText = suggestFeatureBtn.textContent;
      suggestFeatureBtn.textContent = '🚀 Opening GitHub...';
      suggestFeatureBtn.disabled = true;

      setTimeout(() => {
        suggestFeatureBtn.textContent = originalText;
        suggestFeatureBtn.disabled = false;
      }, 2000);
    });
  }
});
