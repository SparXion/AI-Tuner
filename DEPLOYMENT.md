# Deployment Guide - AI Tuner v2.0 & v3.0

## Current Status

- **v2.0**: Live on `index.html` (stable version)
- **v3.0**: Available on `index-v6.html` (beta version)
- **Branch**: `v6.0-upgrade` (pushed to GitHub)

## Deployment Options

### Option 1: GitHub Pages (Current)

If you're using GitHub Pages, the changes are already available:

1. **For v2.0**: Visit `https://sparxion.github.io/AI-Tuner/`
2. **For v3.0**: Visit `https://sparxion.github.io/AI-Tuner/index-v6.html`

The version toggle buttons allow users to switch between versions.

### Option 2: Netlify Deployment

#### Initial Setup (if not already done):

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub repository: `SparXion/AI-Tuner`
4. Configure build settings:
   - **Build command**: (leave empty - no build step needed)
   - **Publish directory**: `.` (root directory)
   - **Branch to deploy**: `v6.0-upgrade` (or `main` after merge)

#### Branch Deployments:

**Option A: Deploy v6.0-upgrade branch directly**
- Netlify will automatically deploy the `v6.0-upgrade` branch
- You can create a preview URL for testing
- Users can access v3.0 via the toggle button

**Option B: Merge to main first**
1. Merge `v6.0-upgrade` → `main` on GitHub
2. Netlify will auto-deploy from `main`
3. Both versions will be live on main branch

#### Custom Domain Setup (Optional):

If you have a custom domain:
- Add domain in Netlify dashboard
- Configure DNS settings as instructed
- Both `index.html` and `index-v6.html` will be accessible

### Option 3: Deploy Both Versions Separately

You can create separate Netlify sites:

1. **Main site** (v2.0): Deploy from `main` branch
2. **Beta site** (v3.0): Deploy from `v6.0-upgrade` branch
   - Use a subdomain like `v3.aitunerapp.com`
   - Or use Netlify's preview URL system

## Recommended Approach

**For testing/feedback**: Keep both versions on same site with toggle buttons (current setup)

**Benefits**:
- ✅ Easy for users to try v3.0
- ✅ Easy rollback if needed
- ✅ Can track usage of both versions
- ✅ No separate deployment needed

## Next Steps

1. ✅ **Code pushed to GitHub** - Done
2. ⏳ **Deploy to Netlify**:
   - If new: Follow "Initial Setup" above
   - If existing: Netlify should auto-deploy from the branch
3. ⏳ **Test live site**: Verify both versions work
4. ⏳ **Monitor feedback**: Track which version users prefer

## Files Included in Deployment

- `index.html` - v2.0 (main version)
- `index-v6.html` - v3.0 (beta version)
- `style.css` - v2.0 styles
- `style-v6.css` - v3.0 styles
- `js/` - v3.0 JavaScript modules
- `radar.js` - Radar chart (both versions)
- All other assets

## Important Notes

- Both versions use the same `style.css` as base (v3.0 adds `style-v6.css`)
- Version toggle buttons allow easy switching
- No build step required - pure static HTML/CSS/JS
- Dark mode and other preferences are stored in localStorage

