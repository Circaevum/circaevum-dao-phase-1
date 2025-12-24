# Circaevum Zhong (中)

**The Center Contract** - Administrative hub for managing Circaevum

Zhong (中) is the center point where Yin and Yang meet. This repository coordinates all Circaevum projects, tracks contributions, manages DAO governance, and facilitates quarterly reviews.

---

## Structure

```
circaevum-zhong/
├── yin/                    # Backend projects (Yin)
│   ├── nakama/            # Nakama backend
│   ├── timescale/         # TimescaleDB backend
│   └── rest/              # REST API backend
│
├── yang/                   # Frontend projects (Yang)
│   ├── web/               # Three.js web (yang-web)
│   │   ├── circaevum/     # Main visualization
│   │   │
│   │   └── yin-seed/      # 阴种子 (Yin Seed - Backend in Frontend)
│   │       ├── api.js     # Zhong (中) - The Center Contract
│   │       ├── events.js  # Event data model
│   │       └── adapters/  # Backend adapters
│   │
│   └── unity/              # Unity projects (yang-avp)
│       ├── TimeBox/       # Apple Vision Pro
│       └── Calendarium/  # Meta Quest
│
├── yin/                    # Backend projects (Yin)
│   ├── nakama/            # Nakama backend (yin-nakama)
│   ├── timescale/         # TimescaleDB backend (yin-timescale)
│   ├── rest/              # REST API backend (yin-rest)
│   │
│   └── yang-seed/         # 阳种子 (Yang Seed - Frontend in Backend)
│       ├── components/    # React UI components
│       │   └── RingStationVisualization.tsx  # Backend structure visualization (Yang-Seed example)
│       └── adapters/      # Frontend adapters
│
├── zhong/                  # Administration (Zhong - 中)
│   ├── dao/               # DAO governance
│   ├── tracking/          # Contribution tracking
│   ├── problems/          # Problem tracking
│   └── milestones/         # Investment milestones
│
└── docs/                   # Documentation
    ├── architecture/       # Architecture docs
    ├── philosophy/         # Taiji philosophy
    └── guides/            # User/developer guides
```

---

## Quick Links

- **[DAO Structure](./zhong/dao/phase-1/README.md)** - DAO governance and token structure
- **[Changelog](./CHANGELOG.md)** - All changes tracked for quarterly reviews
- **[Architecture](./docs/architecture/)** - System architecture documentation
- **[Quarterly Reviews](./zhong/reviews/)** - Quarterly review records
- **[Contribution Tracking](./zhong/tracking/)** - GitHub contribution analysis

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

## Projects

### Yang (Frontend)

**yang-web** (Three.js / Web):
- Location: `yang/web/`
- Platform: Three.js, Web
- Status: Active development

**yang-avp** (Unity / Apple Vision Pro):
- Location: `yang/unity/TimeBox/`
- Platform: Unity, Apple Vision Pro
- Status: Active development

**yang-quest** (Unity / Meta Quest):
- Location: `yang/unity/Calendarium/`
- Platform: Unity, Meta Quest
- Status: Active development

### Yin (Backend)

**yin-nakama** (Nakama Backend):
- Location: `yin/nakama/`
- Platform: Nakama, PostgreSQL
- Status: Active (used by Unity projects)

**yin-timescale** (TimescaleDB Backend):
- Location: `yin/timescale/`
- Platform: TimescaleDB, PostgreSQL
- Status: Planned

**yin-rest** (REST API Backend):
- Location: `yin/rest/`
- Platform: Next.js, REST API
- Status: Planned

---

## DAO Integration

**DAO Repository**: [circaevum-dao-phase-1](https://github.com/Circaevum/circaevum-dao-phase-1)

**Articles of Incorporation**: Points to this repository (`circaevum-zhong`) as the main administrative hub.

**Quarterly Reviews**: 
- Zhong-curated contribution tallying
- Token awards based on problem completion
- Investment milestone tracking
- Yin-Yang rotation (90° counterclockwise)

---

## Contribution Tracking

**Repositories Watched**: See `zhong/tracking/repositories.json`

**Current Projects**:
- TimeBox (yang-avp)
- Calendarium (yang-avp)
- three-circa (yang-web)
- circaevum-yin (yin-rest) - Planned

**Tracking**:
- Commits tagged with `PROBLEM-YIN-XXX`, `PROBLEM-YANG-XXX`, `PROBLEM-ZHONG-XXX`
- Platform categories: `[yang-web]`, `[yang-avp]`, `[yin-nakama]`, etc.
- Quarterly analysis via `zhong/tracking/commit-tracker.sh`

---

## Investment Milestones

**Current Tier**: Seed (WW-001 through WW-006)

**Milestones**:
- WW-001: $25,000
- WW-002: $50,000
- WW-003: $75,000
- WW-004: $100,000
- WW-005: $150,000
- WW-006: $200,000

See `zhong/milestones/current.json` for full details.

---

## Getting Started

### For Developers

1. **Frontend Development**: See `yang/web/` or `yang/unity/`
2. **Backend Development**: See `yin/nakama/`, `yin/timescale/`, or `yin/rest/`
3. **Architecture**: See `docs/architecture/`
4. **Philosophy**: See `docs/philosophy/TAIJI_PHILOSOPHY.md`

### For Contributors

1. **Problem Tracking**: Tag commits with `PROBLEM-YIN-XXX` or `PROBLEM-YANG-XXX`
2. **Platform Tags**: Include platform category `[yang-web]`, `[yang-avp]`, etc.
3. **Quarterly Reviews**: Contributions tracked automatically via `zhong/tracking/`

### For Investors

1. **Investment Milestones**: See `zhong/milestones/current.json`
2. **DAO Structure**: See `zhong/dao/phase-1/README.md`
3. **Token Information**: See `zhong/dao/phase-1/WU_WEI_INVESTMENT_STRUCTURE.md`

---

## Documentation

- **[Architecture](./docs/architecture/)** - System architecture and design
- **[Taiji Philosophy](./docs/philosophy/TAIJI_PHILOSOPHY.md)** - Philosophical foundation
- **[Adapter System](./docs/architecture/ADAPTER_ARCHITECTURE.md)** - Pluggable adapters
- **[Git Commit Visualization](./docs/GIT_COMMIT_VISUALIZATION.md)** - Visualizing development sprints

---

## License

[To be determined based on open-source vs closed-source separation]

---

## Contact

**DAO**: [circaevum-dao-phase-1](https://github.com/Circaevum/circaevum-dao-phase-1)
**Main Repository**: This repository (`circaevum-zhong`)

---

**Last Updated**: March 2025 (Q1 2025)
**Maintained By**: Circaevum Zhong (中) - The Center Contract
