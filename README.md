# PS Trophy Guide Optimus

A Chrome extension that extracts PlayStation trophy data from TrueTrophies pages and exports it to CSV format, perfect for trophy hunters and guide creators.

## 🌐 Live Demo

Visit our GitHub Pages site: **[https://yourusername.github.io/ps-trophy-guide-optimus/](https://yourusername.github.io/ps-trophy-guide-optimus/)**

## 🚀 Features

- 🏆 **Automatic Trophy Detection**: Automatically detects and extracts trophy data from TrueTrophies game pages
- 📊 **CSV Export**: Exports trophy data in CSV format compatible with your existing scraper
- 🚀 **No Cloudflare Issues**: Runs in browser context, so no Cloudflare bypass needed
- 🎯 **Easy to Use**: Simple popup interface with one-click extraction and export
- 💾 **Local Storage**: Stores extracted data locally for multiple exports
- 🔒 **Privacy Focused**: All data processing happens locally in your browser

## 📥 Installation

### Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store listing](https://chrome.google.com/webstore) (coming soon)
2. Click "Add to Chrome"
3. Pin the extension to your toolbar

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `extension` folder
5. Pin the extension to your toolbar

## 🎮 Usage

1. **Navigate** to any TrueTrophies game trophy page
2. **Click** the extension icon in your toolbar
3. **Extract** trophy data with one click
4. **Export** to CSV format for your records

## 📊 Supported Data Fields

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

## 🛠️ Development

### Project Structure

```
ps-trophy-guide-optimus/
├── index.html              # GitHub Pages landing page
├── privacy.html            # Privacy policy page
├── assets/                 # Images and media files
├── extension/              # Chrome extension files
│   ├── manifest.json       # Extension configuration
│   ├── popup.html          # Extension popup interface
│   ├── popup.js            # Popup logic and CSV generation
│   ├── content.js          # Content script for data extraction
│   ├── background.js       # Background service worker
│   └── icons/              # Extension icons
├── GITHUB_PAGES_SETUP.md   # GitHub Pages setup guide
└── README.md               # This file
```

### GitHub Pages Setup

This repository includes a complete GitHub Pages setup for extension store listings:

1. **Landing Page**: Professional website showcasing the extension
2. **Privacy Policy**: Compliant privacy policy for Chrome Web Store
3. **Installation Guide**: Step-by-step installation instructions
4. **Screenshots**: Placeholder structure for extension screenshots

See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for detailed setup instructions.

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ps-trophy-guide-optimus.git
   cd ps-trophy-guide-optimus
   ```

2. Load the extension in Chrome:
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Click "Load unpacked" and select the `extension` folder

3. Test the extension:
   - Navigate to a TrueTrophies game page
   - Click the extension icon
   - Test data extraction and CSV export

## 🔧 Customization

### Updating Extension Information

Edit the following files to customize the extension:

- **`extension/manifest.json`**: Extension metadata and permissions
- **`extension/popup.html`**: Extension popup interface
- **`extension/popup.js`**: Extension functionality
- **`extension/content.js`**: Data extraction logic

### Updating Landing Page

Edit these files for the GitHub Pages site:

- **`index.html`**: Main landing page content
- **`privacy.html`**: Privacy policy
- **`assets/`**: Screenshots and images

## 📱 Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Compatible (Chromium-based)
- **Firefox**: Planned support (WebExtensions)

## 🔒 Privacy & Security

- **Local Processing**: All data extraction happens in your browser
- **No External Servers**: No data is sent to external servers
- **Minimal Permissions**: Only requests necessary permissions
- **Open Source**: Full source code available for review

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **GitHub Issues**: [Create an issue](https://github.com/yourusername/ps-trophy-guide-optimus/issues)
- **Documentation**: [GitHub Pages site](https://yourusername.github.io/ps-trophy-guide-optimus/)
- **FAQ**: Check the FAQ section on the landing page

## 🗺️ Roadmap

- [ ] Chrome Web Store publication
- [ ] Firefox WebExtensions support
- [ ] Additional data export formats (JSON, XML)
- [ ] Batch processing for multiple games
- [ ] Integration with other trophy tracking sites
- [ ] Advanced filtering and sorting options

## 🙏 Acknowledgments

- **TrueTrophies**: For providing the trophy data source
- **Chrome Extensions Team**: For the excellent extension platform
- **Open Source Community**: For inspiration and tools

## 📈 Statistics

- **Downloads**: Coming soon (Chrome Web Store)
- **Rating**: Coming soon (Chrome Web Store)
- **Users**: Coming soon (Chrome Web Store)

---

**Note**: This extension is not affiliated with TrueTrophies or Sony Interactive Entertainment. It's an independent tool created by the community for the community.
