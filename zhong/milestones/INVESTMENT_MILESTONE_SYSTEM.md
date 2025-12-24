# Investment Milestone System: Flexible Scaling

## Overview

The Wu Wei investment milestone system needs **flexibility** for near-term planning while **adapting** to long-term scaling. This document outlines a dynamic milestone system that can adjust as the company grows.

---

## Philosophy: Adaptable Growth

**Near-term**: Clear, achievable milestones for immediate fundraising
**Long-term**: Flexible system that scales with company growth
**Balance**: Structure with adaptability (Taiji principle)

---

## Dynamic Milestone Structure

### Tier-Based System

**Tiers** adjust based on company valuation and growth stage:

| Tier | Stage | Milestone Range | Total Tokens | Example Milestones |
|------|-------|----------------|--------------|-------------------|
| **Seed** | Early | $10k - $200k | 6 tokens | $25k, $50k, $75k, $100k, $150k, $200k |
| **Growth** | Scaling | $250k - $1.5M | 6 tokens | $250k, $350k, $500k, $750k, $1M, $1.5M |
| **Scale** | Mature | $2M - $15M+ | 6 tokens | $2M, $3M, $5M, $7.5M, $10M, $15M+ |

**Total**: 18 Wu Wei tokens across 3 tiers

### Milestone Calculation

**Dynamic Adjustment**:
- Milestones recalculated **annually** based on:
  - Company valuation
  - Revenue growth
  - Market conditions
  - DAO governance vote

**Formula**:
```javascript
function calculateMilestones(tier, currentValuation, growthRate) {
  const baseAmounts = {
    seed: [25000, 50000, 75000, 100000, 150000, 200000],
    growth: [250000, 350000, 500000, 750000, 1000000, 1500000],
    scale: [2000000, 3000000, 5000000, 7500000, 10000000, 15000000]
  };
  
  // Adjust based on valuation and growth
  const adjustmentFactor = currentValuation / 1000000; // Normalize to $1M
  const growthMultiplier = 1 + (growthRate / 100);
  
  return baseAmounts[tier].map(amount => 
    Math.round(amount * adjustmentFactor * growthMultiplier)
  );
}
```

---

## Near-Term Planning (Q1-Q4 2025)

### Seed Tier Milestones (Immediate)

**18 Wu Wei Tokens** distributed across tiers:

**Seed Tier (Tokens 1-6)**:
- **WW-001**: $25,000 - Initial seed funding
- **WW-002**: $50,000 - Product development
- **WW-003**: $75,000 - Team expansion
- **WW-004**: $100,000 - Infrastructure setup
- **WW-005**: $150,000 - Marketing launch
- **WW-006**: $200,000 - Seed round complete

**Growth Tier (Tokens 7-12)** - Future:
- Reserved for Series A (when valuation reaches $5M+)

**Scale Tier (Tokens 13-18)** - Future:
- Reserved for Series B+ (when valuation reaches $20M+)

### Quarterly Milestone Review

**Each Quarter**:
1. **Review Progress**: How many milestones reached?
2. **Adjust if Needed**: Can milestones be adjusted based on progress?
3. **Plan Next Quarter**: Which milestones are realistic?
4. **Governance Vote**: YIN/YANG holders vote on milestone adjustments

---

## Long-Term Adaptability

### Scaling Mechanism

**When to Scale**:
- **Seed → Growth**: When total investment reaches $200k+ or valuation $5M+
- **Growth → Scale**: When total investment reaches $1.5M+ or valuation $20M+

**How to Scale**:
1. **Governance Vote**: YIN/YANG holders vote on tier transition
2. **Milestone Recalculation**: New milestones calculated based on current valuation
3. **Token Reallocation**: Existing tokens remain, new tokens follow new tier structure
4. **Documentation Update**: Update milestone amounts in DAO docs

### Example: Scaling from Seed to Growth

**Before** (Seed Tier):
- WW-001: $25k ✅ (completed)
- WW-002: $50k ✅ (completed)
- WW-003: $75k 🔄 (in progress)
- WW-004: $100k 📋 (planned)

**After** (Growth Tier Transition):
- **Existing Tokens** (WW-001 through WW-006): Remain at Seed tier amounts
- **New Tokens** (WW-007 through WW-012): Growth tier amounts
  - WW-007: $250k (new milestone)
  - WW-008: $350k (new milestone)
  - ... (Growth tier structure)

**Result**: Flexibility - existing investors keep their tier, new investors enter at appropriate tier.

