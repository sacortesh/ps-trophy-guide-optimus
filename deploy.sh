#!/bin/bash

# GitHub Pages Deployment Script for PS Trophy Guide Optimus
# This script deploys to the gh-pages-release branch for GitHub Pages

set -e

echo "🚀 PS Trophy Guide Optimus - GitHub Pages Deployment"
echo "=================================================="

# Configuration
PAGES_BRANCH="gh-pages-release"
MAIN_BRANCH="main"

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Check if we have uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Found uncommitted changes:"
    git status --short
    
    read -p "Do you want to commit these changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📦 Committing changes..."
        git add .
        git commit -m "Update GitHub Pages content"
    else
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Ensure we're on the main branch
if [ "$CURRENT_BRANCH" != "$MAIN_BRANCH" ]; then
    echo "🔄 Switching to $MAIN_BRANCH branch..."
    git checkout $MAIN_BRANCH
fi

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin $MAIN_BRANCH

# Check if gh-pages-release branch exists
if git show-ref --verify --quiet refs/heads/$PAGES_BRANCH; then
    echo "📋 Found existing $PAGES_BRANCH branch"
    # Switch to pages branch
    git checkout $PAGES_BRANCH
    # Merge changes from main
    echo "🔄 Merging changes from $MAIN_BRANCH..."
    git merge $MAIN_BRANCH --no-edit
else
    echo "🆕 Creating new $PAGES_BRANCH branch..."
    git checkout -b $PAGES_BRANCH
fi

# Push the pages branch
echo "🚀 Pushing $PAGES_BRANCH branch to remote..."
git push origin $PAGES_BRANCH

# Switch back to main branch
echo "🔄 Switching back to $MAIN_BRANCH branch..."
git checkout $MAIN_BRANCH

echo "✅ Deployment initiated!"
echo ""
echo "📋 Next steps:"
echo "1. GitHub Pages will automatically deploy from $PAGES_BRANCH branch"
echo "2. Visit your site: https://sacortesh.github.io/ps-trophy-guide-optimus/"
echo "3. Check GitHub Pages settings if deployment fails"
echo ""
echo "🔗 Useful links:"
echo "- GitHub Pages: https://github.com/sacortesh/ps-trophy-guide-optimus/settings/pages"
echo "- Actions: https://github.com/sacortesh/ps-trophy-guide-optimus/actions"
echo "- Pages Branch: https://github.com/sacortesh/ps-trophy-guide-optimus/tree/$PAGES_BRANCH"
echo ""
echo "🎉 Deployment complete!"
