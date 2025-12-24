# Yin-Yang Architecture: Visual Coherence

## The Symbol Structure

The Yin-Yang symbol has:
- **Large Yang** (white) with **small Yin dot** (black) = Frontend with backend seed
- **Large Yin** (black) with **small Yang dot** (white) = Backend with frontend seed
- **Curved boundary** = Zhong (中) - The Center Contract (transition mechanism)

---

## Architecture Mapping

### circaevum-yang (Large Yang with Yin Dot)

**Large Yang** (Frontend Focus):
- ✅ Three.js visualization
- ✅ Event rendering (worldline arcs)
- ✅ User interaction (navigation, zoom)
- ✅ UI components (event table, controls)

**Small Yin Dot** (Backend Seed):
- ✅ **Event data model** (normalized format)
- ✅ **API interface definition** (`CircaevumAPI` - the contract)
- ✅ **Data validation** (ensuring data integrity)
- ✅ **State management** (event storage in memory)

**Why**: The frontend needs to define what data it accepts (Yin seed) to remain backend-agnostic.

```
circaevum-yang/
├── yang/                          # Large Yang (Frontend)
│   ├── visualization/
│   │   ├── main.js               # Three.js scene
│   │   ├── event-renderer.js    # Worldline arc rendering
│   │   └── navigation.js         # Time navigation
│   └── ui/
│       ├── event-table.js       # Event list UI
│       └── controls.js           # Zoom/controls
│
└── yin-seed/                      # 阴种子 (Yin Seed - Backend Seed)
    ├── api.js                     # Zhong (中) - The Center Contract
    ├── events.js                  # Event data model
    ├── validation.js              # Data validation
    └── adapters/                  # Backend adapters (pluggable)
        ├── base-adapter.js        # Abstract base class
        ├── nakama-adapter.js      # Nakama backend
        ├── timescaledb-adapter.js # TimescaleDB backend
        ├── rest-adapter.js        # REST API backend
        └── memory-adapter.js      # In-memory (standalone)
```

---

### circaevum-yin (Large Yin with Yang Dot)

**Large Yin** (Backend Focus):
- ✅ REST API endpoints
- ✅ Database (PostgreSQL)
- ✅ Authentication (NextAuth.js)
- ✅ File parsers (ICS, CSV, JSON)
- ✅ Data storage operations

**Small Yang Dot** (Frontend Seed):
- ✅ **React UI components** (for backend management)
- ✅ **Visualization wrapper** (integrates circaevum-yang)
- ✅ **Admin dashboard** (manage events, collections)
- ✅ **Upload interface** (file upload UI)

**Why**: The backend needs UI to manage itself and integrate with visualization (Yang seed).

```
circaevum-yin/
├── yin/                          # Large Yin (Backend)
│   ├── api/                      # REST API endpoints
│   │   ├── events.ts
│   │   ├── auth.ts
│   │   └── upload.ts
│   ├── database/
│   │   └── prisma/               # Database schema
│   ├── parsers/
│   │   ├── ical.ts
│   │   └── csv.ts
│   └── storage/
│       └── nakama-adapter.ts
│
└── yang-seed/                     # 阳种子 (Yang Seed - Frontend Seed)
    ├── components/
    │   ├── CircaevumViewer.tsx   # Visualization wrapper
    │   ├── EventUpload.tsx       # Upload UI
    │   └── EventTable.tsx        # Event list UI
    └── lib/
        └── circaevum-api.ts      # Wrapper for CircaevumAPI
```

---

## Zhong (中): The Center Contract

**Zhong** (中) is the **central contract** - the balance point where Yin and Yang meet. It replaces "Space Station Memory Palace" / "Taiji Point" as the core interface.

**Location**: Defined in `circaevum-yang/yin-seed/api.js`

**Purpose**: 
- Defines the **stable interface** that both systems agree on
- The **center point** (中) - balance between Yin and Yang
- The **contract** that enables transformation without breaking compatibility

**Structure**: Can be visualized as a **tree-like branching structure** where:

- **Root** = API Contract (`CircaevumAPI`) - 中 (Zhong - The Center)
- **Branches** = Different data flows (events, streams, navigation) - 气 (Qi - Energy flow)
- **Leaves** = Specific operations (getEvents, setEvents, navigateToTime) - 道 (Dao - The way)

