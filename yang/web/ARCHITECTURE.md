# Circaevum Architecture: Zhong (中) - The Center Contract

## Overview

**circaevum-zhong** is the central administrative hub that coordinates all Circaevum projects. Zhong (中) is the center point where Yin and Yang meet, managing DAO governance, contribution tracking, and quarterly reviews.

---

## Repository Structure

```
circaevum-zhong/
├── yin/                            # Backend projects (Yin)
│   ├── nakama/                    # Nakama backend (yin-nakama)
│   ├── timescale/                 # TimescaleDB backend (yin-timescale)
│   ├── rest/                      # REST API backend (yin-rest)
│   │
│   └── yang-seed/                 # 阳种子 (Yang Seed - Frontend in Backend)
│       ├── components/            # React UI components
│       │   └── RingStationVisualization.tsx
│       └── adapters/              # Frontend adapters
│
├── yang/                           # Frontend projects (Yang)
│   ├── web/                       # Three.js web (yang-web)
│   │   ├── circaevum/            # Main visualization
│   │   │
│   │   └── yin-seed/              # 阴种子 (Yin Seed - Backend in Frontend)
│   │       ├── api.js             # Zhong (中) - The Center Contract
│   │       ├── events.js          # Event data model
│   │       └── adapters/          # Backend adapters
│   │
│   └── unity/                      # Unity projects (yang-avp)
│       ├── TimeBox/              # Apple Vision Pro
│       └── Calendarium/          # Meta Quest
│
├── zhong/                          # Administration (Zhong - 中)
│   ├── dao/phase-1/               # DAO governance
│   ├── tracking/                  # Contribution tracking
│   ├── problems/                  # Problem tracking
│   └── milestones/                # Investment milestones
│
└── docs/                           # Documentation
    ├── architecture/              # Architecture docs
    ├── philosophy/                # Taiji philosophy
    ├── guides/                    # User/developer guides
    ├── examples/                  # Examples
    └── reference/                 # Reference docs
```

---

## Philosophy: Yin, Yang, and Zhong

### Yin (阴) - Backend
- **Adaptive, foundational, source of data emergence**
- Projects: `yin-nakama`, `yin-timescale`, `yin-rest`
- Contains **yang-seed**: Frontend components for backend visualization

### Yang (阳) - Frontend
- **Active, dynamic, user experience**
- Projects: `yang-web`, `yang-avp`, `yang-quest`
- Contains **yin-seed**: Backend adapters, data models, API contract

### Zhong (中) - The Center Contract
- **Central coordination, balance, administration**
- Manages: DAO governance, contribution tracking, quarterly reviews
- Maintains balance (和谐 - Héxié) between Yin and Yang

---

## Seeds (种子): Transformation

### Yin-Seed in Yang (阴种子 in 阳)

**Location**: `yang/web/yin-seed/`

**Purpose**: Backend concerns within frontend
- Event data model
- API contract (Zhong - 中)
- Backend adapters (nakama, timescale, rest)

**Enables**: Frontend to be backend-agnostic

### Yang-Seed in Yin (阳种子 in 阴)

**Location**: `yin/yang-seed/`

**Purpose**: Frontend concerns within backend
- React UI components
- Visualization wrappers
- Frontend adapters (threejs, unity, webgl)

**Enables**: Backend to have UI/visualization capabilities

---

## API Contract: Zhong (中)

**Location**: `yang/web/yin-seed/api.js`

**Purpose**: The Center Contract - stable interface between Yin and Yang

```javascript
// Zhong (中) - The Center Contract
window.CircaevumAPI = {
  version: "1.0.0",
  
  // Events Branch
  events: {
    set: (events) => { /* ... */ },
    add: (events) => { /* ... */ },
    get: () => { /* ... */ }
  },
  
  // Streams Branch
  streams: {
    set: (streams) => { /* ... */ },
    get: () => { /* ... */ }
  },
  
  // Navigation Branch
  navigation: {
    toTime: (date) => { /* ... */ },
    toEvent: (eventId) => { /* ... */ }
  }
};
```

---

## Platform Categories

**Frontend (Yang)**:
- `yang-web` - Three.js / Web
- `yang-avp` - Unity / Apple Vision Pro
- `yang-quest` - Unity / Meta Quest

**Backend (Yin)**:
- `yin-nakama` - Nakama backend
- `yin-timescale` - TimescaleDB backend
- `yin-rest` - REST API backend

**Problem Tagging**: `PROBLEM-YANG-001 [yang-web]` or `PROBLEM-YIN-001 [yin-nakama]`

---

## DAO Integration

**DAO Repository**: [circaevum-dao-phase-1](https://github.com/Circaevum/circaevum-dao-phase-1)

**Articles of Incorporation**: Points to this repository (`circaevum-zhong`)

**Quarterly Reviews**: Zhong-curated contribution tallying, token awards, investment milestones

**Changelog**: `CHANGELOG.md` tracks all changes for DAO quarterly reviews

---

## Documentation

- **[Yin-Yang Architecture](./docs/architecture/YINYANG_ARCHITECTURE.md)** - Complete architecture
- **[Adapter System](./docs/architecture/ADAPTER_ARCHITECTURE.md)** - Pluggable adapters
- **[Seed Structure](./docs/architecture/SEED_STRUCTURE.md)** - Seeds explanation
- **[Taiji Philosophy](./docs/philosophy/TAIJI_PHILOSOPHY.md)** - Philosophical foundation
- **[API Reference](./API.md)** - Complete API documentation
- **[User Guide](./docs/guides/USER_GUIDE.md)** - End user documentation
- **[Developer Guide](./docs/guides/DEVELOPER_GUIDE.md)** - Code modification guide

---

## Quick Links

- **[DAO Structure](./zhong/dao/phase-1/README.md)** - DAO governance
- **[Changelog](./CHANGELOG.md)** - Quarterly change tracking
- **[Restructure Plan](./ZHONG_RESTRUCTURE_PLAN.md)** - Current implementation plan

---

**Last Updated**: March 2025 (Q1 2025)
**Maintained By**: Circaevum Zhong (中) - The Center Contract
