# DAO Repo Consolidation Strategy

## Recommendation: Everything in `circaevum-dao-phase-1`

**Why**: Transparency, simplicity, and visitor-friendliness for a DAO.

---

## Current State

**Articles of Incorporation** (Addendum.md) currently points to:
- `circaevum-zhong` (main admin hub)
- `circaevum-dao-phase-1` (DAO governance)

**Problem**: Two repos, less transparent, harder to navigate.

---

## Proposed Structure: Monorepo in DAO Repo

```
circaevum-dao-phase-1/              # Single source of truth (Articles point here)
├── README.md                        # Main entry
├── Addendum.md                      # Articles of Incorporation
│
├── zhong/                           # Admin process (TRANSPARENT)
│   ├── dao/phase-1/                 # DAO structure (current README content)
│   ├── tracking/                    # Contribution tracking
│   │   ├── repositories.json        # Repos to watch
│   │   └── commit-tracker.sh        # Analysis scripts
│   ├── problems/                    # Problem tracking
│   │   └── problems.json            # Current problems
│   ├── milestones/                  # Investment milestones
│   │   └── current.json             # Current tier/milestones
│   └── reviews/                     # Quarterly reviews
│       ├── Q1-2025.md
│       └── CHANGELOG.md             # Master changelog
│
├── yang/                            # Frontend projects
│   ├── web/                         # Three.js (yang-web)
│   │   ├── circaevum/
│   │   ├── yin-seed/
│   │   └── docs/
│   │
│   └── unity/                       # Unity projects
│       ├── universal/               # Shared across all Unity builds
│       │   ├── Packages/            # Unity packages (manifest.json)
│       │   ├── Scripts/             # Shared scripts
│       │   │   ├── Core/           # Core functionality
│       │   │   ├── Nakama/         # Nakama integration
│       │   │   └── Circaevum/      # Circaevum-specific
│       │   └── Assets/             # Shared assets
│       │
│       ├── avp/                     # Apple Vision Pro (TimeBox)
│       │   ├── Assets/
│       │   │   └── TimeBox/        # TimeBox-specific code
│       │   └── ProjectSettings/
│       │
│       ├── quest/                    # Meta Quest (Calendarium)
│       │   ├── Assets/
│       │   │   └── Calendarium/    # Calendarium-specific code
│       │   └── ProjectSettings/
│       │
│       └── pc/                       # Desktop/PC builds
│           ├── Assets/
│           └── ProjectSettings/
│
├── yin/                             # Backend projects
│   ├── nakama/                      # Nakama backend (yin-nakama)
│   ├── timescale/                   # TimescaleDB backend (yin-timescale)
│   ├── rest/                        # REST API backend (yin-rest)
│   │
│   └── yang-seed/                   # 阳种子 (Yang Seed)
│       ├── components/
│       │   └── RingStationVisualization.tsx
│       └── adapters/
│
└── docs/                             # Documentation
    ├── architecture/
    ├── philosophy/
    ├── guides/
    ├── examples/
    └── reference/
```

---

## Why This Works

### 1. **Transparency** ✅
- **Admin process visible**: `zhong/` shows how decisions are made
- **Code visible**: `yang/` and `yin/` show what's being built
- **Reviews visible**: `zhong/reviews/` shows quarterly progress
- **Problems visible**: `zhong/problems/` shows what needs solving

### 2. **Articles Point to One Place** ✅
- **Single source of truth**: Articles point to `circaevum-dao-phase-1`
- **Clear structure**: Everything organized in one repo
- **Easy to reference**: Simple links in legal documents

### 3. **Visitor-Friendly** ✅
- **Full picture immediately**: See DAO structure, admin process, and code
- **Easy navigation**: Clear folder structure
- **Context**: See how admin decisions relate to code

### 4. **Manageable** ✅
- **Good .gitignore**: Ignore build artifacts, node_modules, Unity temp files
- **Organized**: Clear separation of concerns
- **Scalable**: Can grow without becoming unwieldy

---

## Unity Universal Folder Structure

### Purpose
Share common code across all Unity builds (AVP, Quest, PC).

### Structure
```
yang/unity/universal/
├── Packages/
│   └── manifest.json              # Unity package dependencies
│
├── Scripts/
│   ├── Core/
│   │   ├── TimeManager.cs         # Time calculations
│   │   └── EventManager.cs        # Event handling
│   │
│   ├── Nakama/
│   │   ├── NakamaClient.cs        # Nakama client wrapper
│   │   ├── NakamaAuth.cs          # Authentication
│   │   └── NakamaStorage.cs       # Storage operations
│   │
│   └── Circaevum/
│       ├── CircaevumAPI.cs        # API contract
│       └── EventRenderer.cs       # Event rendering
│
└── Assets/
    └── Shared/                     # Shared assets
```

### Usage
- **AVP project**: References `universal/` via Unity Package Manager or symlinks
- **Quest project**: References `universal/` via Unity Package Manager or symlinks
- **PC project**: References `universal/` via Unity Package Manager or symlinks

### Benefits
- ✅ **DRY**: Write once, use everywhere
- ✅ **Consistency**: Same code across platforms
- ✅ **Maintainability**: Update once, affects all platforms
- ✅ **Clear separation**: Platform-specific code in separate folders

---

## .gitignore Strategy

```gitignore
# Node.js (for web projects)
**/node_modules/
**/.next/
**/dist/
**/build/
**/.cache/
**/.vite/

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
**/Logs/

# IDE
**/.idea/
**/.vscode/
**/*.swp
**/*.swo
**/.vs/

# OS
**/.DS_Store
**/Thumbs.db

# Environment
**/.env
**/.env.local

# But keep .git in nested repos (they're separate)
# Don't ignore .git directories
```

---

## Migration Plan

