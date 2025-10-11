# TrueTrophies Data Extractor Chrome Extension

A Chrome extension that extracts trophy data from TrueTrophies pages and exports it to CSV format, bypassing Cloudflare protection by running in the user's browser context.

## Features

- 🏆 **Automatic Trophy Detection**: Automatically detects and extracts trophy data from TrueTrophies game pages
- 📊 **CSV Export**: Exports trophy data in CSV format compatible with your existing scraper
- 🚀 **No Cloudflare Issues**: Runs in browser context, so no Cloudflare bypass needed
- 🎯 **Easy to Use**: Simple popup interface with one-click extraction and export
- 💾 **Local Storage**: Stores extracted data locally for multiple exports

## Installation

1. **Load the Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `extension` folder

2. **Pin the Extension**:
   - Click the puzzle piece icon in Chrome toolbar
   - Pin "TrueTrophies Data Extractor" for easy access

## Usage

1. **Navigate to a TrueTrophies Game Page**:
   - Go to any TrueTrophies game trophy page (e.g., `https://www.truetrophies.com/game/[game-name]/trophies`)
   - Complete any Cloudflare challenges manually (one-time only)

2. **Extract Trophy Data**:
   - Click the extension icon in your toolbar
   - Click "📊 Extract Trophy Data"
   - Wait for the extraction to complete

3. **Export to CSV**:
   - Click "💾 Export to CSV"
   - Choose where to save the file
   - The CSV will be compatible with your existing scraper

## Supported Data Fields

The extension extracts the following trophy data:
- **Title**: Trophy name
- **Description**: Trophy description
- **Type**: Bronze, Silver, Gold, or Platinum
- **Sony Rarity**: Rarity percentage from Sony
- **PSNP Rarity**: Rarity from PSNProfiles
- **Tags**: Trophy tags (Missable, Collectable, etc.)
- **Earned**: Whether the trophy is completed
- **Suggested Stage**: Default stage (10)
- **Trophy Score**: Calculated score
- **Guide URL**: Link to trophy guide
- **YouTube Query**: Search query for trophy guides

## How It Works

1. **Content Script**: Runs on TrueTrophies pages and extracts trophy data from the DOM
2. **Popup Interface**: Provides user controls for extraction and export
3. **Background Service**: Handles downloads and extension lifecycle
4. **Local Storage**: Temporarily stores extracted data for export

## Advantages Over Web Scraping

- ✅ **No Cloudflare Issues**: Runs in user's browser context
- ✅ **No Rate Limiting**: Uses normal browser requests
- ✅ **Real-time Data**: Always gets current page data
- ✅ **User-friendly**: Simple point-and-click interface
- ✅ **No Server Required**: Works entirely client-side

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic and CSV generation
├── content.js            # Content script for data extraction
├── background.js         # Background service worker
└── icons/                # Extension icons (optional)
```

## Compatibility

- **Chrome**: Manifest V3 compatible
- **Pages**: TrueTrophies game trophy pages
- **Data Format**: CSV compatible with existing scraper

## Troubleshooting

- **"Please navigate to a TrueTrophies game trophy page"**: Make sure you're on a game's trophy page
- **"No data to export"**: Extract trophy data first before exporting
- **Download fails**: Check Chrome's download permissions

## Development

To modify the extension:
1. Edit the relevant files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the extension
4. Test your changes

The extension uses the same trophy extraction logic as your existing scraper, adapted for browser DOM manipulation.
