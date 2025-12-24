# Git Unity Project Management

## Current Status

**Unity projects are currently tracked in git** (58,349 files in `yang/unity/`).

The `.gitignore` file protects against committing:
- ✅ `Library/` folders (Unity cache)
- ✅ `Temp/` folders (temporary files)
- ✅ `Build/` and `Builds/` folders (compiled builds)
- ✅ `obj/` folders (compiled objects)
- ✅ Project files (`.csproj`, `.sln`, etc.)

## If You Want to Exclude Unity Projects

### Option 1: Remove from Git (Keep Locally)

If Unity projects shouldn't be in version control:

```bash
# Remove Unity projects from git tracking (keeps files locally)
git rm -r --cached yang/unity/avp/Assets
git rm -r --cached yang/unity/quest/Assets
git rm -r --cached yang/unity/avp/ProjectSettings
git rm -r --cached yang/unity/quest/ProjectSettings

# Commit the removal
git commit -m "Remove Unity projects from git tracking"

# Add to .gitignore to prevent re-adding
echo "yang/unity/*/Assets/" >> .gitignore
echo "yang/unity/*/ProjectSettings/" >> .gitignore
```

**Note**: This removes Unity source code from the repo. You'd need another strategy (separate repos, Git LFS, or only tracking essential scripts).

### Option 2: Use Git LFS for Large Binary Assets

Track Unity assets with Git LFS to handle large files better:

```bash
# Install Git LFS (if not already installed)
# brew install git-lfs  # macOS
# git lfs install

# Track large Unity assets with LFS
git lfs track "yang/unity/**/*.fbx"
git lfs track "yang/unity/**/*.obj"
git lfs track "yang/unity/**/*.exr"
git lfs track "yang/unity/**/*.tif"
git lfs track "yang/unity/**/*.tga"
git lfs track "yang/unity/**/*.png" --size=10M

# Add .gitattributes
git add .gitattributes
```

### Option 3: Keep Tracked (Current Approach)

Unity projects remain in git. This is fine if:
- You want full version control of Unity source
- Team needs to sync Unity projects
- Repo size is acceptable

**Current protection**: Generated files (Library/, Temp/, Build/) are ignored and won't bloat the repo.

### Option 4: Use Sparse Checkout

If Unity projects are tracked but you want to exclude them locally:

```bash
# Configure sparse checkout
git config core.sparseCheckout true

# Exclude Unity projects
echo "/*" > .git/info/sparse-checkout
echo "!yang/unity/" >> .git/info/sparse-checkout

# Apply sparse checkout
git read-tree -mu HEAD
```

## Recommendation

**For now**: Keep the current setup. The `.gitignore` properly excludes large generated folders (Library, Temp, Build), which are the main space concerns. Unity Assets/ being tracked is normal for Unity projects in version control.

**If repo size becomes an issue**: Consider Git LFS for large binary assets (>10MB).

---

**Last Updated**: December 23, 2025

