# Session Summary: Taiji Architecture & Token Structure

## Date: Today's Session

---

## Goals Accomplished

### 1. Taiji Philosophy Integration ✅

**Terminology Updates**:
- **Seeds (种子)**: Changed from "dots" to "seeds" - `yin-seed/`, `yang-seed/`
- **Zhong (中)**: Replaced "Taiji Point" / "Space Station Memory Palace" with "Zhong" - The Center Contract
- **Proper Chinese Terms**: Integrated throughout architecture and DAO documentation

**Key Concepts**:
- 种子 (Zhǒngzi) - Seeds (Yin/Yang seeds in each other)
- 中 (Zhōng) - Center (The Center Contract)
- 气 (Qì) - Energy Flow (Events/data flowing)
- 道 (Dào) - The Way (Natural data flow)
- 无为 (Wú Wéi) - Effortless Action (Investment flow)

---

### 2. Architecture: Pluggable Adapter System ✅

**Yin Seed (Backend Adapters)**:
- `yin-seed/adapters/` - Pluggable backend adapters
  - `nakama-adapter.js` - Nakama backend
  - `timescaledb-adapter.js` - TimescaleDB backend
  - `rest-adapter.js` - REST API backend
  - `memory-adapter.js` - Standalone mode

**Yang Seed (Frontend Adapters)**:
- `yang-seed/adapters/` - Pluggable frontend adapters
  - `threejs-adapter.js` - Three.js visualization
  - `unity-adapter.js` - Unity visualization
  - `webgl-adapter.js` - Generic WebGL

**Result**: True transformation (变) - each system can adapt to work with different implementations while maintaining balance through Zhong (中).

---

### 3. DAO Token Structure: Perfect Balance ✅

**YIN and YANG Now Identical**:
- ✅ **Governance**: Both have voting rights
- ✅ **Equity**: Both have 2.7% per token
- ✅ **Profit-Sharing**: Both receive quarterly distributions
- ✅ **Decay**: Both decay at same rate (0.1% per quarter if inactive)
- ✅ **Rights**: Perfect reflection of each other

**Wu Wei Investment Structure**:
- ✅ **Profit-Sharing**: Annual distributions (long-term focus)
- ✅ **Investment Milestones**: 18 tokens = 18 investment thresholds
- ✅ **Governance**: Voting rights
- ✅ **Equity**: 2.7% per token

**Zhong (中)**:
- ✅ **Central Coordination**: 1 token, 2.8%, no decay
- ✅ **All Benefits**: Governance, equity, profit-sharing

---

### 4. Quarterly Review System ✅

**Process Defined**:
1. Pre-review: GitHub history analysis
2. Review meeting: 3.5 hours (revenue, contributions, voting, distribution)
3. Post-review: Rotation, new quarter begins

**Contribution Tracking**:
- Commit tagging: `PROBLEM-YIN-XXX`, `PROBLEM-YANG-XXX`, `PROBLEM-ZHONG-XXX`
- Platform categories: `[Unity]`, `[Three.js]`, `[Nakama]`, `[TimescaleDB]`
- Token awards: Based on problem completion

**Naming Conventions**:
- Main tokens: YIN-001 through YIN-018, YANG-001 through YANG-018
- Category tags: `[Unity]`, `[Three.js]`, `[Nakama]`, `[TimescaleDB]`
- Problem format: `PROBLEM-YANG-001 [Unity] COMPLETED: Description`

---

### 5. Git Commit Visualization ✅

