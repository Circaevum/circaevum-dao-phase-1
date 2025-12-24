# Adapter Architecture: Pluggable Seeds

## Overview

The **seeds** (种子) are designed as **pluggable adapters** that allow each system to work with different implementations of the other:

- **`yin-seed`** in `circaevum-yang` = Backend adapter interface (can plug into Nakama, TimescaleDB, REST API, etc.)
- **`yang-seed`** in `circaevum-yin` = Frontend adapter interface (can plug into three.js, Unity, WebGL, etc.)

**Philosophy**: The seeds represent **potential for transformation** (变 - Biàn) - they can adapt to work with different systems while maintaining the core contract (中 - Zhong).

---

## Zhong (中): The Center Contract

**Zhong** (中) replaces "Taiji Point" / "Space Station Memory Palace" as the **central contract** - the balance point where Yin and Yang meet.

**Location**: Defined in `circaevum-yang/yin-seed/api.js` (the API contract)

**Purpose**: 
- Defines the **stable interface** that both systems agree on
- The **center point** (中) - balance between Yin and Yang
- The **contract** that enables transformation without breaking compatibility

**Implementation**:
```javascript
// circaevum-yang/yin-seed/api.js
// Zhong (中) - The Center Contract

const Zhong = {
  version: "1.0.0",
  
  // Events Branch (气 - Qi Flow)
  events: {
    set: (events) => { /* ... */ },
    add: (events) => { /* ... */ },
    get: () => { /* ... */ }
  },
  
  // Streams Branch (道 - The Way)
  streams: {
    set: (streams) => { /* ... */ },
    get: () => { /* ... */ }
  },
  
  // Navigation Branch (动 - Movement)
  navigation: {
    toTime: (date) => { /* ... */ },
    toEvent: (eventId) => { /* ... */ }
  }
};

// Expose as CircaevumAPI (Zhong)
window.CircaevumAPI = Zhong;
```

---

## Yin Seed: Backend Adapter Interface

**Location**: `circaevum-yang/yin-seed/`

**Purpose**: Define the **backend adapter interface** that allows `circaevum-yang` to work with different backends.

### Structure

```
circaevum-yang/
└── yin-seed/                      # 阴种子 (Yin Seed)
    ├── api.js                     # Zhong (中) - The Center Contract
    ├── events.js                   # Event data model
    ├── validation.js               # Data validation
    └── adapters/                  # Backend adapters (pluggable)
        ├── base-adapter.js        # Abstract base class
        ├── nakama-adapter.js      # Nakama backend
        ├── timescaledb-adapter.js # TimescaleDB backend
        ├── rest-adapter.js        # REST API backend
        └── memory-adapter.js      # In-memory (standalone mode)
```

### Adapter Interface

```javascript
// circaevum-yang/yin-seed/adapters/base-adapter.js
/**
 * Base Backend Adapter Interface
 * All backend adapters must implement this interface
 */
class BackendAdapter {
  /**
   * Initialize the adapter
   * @param {Object} config - Backend-specific configuration
   */
  async init(config) {
    throw new Error('init() must be implemented');
  }
  
  /**
   * Fetch events from backend
   * @param {Object} options - Query options (start, end, streamId, etc.)
   * @returns {Promise<Event[]>} - Array of events
   */
  async fetchEvents(options = {}) {
    throw new Error('fetchEvents() must be implemented');
  }
  
  /**
   * Save events to backend
   * @param {Event[]} events - Events to save
   * @returns {Promise<void>}
   */
  async saveEvents(events) {
    throw new Error('saveEvents() must be implemented');
  }
  
  /**
   * Delete events from backend
   * @param {string[]} eventIds - Event IDs to delete
   * @returns {Promise<void>}
   */
  async deleteEvents(eventIds) {
    throw new Error('deleteEvents() must be implemented');
  }
  
  /**
   * Fetch streams/collections from backend
   * @returns {Promise<Stream[]>} - Array of streams
   */
  async fetchStreams() {
    throw new Error('fetchStreams() must be implemented');
  }
  
  /**
   * Authenticate with backend
   * @param {Object} credentials - Auth credentials
   * @returns {Promise<Object>} - Session/token
   */
  async authenticate(credentials) {
    throw new Error('authenticate() must be implemented');
  }
  
  /**
   * Cleanup resources
   */
  async destroy() {
    // Optional cleanup
  }
}
```