**Philosophy**: The tree structure represents **Qi** (气) - energy flowing through branches, following **The Way** (道) naturally, centered on **Zhong** (中).

### Tree Structure Visualization

```
Zhong (中) - The Center Contract
│
├── Events Branch (气 - Qi Flow)
│   ├── setEvents()          → Yang (visualization - 动 Movement)
│   ├── addEvents()          → Yang (visualization - 动 Movement)
│   ├── getEvents()          ← Yin (backend data - 静 Stillness)
│   └── removeEvents()       → Yang (visualization - 动 Movement)
│
├── Streams Branch (道 - The Way)
│   ├── setStreams()         → Yang (visualization)
│   ├── setStreamVisibility() → Yang (visualization)
│   └── getStreams()          ← Yin (backend data)
│
├── Navigation Branch (动 - Movement)
│   ├── navigateToTime()      → Yang (visualization)
│   ├── navigateToEvent()    → Yang (visualization)
│   └── getCurrentTimeRange() ← Yang (visualization state)
│
└── Lifecycle Branch (循环 - Cycles)
    ├── init()               → Yang (visualization)
    ├── destroy()            → Yang (visualization)
    └── refresh()            → Yang (visualization)
```

### Implementation: Tree Structure

```javascript
// circaevum-yang/yin-seed/api.js
// Zhong (中) - The Center Contract - Tree Structure

const Zhong = {
  // Root: API Contract (中 - The Center)
  version: "1.0.0",
  
  // Events Branch (Yin → Yang flow)
  events: {
    set: (events) => {
      // Validate (Yin dot)
      validateEvents(events);
      // Render (Yang)
      renderEvents(events);
    },
    add: (events) => {
      validateEvents(events);
      renderEvents(events, { append: true });
    },
    get: () => {
      // Return current events (Yang state)
      return currentEvents;
    },
    remove: (eventIds) => {
      removeEvents(eventIds);
      refreshVisualization();
    }
  },
  
  // Streams Branch
  streams: {
    set: (streams) => {
      validateStreams(streams);
      updateStreamLayers(streams);
    },
    setVisibility: (streamId, visible) => {
      toggleStreamVisibility(streamId, visible);
      refreshVisualization();
    }
  },
  
  // Navigation Branch
  navigation: {
    toTime: (date) => {
      navigateToTime(date);
      updateCamera();
    },
    toEvent: (eventId) => {
      const event = findEvent(eventId);
      navigateToTime(event.start);
      highlightEvent(eventId);
    },
    getCurrentRange: () => {
      return calculateVisibleRange();
    }
  },
  
  // Lifecycle Branch
  lifecycle: {
    init: (config) => {
      initializeVisualization(config);
    },
    destroy: () => {
      cleanup();
    },
    refresh: () => {
      refreshVisualization();
    }
  }
};

// Expose as CircaevumAPI (Zhong - 中)
window.CircaevumAPI = Zhong;
```

---

## Visual Coherence: How Dots Map

### Yin Seed in Yang (circaevum-yang)

**Location**: `circaevum-yang/yin-seed/` - 阴种子 (Yīn Zhǒngzi)

**Purpose**: Backend concerns within frontend (静 - Stillness within 动 - Movement)
- **Event data model**: Defines what data format is accepted
- **API contract**: Defines the interface (Zhong - 中)
- **Validation**: Ensures data integrity before rendering

