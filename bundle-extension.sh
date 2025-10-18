#!/bin/bash

# Bundle script for PS Trophy Guide Optimus Chrome Extension
# Creates a zip file containing all necessary extension files for review

set -e

# Configuration
EXTENSION_DIR="extension"
OUTPUT_DIR="output"
BUNDLE_NAME="ps-trophy-guide-optimus-extension"
VERSION=$(node -p "require('./package.json').version")

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Generate timestamp for unique filenames
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ZIP_FILE="$OUTPUT_DIR/${BUNDLE_NAME}-v${VERSION}-${TIMESTAMP}.zip"

echo "📦 Bundling Chrome Extension for review..."
echo "Extension directory: $EXTENSION_DIR"
echo "Output file: $ZIP_FILE"

# Remove existing zip if it exists
if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
fi

# Create zip file with extension files
# Include all necessary files for the extension to work
cd "$EXTENSION_DIR"
zip -r "../$ZIP_FILE" \
    manifest.json \
    background.js \
    content.js \
    popup.html \
    popup.js \
    logger.js \
    tags-dictionary.js \
    icon.svg \
    icons/ \
    -x "*.sh" "*.md" "create-icons.sh" "ICON_GENERATOR_README.md" "README.md"

cd ..

# Verify the zip was created successfully
if [ -f "$ZIP_FILE" ]; then
    FILE_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
    echo "✅ Extension bundled successfully!"
    echo "📁 Bundle location: $ZIP_FILE"
    echo "📏 Bundle size: $FILE_SIZE"
    echo ""
    echo "🚀 Ready for review! You can:"
    echo "   • Upload to Chrome Web Store Developer Dashboard"
    echo "   • Load unpacked in Chrome for testing"
    echo "   • Share with reviewers"
else
    echo "❌ Failed to create bundle"
    exit 1
fi


