# GitHub Pages Workflow - Custom Branch Setup

## 🌿 Branch Strategy

Your repository now uses a **custom branch strategy** for GitHub Pages deployment:

- **`main`** - Development branch (your working branch)
- **`gh-pages-release`** - GitHub Pages deployment branch (published site)

## 🔄 Workflow Overview

### Development Workflow
1. **Work on `main` branch** - Make changes to your extension and documentation
2. **Test locally** - Use `npm run serve` to preview changes
3. **Deploy to Pages** - Use `./deploy.sh` to update the live site
4. **GitHub Pages** - Automatically deploys from `gh-pages-release` branch

### Deployment Process
```bash
# 1. Make changes on main branch
git checkout main
# ... make your changes ...

# 2. Deploy to GitHub Pages
./deploy.sh
# or
npm run deploy
```

## 🚀 Deployment Script Features

The updated `deploy.sh` script now:

### ✅ Automatic Branch Management
- **Detects current branch** and switches to `main` if needed
- **Pulls latest changes** from remote `main` branch
- **Creates `gh-pages-release`** branch if it doesn't exist
- **Merges changes** from `main` to `gh-pages-release`
- **Pushes to remote** and switches back to `main`

### ✅ Safety Checks
- **Uncommitted changes** detection and handling
- **Git repository** validation
- **Branch existence** checks
- **Error handling** with clear messages

### ✅ User-Friendly Output
- **Progress indicators** with emojis
- **Clear instructions** for next steps
- **Helpful links** to GitHub Pages settings
- **Status updates** throughout the process

## 📋 GitHub Pages Configuration

### Repository Settings
1. Go to **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: Select `gh-pages-release`
4. **Folder**: `/ (root)`
5. **Save**

### Branch Protection (Optional)
Consider protecting the `gh-pages-release` branch:
1. Go to **Settings** → **Branches**
2. Add rule for `gh-pages-release`
3. Enable "Require pull request reviews"
4. Enable "Restrict pushes that create files"

## 🛠️ Available Commands

### Development Commands
```bash
# Serve site locally
npm run serve
# or
python -m http.server 8000

# Test deployment script
./deploy.sh
```

### Deployment Commands
```bash
# Full deployment (recommended)
npm run deploy
# or
./deploy.sh

# Manual deployment (alternative)
npm run deploy:manual
```

### Git Commands
```bash
# Check branch status
git branch -a

# View pages branch
git checkout gh-pages-release
git log --oneline -5

# Switch back to main
git checkout main
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Branch Not Found
```bash
# If gh-pages-release doesn't exist
git checkout -b gh-pages-release
git push origin gh-pages-release
```

#### 2. Merge Conflicts
```bash
# Resolve conflicts manually
git checkout gh-pages-release
git merge main
# ... resolve conflicts ...
git add .
git commit -m "Resolve merge conflicts"
git push origin gh-pages-release
```

#### 3. GitHub Pages Not Updating
1. Check **Settings** → **Pages** configuration
2. Verify `gh-pages-release` branch exists
3. Check **Actions** tab for deployment logs
4. Wait 5-10 minutes for deployment

#### 4. Script Permissions
```bash
# Make script executable
chmod +x deploy.sh
```

### Debug Commands
```bash
# Check script syntax
bash -n deploy.sh

# Run with debug output
bash -x deploy.sh

# Check git status
git status
git branch -a
```

## 📊 Branch Comparison

| Feature | `main` Branch | `gh-pages-release` Branch |
|---------|---------------|---------------------------|
| **Purpose** | Development | Production/Published |
| **Content** | All files | Only Pages files |
| **Updates** | Frequent | On deployment |
| **Access** | Private/Public | Public (via GitHub Pages) |
| **History** | Full development | Deployment history |

## 🔄 Workflow Examples

### Example 1: Adding New Feature
```bash
# 1. Work on main branch
git checkout main
# ... add new feature to extension ...
# ... update documentation ...

# 2. Test locally
npm run serve

# 3. Deploy to Pages
./deploy.sh

# 4. Verify deployment
# Visit: https://sacortesh.github.io/ps-trophy-guide-optimus/
```

### Example 2: Hotfix Deployment
```bash
# 1. Quick fix on main
git checkout main
# ... make urgent fix ...

# 2. Deploy immediately
./deploy.sh

# 3. Verify fix is live
# Check the live site
```

### Example 3: Manual Branch Management
```bash
# 1. Check pages branch
git checkout gh-pages-release
git log --oneline -5

# 2. Compare with main
git diff main..gh-pages-release

# 3. Force sync (if needed)
git reset --hard main
git push origin gh-pages-release --force
```

## 🎯 Best Practices

### Development
- **Always work on `main`** for development
- **Test locally** before deploying
- **Commit frequently** with clear messages
- **Use descriptive commit messages**

### Deployment
- **Use the deployment script** for consistency
- **Verify deployment** after each update
- **Monitor GitHub Pages** for any issues
- **Keep branches in sync**

### Maintenance
- **Regular updates** to keep content fresh
- **Monitor site performance** and user feedback
- **Backup important changes** before major updates
- **Document any custom configurations**

## 🔗 Useful Links

- **GitHub Pages**: https://github.com/sacortesh/ps-trophy-guide-optimus/settings/pages
- **Actions**: https://github.com/sacortesh/ps-trophy-guide-optimus/actions
- **Pages Branch**: https://github.com/sacortesh/ps-trophy-guide-optimus/tree/gh-pages-release
- **Live Site**: https://sacortesh.github.io/ps-trophy-guide-optimus/

## 🎉 Benefits of Custom Branch Setup

### ✅ Advantages
- **Clean separation** between development and production
- **Flexible deployment** control
- **Easy rollback** if needed
- **Professional workflow** for extension stores
- **Version control** for published content

### ✅ Use Cases
- **Extension store listings** with professional presentation
- **Documentation sites** separate from development
- **Marketing pages** with controlled updates
- **User-facing content** with stable deployment

---

**Your custom branch workflow is now ready!** Use `./deploy.sh` to deploy updates to your GitHub Pages site.