---

## GitHub Repository Tracking

### Repositories to Watch

**Primary Repositories**:
1. **TimeBox** (`yang-avp`) - Apple Vision Pro / Unity
   - Location: `Active/TimeBox/`
   - Platform: Unity, Apple Vision Pro
   - Track: Commits, problems, versions

2. **Calendarium** (`yang-avp`) - Meta Quest / Unity
   - Location: `Active/Calendarium/`
   - Platform: Unity, Meta Quest
   - Track: Commits, problems, versions

3. **three-circa** (`yang-web`) - Three.js / Web
   - Location: `Claude/circaevum-package/three-circa/`
   - Platform: Three.js, Web
   - Track: Commits, problems, versions

4. **circaevum-yin** (Future) - Backend
   - Location: (To be created)
   - Platform: Next.js, REST API
   - Track: Commits, problems, versions

**Supporting Repositories**:
- `circaevum-dao-phase-1/` - DAO governance
- `nakama-integration/` - Backend integration examples
- Other reference/archive projects

### Repository Configuration

**Config File**: `repositories.json`
```json
{
  "repositories": [
    {
      "name": "TimeBox",
      "path": "Active/TimeBox",
      "platform": "yang-avp",
      "type": "yang",
      "category": "Unity",
      "github": "https://github.com/Circaevum/TimeBox",
      "watch": true,
      "changelog": "CHANGELOG.md"
    },
    {
      "name": "Calendarium",
      "path": "Active/Calendarium",
      "platform": "yang-avp",
      "type": "yang",
      "category": "Unity",
      "github": "https://github.com/Circaevum/Calendarium",
      "watch": true
    },
    {
      "name": "three-circa",
      "path": "Claude/circaevum-package/three-circa",
      "platform": "yang-web",
      "type": "yang",
      "category": "Three.js",
      "github": "https://github.com/Circaevum/three-circa",
      "watch": true
    },
    {
      "name": "circaevum-yin",
      "path": "Active/circaevum-yin",
      "platform": "yin-rest",
      "type": "yin",
      "category": "Next.js",
      "github": "https://github.com/Circaevum/circaevum-yin",
      "watch": true,
      "status": "planned"
    }
  ],
  "tracking": {
    "commitTags": ["PROBLEM-YIN-", "PROBLEM-YANG-", "PROBLEM-ZHONG-"],
    "platformCategories": ["Unity", "Three.js", "Nakama", "TimescaleDB", "REST"],
    "quarterlyReview": true
  }
}
```

### Automated Tracking

**Script**: `track-contributions.sh`
```bash
#!/bin/bash
# Track contributions across all configured repositories

REPOS_FILE="repositories.json"
QUARTER=$(get_current_quarter)

# Load repository config
REPOS=$(cat $REPOS_FILE | jq -r '.repositories[] | select(.watch == true)')

# Track each repository
for repo in $REPOS; do
  name=$(echo $repo | jq -r '.name')
  path=$(echo $repo | jq -r '.path')
  platform=$(echo $repo | jq -r '.platform')
  
  echo "Tracking: $name ($platform)"
  
  # Analyze commits
  ./commit-tracker.sh analyze \
    --repository "$path" \
    --platform "$platform" \
    --quarter "$QUARTER" \
    --output "contributions/$name-$QUARTER.json"
done

# Aggregate results
./aggregate-contributions.sh --quarter "$QUARTER"
```

---

## Ring Station VR: Yin-Seed Visualization

### Analysis: `ring_station_vr.tsx`

**What it is**:
- **3D visualization** of backend architecture (services, APIs, connections)
- **React/Three.js component** showing ring-based space station structure
- **Visual representation** of backend systems (Yin structure)

**Classification**:
- **Type**: Yang (frontend visualization component)
- **Purpose**: Visualizes Yin (backend structure)
- **Location**: Could be `yang-seed/components/RingStationVisualization.tsx`
- **Use Case**: Visual representation of backend architecture for developers/users

**Why it's Yang-Seed**:
- It's a **frontend component** (React/Three.js)
- It **visualizes backend structure** (Yin)
- It's a **seed** - frontend concern within backend visualization context
- It helps **understand** the backend (Yin) through visualization (Yang)

**Alternative View**: Could also be considered a **yin-seed** example if we think of it as:
- Backend structure visualization (Yin)
- But implemented as frontend component (Yang seed within Yin)

**Recommendation**: **Yang-Seed** - It's a frontend visualization component that helps understand backend structure.