**Visual Representation**:
```
circaevum-yang (Large Yang - 动 Movement)
┌─────────────────────────┐
│  Visualization (Yang)   │
│  ┌───────────────────┐  │
│  │ yin-seed/         │  │ ← 阴种子 (Yin Seed - 静 Stillness)
│  │  - events.js      │  │
│  │  - api.js         │  │
│  │  - validation.js  │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

**Why It Matters**: The frontend defines its own data contract (Yin seed), making it backend-agnostic. This represents **potential for transformation** (变 - Biàn).

**Adapter Architecture**: The `yin-seed` contains **pluggable backend adapters** that allow `circaevum-yang` to work with different backends:
- ✅ **Nakama adapter** - Plug into Nakama backend
- ✅ **TimescaleDB adapter** - Plug into TimescaleDB
- ✅ **REST adapter** - Plug into REST API
- ✅ **Memory adapter** - Standalone mode (no backend)

See `docs/ADAPTER_ARCHITECTURE.md` for details.

---

### Yang Seed in Yin (circaevum-yin)

**Location**: `circaevum-yin/yang-seed/` - 阳种子 (Yáng Zhǒngzi)

**Purpose**: Frontend concerns within backend (动 - Movement within 静 - Stillness)
- **React components**: UI for managing backend
- **Visualization wrapper**: Integrates with circaevum-yang
- **Admin dashboard**: Visual interface for backend operations

**Visual Representation**:
```
circaevum-yin (Large Yin - 静 Stillness)
┌─────────────────────────┐
│  Backend (Yin)          │
│  ┌───────────────────┐  │
│  │ yang-seed/       │  │ ← 阳种子 (Yang Seed - 动 Movement)
│  │  - components/   │  │
│  │  - lib/          │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

**Why It Matters**: The backend needs UI to integrate with visualization (Yang seed). This represents **potential for transformation** (变 - Biàn).

**Adapter Architecture**: The `yang-seed` contains **pluggable frontend adapters** that allow `circaevum-yin` to work with different visualization engines:
- ✅ **Three.js adapter** - Plug into three.js visualization
- ✅ **Unity adapter** - Plug into Unity visualization
- ✅ **WebGL adapter** - Plug into generic WebGL

See `docs/ADAPTER_ARCHITECTURE.md` for details.

---

## Tree-Like Branching: Zhong (中)

### Branch Structure

Zhong (中) can be visualized as a **tree** where:

```
Zhong (中) - The Center Contract (Root)
│
├── Events (Branch)
│   ├── Input (Yin) → setEvents, addEvents
│   ├── Output (Yang) → renderEvents, updateVisualization
│   └── State (Yang) → getEvents, currentEvents
│
├── Streams (Branch)
│   ├── Input (Yin) → setStreams, setStreamVisibility
│   └── Output (Yang) → updateStreamLayers
│
├── Navigation (Branch)
│   ├── Input (Yin) → navigateToTime, navigateToEvent
│   └── Output (Yang) → updateCamera, highlightEvent
│
└── Lifecycle (Branch)
    ├── Input (Yin) → init, destroy
    └── Output (Yang) → initializeVisualization, cleanup
```

### Implementation with Tree Structure

```javascript
// circaevum-yang/yin-seed/palace-tree.js
class PalaceTree {
  constructor() {
    this.root = {
      events: new EventsBranch(),
      streams: new StreamsBranch(),
      navigation: new NavigationBranch(),
      lifecycle: new LifecycleBranch()
    };
  }
  
  // Events branch handles Yin → Yang flow
  events = {
    set: (events) => {
      // Yin: Validate data
      this.root.events.validate(events);
      // Yang: Render
      this.root.events.render(events);
    },
    get: () => {
      // Yang: Return state
      return this.root.events.getState();
    }
  };
}

class EventsBranch {
  validate(events) {
    // Yin dot: Backend concern (data validation)
    events.forEach(event => {
      if (!event.id || !event.title || !event.start) {
        throw new Error('Invalid event format');
      }
    });
  }
  
  render(events) {
    // Yang: Frontend concern (visualization)
    renderWorldlineArcs(events);
  }
  
  getState() {
    // Yang: Frontend state
    return currentEvents;
  }
}
```

---

## File Structure Reflecting Symbol

### circaevum-yang Structure

```
circaevum-yang/
├── README.md
├── package.json
│
├── yang/                          # Large Yang (Frontend)
│   ├── visualization/
│   │   ├── main.js               # Three.js scene
│   │   ├── planets.js            # Planet rendering
│   │   ├── worldlines.js          # Worldline rendering
│   │   └── event-renderer.js      # Event arc rendering
│   │
│   ├── navigation/
│   │   ├── zoom.js               # Zoom level management
│   │   ├── time-navigation.js   # Time navigation
│   │   └── camera.js              # Camera controls
│   │
│   └── ui/
│       ├── event-table.js        # Event list UI
│       ├── controls.js           # UI controls
│       └── markers.js            # Time markers
│
└── yin-seed/                      # 阴种子 (Yin Seed - Backend Seed)
    ├── events.js                 # Event data model
    ├── api.js                     # Zhong (中) - The Center Contract
    ├── validation.js             # Data validation
    └── palace-tree.js            # Tree structure implementation
```

