# GitHub Repository Cleanup Plan

**Date**: November 13, 2025  
**Repository**: `SparXion/AI-Tuner`

---

## Current Branch Status

### Active Branches
- **`main`** - Default branch (may be outdated)
- **`v3.0-live-default`** - Current production branch with all cleanup changes ✅

### Potential Cleanup Branches
- **`v3.0`** - Old v3.0 branch (may be superseded by v3.0-live-default)
- **`v3.0-test`** - Test branch (can likely be deleted)
- **`v6.0-upgrade`** - Old upgrade branch (can likely be deleted)
- **`feature/interactive-radar`** - Feature branch (check if merged, then delete)
- **`creative`** - Archive branch (can be archived or deleted)

---

## Recommended Actions

### Option 1: Merge to Main (Recommended for Production)

If `main` should be the production branch:

```bash
# Switch to main
git checkout main

# Pull latest
git pull ai-tuner main

# Merge v3.0-live-default into main
git merge --no-ff v3.0-live-default -m "Merge v3.0-live-default: Major cleanup and reorganization"

# Push to main
git push ai-tuner main
```

**Then update Netlify to deploy from `main` branch.**

### Option 2: Keep v3.0-live-default as Production

If you want to keep `v3.0-live-default` as the production branch:

1. Update Netlify to deploy from `v3.0-live-default` branch
2. Set `v3.0-live-default` as default branch on GitHub (optional)
3. Delete old branches that are no longer needed

---

## Branch Cleanup Commands

### Delete Remote Branches (after confirming they're not needed)

**⚠️ Warning: Only delete if you're sure these branches are no longer needed!**

```bash
# Delete old version branches
git push ai-tuner --delete v3.0-test
git push ai-tuner --delete v6.0-upgrade
git push ai-tuner --delete feature/interactive-radar

# Archive creative branch (or delete if not needed)
# git push ai-tuner --delete creative
```

### Check Branch Status Before Deleting

```bash
# See what commits are unique to each branch
git log ai-tuner/main..ai-tuner/v3.0-test --oneline
git log ai-tuner/main..ai-tuner/v6.0-upgrade --oneline
git log ai-tuner/main..ai-tuner/feature/interactive-radar --oneline
```

---

## Next Steps

1. ✅ **All cleanup changes pushed to `v3.0-live-default`** - Done!
2. ✅ **Merged to `main` branch** - Done!
3. ⏳ **Update Netlify deployment branch** (if needed - should be `main`)
4. ⏳ **Delete old branches** (after review - see below)
5. ⏳ **Update GitHub default branch** (optional - can set `main` as default)

## ✅ Completed Actions

- ✅ **Committed all cleanup changes** (file renames, structure organization, cross-link removal)
- ✅ **Pushed to `v3.0-live-default` branch**
- ✅ **Merged `v3.0-live-default` into `main`**
- ✅ **Pushed `main` to GitHub**

## ⚠️ Branches to Review for Deletion

Check these branches on GitHub and delete if no longer needed:

1. **`v3.0-test`** - Test branch (likely safe to delete)
2. **`v6.0-upgrade`** - Old upgrade branch (likely safe to delete)  
3. **`feature/interactive-radar`** - Feature branch (check if merged, then delete)
4. **`v3.0`** - Old v3.0 branch (may be superseded by `v3.0-live-default` and `main`)
5. **`creative`** - Archive branch (delete or keep based on need)

**Note**: These can be deleted via GitHub web interface or command line after review.

---

## Current Repository Structure

After cleanup, the repository has:

```
/
├── index.html                    → v3.0 Production (standalone)
├── js/core/v3.0-engine.js       → v3.0 engine
├── js/data/v3.0-*.js            → v3.0 data files
├── style-v3.0.css               → v3.0 styles
│
├── v3.0/                         → v3.0 Backup (synced)
│   └── (same structure)
│
├── v3.5/                         → v3.5 Beta (standalone, different structure)
│   ├── css/style-v6.css
│   └── js/core/v6-engine.js
│
├── v2.0/                         → v2.0 Archived
│   └── (preserved for reference)
│
├── _quarantine/                  → Unused files
│   ├── script.js
│   ├── presets.js
│   └── analytics.js
│
└── CLEANUP-SUMMARY.md            → Documentation of cleanup
```

---

## Important Notes

- **File Naming**: All v3.0 files use `v3.0-*` naming (was `v6-*`)
- **Standalone Versions**: v3.0 and v3.5 have no cross-links
- **Internal Variables**: Kept as `LEVERS_V6`, `MODELS_V6` for compatibility
- **Production**: Root `index.html` is v3.0 (standalone)