---

## Naming Conventions: Repository vs Platform

### Recommended Structure

**Repository Names** (Full repos):
- `circaevum-yang` - Frontend visualization repository
- `circaevum-yin` - Backend data/auth repository

**Platform Categories** (Within repos):
- **In `circaevum-yang`**:
  - `yang-web` - Three.js / Web platform
  - `yang-avp` - Unity / Apple Vision Pro platform
  - `yang-quest` - Unity / Meta Quest platform

- **In `circaevum-yin`**:
  - `yin-nakama` - Nakama backend
  - `yin-timescale` - TimescaleDB backend
  - `yin-rest` - REST API backend

### File Structure

```
circaevum-yang/                    # Repository name
├── yang/                          # Large Yang
│   ├── web/                       # yang-web (Three.js)
│   │   ├── visualization/
│   │   └── ui/
│   │
│   └── avp/                       # yang-avp (Unity/Apple Vision Pro)
│       ├── visualization/
│       └── ui/
│
└── yin-seed/                      # Yin Seed
    ├── api.js                     # Zhong (中)
    ├── events.js
    └── adapters/
        ├── nakama-adapter.js      # yin-nakama
        ├── timescaledb-adapter.js # yin-timescale
        └── rest-adapter.js        # yin-rest
```

### Problem Tagging

**Format**: `PROBLEM-[TYPE]-[NUMBER] [PLATFORM]`

**Examples**:
- `PROBLEM-YANG-001 [yang-web]` - Three.js problem
- `PROBLEM-YANG-002 [yang-avp]` - Apple Vision Pro problem
- `PROBLEM-YIN-001 [yin-nakama]` - Nakama backend problem
- `PROBLEM-YIN-002 [yin-timescale]` - TimescaleDB problem

---

## Investment Milestone Configuration

### Initial Setup (Q1 2025)

**Seed Tier** (Active):
```json
{
  "tier": "seed",
  "tokens": [1, 2, 3, 4, 5, 6],
  "milestones": [
    { "token": "WW-001", "amount": 25000, "status": "available" },
    { "token": "WW-002", "amount": 50000, "status": "available" },
    { "token": "WW-003", "amount": 75000, "status": "available" },
    { "token": "WW-004", "amount": 100000, "status": "available" },
    { "token": "WW-005", "amount": 150000, "status": "available" },
    { "token": "WW-006", "amount": 200000, "status": "available" }
  ]
}
```

**Growth Tier** (Reserved):
```json
{
  "tier": "growth",
  "tokens": [7, 8, 9, 10, 11, 12],
  "milestones": [
    { "token": "WW-007", "amount": 250000, "status": "reserved" },
    { "token": "WW-008", "amount": 350000, "status": "reserved" },
    // ... (unlocked when seed tier completes)
  ],
  "unlockCondition": {
    "type": "investment_threshold",
    "amount": 200000,
    "or": {
      "type": "valuation_threshold",
      "amount": 5000000
    }
  }
}
```

### Quarterly Adjustment Process

**Each Quarter**:
1. **Review Progress**: How many milestones reached?
2. **Check Conditions**: Should Growth tier unlock?
3. **Adjust Amounts**: Recalculate based on valuation/growth?
4. **Governance Vote**: YIN/YANG holders vote on adjustments
5. **Update Config**: Save new milestone configuration

---

## Summary

**Investment Milestones**:
- ✅ **Tier-based system**: Seed (6), Growth (6), Scale (6) = 18 tokens
- ✅ **Flexible scaling**: Adjusts based on valuation and growth
- ✅ **Near-term clarity**: Clear milestones for immediate fundraising
- ✅ **Long-term adaptability**: Can scale to higher amounts as company grows

**GitHub Tracking**:
- ✅ **Repository config**: `repositories.json` lists all repos to watch
- ✅ **Automated tracking**: Scripts analyze contributions across repos
- ✅ **Platform categories**: Track by `yang-web`, `yang-avp`, `yin-nakama`, etc.

**Ring Station VR**:
- ✅ **Yang-Seed example**: Frontend visualization of backend structure
- ✅ **Location**: `yang-seed/components/RingStationVisualization.tsx`

**Naming**:
- ✅ **Repositories**: `circaevum-yang`, `circaevum-yin`
- ✅ **Platforms**: `yang-web`, `yang-avp`, `yin-nakama`, `yin-timescale`
- ✅ **Problem tags**: `PROBLEM-YANG-001 [yang-web]`

