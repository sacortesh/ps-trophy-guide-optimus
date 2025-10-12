# Installation Guide for TrueTrophies Data Extractor

## Quick Start

1. **Open Chrome Extensions Page**:
   - Type `chrome://extensions/` in your address bar
   - Or go to Chrome Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**:
   - Click "Load unpacked" button
   - Navigate to and select the `extension` folder
   - Click "Select Folder"

4. **Pin the Extension**:
   - Click the puzzle piece icon (🧩) in Chrome's toolbar
   - Find "TrueTrophies Data Extractor" and click the pin icon (📌)

## How to Use

1. **Go to a TrueTrophies Game Page**:
   ```
   https://www.truetrophies.com/game/[game-name]/trophies
   ```

2. **Complete Cloudflare Challenge** (if any):
   - Complete the "I'm not a robot" challenge manually
   - This only needs to be done once per session

3. **Extract Trophy Data**:
   - Click the extension icon in your toolbar
   - Click "📊 Extract Trophy Data"
   - Wait for the green success message

4. **Export to CSV**:
   - Click "💾 Export to CSV"
   - Choose where to save the file
   - The CSV will be named after the game

## Example Usage

1. Navigate to: `https://www.truetrophies.com/game/Legacy-of-Kain-Soul-Reaver-1-and-2-Remastered/trophies`
2. Complete any Cloudflare challenges
3. Click extension icon → "Extract Trophy Data"
4. Click "Export to CSV"
5. Save as `legacy_of_kain_soul_reaver_1_and_2_remastered.csv`

## Troubleshooting

**Extension not working?**
- Make sure you're on a TrueTrophies game trophy page
- Check that the extension is enabled in `chrome://extensions/`
- Try refreshing the page and extracting again

**No trophies found?**
- Ensure the page has fully loaded
- Check that you're on the correct trophy page (not just the game page)
- Try scrolling down to load all trophies

**Download not working?**
- Check Chrome's download permissions
- Make sure you have space on your device
- Try a different download location

## Features

- ✅ **Bypasses Cloudflare**: Runs in your browser, no proxy needed
- ✅ **One-click extraction**: Simple interface
- ✅ **CSV export**: Compatible with your existing tools
- ✅ **Real-time data**: Always current trophy information
- ✅ **No server required**: Works entirely offline after installation