### circaevum-yin Structure

```
circaevum-yin/
├── README.md
├── package.json
│
├── yin/                          # Large Yin (Backend)
│   ├── api/
│   │   ├── events.ts             # Events endpoints
│   │   ├── auth.ts               # Authentication
│   │   └── upload.ts             # File upload
│   │
│   ├── database/
│   │   └── prisma/
│   │       └── schema.prisma     # Database schema
│   │
│   ├── parsers/
│   │   ├── ical.ts               # ICS parser
│   │   └── csv.ts                # CSV parser
│   │
│   └── storage/
│       ├── nakama-adapter.ts     # Nakama adapter
│       └── postgres-adapter.ts   # PostgreSQL adapter
│
└── yang-seed/                     # 阳种子 (Yang Seed - Frontend Seed)
    ├── components/
    │   ├── CircaevumViewer.tsx   # Visualization wrapper
    │   ├── EventUpload.tsx       # Upload UI
    │   ├── EventTable.tsx        # Event list UI
    │   └── AdminDashboard.tsx    # Admin UI
    │
    └── lib/
        └── circaevum-api.ts      # Wrapper for CircaevumAPI
```

---

## Visual Coherence: How It Maps

### The Symbol

```
     ┌─────────────┐
     │   YANG      │
     │  (White)    │
     │      ⚫     │ ← Yin dot
     │             │
     └─────────────┘
     ┌─────────────┐
     │   YIN       │
     │  (Black)    │
     │      ⚪     │ ← Yang dot
     │             │
     └─────────────┘
```

### The Architecture

```
circaevum-yang (Large Yang)
┌─────────────────────────┐
│  Visualization (Yang)   │
│  - Rendering            │
│  - Navigation           │
│  - UI Components        │
│                         │
│  ┌───────────────────┐  │
│  │ yin-seed/        │  │ ← 阴种子 (Yin Seed)
│  │  - Data Model    │  │   (Backend seed)
│  │  - API Contract  │  │
│  │  - Validation    │  │
│  └───────────────────┘  │
└─────────────────────────┘
         │
         │ Zhong (中)
         │ (The Center Contract)
         │
circaevum-yin (Large Yin)
┌─────────────────────────┐
│  Backend (Yin)          │
│  - REST API             │
│  - Database             │
│  - Parsers              │
│                         │
│  ┌───────────────────┐  │
│  │ yang-seed/       │  │ ← 阳种子 (Yang Seed)
│  │  - React UI      │  │   (Frontend seed)
│  │  - Visualization │  │
│  │  - Admin         │  │
│  └───────────────────┘  │
└─────────────────────────┘
```

---

## Tree-Like Branching: Implementation

### Palace Tree Structure