### Nakama Adapter Example

```javascript
// circaevum-yang/yin-seed/adapters/nakama-adapter.js
import { BackendAdapter } from './base-adapter.js';
import { Client } from '@heroiclabs/nakama-js';

class NakamaAdapter extends BackendAdapter {
  constructor() {
    super();
    this.client = null;
    this.session = null;
  }
  
  async init(config) {
    this.client = new Client(
      config.serverKey,
      config.host,
      config.port,
      config.useSSL
    );
    
    if (config.session) {
      this.session = config.session;
    }
  }
  
  async authenticate(credentials) {
    this.session = await this.client.authenticateEmail(
      credentials.email,
      credentials.password
    );
    return this.session;
  }
  
  async fetchEvents(options = {}) {
    const { start, end, streamId } = options;
    
    // Fetch from Nakama storage
    const objects = await this.client.listUsersStorageObjects(
      this.session,
      'events',
      this.session.userId,
      100
    );
    
    // Transform Nakama format to Event model
    return objects.objects.map(obj => ({
      id: obj.key,
      title: obj.value.title,
      start: new Date(obj.value.startTime),
      end: obj.value.endTime ? new Date(obj.value.endTime) : null,
      color: obj.value.color,
      streamId: obj.value.collectionId,
      source: obj.value.source,
      // ... map other fields
    }));
  }
  
  async saveEvents(events) {
    const writes = events.map(event => ({
      collection: 'events',
      key: event.id,
      value: {
        title: event.title,
        startTime: event.start.toISOString(),
        endTime: event.end ? event.end.toISOString() : null,
        color: event.color,
        collectionId: event.streamId,
        source: event.source,
        // ... other fields
      }
    }));
    
    await this.client.writeStorageObjects(this.session, writes);
  }
  
  async deleteEvents(eventIds) {
    const deletes = eventIds.map(id => ({
      collection: 'events',
      key: id
    }));
    
    await this.client.deleteStorageObjects(this.session, deletes);
  }
  
  async fetchStreams() {
    const objects = await this.client.listUsersStorageObjects(
      this.session,
      'collections',
      this.session.userId,
      100
    );
    
    return objects.objects.map(obj => ({
      id: obj.key,
      name: obj.value.name,
      source: obj.value.source,
      color: obj.value.color,
      visible: true
    }));
  }
}
```

### TimescaleDB Adapter Example

```javascript
// circaevum-yang/yin-seed/adapters/timescaledb-adapter.js
import { BackendAdapter } from './base-adapter.js';
import { Pool } from 'pg';

class TimescaleDBAdapter extends BackendAdapter {
  constructor() {
    super();
    this.pool = null;
  }
  
  async init(config) {
    this.pool = new Pool({
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      password: config.password
    });
  }
  
  async fetchEvents(options = {}) {
    const { start, end, streamId } = options;
    
    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];
    
    if (start) {
      query += ` AND start_time >= $${params.length + 1}`;
      params.push(start);
    }
    
    if (end) {
      query += ` AND end_time <= $${params.length + 1}`;
      params.push(end);
    }
    
    if (streamId) {
      query += ` AND collection_id = $${params.length + 1}`;
      params.push(streamId);
    }
    
    const result = await this.pool.query(query, params);
    
    return result.rows.map(row => ({
      id: row.id,
      title: row.title,
      start: new Date(row.start_time),
      end: row.end_time ? new Date(row.end_time) : null,
      color: row.color,
      streamId: row.collection_id,
      source: row.source,
      // ... map other fields
    }));
  }
  
  async saveEvents(events) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      for (const event of events) {
        await client.query(
          `INSERT INTO events (id, title, start_time, end_time, color, collection_id, source)
           VALUES ($1, $2, $3, $4, $5, $6, $7)
           ON CONFLICT (id) DO UPDATE SET
             title = $2,
             start_time = $3,
             end_time = $4,
             color = $5,
             collection_id = $6,
             source = $7`,
          [
            event.id,
            event.title,
            event.start,
            event.end,
            event.color,
            event.streamId,
            event.source
          ]
        );
      }
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  async deleteEvents(eventIds) {
    await this.pool.query(
      'DELETE FROM events WHERE id = ANY($1)',
      [eventIds]
    );
  }
  
  async fetchStreams() {
    const result = await this.pool.query('SELECT * FROM collections');
    return result.rows.map(row => ({
      id: row.id,
      name: row.name,
      source: row.source,
      color: row.color,
      visible: true
    }));
  }
  
  async authenticate(credentials) {
    // For REST API, auth is handled separately
    // This adapter assumes authenticated connection
    return { authenticated: true };
  }
}
```

