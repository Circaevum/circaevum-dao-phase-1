# Zhong Restructure Plan: Administrative Hub

## Overview

Transform this repository into **`circaevum-zhong`** - the central administrative hub for managing all of Circaevum. Zhong (中) becomes the center point where Yin and Yang are coordinated, and all administration happens.

---

## New Repository Structure

```
circaevum-zhong/                    # Main administrative repository
├── README.md                       # Main overview
├── CHANGELOG.md                    # Changes tracked for DAO
│
├── yin/                            # Backend projects (Yin)
│   ├── nakama/                     # Nakama backend (yin-nakama)
│   ├── timescale/                  # TimescaleDB backend (yin-timescale)
│   ├── rest/                       # REST API backend (yin-rest)
│   │
│   └── yang-seed/                  # 阳种子 (Yang Seed - Frontend in Backend)
│       ├── components/             # React UI components
│       │   ├── CircaevumViewer.tsx
│       │   ├── EventUpload.tsx
│       │   ├── EventTable.tsx
│       │   └── RingStationVisualization.tsx  # Backend structure visualization
│       │
│       └── adapters/               # Frontend adapters
│           ├── threejs-adapter.js
│           ├── unity-adapter.js
│           └── webgl-adapter.js
│
├── yang/                           # Frontend projects (Yang)
│   ├── web/                        # Three.js web (current three-circa)
│   │   ├── circaevum/
│   │   │   ├── js/
│   │   │   │   ├── main.js
│   │   │   │   ├── config.js
│   │   │   │   └── datetime.js
│   │   │   └── ...
│   │   ├── docs/
│   │   └── index.html
│   │
│   └── unity/                      # Unity projects
│       ├── TimeBox/                # Apple Vision Pro
│       ├── Calendarium/            # Meta Quest
│       └── ...
│
├── zhong/                          # Administration (Zhong - 中)
│   ├── dao/                        # DAO governance
│   │   ├── phase-1/                # Current DAO structure
│   │   ├── tokens/                 # Token tracking
│   │   └── reviews/                 # Quarterly reviews
│   │
│   ├── tracking/                   # Contribution tracking
│   │   ├── repositories.json       # Repos to watch
│   │   ├── commit-tracker.sh       # Contribution analysis
│   │   └── contributions/          # Quarterly contribution data
│   │
│   ├── problems/                   # Problem tracking
│   │   ├── registry.json           # Problem registry
│   │   └── history/                 # Problem history
│   │
│   └── milestones/                 # Investment milestones
│       ├── current.json            # Current milestone status
│       └── history/                 # Milestone history
│
└── docs/                           # Documentation
    ├── architecture/                # Architecture docs
    ├── philosophy/                  # Taiji philosophy
    └── guides/                      # User/developer guides
```

---

## Migration Plan

### Phase 1: Restructure Current Repo

1. **Rename**: `Claude/circaevum-package/three-circa/` → `circaevum-zhong/`
2. **Move current content**: 
   - `circaevum/` → `yang/web/circaevum/`
   - `docs/` → `docs/` (keep)
   - `index.html` → `yang/web/index.html`

3. **Create new structure**:
   - Create `yin/` folder
   - Create `yang/` folder
   - Create `zhong/` folder
   - Move DAO content to `zhong/dao/phase-1/`

### Phase 2: Add Unity Projects

1. **Link Unity projects**:
   - `yang/unity/TimeBox/` → Link to `Active/TimeBox/`
   - `yang/unity/Calendarium/` → Link to `Active/Calendarium/`

2. **Or move** (if preferred):
   - Move `Active/TimeBox/` → `yang/unity/TimeBox/`
   - Move `Active/Calendarium/` → `yang/unity/Calendarium/`

### Phase 2.5: Add Seeds

1. **Create yin-seed in yang**:
   - `yang/web/yin-seed/` - Backend adapters, data models, API contract
   - Move/create: `api.js`, `events.js`, `validation.js`, `adapters/`

