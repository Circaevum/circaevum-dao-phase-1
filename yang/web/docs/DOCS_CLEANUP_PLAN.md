# Documentation Cleanup Plan

## Analysis: Current State

**Total Markdown Files**: 30+
**Issue**: Too many docs, some outdated, some redundant

---

## Consolidation Strategy

### Keep (Essential)

**Root Level**:
- ✅ `README.md` - Main entry point
- ✅ `CHANGELOG.md` - DAO tracking
- ✅ `API.md` - Core API reference
- ✅ `ARCHITECTURE.md` - Main architecture (update to reflect Zhong structure)
- ✅ `ZHONG_RESTRUCTURE_PLAN.md` - Current plan

**Docs Folder**:
- ✅ `YINYANG_ARCHITECTURE.md` - Core architecture (most current)
- ✅ `TAIJI_PHILOSOPHY.md` - Philosophical foundation
- ✅ `ADAPTER_ARCHITECTURE.md` - Pluggable adapters
- ✅ `SEED_STRUCTURE.md` - Seed explanation
- ✅ `GIT_COMMIT_VISUALIZATION.md` - Commit visualization
- ✅ `PROJECTIONS.md` - Time projections
- ✅ `USER_GUIDE.md` - End user guide
- ✅ `DEVELOPER_GUIDE.md` - Developer guide

### Consolidate (Merge into others)

**Merge into `ARCHITECTURE.md`**:
- ❌ `ARCHITECTURE_REASSESSMENT.md` - Outdated (superseded by YINYANG_ARCHITECTURE)
- ❌ `SUMMARY.md` - Redundant (info in ARCHITECTURE.md)
- ❌ `RESTRUCTURE_SUMMARY.md` - Info in ZHONG_RESTRUCTURE_PLAN

**Merge into `docs/YINYANG_ARCHITECTURE.md`**:
- ❌ `ARCHITECTURE_REASSESSMENT.md` - Already covered

**Merge into single "Implementation" doc**:
- ❌ `IMPLEMENTATION_PLAN.md` - Outdated (use DEMO_SCOPE.md)
- ❌ `WEB_IMPLEMENTATION_PLAN.md` - Outdated (use DEMO_SCOPE.md)
- ✅ Keep `DEMO_SCOPE.md` - Current goal

**Merge into single "Documentation Strategy" doc**:
- ❌ `DOCUMENTATION_STRATEGY.md` - Outdated
- ❌ `DOCUMENTATION_STRATEGY_V2.md` - Outdated
- ❌ `DOCUMENTATION_ALTERNATIVES.md` - Outdated
- ❌ `VITEPRESS_THREEJS.md` - Outdated (VitePress decided)

**Archive (Done/Reference)**:
- ❌ `REPO_CLEANUP.md` - Already done
- ❌ `REPO_STRUCTURE.md` - Outdated (we're using Zhong structure now)
- ❌ `MAINTENANCE.md` - Outdated (references old structure)
- ❌ `WRAPPER_EXAMPLE.md` - Outdated (use ADAPTER_ARCHITECTURE.md)

**Keep but Update**:
- ✅ `BACKEND_MIGRATION_PLAN.md` - Useful, update references
- ✅ `BACKEND_STRATEGY.md` - Useful, update references
- ✅ `STORAGE_STRATEGY.md` - Useful, update references
- ✅ `TIMESCALEDB_SETUP.md` - Useful reference
- ✅ `UNITY_ADAPTER.md` - Useful reference
- ✅ `REACT_ROLE.md` - Useful clarification
- ✅ `RING_STATION_INTEGRATION.md` - New, relevant

---

## Recommended Structure (After Cleanup)

### Root Level (5 files)
```
circaevum-zhong/
├── README.md                    # Main entry
├── CHANGELOG.md                 # DAO tracking
├── API.md                       # API reference
├── ARCHITECTURE.md              # Main architecture (updated)
└── ZHONG_RESTRUCTURE_PLAN.md    # Current plan
```

### Docs Folder (15 files)
```
docs/
├── architecture/
│   ├── YINYANG_ARCHITECTURE.md  # Core architecture
│   ├── ADAPTER_ARCHITECTURE.md  # Adapter system
│   ├── SEED_STRUCTURE.md        # Seeds explanation
│   ├── BACKEND_MIGRATION_PLAN.md
│   ├── BACKEND_STRATEGY.md
│   └── STORAGE_STRATEGY.md
│
├── philosophy/
│   └── TAIJI_PHILOSOPHY.md      # Philosophical foundation
│
├── guides/
│   ├── USER_GUIDE.md
│   ├── DEVELOPER_GUIDE.md
│   └── PROJECTIONS.md
│
├── examples/
│   ├── GIT_COMMIT_VISUALIZATION.md
│   ├── RING_STATION_INTEGRATION.md
│   └── DEMO_SCOPE.md
│
└── reference/
    ├── TIMESCALEDB_SETUP.md
    ├── UNITY_ADAPTER.md
    └── REACT_ROLE.md
```

---

## Cleanup Actions

### 1. Delete Outdated Files
- `ARCHITECTURE_REASSESSMENT.md` - Superseded
- `SUMMARY.md` - Redundant
- `RESTRUCTURE_SUMMARY.md` - Redundant
- `DOCUMENTATION_STRATEGY.md` - Outdated
- `DOCUMENTATION_STRATEGY_V2.md` - Outdated
- `DOCUMENTATION_ALTERNATIVES.md` - Outdated
- `VITEPRESS_THREEJS.md` - Outdated
- `IMPLEMENTATION_PLAN.md` - Outdated
- `WEB_IMPLEMENTATION_PLAN.md` - Outdated
- `REPO_CLEANUP.md` - Done
- `REPO_STRUCTURE.md` - Outdated
- `MAINTENANCE.md` - Outdated
- `WRAPPER_EXAMPLE.md` - Outdated

### 2. Update Existing Files
- `ARCHITECTURE.md` - Update to reflect Zhong structure
- `README.md` - Update to reflect Zhong structure
- `BACKEND_MIGRATION_PLAN.md` - Update references
- `BACKEND_STRATEGY.md` - Update references
- `STORAGE_STRATEGY.md` - Update references

### 3. Organize into Subfolders
- Create `docs/architecture/`
- Create `docs/philosophy/`
- Create `docs/guides/`
- Create `docs/examples/`
- Create `docs/reference/`

---

## Result

**Before**: 30+ markdown files
**After**: ~20 organized files

**Benefits**:
- ✅ Less overwhelming
- ✅ Better organized
- ✅ All current
- ✅ Clear structure
- ✅ Easy to navigate