### REST API Adapter Example

```javascript
// circaevum-yang/yin-seed/adapters/rest-adapter.js
import { BackendAdapter } from './base-adapter.js';

class RESTAdapter extends BackendAdapter {
  constructor() {
    super();
    this.baseURL = null;
    this.token = null;
  }
  
  async init(config) {
    this.baseURL = config.baseURL;
    if (config.token) {
      this.token = config.token;
    }
  }
  
  async authenticate(credentials) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    
    const data = await response.json();
    this.token = data.token;
    return data;
  }
  
  async fetchEvents(options = {}) {
    const params = new URLSearchParams();
    if (options.start) params.append('start', options.start.toISOString());
    if (options.end) params.append('end', options.end.toISOString());
    if (options.streamId) params.append('streamId', options.streamId);
    
    const response = await fetch(`${this.baseURL}/events?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    
    const data = await response.json();
    return data.events.map(event => ({
      id: event.id,
      title: event.title,
      start: new Date(event.startTime),
      end: event.endTime ? new Date(event.endTime) : null,
      color: event.color,
      streamId: event.collectionId,
      source: event.source,
      // ... map other fields
    }));
  }
  
  async saveEvents(events) {
    const response = await fetch(`${this.baseURL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ events })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to save events: ${response.statusText}`);
    }
  }
  
  async deleteEvents(eventIds) {
    const response = await fetch(`${this.baseURL}/events`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ eventIds })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete events: ${response.statusText}`);
    }
  }
  
  async fetchStreams() {
    const response = await fetch(`${this.baseURL}/streams`, {
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
    
    const data = await response.json();
    return data.streams;
  }
}
```

### Memory Adapter (Standalone Mode)

```javascript
// circaevum-yang/yin-seed/adapters/memory-adapter.js
import { BackendAdapter } from './base-adapter.js';

class MemoryAdapter extends BackendAdapter {
  constructor() {
    super();
    this.events = [];
    this.streams = [];
  }
  
  async init(config) {
    // No-op for memory adapter
  }
  
  async fetchEvents(options = {}) {
    let filtered = [...this.events];
    
    if (options.start) {
      filtered = filtered.filter(e => e.start >= options.start);
    }
    
    if (options.end) {
      filtered = filtered.filter(e => e.end <= options.end);
    }
    
    if (options.streamId) {
      filtered = filtered.filter(e => e.streamId === options.streamId);
    }
    
    return filtered;
  }
  
  async saveEvents(events) {
    // Merge with existing events
    for (const event of events) {
      const index = this.events.findIndex(e => e.id === event.id);
      if (index >= 0) {
        this.events[index] = event;
      } else {
        this.events.push(event);
      }
    }
  }
  
  async deleteEvents(eventIds) {
    this.events = this.events.filter(e => !eventIds.includes(e.id));
  }
  
  async fetchStreams() {
    return [...this.streams];
  }
  
  async authenticate(credentials) {
    // No-op for memory adapter
    return { authenticated: true };
  }
}
```

### Using Adapters