2. **Create yang-seed in yin**:
   - `yin/yang-seed/` - Frontend components, visualization wrappers
   - Move `ring_station_vr.tsx` → `yin/yang-seed/components/RingStationVisualization.tsx`
   - Create: `CircaevumViewer.tsx`, `EventUpload.tsx`, `adapters/`

### Phase 3: Add Backend Projects

1. **Create backend structure**:
   - `yin/nakama/` - Nakama backend code
   - `yin/timescale/` - TimescaleDB backend code
   - `yin/rest/` - REST API backend code

2. **Create yang-seed in yin**:
   - `yin/yang-seed/components/` - React UI components
   - `yin/yang-seed/adapters/` - Frontend adapters

### Phase 4: Administrative Hub

1. **Move DAO content**:
   - `DAO/circaevum-dao-phase-1/` → `zhong/dao/phase-1/`
   - Keep link to GitHub for Articles of Incorporation

2. **Create tracking**:
   - `zhong/tracking/repositories.json`
   - `zhong/tracking/commit-tracker.sh`
   - `zhong/tracking/contributions/`

3. **Create reviews**:
   - `zhong/reviews/Q1-2025.md`
   - `zhong/reviews/Q2-2025.md`
   - etc.

---

## Naming Conventions (Short)

**Folders**:
- `yin/` - Backend
- `yang/` - Frontend
- `zhong/` - Administration
- `web/` - Three.js web
- `unity/` - Unity projects
- `nakama/` - Nakama backend
- `timescale/` - TimescaleDB
- `rest/` - REST API
- `dao/` - DAO governance
- `tracking/` - Contribution tracking

**Files**:
- Keep existing file names (short where possible)
- `repositories.json` - Repo config
- `registry.json` - Problem registry
- `current.json` - Current milestone status

---

## Zhong as Administrative Hub

### Responsibilities

**Zhong (中) manages**:
1. **DAO Governance**: Token structure, quarterly reviews, voting
2. **Contribution Tracking**: GitHub analysis, problem tracking, token awards
3. **Investment Milestones**: Wu Wei token tracking, milestone management
4. **Coordination**: Between Yin and Yang projects
5. **Documentation**: Architecture, philosophy, guides

### Quarterly Review Process

**Zhong-curated tallying**:
1. **Pre-Review** (Zhong):
   - Analyze all repos (`yin/`, `yang/`)
   - Tally contributions by platform
   - Map commits to problems
   - Calculate token awards

2. **Review Meeting**:
   - Present Zhong-curated data
   - Vote on token awards
   - Vote on next quarter's problems
   - Distribute profits

3. **Post-Review** (Zhong):
   - Update DAO structure
   - Record in `zhong/reviews/`
   - Update CHANGELOG.md
   - Rotate Yin-Yang 90°

---

## CHANGELOG.md Structure

**Location**: `circaevum-zhong/CHANGELOG.md`

**Purpose**: Track all changes for DAO quarterly reviews

**Format**:
```markdown
# Circaevum Zhong Changelog

## [Quarter] [Year] - [Quarter Name]

### Yin (Backend)
- ✅ PROBLEM-YIN-001 [yin-nakama]: Description
- 🔄 PROBLEM-YIN-002 [yin-timescale]: In progress

### Yang (Frontend)
- ✅ PROBLEM-YANG-001 [yang-web]: Description
- ✅ PROBLEM-YANG-002 [yang-avp]: Description

### Zhong (Administration)
- ✅ DAO structure updates
- ✅ Quarterly review completed
- ✅ Investment milestones updated

### Token Awards
- YIN-001: Contributor A
- YANG-001: Contributor B
- ZHONG-001: Contributor C

### Investment Milestones
- WW-001: $25k reached ✅
- WW-002: $50k in progress 🔄
```

**Sync with DAO**: CHANGELOG.md updates are reflected in `zhong/dao/phase-1/README.md` quarterly.

