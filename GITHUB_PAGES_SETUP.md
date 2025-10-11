# PS Trophy Guide Optimus - GitHub Pages Setup

This repository contains a Chrome extension for extracting PlayStation trophy data from TrueTrophies and a GitHub Pages website for extension store listings.

## 🚀 Quick Start

### For Users
1. Visit the [GitHub Pages site](https://yourusername.github.io/ps-trophy-guide-optimus/)
2. Follow the installation guide
3. Install the extension from Chrome Web Store (when published)

### For Developers
1. Clone this repository
2. Follow the GitHub Pages setup instructions below
3. Customize the landing page content

## 📁 Repository Structure

```
ps-trophy-guide-optimus/
├── index.html              # Main landing page
├── privacy.html            # Privacy policy page
├── assets/                 # Images and media files
│   ├── extension-popup.png
│   ├── csv-export.png
│   └── truetrophies-page.png
├── extension/              # Chrome extension files
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   ├── content.js
│   ├── background.js
│   └── icons/
└── README.md               # This file
```

## 🌐 GitHub Pages Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **Deploy from a branch**
5. Choose **main** branch and **/ (root)** folder
6. Click **Save**

### 2. Configure Custom Domain (Optional)

1. In the Pages settings, add your custom domain
2. Update the `index.html` file to replace `yourusername.github.io` with your domain
3. Update meta tags and links accordingly

### 3. Update Repository Information

Before publishing, update these placeholders in `index.html`:

```html
<!-- Replace these URLs -->
<meta property="og:url" content="https://yourusername.github.io/ps-trophy-guide-optimus/">
<meta property="twitter:url" content="https://yourusername.github.io/ps-trophy-guide-optimus/">

<!-- Replace these image URLs -->
<meta property="og:image" content="https://yourusername.github.io/ps-trophy-guide-optimus/assets/extension-preview.png">
<meta property="twitter:image" content="https://yourusername.github.io/ps-trophy-guide-optimus/assets/extension-preview.png">

<!-- Replace GitHub links -->
<a href="https://github.com/yourusername/ps-trophy-guide-optimus" target="_blank">GitHub</a>

<!-- Replace Chrome Web Store link -->
<a href="https://chrome.google.com/webstore" class="btn btn-primary" target="_blank">
```

## 📸 Adding Screenshots

### Required Images

Create an `assets/` directory and add these images:

1. **extension-popup.png** - Screenshot of the extension popup interface
2. **csv-export.png** - Example of exported CSV data
3. **truetrophies-page.png** - TrueTrophies page with extension active
4. **extension-preview.png** - Main preview image for social media

### Image Specifications

- **Format:** PNG or JPG
- **Size:** Optimized for web (under 500KB each)
- **Dimensions:** 
  - Screenshots: 800x600px or similar
  - Preview image: 1200x630px (for social media)

### Creating Screenshots

1. **Extension Popup:**
   - Take a screenshot of the extension popup on a TrueTrophies page
   - Show the interface with extracted data

2. **CSV Export:**
   - Show a spreadsheet or text editor with exported CSV data
   - Highlight the structured trophy data

3. **TrueTrophies Integration:**
   - Screenshot of a TrueTrophies game page
   - Show the extension icon in the toolbar

## 🔧 Customization

### Updating Extension Information

Edit these sections in `index.html`:

1. **Hero Section:**
   ```html
   <h1>PS Trophy Guide Optimus</h1>
   <p>Extract PlayStation trophy data from TrueTrophies and export to CSV format</p>
   ```

2. **Features:**
   - Update feature cards in the features grid
   - Modify icons and descriptions

3. **FAQ Section:**
   - Add or modify frequently asked questions
   - Update answers based on user feedback

### Styling

The page uses CSS Grid and Flexbox for responsive design. Key styling areas:

- **Colors:** Update the gradient background and accent colors
- **Typography:** Modify font families and sizes
- **Layout:** Adjust grid layouts and spacing

## 📱 Chrome Web Store Integration

### Store Listing Requirements

When submitting to Chrome Web Store, you'll need:

1. **Store Description:** Use content from the landing page
2. **Screenshots:** Use the images from the `assets/` directory
3. **Privacy Policy:** Link to `privacy.html`
4. **Support URL:** Link to the GitHub Pages site

### Store Description Template

```
Extract PlayStation trophy data from TrueTrophies and export to CSV format. Perfect for trophy hunters and guide creators.

Features:
• Automatic trophy detection from TrueTrophies pages
• CSV export compatible with existing tools
• No Cloudflare issues - runs in browser context
• Local storage for multiple exports
• Privacy-focused - no data sent to external servers

Visit our website for detailed installation instructions and support.
```

## 🚀 Deployment

### Automatic Deployment

GitHub Pages automatically deploys when you push to the main branch:

1. Make changes to `index.html` or other files
2. Commit and push to main branch
3. GitHub Pages will automatically update (may take a few minutes)

### Manual Deployment

If you need to test locally:

1. Serve the files using a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

2. Visit `http://localhost:8000` to preview

## 🔍 SEO Optimization

The landing page includes:

- **Meta tags** for search engines
- **Open Graph** tags for social media
- **Structured data** for better indexing
- **Semantic HTML** for accessibility
- **Mobile-responsive** design

## 📞 Support

For issues or questions:

1. **GitHub Issues:** Create an issue in this repository
2. **Email:** Contact through the extension store
3. **Documentation:** Check the FAQ section on the landing page

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📈 Analytics (Optional)

To add analytics to the landing page:

1. Add Google Analytics or similar service
2. Include tracking code in the `<head>` section
3. Update privacy policy to mention analytics

## 🔄 Updates

When updating the extension:

1. Update version numbers in `manifest.json`
2. Update the landing page with new features
3. Add new screenshots if needed
4. Update the FAQ section
5. Commit and push changes

---

**Note:** Replace all placeholder URLs (`yourusername.github.io`) with your actual GitHub Pages URL before publishing.
