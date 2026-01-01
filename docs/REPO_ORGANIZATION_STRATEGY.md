# Repository Organization Strategy: DAO vs Zhong

## The Question

Should everything move into the DAO repo, or keep Zhong (admin) separate from what Articles of Incorporation point to?

---

## Option 1: Everything in DAO Repo (Monorepo)

### Structure

```
circaevum-dao-phase-1/
├── README.md                    # Main entry (Articles point here)
├── Addendum.md                  # Articles of Incorporation
│
├── zhong/                        # Admin process (transparent)
│   ├── dao/phase-1/             # DAO structure
│   ├── tracking/                # Contribution tracking
│   ├── problems/                # Problem tracking
│   ├── milestones/              # Investment milestones
│   └── reviews/                 # Quarterly reviews
│
├── yin/                          # Backend projects
│   ├── nakama/
│   ├── timescale/
│   ├── rest/
│   └── yang-seed/
│
├── yang/                         # Frontend projects
│   ├── web/                     # Three.js (yang-web)
│   └── unity/                   # Unity projects
│       ├── universal/           # Shared Unity packages/scripts
│       ├── avp/                 # Apple Vision Pro
│       ├── quest/               # Meta Quest
│       └── pc/                  # Desktop/PC
│
└── docs/                         # Documentation
    ├── architecture/
    ├── philosophy/
    └── guides/
```

### Pros

✅ **Transparency**: Everything visible in one place
✅ **Easy Navigation**: Visitors see full picture immediately
✅ **Single Source of Truth**: One repo for everything
✅ **Simpler Links**: Articles point to one repo
✅ **Unified History**: All development history in one place
✅ **Better Context**: See admin decisions alongside code

### Cons

❌ **Large Repo**: Could be overwhelming
❌ **Mixed Concerns**: Admin + code in same repo
❌ **Git Performance**: Large repos can be slower
❌ **Access Control**: Harder to restrict access to specific parts
❌ **Nested Repos**: Need careful .gitignore for sub-repos

### .gitignore Strategy

```gitignore
# Ignore node_modules in nested projects
**/node_modules/
**/.next/
**/dist/
**/build/

# Ignore Unity build artifacts
**/Library/
**/Temp/
**/obj/
**/Build/
**/Builds/

# Keep .git in nested repos (they're separate)
# But ignore their node_modules, etc.
```

---

## Option 2: Separate Repos (Current Implementation - January 2026)

### Structure

```
CIR/                              # Root directory
├── circaevum-dao-phase-1/        # DAO only (Articles point here)
│   ├── README.md
│   ├── Addendum.md
│   ├── zhong/                    # Admin process (transparent)
│   │   ├── dao/phase-1/
│   │   ├── tracking/
│   │   ├── problems/
│   │   ├── milestones/
│   │   └── reviews/
│   └── docs/                     # Documentation
│
├── yin/                          # Backend projects (separate)
│   ├── nakama/
│   ├── timescale/
│   ├── rest/
│   └── yang-seed/
│
└── yang/                          # Frontend projects (separate)
    ├── web/                      # Three.js (yang-web)
    └── unity/                    # Unity projects
        ├── avp/                  # Apple Vision Pro (TimeBox)
        ├── quest/                # Meta Quest (Calendarium)
        └── TimeBox-reference/    # Reference clone for debugging
```

### Pros

✅ **Clean Separation**: Admin vs code
✅ **Focused Repos**: Each repo has clear purpose
✅ **Better Performance**: Smaller repos, faster operations
✅ **Access Control**: Can restrict access per repo
✅ **Independent Versioning**: Each repo can version separately

### Cons

❌ **Fragmented**: Harder to see full picture
❌ **More Repos**: More to manage
❌ **Complex Links**: Articles point to one, but need to navigate others
❌ **Less Transparent**: Admin process less visible

---

## Option 3: Hybrid - DAO Repo with Submodules/Links

### Structure

```
circaevum-dao-phase-1/            # Main repo (Articles point here)
├── README.md
├── Addendum.md
│
├── zhong/                        # Admin (in this repo)
│   ├── dao/phase-1/
│   ├── tracking/
│   └── reviews/
│
├── projects/                     # Links to code repos
│   ├── yang-web -> git submodule or symlink
│   ├── yang-avp -> git submodule or symlink
│   └── yin-rest -> git submodule or symlink
│
└── docs/                         # Documentation
```

### Pros

✅ **Best of Both**: Admin transparent, code separate
✅ **Clear Structure**: Admin in DAO, code in separate repos
✅ **Flexible**: Can move code repos independently
✅ **Transparent Admin**: Zhong process visible in DAO repo

### Cons

❌ **Submodule Complexity**: Git submodules can be tricky
❌ **Still Multiple Repos**: Still need to manage separate repos
❌ **Symlink Issues**: Symlinks don't work well in Git

---

## Recommendation: Option 1 (Monorepo) with Careful Organization

### Why

1. **Transparency is Key**: For a DAO, transparency is crucial. Having everything visible in one place makes the process transparent.

2. **Articles Point to One Place**: Articles of Incorporation should point to a single, authoritative source. Having everything in the DAO repo makes this clear.

3. **Zhong Process Should Be Visible**: The admin process (Zhong) SHOULD be transparent. Keeping it in the DAO repo alongside code shows how decisions are made.