```javascript
// circaevum-yang/yin-seed/api.js
// Zhong (中) - The Center Contract

import { NakamaAdapter } from './adapters/nakama-adapter.js';
import { TimescaleDBAdapter } from './adapters/timescaledb-adapter.js';
import { RESTAdapter } from './adapters/rest-adapter.js';
import { MemoryAdapter } from './adapters/memory-adapter.js';

class Zhong {
  constructor() {
    this.adapter = null;
    this.events = [];
    this.streams = [];
  }
  
  /**
   * Initialize with a backend adapter
   * @param {string} adapterType - 'nakama', 'timescaledb', 'rest', 'memory'
   * @param {Object} config - Adapter configuration
   */
  async initAdapter(adapterType, config) {
    switch (adapterType) {
      case 'nakama':
        this.adapter = new NakamaAdapter();
        break;
      case 'timescaledb':
        this.adapter = new TimescaleDBAdapter();
        break;
      case 'rest':
        this.adapter = new RESTAdapter();
        break;
      case 'memory':
      default:
        this.adapter = new MemoryAdapter();
        break;
    }
    
    await this.adapter.init(config);
    
    // Load initial data
    if (this.adapter) {
      this.events = await this.adapter.fetchEvents();
      this.streams = await this.adapter.fetchStreams();
    }
  }
  
  /**
   * Set events (from backend or manually)
   */
  async setEvents(events) {
    this.events = events;
    
    // If adapter is set, save to backend
    if (this.adapter) {
      await this.adapter.saveEvents(events);
    }
    
    // Render in visualization
    this.renderEvents(events);
  }
  
  /**
   * Fetch events from backend
   */
  async fetchEvents(options = {}) {
    if (this.adapter) {
      this.events = await this.adapter.fetchEvents(options);
      this.renderEvents(this.events);
    }
    return this.events;
  }
  
  // ... other methods
}

// Expose as CircaevumAPI (Zhong)
window.CircaevumAPI = new Zhong();
```

---

## Yang Seed: Frontend Adapter Interface

**Location**: `circaevum-yin/yang-seed/`

**Purpose**: Define the **frontend adapter interface** that allows `circaevum-yin` to work with different visualization engines.

### Structure

```
circaevum-yin/
└── yang-seed/                     # 阳种子 (Yang Seed)
    ├── components/               # React UI components
    │   ├── CircaevumViewer.tsx   # Visualization wrapper
    │   ├── EventUpload.tsx
    │   └── EventTable.tsx
    │
    └── adapters/                 # Frontend adapters (pluggable)
        ├── base-adapter.js      # Abstract base class
        ├── threejs-adapter.js   # Three.js visualization
        ├── unity-adapter.js     # Unity visualization
        └── webgl-adapter.js     # Generic WebGL adapter
```

### Adapter Interface

```javascript
// circaevum-yin/yang-seed/adapters/base-adapter.js
/**
 * Base Frontend Adapter Interface
 * All frontend adapters must implement this interface
 */
class FrontendAdapter {
  /**
   * Initialize the visualization
   * @param {HTMLElement} container - Container element
   * @param {Object} config - Visualization configuration
   */
  async init(container, config) {
    throw new Error('init() must be implemented');
  }
  
  /**
   * Render events in the visualization
   * @param {Event[]} events - Events to render
   */
  async renderEvents(events) {
    throw new Error('renderEvents() must be implemented');
  }
  
  /**
   * Navigate to a specific time
   * @param {Date} date - Target time
   */
  async navigateToTime(date) {
    throw new Error('navigateToTime() must be implemented');
  }
  
  /**
   * Navigate to a specific event
   * @param {string} eventId - Event ID
   */
  async navigateToEvent(eventId) {
    throw new Error('navigateToEvent() must be implemented');
  }
  
  /**
   * Get current time range
   * @returns {{ start: Date, end: Date }}
   */
  getCurrentTimeRange() {
    throw new Error('getCurrentTimeRange() must be implemented');
  }
  
  /**
   * Set event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  on(event, callback) {
    throw new Error('on() must be implemented');
  }
  
  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    throw new Error('off() must be implemented');
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    throw new Error('destroy() must be implemented');
  }
}
```

### Three.js Adapter Example