**Design**:
- **Sprint Arcs**: Development periods as event arcs
- **Platform Borders**: 
  - yang-avp: Blue (#4285F4)
  - yang-web: Purple (#9C27B0)
  - yin-nakama: Green (#4CAF50)
  - yin-timescale: Teal (#009688)
- **Commit Dots**: Small spheres along arcs (size based on impact)
- **Base Colors**: White (Yang), Dark Gray (Yin), Light Gray (Zhong)

**Integration**:
- Parse from CHANGELOG.md
- Parse from git history
- API methods for adding sprint arcs
- Interactive commit details

---

## Documentation Created

1. **`TAIJI_PHILOSOPHY.md`** - Complete Taiji concepts mapped to architecture
2. **`ADAPTER_ARCHITECTURE.md`** - Pluggable adapter system design
3. **`YINYANG_BALANCE.md`** - How YIN and YANG maintain perfect reflection
4. **`WU_WEI_INVESTMENT_STRUCTURE.md`** - Investment milestone system
5. **`DECAY_MECHANICS.md`** - Token decay system for active participation
6. **`QUARTERLY_REVIEW_SCENARIOS.md`** - Quarterly review process and contribution tracking
7. **`GIT_COMMIT_VISUALIZATION.md`** - Git commit visualization as event arcs

---

## Architecture Updates

### Repository Structure

**circaevum-yang** (Frontend):
```
circaevum-yang/
├── yang/                          # Large Yang (Three.js visualization)
│   ├── visualization/
│   └── ui/
│
└── yin-seed/                      # 阴种子 (Yin Seed - Backend Adapter)
    ├── api.js                     # Zhong (中) - The Center Contract
    ├── events.js
    ├── validation.js
    └── adapters/                  # Backend adapters (pluggable)
        ├── base-adapter.js
        ├── nakama-adapter.js
        ├── timescaledb-adapter.js
        ├── rest-adapter.js
        └── memory-adapter.js
```

**circaevum-yin** (Backend):
```
circaevum-yin/
├── yin/                           # Large Yin (Backend)
│   ├── api/
│   ├── database/
│   └── parsers/
│
└── yang-seed/                     # 阳种子 (Yang Seed - Frontend Adapter)
    ├── components/
    └── adapters/                  # Frontend adapters (pluggable)
        ├── base-adapter.js
        ├── threejs-adapter.js
        ├── unity-adapter.js
        └── webgl-adapter.js
```

---

## Token Structure Summary

| Token Type | # Tokens | Governance? | Equity? | Profit-Sharing? | Distribution? | Decay? |
|------------|----------|-------------|---------|-----------------|---------------|--------|
| **Zhong (中)** | 1 | ✅ Yes | ✅ Yes | ✅ Yes | Quarterly | ❌ No |
| **YANG** | 18 | ✅ Yes | ✅ Yes | ✅ Yes | Quarterly | ✅ Yes |
| **YIN** | 18 | ✅ Yes | ✅ Yes | ✅ Yes | Quarterly | ✅ Yes |
| **Wu Wei** | 18 | ✅ Yes | ✅ Yes | ✅ Yes | **Annual** | ✅ Yes |

**Total**: 55 tokens (1 Zhong + 18 YANG + 18 YIN + 18 Wu Wei)

---

## Next Steps: Implementation

### Phase 1: Demo Scope (Immediate)

**Goal**: Working demo where:
1. ✅ `circaevum-yang` works **independently** (standalone visualization)
2. ✅ `circaevum-yin` wraps `circaevum-yang` (full integration)
3. ✅ Both work **together** (upload ICS → parse → visualize)

**Tasks**:
1. **Rename/Restructure**:
   - Create `circaevum-yang/` structure
   - Create `circaevum-yin/` structure
   - Move existing code appropriately

2. **Implement Zhong (中) - The Center Contract**:
   - Create `yin-seed/api.js` with `CircaevumAPI`
   - Define event data model
   - Implement validation

3. **Implement Adapters**:
   - `yin-seed/adapters/memory-adapter.js` (standalone mode)
   - `yang-seed/adapters/threejs-adapter.js` (visualization wrapper)

4. **ICS Parser**:
   - Parse VEVENT format
   - Transform to event data model
   - Integrate with adapter

5. **Event Rendering**:
   - Worldline arcs for events
   - Collision avoidance
   - Event labels and markers

6. **Git Commit Visualization**:
   - Parse CHANGELOG.md
   - Create sprint arcs
   - Render commit dots along arcs

---

## Key Principles Established

1. **Taiji Balance**: YIN and YANG are perfectly balanced reflections
2. **Zhong (中)**: The Center Contract maintains balance
3. **Seeds (种子)**: Enable transformation (变) through adapters
4. **Platform Categories**: Clear naming (`yang-avp`, `yang-web`, `yin-nakama`, etc.)
5. **Quarterly Cycles**: Structured review and rotation process
6. **Visual Coherence**: Git commits as time streams with platform colors

---

## Ready to Begin

**Current State**:
- ✅ Architecture designed
- ✅ Token structure balanced
- ✅ Documentation complete
- ✅ Naming conventions established
- ✅ Visualization design ready

**Next Action**: Begin implementation of demo scope

---

**Last Updated**: Today's Session
**Status**: Ready for Implementation

