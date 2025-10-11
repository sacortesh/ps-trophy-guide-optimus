// Popup script for the Chrome extension
document.addEventListener('DOMContentLoaded', function() {
  const extractBtn = document.getElementById('extractBtn');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  const status = document.getElementById('status');
  const gameInfo = document.getElementById('gameInfo');
  const gameTitle = document.getElementById('gameTitle');
  const trophyCount = document.getElementById('trophyCount');

  // Check if we're on a supported page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    if (currentTab.url.includes('truetrophies.com/game/') && currentTab.url.includes('/trophies')) {
      status.textContent = '✅ Ready to extract from this page';
      status.className = 'status success';
    } else {
      status.textContent = '⚠️ Please navigate to a TrueTrophies game trophy page';
      status.className = 'status error';
      extractBtn.disabled = true;
    }
  });

  // Extract trophy data
  extractBtn.addEventListener('click', function() {
    status.textContent = '🔄 Extracting trophy data...';
    status.className = 'status info';
    extractBtn.disabled = true;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'extractTrophies'}, function(response) {
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
          
          // Enable export button
          exportBtn.disabled = false;
          clearBtn.disabled = false;
          
          // Store data for export
          chrome.storage.local.set({
            trophyData: response.trophies,
            gameTitle: response.gameTitle,
            gameUrl: response.gameUrl
          });
        } else {
          status.textContent = '❌ Failed to extract trophy data';
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

      const csv = generateCSV(data.trophyData, data.gameTitle);
      const filename = sanitizeFilename(data.gameTitle || 'trophies') + '.csv';
      
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
      exportBtn.disabled = true;
      clearBtn.disabled = true;
    });
  });

  // Generate CSV content using your original format
  function generateCSV(trophies, gameTitle) {
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

    // Sort trophies by trophy score (descending) like your original script
    trophies.sort((a, b) => b.trophyScore - a.trophyScore);

    const csvRows = [headers.join(',')];

    trophies.forEach(trophy => {
      const tagsDescription = trophy.tags.map(tag => tag.name).join('- ');
      
      const row = [
        escapeCSV(gameTitle || ''),
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
      csvRows.push(row.join(','));
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
});