```javascript
// circaevum-yin/yang-seed/adapters/threejs-adapter.js
import { FrontendAdapter } from './base-adapter.js';

class ThreeJSAdapter extends FrontendAdapter {
  constructor() {
    super();
    this.api = null; // CircaevumAPI from circaevum-yang
  }
  
  async init(container, config) {
    // Load circaevum-yang (Three.js visualization)
    // This assumes circaevum-yang is loaded as a script or module
    if (window.CircaevumAPI) {
      this.api = window.CircaevumAPI;
      await this.api.init({
        container: container,
        ...config
      });
    } else {
      throw new Error('CircaevumAPI (circaevum-yang) not loaded');
    }
  }
  
  async renderEvents(events) {
    if (this.api) {
      this.api.setEvents(events);
    }
  }
  
  async navigateToTime(date) {
    if (this.api) {
      this.api.navigateToTime(date);
    }
  }
  
  async navigateToEvent(eventId) {
    if (this.api) {
      this.api.navigateToEvent(eventId);
    }
  }
  
  getCurrentTimeRange() {
    if (this.api) {
      return this.api.getCurrentTimeRange();
    }
    return { start: new Date(), end: new Date() };
  }
  
  on(event, callback) {
    if (this.api) {
      this.api.on(event, callback);
    }
  }
  
  off(event, callback) {
    if (this.api) {
      this.api.off(event, callback);
    }
  }
  
  destroy() {
    if (this.api) {
      this.api.destroy();
    }
  }
}
```

### Unity Adapter Example

```javascript
// circaevum-yin/yang-seed/adapters/unity-adapter.js
import { FrontendAdapter } from './base-adapter.js';

class UnityAdapter extends FrontendAdapter {
  constructor() {
    super();
    this.unityInstance = null;
    this.eventHandlers = new Map();
  }
  
  async init(container, config) {
    // Initialize Unity WebGL build
    // This assumes Unity WebGL build is loaded
    if (window.Unity) {
      this.unityInstance = await window.Unity.createUnityInstance(
        container,
        config.unityConfig
      );
      
      // Set up Unity message handlers
      this.setupUnityHandlers();
    } else {
      throw new Error('Unity WebGL not loaded');
    }
  }
  
  setupUnityHandlers() {
    // Listen for messages from Unity
    window.addEventListener('message', (event) => {
      const { type, data } = event.data;
      
      if (type === 'circaevum:event:click') {
        const handler = this.eventHandlers.get('event:click');
        if (handler) handler(data);
      }
      
      // ... other event types
    });
  }
  
  async renderEvents(events) {
    if (this.unityInstance) {
      // Send events to Unity via SendMessage
      this.unityInstance.SendMessage(
        'CircaevumController',
        'SetEvents',
        JSON.stringify(events)
      );
    }
  }
  
  async navigateToTime(date) {
    if (this.unityInstance) {
      this.unityInstance.SendMessage(
        'CircaevumController',
        'NavigateToTime',
        date.toISOString()
      );
    }
  }
  
  async navigateToEvent(eventId) {
    if (this.unityInstance) {
      this.unityInstance.SendMessage(
        'CircaevumController',
        'NavigateToEvent',
        eventId
      );
    }
  }
  
  getCurrentTimeRange() {
    // Query Unity for current time range
    if (this.unityInstance) {
      const result = this.unityInstance.SendMessage(
        'CircaevumController',
        'GetCurrentTimeRange',
        ''
      );
      return JSON.parse(result);
    }
    return { start: new Date(), end: new Date() };
  }
  
  on(event, callback) {
    this.eventHandlers.set(event, callback);
  }
  
  off(event, callback) {
    this.eventHandlers.delete(event);
  }
  
  destroy() {
    if (this.unityInstance) {
      this.unityInstance.Quit();
    }
  }
}
```

### Using Frontend Adapters

