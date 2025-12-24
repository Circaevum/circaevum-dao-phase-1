# Unity Projects

**Note**: Unity projects (`avp/`, `quest/`, `pc/`) are **excluded from git** due to their large size (~6.4GB total).

## Status

- ✅ **Local files preserved** - All Unity projects remain on your local machine
- ❌ **Not in git** - Unity projects are ignored to keep repository size manageable
- ✅ **`.gitignore` configured** - Unity projects won't accidentally be committed

## Unity Projects

- **`avp/`** - Apple Vision Pro (TimeBox) - ~5.0GB
- **`quest/`** - Meta Quest (Calendarium) - ~1.4GB  
- **`pc/`** - Desktop/PC version
- **`universal/`** - Shared Unity code (if tracked separately)

## If You Need to Share Unity Projects

Unity projects should be managed separately:

1. **Separate Git Repositories** - Each Unity project could be its own repo
2. **Git LFS** - If you must include them, use Git LFS for large binary assets
3. **File Sharing** - Use external storage/sharing for Unity project files
4. **Selective Tracking** - Only track essential scripts/assets, not full projects

## Working with Unity Projects Locally

Unity projects work normally on your local machine. They're just excluded from version control in this repository.

---

**Last Updated**: December 23, 2025  
**Reason**: Repository size management (Unity projects total ~6.4GB)