---

## Articles of Incorporation Link

**DAO GitHub**: `https://github.com/Circaevum/circaevum-dao-phase-1`

**Articles Point To**: 
- Main repo: `circaevum-zhong` (this repo)
- DAO structure: `zhong/dao/phase-1/`
- Changelog: `CHANGELOG.md` (in root)

**Structure**:
```
DAO GitHub (circaevum-dao-phase-1)
├── README.md (points to circaevum-zhong)
├── Addendum.md (Articles of Incorporation)
└── Links to:
    - circaevum-zhong/CHANGELOG.md
    - zhong/dao/phase-1/ (DAO structure)
    - zhong/tracking/ (Contribution tracking)
```

---

## Implementation Steps

### Step 1: Create New Structure
```bash
cd /Users/adamsauer/Documents/GitHub/CIR/Claude/circaevum-package
mkdir -p three-circa/yin
mkdir -p three-circa/yang/web
mkdir -p three-circa/yang/unity
mkdir -p three-circa/zhong/dao/phase-1
mkdir -p three-circa/zhong/tracking
mkdir -p three-circa/zhong/reviews
```

### Step 2: Move Current Content
```bash
# Move current three-circa content to yang/web
mv three-circa/circaevum three-circa/yang/web/
mv three-circa/index.html three-circa/yang/web/
mv three-circa/docs three-circa/  # Keep at root level
```

### Step 3: Link/Move Unity Projects
```bash
# Option A: Create symlinks
ln -s ../../../Active/TimeBox three-circa/yang/unity/TimeBox
ln -s ../../../Active/Calendarium three-circa/yang/unity/Calendarium

# Option B: Move (if preferred)
# mv ../../Active/TimeBox three-circa/yang/unity/
# mv ../../Active/Calendarium three-circa/yang/unity/
```

### Step 4: Move DAO Content
```bash
# Copy DAO content to zhong/dao/phase-1
cp -r ../../DAO/circaevum-dao-phase-1/* three-circa/zhong/dao/phase-1/
```

### Step 5: Create Tracking
```bash
# Copy tracking files
cp ../../DAO/circaevum-dao-phase-1/repositories.json three-circa/zhong/tracking/
cp ../../DAO/circaevum-dao-phase-1/commit-tracker.sh three-circa/zhong/tracking/
```

### Step 6: Rename Repository
```bash
# Rename the directory
cd /Users/adamsauer/Documents/GitHub/CIR/Claude/circaevum-package
mv three-circa circaevum-zhong
```

---

## New README.md Structure

```markdown
# Circaevum Zhong (中)

**The Center Contract** - Administrative hub for managing Circaevum

## Structure

- **yin/**: Backend projects (Nakama, TimescaleDB, REST API)
- **yang/**: Frontend projects (Web, Unity)
- **zhong/**: Administration (DAO, tracking, reviews)
- **docs/**: Documentation

## Quick Links

- [DAO Structure](./zhong/dao/phase-1/README.md)
- [Changelog](./CHANGELOG.md)
- [Architecture](./docs/architecture/)
- [Quarterly Reviews](./zhong/reviews/)

## Philosophy

Zhong (中) is the center point where Yin and Yang meet. This repository coordinates all Circaevum projects, tracks contributions, manages DAO governance, and facilitates quarterly reviews.
```

---

## Benefits

1. **Centralized Administration**: All Circaevum management in one place
2. **Clear Structure**: Yin/Yang/Zhong organization
3. **DAO Integration**: Direct link to DAO structure and reviews
4. **Contribution Tracking**: Centralized tracking across all projects
5. **Quarterly Reviews**: Zhong-curated data for reviews
6. **Scalability**: Easy to add new projects (yin or yang)

---

## Next Steps

1. Create new folder structure
2. Move/restructure current content
3. Link Unity projects
4. Move DAO content
5. Create CHANGELOG.md
6. Update README.md
7. Rename repository

