# Circaevum DAO - Phase 1

**The Center Contract** - Single source of truth for Circaevum governance, administration, and development.

Circaevum is a **3D calendar and time visualization system** that maps time to the actual motion of planets. Each moment in your life has a unique position in 3D space—where Earth was along its path around the Sun. Your brain already thinks spatially; Circaevum works with that. Memories become places you can navigate, anchored to planetary positions instead of arbitrary calendar grids.

This repository consolidates all Circaevum projects and serves as the framework for DAO governance and administrative processes in one transparent location. 

---

## 🌐 Quick Start: yang/web

**Start the visualization**:
```bash
cd yang/web
python3 -m http.server 8080
```

**Open in browser**: http://localhost:8080
<br>Or visit [https://circaevum.com/](https://circaevum.com/)

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

- **[Consolidation Handoff](./zhong/reviews/CONSOLIDATION_2025-12-23.md)** - Context from consolidation (EOY 2025)
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

## Project Status

### Q1 2025 - Foundation & Initial Development

**DAO & Governance (Zhong)**:
- ✅ Established Zhong (中) as central administrative hub
- ✅ Balanced YIN/YANG token structure with Wu Wei investment tiers
- ✅ Repository consolidation into monorepo structure
- ✅ Quarterly review system and contribution tracking framework

**Backend - Nakama (Yin)**:
- ✅ Nakama Device Authentication System (v0.4.03-v0.4.04)
- ✅ Google Calendar Integration (v0.4.02-v0.4.05)
- ✅ Sleep Data Visualization (v0.4.06)
- 🔄 Mobile Device Optimization (v0.4.07, ongoing)

**Frontend - Unity AVP (Yang)**:
- ✅ Zhong (中) UI - The Center Contract interface (v0.4.03-v0.4.04)

**Frontend - Web (Yang)**:
- ✅ Three.js visualization consolidated and working

**Architecture - Seeds**:
- ✅ Yang-Seed structure created (`yin/yang-seed/` for frontend in backend)
- ✅ Yin-Seed structure created (`yang/web/yin-seed/` for backend in frontend)

### Q3 2025 - Pod System & Event Processing

**Frontend - Unity AVP (Yang)**:
- ✅ Pod system simplification (console logging, event stats) - v0.4.08
- ✅ Nakama event cache comparison and batch processing - v0.4.08
- ✅ Google Event Manager improvements - v0.4.08

### Q4 2025 - UI/UX Enhancements & Repository Organization

**Frontend - Unity AVP (Yang)**:
- ✅ Event system improvements (transparency, visibility, panel management) - v0.4.09
- ✅ Turntable coordinate system with full rotation integration - v0.4.09
- ✅ Time navigation controllers (consolidated day/month navigation) - v0.4.09
- ✅ Event interaction improvements (selection, click handling, panel lifecycle) - v0.4.09

**DAO & Governance (Zhong)**:
- ✅ Root directory cleanup (consolidated 20+ markdown files)
- ✅ Documentation standards (markdown organization methodology)
- ✅ Screenshot organization system (automated tracking)
- ✅ Contribution evaluation frameworks (Unity, Web, Backend tracking)

### Current Work

**In Progress**:
- 🔄 Mobile Device Optimization - Performance and compatibility improvements

**Planned**:
- 📋 ISS Data Pod Visualization - Advanced data visualization interface
- 📋 User Login Flow Enhancement - Streamlined authentication
- 📋 Three.js Event Renderer - Web-based event visualization

See [Changelog](./zhong/reviews/CHANGELOG.md) for detailed progress tracking.

---

## Projects

### Yang (Frontend)

**yang-web** (Three.js / Web):
- Location: `yang/web/`
- Status: ✅ **Working** - Deployed at [circaevum.com](https://circaevum.com/)
- Features: Planetary time visualization, zoom controls, time markers, event rendering
- Start: `cd yang/web && python3 -m http.server 8080`
- See: [yang/web/CHANGELOG.md](./yang/web/CHANGELOG.md)

**yang-avp** (Unity / Apple Vision Pro - TimeBox):
- Location: `yang/unity/avp/`
- Status: ✅ **Active Development** - v0.4.09+ (Q4 2025)
- Features: 3D spatial calendar, event visualization, turntable rotation, time navigation
- Recent: Event system improvements, coordinate transformations, UI controllers
- See: [yang/unity/avp/CHANGELOG.md](./yang/unity/avp/CHANGELOG.md)

**yang-quest** (Unity / Meta Quest - Calendarium):
- Location: `yang/unity/quest/`
- Status: ✅ **Active Development**
- Features: VR calendar interface, spatial time navigation

### Yin (Backend)

**yin-nakama** (Nakama Backend):
- Location: `yin/nakama/`
- Status: ✅ **Active** - Used by Unity projects
- Features: Device authentication, real-time sync, event storage, Google Calendar integration
- Versions: v0.4.02-v0.4.07 (Q1-Q4 2025)

**yin-timescale** (TimescaleDB Backend):
- Location: `yin/timescale/`
- Status: 📋 **Planned** - Q2 2025
- Purpose: Time-series data storage and analytics

**yin-rest** (REST API Backend):
- Location: `yin/rest/`
- Status: 📋 **Planned** - Q2-Q3 2025
- Purpose: RESTful API for web and mobile clients

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

### Architecture & Design
- **[Architecture Overview](./docs/architecture/)** - System architecture documentation
- **[Taiji Philosophy](./docs/philosophy/TAIJI_PHILOSOPHY.md)** - Philosophical foundation (Yin/Yang/Zhong)
- **[Adapter System](./docs/architecture/ADAPTER_ARCHITECTURE.md)** - Pluggable backend/frontend adapters
- **[Seed Structure](./docs/architecture/SEED_STRUCTURE.md)** - Yin-seed and Yang-seed architecture

### Guides & Reference
- **[Developer Guide](./docs/guides/DEVELOPER_GUIDE.md)** - Development workflows
- **[User Guide](./docs/guides/USER_GUIDE.md)** - End-user documentation
- **[Contribution Evaluation](./docs/CONTRIBUTION_EVALUATION.md)** - How contributions are tracked
- **[Yang-Web Evaluation](./docs/YANG_WEB_EVALUATION_RECOMMENDATION.md)** - Web project tracking

### Changelogs
- **[Master Changelog](./zhong/reviews/CHANGELOG.md)** - All projects, quarterly tracking
- **[Web Changelog](./yang/web/CHANGELOG.md)** - yang-web specific changes
- **[AVP Changelog](./yang/unity/avp/CHANGELOG.md)** - TimeBox (Unity AVP) changes

---

## Platform Availability

Circaevum is available on multiple platforms:
- **Web**: [circaevum.com](https://circaevum.com/) - Three.js visualization
- **Apple Vision Pro**: TimeBox - Immersive spatial calendar (in development)
- **Meta Quest**: Calendarium - VR calendar experience (in development)

---

**Last Updated**: December 2025  
**Maintained By**: Circaevum DAO - The Center Contract (Zhong - 中)  
**Quarterly Reviews**: See [zhong/reviews/CHANGELOG.md](./zhong/reviews/CHANGELOG.md)

**See [Consolidation Handoff](./zhong/reviews/CONSOLIDATION_2025-12-23.md) for full context on the consolidation!**