```javascript
// circaevum-yang/yin-seed/palace-tree.js
/**
 * Zhong (中) - The Center Contract - Tree Structure
 * Represents the transition mechanism between Yin and Yang
 */

class PalaceTree {
  constructor() {
    this.branches = {
      events: new EventsBranch(),
      streams: new StreamsBranch(),
      navigation: new NavigationBranch(),
      lifecycle: new LifecycleBranch()
    };
  }
  
  // Root API
  getRoot() {
    return {
      version: "1.0.0",
      events: this.branches.events.getAPI(),
      streams: this.branches.streams.getAPI(),
      navigation: this.branches.navigation.getAPI(),
      lifecycle: this.branches.lifecycle.getAPI()
    };
  }
}

class EventsBranch {
  constructor() {
    this.events = [];
    this.listeners = [];
  }
  
  // Yin → Yang flow
  set(events) {
    // Yin dot: Validate (backend concern)
    this.validate(events);
    // Yang: Store and render (frontend concern)
    this.events = events;
    this.render();
    this.notifyListeners('events:set', events);
  }
  
  add(events) {
    this.validate(events);
    this.events = [...this.events, ...events];
    this.render();
    this.notifyListeners('events:add', events);
  }
  
  // Yang → Yin flow (state query)
  get() {
    return this.events;
  }
  
  // Yin dot: Validation (backend seed in frontend)
  validate(events) {
    if (!Array.isArray(events)) {
      throw new Error('Events must be an array');
    }
    events.forEach(event => {
      if (!event.id || !event.title || !event.start) {
        throw new Error(`Invalid event: missing required fields`);
      }
    });
  }
  
  // Yang: Rendering (frontend concern)
  render() {
    renderWorldlineArcs(this.events);
  }
  
  getAPI() {
    return {
      set: (events) => this.set(events),
      add: (events) => this.add(events),
      get: () => this.get(),
      remove: (eventIds) => this.remove(eventIds),
      on: (event, callback) => this.addListener(event, callback)
    };
  }
}
```

---

## Visual Representation in Code

### Directory Structure as Symbol

The folder structure itself can reflect the Yin-Yang symbol:

```
circaevum-yang/
├── yang/              # Large Yang (most of the code)
│   ├── visualization/ # Frontend rendering
│   ├── navigation/    # User interaction
│   └── ui/            # UI components
│
└── yin-dot/           # Small Yin Dot (backend seed)
    ├── events.js      # Data model (Yin concern)
    ├── api.js         # API contract (Yin concern)
    └── validation.js  # Data validation (Yin concern)

circaevum-yin/
├── yin/               # Large Yin (most of the code)
│   ├── api/           # Backend endpoints
│   ├── database/      # Data storage
│   └── parsers/       # Data parsing
│
└── yang-dot/          # Small Yang Dot (frontend seed)
    ├── components/    # React UI (Yang concern)
    └── lib/           # Visualization integration (Yang concern)
```

### Visual Coherence

**File Count Ratio** (reflecting symbol proportions):
- `yang/` folder: ~80% of files (large Yang)
- `yin-seed/` folder: ~20% of files (阴种子 - Yin Seed)
- `yin/` folder: ~80% of files (large Yin)
- `yang-seed/` folder: ~20% of files (阳种子 - Yang Seed)

---

## Implementation for Today's Demo

### circaevum-yang Structure

```
circaevum-yang/
├── index.html
├── package.json
│
├── yang/
│   ├── visualization/
│   │   ├── main.js              # Three.js scene (existing)
│   │   └── event-renderer.js    # NEW: Worldline arcs
│   │
│   └── ui/
│       └── event-table.js       # NEW: Event list UI
│
└── yin-dot/                      # NEW: Backend seed
    ├── events.js                 # Event data model
    ├── api.js                     # Zhong (中) - The Center Contract
    └── validation.js             # Data validation
```

### circaevum-yin Structure

```
circaevum-yin/
├── package.json
│
├── yin/
│   ├── api/
│   │   └── upload.ts            # ICS upload endpoint
│   │
│   └── parsers/
│       └── ical.ts               # ICS parser
│
└── yang-dot/                     # Frontend seed
    ├── components/
    │   ├── CircaevumViewer.tsx   # Visualization wrapper
    │   └── EventUpload.tsx      # Upload UI
    │
    └── lib/
        └── circaevum-api.ts      # API wrapper
```

---

## Summary

**Visual Coherence Achieved**:
- ✅ **Large Yang** (`yang/` folder) = Frontend visualization (动 - Movement)
- ✅ **Yin Seed** (`yin-seed/` folder) = 阴种子 - Backend seed (静 - Stillness)
- ✅ **Large Yin** (`yin/` folder) = Backend operations (静 - Stillness)
- ✅ **Yang Seed** (`yang-seed/` folder) = 阳种子 - Frontend seed (动 - Movement)
- ✅ **Zhong** (中) = The Center Contract - Tree-like branching API structure
- ✅ **Qi Flow** (气) = Events/data flowing through branches
- ✅ **The Way** (道) = Natural data flow path

**Result**: Architecture visually and philosophically aligned with Taiji principles!

