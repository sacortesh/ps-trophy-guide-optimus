// Background service worker for the Chrome extension
chrome.runtime.onInstalled.addListener(function() {
  console.log('🏆 TrueTrophies Data Extractor installed');
});

// Handle download completion
chrome.downloads.onCreated.addListener(function(downloadItem) {
  console.log('📥 Download started:', downloadItem.filename);
});

chrome.downloads.onChanged.addListener(function(downloadDelta) {
  if (downloadDelta.state && downloadDelta.state.current === 'complete') {
    console.log('✅ Download completed');
  }
});