```typescript
// circaevum-yin/yang-seed/components/CircaevumViewer.tsx
import React, { useEffect, useRef } from 'react';
import { ThreeJSAdapter } from '../adapters/threejs-adapter.js';
import { UnityAdapter } from '../adapters/unity-adapter.js';

interface CircaevumViewerProps {
  adapterType: 'threejs' | 'unity';
  events: Event[];
  onEventClick?: (event: Event) => void;
}

export const CircaevumViewer: React.FC<CircaevumViewerProps> = ({
  adapterType,
  events,
  onEventClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const adapterRef = useRef<FrontendAdapter | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Initialize adapter
    let adapter: FrontendAdapter;
    switch (adapterType) {
      case 'threejs':
        adapter = new ThreeJSAdapter();
        break;
      case 'unity':
        adapter = new UnityAdapter();
        break;
      default:
        throw new Error(`Unknown adapter type: ${adapterType}`);
    }
    
    adapterRef.current = adapter;
    
    // Initialize visualization
    adapter.init(containerRef.current, {
      theme: 'dark',
      initialZoom: 2
    }).then(() => {
      // Render events
      adapter.renderEvents(events);
      
      // Set up event handlers
      if (onEventClick) {
        adapter.on('event:click', onEventClick);
      }
    });
    
    return () => {
      // Cleanup
      if (adapterRef.current) {
        adapterRef.current.destroy();
      }
    };
  }, [adapterType]);
  
  useEffect(() => {
    // Update events when they change
    if (adapterRef.current) {
      adapterRef.current.renderEvents(events);
    }
  }, [events]);
  
  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};
```

---

## Complete Architecture: Pluggable Seeds

### circaevum-yang (Frontend)

```
circaevum-yang/
├── yang/                          # Large Yang (Three.js visualization)
│   ├── visualization/
│   └── ui/
│
└── yin-seed/                      # 阴种子 (Yin Seed - Backend Adapter)
    ├── api.js                     # Zhong (中) - The Center Contract
    ├── events.js                  # Event data model
    ├── validation.js              # Data validation
    └── adapters/                  # Backend adapters (pluggable)
        ├── base-adapter.js
        ├── nakama-adapter.js      # ✅ Plug into Nakama
        ├── timescaledb-adapter.js # ✅ Plug into TimescaleDB
        ├── rest-adapter.js        # ✅ Plug into REST API
        └── memory-adapter.js      # ✅ Standalone mode
```

### circaevum-yin (Backend)

```
circaevum-yin/
├── yin/                           # Large Yin (Backend)
│   ├── api/
│   ├── database/
│   └── parsers/
│
└── yang-seed/                     # 阳种子 (Yang Seed - Frontend Adapter)
    ├── components/                # React UI
    └── adapters/                  # Frontend adapters (pluggable)
        ├── base-adapter.js
        ├── threejs-adapter.js     # ✅ Plug into three.js
        ├── unity-adapter.js       # ✅ Plug into Unity
        └── webgl-adapter.js        # ✅ Plug into WebGL
```

---

## Benefits of Adapter Architecture

1. **True Decoupling**: Each system can work with different implementations
2. **Easy Testing**: Use memory adapters for testing
3. **Flexible Deployment**: Switch backends/frontends without code changes
4. **Multiple Integrations**: Support multiple backends/frontends simultaneously
5. **Transformation (变)**: Seeds can transform to work with different systems
6. **Balance (中)**: Zhong (the contract) maintains balance between systems

---

## Example: Switching Backends

```javascript
// Start with Nakama
await CircaevumAPI.initAdapter('nakama', {
  serverKey: 'defaultkey',
  host: 'localhost',
  port: 7350
});

// Later, switch to TimescaleDB
await CircaevumAPI.initAdapter('timescaledb', {
  host: 'localhost',
  port: 5432,
  database: 'circaevum',
  user: 'postgres',
  password: 'password'
});

// Or use REST API
await CircaevumAPI.initAdapter('rest', {
  baseURL: 'https://api.circaevum.com',
  token: 'your-token'
});

// Or standalone (no backend)
await CircaevumAPI.initAdapter('memory', {});
```

---

## Example: Switching Frontends

```tsx
// Use Three.js
<CircaevumViewer adapterType="threejs" events={events} />

// Or use Unity
<CircaevumViewer adapterType="unity" events={events} />

// Or use WebGL directly
<CircaevumViewer adapterType="webgl" events={events} />
```

---

## Summary

**Zhong (中)** = The Center Contract (replaces "Taiji Point")

**Yin Seed** = Backend adapter interface (pluggable into Nakama, TimescaleDB, REST, etc.)

**Yang Seed** = Frontend adapter interface (pluggable into three.js, Unity, WebGL, etc.)

**Result**: True transformation (变) - each system can adapt to work with different implementations while maintaining balance through Zhong (中).

