# Session Notes - January 1, 2026

## Context

This session focused on debugging Unity AVP input issues and preparing the TimeBox project for separate repository management.

---

## Key Actions Completed

### 1. Unity AVP Input Issue Resolution ✅
- **Problem**: Core AVP input interactions not working
- **Root Cause**: `activeInputHandler` was set to `1` (legacy Input Manager) instead of `2` (Input System Package)
- **Fix**: Changed `avp/ProjectSettings/ProjectSettings.asset` line 970: `activeInputHandler: 1` → `activeInputHandler: 2`
- **Status**: ✅ Resolved - input now works

### 2. TimeBox Reference Setup
- Created `yang/unity/TimeBox-reference/` as a reference clone at commit `825ba9dcc` (November 9, 2025)
- Used for comparison to debug input issues
- Reference project uses:
  - Unity 6.2 (working)
  - PolySpatial 2.4.2
  - Input System 1.14.2

### 3. Project Comparison & Documentation
- Created comparison analysis between TimeBox-reference and avp
- Key differences identified:
  - UI structure: TimeBox-reference has single `UI/` folder; avp has `AVP_UI/` and `Old UI/`
  - Code changes: Sundial.cs (month index fix), Z1_TimeFrame.cs (spline closed state changed)
  - Package versions: PolySpatial upgraded from 2.4.2 → 3.0.2 (major version)

### 4. Repository Structure Changes
- **Previous attempt**: Tried consolidating everything into `circaevum-dao-phase-1/` as a monorepo
- **Issue encountered**: Nested git repositories caused conflicts and update nightmares
- **Current state**: `yin/` and `yang/` folders moved out of `circaevum-dao-phase-1` to separate directories at parent level (`/Users/adamsauer/Documents/GitHub/CIR/`)
- **Result**: 
  - `circaevum-dao-phase-1/` focuses on DAO governance, tracking, and documentation
  - `yin/` and `yang/` are separate directories with their own git repositories
  - Each Unity project (avp, quest) maintains its own git repository
  - Clean separation avoids nested git conflicts

---

## Important Technical Notes

### PolySpatial Version Change
- **TimeBox-reference**: PolySpatial 2.4.2 (confirmed working)
- **avp (current)**: PolySpatial 3.0.2 (major version upgrade)
- **Note**: Major version changes may have breaking API changes
- **Location documented**: `yang/unity/TimeBox-reference/COMPARISON_NOTES.md` (if still exists)

### Input System Configuration
- **Critical setting**: `ProjectSettings/ProjectSettings.asset` → `activeInputHandler: 2`
- **Required for**: PolySpatial/XR input on Apple Vision Pro
- **Values**:
  - `1` = Legacy Input Manager (won't work with PolySpatial)
  - `2` = Input System Package (required)

### Git Repository Setup
- **Structure**: Projects are now at parent level, not nested in DAO repo
- `yang/unity/avp/` should be its own git repository pointing to `git@github.com:Circaevum/TimeBox.git`
- `.gitignore` created for Unity projects (excludes Library/, Temp/, Builds/, etc.)
- **Verification commands**:
  ```bash
  cd ../yang/unity/avp  # From circaevum-dao-phase-1/
  git rev-parse --show-toplevel  # Should show .../yang/unity/avp
  git remote get-url origin      # Should show TimeBox.git
  ```

---

## Files Created/Modified (if still present)

- `yang/unity/TimeBox-reference/` - Reference clone for comparison
- `yang/unity/TimeBox-reference/COMPARISON_NOTES.md` - Package version notes
- `yang/unity/avp/.gitignore` - Unity gitignore file
- `yang/unity/avp/README.md` - Updated version to 0.4.09

---

## Next Steps / Reminders

1. ✅ **Repository structure confirmed**: yin/yang folders are in separate directories at parent level (`/Users/adamsauer/Documents/GitHub/CIR/`)
2. **TimeBox push**: When ready, `avp` folder can be pushed to TimeBox remote:
   ```bash
   cd ../yang/unity/avp  # From circaevum-dao-phase-1/
   git add .
   git commit -m "Update to v0.4.09"
   git push origin main
   ```
3. **PolySpatial 3.x**: If issues arise, consider whether PolySpatial 3.0.2 breaking changes need to be addressed
4. **Unity projects**: Unity projects (`avp/`, `quest/`, `pc/`) are large (~6.4GB total) and are managed as separate repositories to avoid nested git conflicts
5. **DAO repo focus**: `circaevum-dao-phase-1/` now focuses on governance, tracking, and documentation - not code storage

---

## Current Structure (Confirmed)

- ✅ **yin/yang folders**: Located at parent level (`/Users/adamsauer/Documents/GitHub/CIR/`) with their own git repos
- ✅ **DAO repo**: `circaevum-dao-phase-1/` focuses on governance, tracking, documentation
- ✅ **Separation**: Clean separation avoids nested git repository conflicts
- ✅ **Structure matches intent**: DAO tracks contributions, projects maintain independence

## Questions for Next Session

- Any remaining issues with TimeBox/avp setup?
- Should we document the project locations in the DAO README for easy reference?

---

**Date**: 2026-01-01  
**Focus**: Unity AVP input debugging, repository separation

