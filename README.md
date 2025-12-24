# Circaevum DAO - Phase 1

**The Center Contract** - Single source of truth for Circaevum governance, administration, and development.

This repository consolidates all Circaevum projects, DAO governance, and administrative processes in one transparent location.

---

## 🌐 Quick Start: yang/web

**Start the visualization**:
```bash
cd yang/web
python3 -m http.server 8080
```

**Open in browser**: http://localhost:8080

You should see the Circaevum planetary time visualization with zoom controls and time markers.

---

## Structure

```
circaevum-dao-phase-1/
├── zhong/                         # Admin process (TRANSPARENT)
│   ├── dao/phase-1/              # DAO structure and governance
│   ├── tracking/                 # Contribution tracking
│   ├── problems/                 # Problem tracking
│   ├── milestones/               # Investment milestones
│   └── reviews/                  # Quarterly reviews + CHANGELOG.md
│
├── yang/                          # Frontend projects
│   ├── web/                      # Three.js (yang-web) ✅ WORKS
│   └── unity/                    # Unity projects
│       ├── universal/            # Shared Unity code
│       ├── avp/                  # Apple Vision Pro (TimeBox)
│       ├── quest/                # Meta Quest (Calendarium)
│       └── pc/                   # Desktop/PC
│
├── yin/                           # Backend projects
│   ├── nakama/                   # Nakama backend
│   ├── timescale/                # TimescaleDB backend
│   ├── rest/                     # REST API backend
│   └── yang-seed/                # Yang Seed (frontend in backend)
│
└── docs/                          # Documentation
    ├── architecture/
    ├── philosophy/
    ├── guides/
    ├── examples/
    └── reference/
```

---

## Quick Links

- **[Consolidation Handoff](./zhong/reviews/CONSOLIDATION_2025-12-23.md)** - Context from consolidation (December 23, 2025)
- **[DAO Structure](./zhong/dao/phase-1/README.md)** - Complete DAO governance
- **[Changelog](./zhong/reviews/CHANGELOG.md)** - All changes tracked
- **[Problem Tracking](./zhong/problems/)** - Current problems
- **[Articles of Incorporation](./Addendum.md)** - Legal DAO structure

---

## Philosophy

**Zhong (中)** = The Center Contract
- Coordinates between Yin (backend) and Yang (frontend)
- Manages DAO governance and token structure
- Tracks contributions across all projects
- Facilitates quarterly reviews
- Maintains balance (和谐 - Héxié)

**Yin (阴)** = Backend projects
- Receptive, foundational, data emergence
- Platforms: `yin-nakama`, `yin-timescale`, `yin-rest`

**Yang (阳)** = Frontend projects
- Active, dynamic, user experience
- Platforms: `yang-web`, `yang-avp`, `yang-quest`

---

## Current Problems (Q1 2025)

**Back-End (Yin) Problems:**
1. **Mobile Device Optimization** 🔄 IN_PROGRESS
   - **Problem ID**: PROBLEM-YIN-004
   - **Token**: YIN-004 pending

**Front-End (Yang) Problems:**
2. **ISS Data Pod Visualization** 📋 PLANNED
   - **Problem ID**: PROBLEM-YANG-002
   - **Token**: YANG-002 pending

3. **User Login Flow Enhancement** 📋 PLANNED
   - **Problem ID**: PROBLEM-YANG-003
   - **Token**: YANG-003 pending

**Completed Problems (Q1 2025):**
- ✅ **Nakama Device Authentication** (PROBLEM-YIN-001)
- ✅ **Google Calendar Integration** (PROBLEM-YIN-002)
- ✅ **Sleep Data Visualization** (PROBLEM-YIN-003)
- ✅ **Zhong (中) Architecture** (PROBLEM-ZHONG-001)
- ✅ **Zhong (中) UI** (PROBLEM-YANG-001)

---

## Projects

### Yang (Frontend)

**yang-web** (Three.js / Web):
- Location: `yang/web/`
- Status: ✅ **Working** - Test on http://localhost:8080
- Start: `cd yang/web && python3 -m http.server 8080`

**yang-avp** (Unity / Apple Vision Pro):
- Location: `yang/unity/avp/`
- Status: Active development

**yang-quest** (Unity / Meta Quest):
- Location: `yang/unity/quest/`
- Status: Active development

### Yin (Backend)

**yin-nakama** (Nakama Backend):
- Location: `yin/nakama/`
- Status: Active (used by Unity projects)

**yin-timescale** (TimescaleDB Backend):
- Location: `yin/timescale/`
- Status: Planned

**yin-rest** (REST API Backend):
- Location: `yin/rest/`
- Status: Planned

---

## DAO Information

**Smart Contract**: `GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw` (Solana)
**Realm**: https://app.realms.today/dao/FDerj19PyQytsD1rL4NGpSeXWT8d7WdRABBxxCEnDj6d

**Legal Status**: Wyoming Decentralized Autonomous Organization LLC
**Articles of Incorporation**: See [Addendum.md](./Addendum.md)

---

## Getting Started

### For Developers

1. **Web Development**: See `yang/web/` - Start with `python3 -m http.server 8080`
2. **Unity Development**: See `yang/unity/`
3. **Backend Development**: See `yin/`
4. **Architecture**: See `docs/architecture/`

### For Contributors

1. **Problem Tracking**: Tag commits with `PROBLEM-YIN-XXX` or `PROBLEM-YANG-XXX`
2. **Platform Tags**: Include platform category `[yang-web]`, `[yang-avp]`, etc.
3. **Quarterly Reviews**: Contributions tracked in `zhong/tracking/`

---

## Documentation

- **[Architecture](./docs/architecture/)** - System architecture
- **[Taiji Philosophy](./docs/philosophy/TAIJI_PHILOSOPHY.md)** - Philosophical foundation
- **[Adapter System](./docs/architecture/ADAPTER_ARCHITECTURE.md)** - Pluggable adapters
- **[Seed Structure](./docs/architecture/SEED_STRUCTURE.md)** - Yin-seed and Yang-seed

---

**Last Updated**: December 2025
**Maintained By**: Circaevum DAO - The Center Contract (Zhong - 中)

**See [Consolidation Handoff](./zhong/reviews/CONSOLIDATION_2025-12-23.md) for full context on the consolidation!**
