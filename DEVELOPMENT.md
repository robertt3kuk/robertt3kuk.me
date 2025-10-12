# Development Guidelines & CI/CD Documentation

## 🚀 Project Overview
This is a SolidJS terminal portfolio application built with Bun, featuring a modern VHX/Charm-inspired terminal UI for displaying professional information.

---

## 📋 Git Workflow Rules

### Branch Strategy
```
master/main     ← Production-ready code (auto-deployed to GitHub Pages)
feature/*       ← Feature development branches
hotfix/*        ← Emergency fixes for production
```

### Commit Message Format
Use conventional commits with clear, descriptive messages:

```bash
# Feature additions
git commit -m "feat: add command auto-completion with suggestions"

# Bug fixes  
git commit -m "fix: resolve syntax error in terminal data"

# Styling changes
git commit -m "style: enhance terminal animations and transitions"

# Refactoring
git commit -m "refactor: optimize color scheme system"

# Documentation
git commit -m "docs: update README with new features"

# Build/CI changes
git commit -m "ci: fix GitHub Pages deployment configuration"
```

### Commit Rules
✅ **DO:**
- Commit in logical, small chunks
- Write clear, descriptive commit messages
- Use prefixes: `feat:`, `fix:`, `style:`, `refactor:`, `docs:`, `ci:`, `chore:`
- Include what changed and why (not just what)
- Test locally before pushing

❌ **DON'T:**
- Commit multiple unrelated changes together
- Use vague commit messages like "update files" or "fix stuff"
- Push directly to master without testing
- Include sensitive data in commits

### Pull Request Process
1. Create feature branch from master
2. Develop and test locally
3. Push to remote and create PR
4. Get code review
5. Merge to master
6. Delete feature branch

### Git Commands Cheat Sheet
```bash
# Start new feature
git checkout -b feature/terminal-themes
git add .
git commit -m "feat: implement new color schemes for terminal"

# Sync with remote master
git checkout master
git pull origin master
git checkout feature/terminal-themes
git rebase master

# Push and create PR
git push origin feature/terminal-themes

# Clean up after merge
git checkout master
git pull origin master
git branch -d feature/terminal-themes
```

---

## 🔄 CI/CD Pipeline (GitHub Pages)

### Architecture Overview
```
GitHub Repository → GitHub Actions → Build with Bun → Deploy to GitHub Pages
```

### Workflow File: `.github/workflows/deploy.yml`

#### Triggers
```yaml
on:
  push:
    branches: [ master, main ]    # Auto-deploy on master push
  workflow_dispatch:              # Manual deployment option
```

#### Build Process
1. **Setup Environment**
   - Ubuntu latest runner
   - Setup Bun (latest version)
   - Install dependencies with `bun install`

2. **Build Application**
   - Run `bun run build` command
   - Output directory: `./public`
   - Minified bundle with source maps disabled

3. **Deploy**
   - Upload `public` directory as GitHub Pages artifact
   - Deploy to production environment

### Build Configuration

#### `package.json` Scripts
```json
{
  "scripts": {
    "dev": "bun run build.js --watch",    // Development with hot reload
    "build": "bun run build.js",          // Production build
    "preview": "cd public && bun --bun x serve ."  // Local preview
  }
}
```

#### `build.js` (ESBuild Configuration)
```javascript
// Development (with watch mode)
bun run build.js --watch
// - Enables source maps
// - Disables minification  
// - Starts dev server on port 3000

// Production
bun run build
// - No source maps
// - Full minification
// - Outputs to public/bundle.js
```

### Deployment Details

#### Output Structure
```
public/
├── index.html          # Main HTML file
├── bundle.js          # Built JavaScript bundle
├── bundle.css         # Built CSS styles
├── terminal.svg       # SVG assets
└── BekbolatAbaildayev_CV.pdf  # Resume PDF
```

#### GitHub Pages Settings
- **Source**: Deploy from branch `master`
- **Folder**: `/ (root)` (using `public` folder as root)
- **Custom Domain**: `robertt3kuk.me`
- **HTTPS**: Enabled
- **Enforce HTTPS**: Enabled

### Environment Variables
No environment variables required for this static site.

---

## 🔧 Development Setup

### Prerequisites
- **Bun** (latest version)
- **Git**

### Installation
```bash
# Clone repository
git clone https://github.com/robertt3kuk/robertt3kuk.me.git
cd robertt3kuk.me

# Install dependencies
bun install

# Start development server
bun run dev
```

### Local Development
```bash
# Development with hot reload
bun run dev
# Server: http://localhost:3000

# Production build locally
bun run build
# Output: public/

# Preview production build
bun run preview
# Server: http://localhost:3000
```

---

## 📁 Project Structure

```
robertt3kuk.me/
├── src/
│   ├── index.jsx              # Application entry point
│   ├── App.jsx                # Main app component
│   ├── Terminal.jsx           # Terminal UI component
│   ├── terminal.css           # Terminal styles
│   ├── terminalData.js        # Terminal data & commands
│   └── app.css                # Global styles
├── public/                    # Build output directory
├── .github/workflows/         # CI/CD configurations
├── package.json              # Dependencies & scripts
├── build.js                  # ESBuild configuration
├── tsconfig.json             # TypeScript configuration
└── bun.lock                  # Dependency lock file
```

---

## 🚨 Deployment Checklist

Before pushing to master:
```bash
# 1. Test locally
bun run build
bun run preview

# 2. Check for errors
# - No console errors
# - All commands work
# - Responsive design
# - All themes function

# 3. Commit with proper message
git add .
git commit -m "feat: [description of changes]"

# 4. Push to master
git push origin master

# 5. Monitor deployment
# - Check GitHub Actions tab
# - Verify live site at https://robertt3kuk.me
```

---

## 🔍 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clear cache
rm -rf node_modules bun.lock
bun install
bun run build
```

#### Deployment Fails
1. Check GitHub Actions logs
2. Verify `build.js` outputs to `public/` directory
3. Ensure no errors in build process
4. Check file permissions

#### Styles Not Loading
1. Verify CSS import in `index.jsx`
2. Check `terminal.css` file exists
3. Ensure CSS bundle is generated in `public/`

### Commands for Debugging
```bash
# Build with verbose output
bun run build --verbose

# Check built files
ls -la public/

# Test production build locally
bun run preview
```

---

## 📊 Performance Optimization

### Build Optimizations
- **Minification**: Enabled in production builds
- **Source Maps**: Disabled in production
- **Bundle Analysis**: Use ESBuild analyzer for bundle inspection

### Best Practices
- Use `solid-js` optimizations (Show, For, createMemo)
- Minimize re-renders in terminal components
- Optimize CSS animations with `transform` and `opacity`
- Use semantic HTML for accessibility

---

## 🔄 Version History

### Key Deployments
- **v3.0**: VHX/Charm-inspired UI redesign (current)
- **v2.0**: Original terminal implementation
- **v1.0**: Initial portfolio setup

### Deployment Process
1. All changes to `master` branch trigger automatic deployment
2. Build takes ~30 seconds
3. Site updates instantly on GitHub Pages
4. Custom DNS propagates within minutes

---

## 📞 Support

For deployment issues:
1. Check GitHub Actions logs
2. Review this documentation
3. Compare with working commits
4. Test locally before deployment

💡 **Remember**: The terminal UI should always be functional and visually appealing in production. Test all features before pushing to master!