4. **Manageable with Organization**: With proper folder structure and .gitignore, a monorepo is manageable.

5. **Visitor-Friendly**: New visitors can see the full picture immediately - DAO structure, admin process, and code all in one place.

### Implementation

**Structure**:
```
circaevum-dao-phase-1/
├── README.md                    # Main entry (Articles point here)
├── Addendum.md                  # Articles of Incorporation
│
├── zhong/                        # Admin process (transparent)
│   ├── dao/phase-1/             # Current DAO structure
│   ├── tracking/                # Contribution tracking
│   ├── problems/                # Problem tracking
│   ├── milestones/              # Investment milestones
│   └── reviews/                 # Quarterly reviews
│
├── yang/                         # Frontend projects
│   ├── web/                     # Three.js (yang-web)
│   │   ├── circaevum/
│   │   └── yin-seed/
│   │
│   └── unity/                   # Unity projects
│       ├── universal/           # Shared Unity packages/scripts
│       │   ├── Packages/        # Unity packages
│       │   └── Scripts/         # Shared scripts
│       ├── avp/                 # Apple Vision Pro (TimeBox)
│       ├── quest/               # Meta Quest (Calendarium)
│       └── pc/                  # Desktop/PC builds
│
├── yin/                          # Backend projects
│   ├── nakama/
│   ├── timescale/
│   ├── rest/
│   └── yang-seed/
│
└── docs/                         # Documentation
    ├── architecture/
    ├── philosophy/
    └── guides/
```

**Articles of Incorporation Point To**:
- Main repo: `circaevum-dao-phase-1`
- Changelog: `zhong/reviews/CHANGELOG.md` (or root `CHANGELOG.md`)
- DAO structure: `zhong/dao/phase-1/README.md`

**Transparency**:
- All admin decisions visible in `zhong/`
- All code visible in `yang/` and `yin/`
- Quarterly reviews in `zhong/reviews/`
- Problem tracking in `zhong/problems/`

---

## Unity Folder Structure

### Recommended

```
yang/unity/
├── universal/                    # Shared across all Unity builds
│   ├── Packages/                # Unity packages (manifest.json)
│   ├── Scripts/                 # Shared scripts
│   │   ├── Core/
│   │   ├── Nakama/
│   │   └── Circaevum/
│   └── Assets/                  # Shared assets
│
├── avp/                         # Apple Vision Pro (TimeBox)
│   ├── Assets/
│   │   └── TimeBox/            # TimeBox-specific code
│   └── ProjectSettings/
│
├── quest/                        # Meta Quest (Calendarium)
│   ├── Assets/
│   │   └── Calendarium/        # Calendarium-specific code
│   └── ProjectSettings/
│
└── pc/                          # Desktop/PC builds
    ├── Assets/
    └── ProjectSettings/
```

**Benefits**:
- ✅ Shared code in `universal/` (DRY principle)
- ✅ Platform-specific code in separate folders
- ✅ Easy to build for different platforms
- ✅ Clear separation of concerns

---

## .gitignore Strategy

```gitignore
# Node.js (for web projects)
**/node_modules/
**/.next/
**/dist/
**/build/
**/.cache/

# Unity
**/Library/
**/Temp/
**/obj/
**/Build/
**/Builds/
**/*.csproj
**/*.unityproj
**/*.sln
**/*.suo
**/*.user
**/*.userprefs

# IDE
**/.idea/
**/.vscode/
**/*.swp
**/*.swo

# OS
**/.DS_Store
**/Thumbs.db

# But keep .git in nested repos (they're separate)
# Don't ignore .git directories
```

---

## Migration Plan

### Step 1: Prepare DAO Repo

1. Create folder structure in `circaevum-dao-phase-1`
2. Add `.gitignore` for nested projects
3. Update `README.md` to reflect new structure

### Step 2: Move Content

1. Move `Claude/circaevum-package/three-circa/` → `yang/web/`
2. Move `Active/TimeBox/` → `yang/unity/avp/`
3. Move `Active/Calendarium/` → `yang/unity/quest/`
4. Move `DAO/circaevum-dao-phase-1/zhong/` → `zhong/` (if exists)
5. Move documentation → `docs/`

### Step 3: Update Articles

1. Update `Addendum.md` to point to new structure
2. Ensure all links work
3. Update any external references

### Step 4: Create Unity Universal Folder

1. Extract shared Unity code to `yang/unity/universal/`
2. Set up Unity package structure
3. Update AVP and Quest projects to reference universal

---

## Current Implementation (January 2026)

**Option 2 (Separate Repos) is now the active structure** because:

1. ✅ **Avoids Nested Git Conflicts**: Unity projects and other large repos can be managed independently
2. ✅ **Clean Separation**: DAO governance separate from code repositories
3. ✅ **Better Performance**: Smaller repos, faster git operations
4. ✅ **Flexible Management**: Each project can have its own versioning and release cycle

**Key Points**:
- Articles point to `circaevum-dao-phase-1` (DAO repo)
- Zhong admin process is in `circaevum-dao-phase-1/zhong/` (transparent)
- Code projects in separate `yin/` and `yang/` directories at parent level
- Each Unity project maintains its own git repository
- DAO repo tracks contributions and governance without containing code

**Result**: Clean separation that avoids git conflicts while maintaining transparency through the DAO repository's tracking and documentation.