### Phase 1: Prepare DAO Repo Structure

1. **Create folder structure**:
   ```bash
   cd circaevum-dao-phase-1
   mkdir -p zhong/{dao/phase-1,tracking,problems,milestones,reviews}
   mkdir -p yang/{web,unity/{universal,avp,quest,pc}}
   mkdir -p yin/{nakama,timescale,rest,yang-seed}
   mkdir -p docs/{architecture,philosophy,guides,examples,reference}
   ```

2. **Add .gitignore** for nested projects

3. **Move current DAO content**:
   - `README.md` → `zhong/dao/phase-1/README.md`
   - `Addendum.md` → Keep in root (legal document)
   - Other DAO files → `zhong/dao/phase-1/`

### Phase 2: Move Code Projects

1. **Move web project**:
   ```bash
   # From CIR/Claude/circaevum-package/three-circa/
   mv .../three-circa/* yang/web/
   ```

2. **Move Unity projects**:
   ```bash
   # From CIR/Active/TimeBox/
   mv .../TimeBox/* yang/unity/avp/
   
   # From CIR/Active/Calendarium/
   mv .../Calendarium/* yang/unity/quest/
   ```

3. **Extract Unity universal**:
   - Identify shared code in AVP and Quest
   - Move to `yang/unity/universal/`
   - Update AVP and Quest to reference universal

### Phase 3: Update Articles

1. **Update Addendum.md**:
   ```markdown
   - **Main Administrative Hub**: https://github.com/Circaevum/circaevum-dao-phase-1
   - **Zhong Admin Process**: https://github.com/Circaevum/circaevum-dao-phase-1/tree/main/zhong
   - **Changelog**: https://github.com/Circaevum/circaevum-dao-phase-1/blob/main/zhong/reviews/CHANGELOG.md
   ```

2. **Update README.md** to reflect new structure

3. **Update all internal links**

### Phase 4: Create Unity Universal

1. **Extract shared code**:
   - Nakama integration → `universal/Scripts/Nakama/`
   - Core Circaevum → `universal/Scripts/Circaevum/`
   - Shared utilities → `universal/Scripts/Core/`

2. **Set up Unity Package**:
   - Create `manifest.json` in `universal/Packages/`
   - Configure dependencies

3. **Update projects**:
   - AVP references universal
   - Quest references universal
   - PC references universal

---

## Articles of Incorporation Update

### Current (Addendum.md)
```markdown
- **Main Administrative Hub**: https://github.com/Circaevum/circaevum-zhong
- **DAO Governance Repository**: https://github.com/Circaevum/circaevum-dao-phase-1
```

### Proposed (Addendum.md)
```markdown
- **Main Repository**: https://github.com/Circaevum/circaevum-dao-phase-1
- **Zhong Admin Process**: https://github.com/Circaevum/circaevum-dao-phase-1/tree/main/zhong
- **Changelog**: https://github.com/Circaevum/circaevum-dao-phase-1/blob/main/zhong/reviews/CHANGELOG.md
```

**Benefits**:
- ✅ Single source of truth
- ✅ Clear structure
- ✅ Transparent admin process
- ✅ Easy to reference

---

## Transparency Considerations

### Question: Should Zhong be separate from Articles?

**Answer: No - Zhong SHOULD be transparent**

**Why**:
1. **DAO Principle**: Transparency is fundamental to DAO governance
2. **Trust**: Visible admin process builds trust
3. **Accountability**: Public admin decisions hold decision-makers accountable
4. **Participation**: Members can see how decisions are made

**What to Keep Transparent**:
- ✅ Problem tracking (`zhong/problems/`)
- ✅ Contribution tracking (`zhong/tracking/`)
- ✅ Quarterly reviews (`zhong/reviews/`)
- ✅ Investment milestones (`zhong/milestones/`)
- ✅ DAO structure (`zhong/dao/phase-1/`)

**What Can Be Private** (if needed):
- ❌ Personal contributor information (use GitHub usernames)
- ❌ Financial details (use ranges or anonymized data)
- ❌ Sensitive business decisions (use summaries)

**Recommendation**: Keep everything transparent. This is a DAO - transparency is the point.

---

## Size and Manageability

### Is it concise enough?

**Yes**, with proper organization:

1. **Clear structure**: `zhong/`, `yang/`, `yin/`, `docs/`
2. **Good .gitignore**: Ignore build artifacts, node_modules, Unity temp files
3. **Focused folders**: Each folder has clear purpose
4. **Documentation**: Well-documented structure

### Is it easier for visitors?

**Yes**:

1. **One place**: Everything in one repo
2. **Clear navigation**: Obvious folder structure
3. **Full context**: See admin + code together
4. **Transparent**: Admin process visible

---

## Final Recommendation

**✅ Consolidate everything into `circaevum-dao-phase-1`**

**Structure**:
- `zhong/` - Admin process (transparent)
- `yang/` - Frontend projects
- `yin/` - Backend projects
- `docs/` - Documentation

**Unity Structure**:
- `yang/unity/universal/` - Shared code
- `yang/unity/avp/` - Apple Vision Pro
- `yang/unity/quest/` - Meta Quest
- `yang/unity/pc/` - Desktop/PC

**Articles Point To**:
- Single repo: `circaevum-dao-phase-1`
- Changelog: `zhong/reviews/CHANGELOG.md`
- Admin: `zhong/`

**Result**: Transparent, organized, manageable monorepo that serves both DAO governance and code development.

---

## Next Steps

1. **Create folder structure** in DAO repo
2. **Move content** from current locations
3. **Update Articles** (Addendum.md)
4. **Extract Unity universal** code
5. **Update all links** and references
6. **Test structure** and navigation

**Timeline**: Can be done incrementally, no need to rush.

