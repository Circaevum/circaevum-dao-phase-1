# Backend Strategy: Moving Beyond Nakama

## Current Situation

You chose Nakama **several years ago** as the best open-source game server. Now you're evaluating:
- ✅ Keep Nakama (if it still fits)
- ✅ Replace with modern backend (if better options exist)
- ✅ Separate multiplayer from core data (if that makes sense)

---

## Nakama: Current Constraints

### What Nakama Does Well

✅ **Unity Integration**: Native Unity SDK (your existing builds work)
✅ **Multiplayer**: Real-time multiplayer, matchmaking, presence
✅ **Cross-platform**: Same API for Unity and web
✅ **Open Source**: Self-hosted, no vendor lock-in

### What Nakama Doesn't Do Well

❌ **Calendar Data**: Key-value storage isn't ideal for time-series queries
❌ **TimescaleDB**: Hard to integrate (Nakama abstracts PostgreSQL)
❌ **REST API**: Not RESTful (custom protocol)
❌ **Modern Web**: Designed for games, not web apps
❌ **Complex Queries**: Limited query capabilities

### Adding TimescaleDB to Nakama

**Difficulty**: ⚠️ **Hard**

**Why**:
- Nakama uses its own storage abstraction layer
- Events stored as JSON blobs in key-value format
- Can't directly use TimescaleDB hypertables
- Would need custom Nakama RPC functions (workaround)

**Workaround**:
```lua
-- Nakama RPC function (Lua)
function get_events_in_range(context, payload)
  -- Still reads from key-value storage
  -- Can't use TimescaleDB directly
  local events = storage_list("events", ...)
  -- Filter in Lua (slow)
  return events
end
```

**Verdict**: Not ideal for calendar/time-series data.

---

## Backend Alternatives

### Option 1: Modern REST API + PostgreSQL (Recommended)

**Architecture**:
```
┌─────────────┐
│   Unity     │───┐
│   (REST)    │   │
└─────────────┘   │
                  ├──► REST API ──► PostgreSQL (TimescaleDB)
┌─────────────┐   │
│   Web       │───┘
│   (REST)    │
└─────────────┘

┌─────────────┐
│ Multiplayer │───► Separate Service (if needed)
│   (Nakama)  │
└─────────────┘
```

**Stack**:
- **API**: Next.js API Routes / Express / Fastify
- **Database**: PostgreSQL + TimescaleDB (optional)
- **ORM**: Prisma (you already use this)
- **Auth**: NextAuth.js / Auth.js
- **Multiplayer**: Separate Nakama instance (if needed)

**Benefits**:
- ✅ **Direct SQL**: Full PostgreSQL power (TimescaleDB, indexes, etc.)
- ✅ **REST API**: Standard HTTP, easy to use
- ✅ **Modern**: Built for web apps, not games
- ✅ **Flexible**: Can optimize for calendar data
- ✅ **Prisma**: You already know it
- ✅ **Separate concerns**: Data API vs multiplayer

**Trade-offs**:
- ⚠️ Unity needs REST client (not native SDK)
- ⚠️ Multiplayer separate (but that's fine!)

---

### Option 2: Supabase (PostgreSQL + Real-time)

**Architecture**:
```
┌─────────────┐
│   Unity     │───┐
│   (REST)    │   │
└─────────────┘   │
                  ├──► Supabase ──► PostgreSQL (TimescaleDB)
┌─────────────┐   │
│   Web       │───┘
│   (REST)    │
└─────────────┘

Built-in:
- Real-time subscriptions
- Auth
- Storage
- Edge Functions
```

**Benefits**:
- ✅ **PostgreSQL**: Full SQL power + TimescaleDB
- ✅ **Real-time**: Built-in WebSocket subscriptions
- ✅ **Auth**: Built-in authentication
- ✅ **Hosted**: Managed service (or self-hosted)
- ✅ **REST API**: Auto-generated from schema

**Trade-offs**:
- ⚠️ Vendor lock-in (but open-source, can self-host)
- ⚠️ Unity needs REST client

---

### Option 3: Keep Nakama, Add REST API Layer

**Architecture**:
```
┌─────────────┐
│   Unity     │───► Nakama (for multiplayer)
└─────────────┘

┌─────────────┐
│   Web       │───► REST API ──► PostgreSQL (TimescaleDB)
└─────────────┘

┌─────────────┐
│   Sync      │───► Sync Nakama ↔ PostgreSQL (if needed)
└─────────────┘
```

**Benefits**:
- ✅ Keep Unity integration (no changes)
- ✅ Web gets optimized backend
- ✅ Can sync data if needed

**Trade-offs**:
- ⚠️ Two backends to maintain
- ⚠️ Data sync complexity

---

### Option 4: Tauri + Local-First (Future)

**Architecture**:
```
┌─────────────┐
│   Unity     │───► REST API ──► PostgreSQL
└─────────────┘

┌─────────────┐
│   Web       │───► REST API ──► PostgreSQL
└─────────────┘

┌─────────────┐
│   Desktop   │───► Local SQLite + Sync ──► PostgreSQL
│   (Tauri)   │
└─────────────┘
```

**Benefits**:
- ✅ Offline-first
- ✅ Local database (SQLite)
- ✅ Sync when online

**Trade-offs**:
- ⚠️ More complex sync logic
- ⚠️ Future consideration

---

## Recommendation: Modern REST API + PostgreSQL

### Why This Makes Sense

1. **Calendar Data**: REST API + PostgreSQL is perfect for time-series data
2. **TimescaleDB**: Easy to add (just install extension, convert table)
3. **Modern Web**: Built for web apps, not games
4. **Unity**: Can use REST client (UnityWebRequest)
5. **Multiplayer**: Separate concern (can add later if needed)

### Migration Path

**Phase 1: Add REST API** (Keep Nakama for Unity)
- ✅ Build REST API with Next.js/Express
- ✅ Use PostgreSQL + Prisma (you already have this)
- ✅ Web uses REST API
- ✅ Unity keeps using Nakama (for now)

**Phase 2: Migrate Unity** (Optional)
- ✅ Unity uses REST API instead of Nakama
- ✅ Deprecate Nakama (or keep for multiplayer)

**Phase 3: Add Multiplayer** (If Needed)
- ✅ Separate multiplayer service (Nakama or Colyseus)
- ✅ Core data stays in REST API

---

## Multiplayer: Separate Concern?

### When You Need Multiplayer

**Calendar Use Cases**:
- ✅ **Shared Calendars**: Multiple users viewing same calendar
- ✅ **Collaborative Planning**: Real-time event editing
- ✅ **Live Updates**: See when others add/change events
- ✅ **Presence**: See who's viewing what time period

### Options for Multiplayer

**Option 1: Supabase Real-time**
```typescript
// Subscribe to event changes
supabase
  .channel('events')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'events'
  }, (payload) => {
    // Real-time updates
  })
  .subscribe();
```

**Option 2: Keep Nakama for Multiplayer Only**
- Use Nakama only for real-time features
- Core data in REST API + PostgreSQL
- Nakama subscribes to PostgreSQL changes

**Option 3: Colyseus (Lightweight Game Server)**
- Lighter than Nakama
- Built for real-time, not storage
- Use REST API for data, Colyseus for multiplayer

**Option 4: WebSockets + Redis**
- Custom WebSocket server
- Redis for pub/sub
- REST API for data

---

## Recommended Architecture

### Core Data: REST API + PostgreSQL

```
┌─────────────┐
│   Unity     │───┐
│   (REST)    │   │
└─────────────┘   │
                  ├──► REST API (Next.js/Express)
┌─────────────┐   │         │
│   Web       │───┘         │
│   (REST)    │              ▼
└─────────────┘         PostgreSQL
                              │
                              ▼
                        TimescaleDB (optional)
```

**Stack**:
- **API**: Next.js API Routes or Express
- **Database**: PostgreSQL + TimescaleDB (if needed)
- **ORM**: Prisma
- **Auth**: NextAuth.js

### Multiplayer: Separate Service (If Needed)

```
┌─────────────┐
│   Unity     │───┐
│   (WebSocket)│  │
└─────────────┘   │
                  ├──► Multiplayer Service
┌─────────────┐   │    (Supabase Real-time /
│   Web       │───┘     Colyseus / Custom)
│   (WebSocket)│
└─────────────┘
```

**Benefits**:
- ✅ **Separation**: Data API vs multiplayer
- ✅ **Optimization**: Each service optimized for its purpose
- ✅ **Scalability**: Scale independently
- ✅ **Flexibility**: Can add multiplayer later

---

## Implementation Plan

### Step 1: Build REST API

```typescript
// app/api/events/route.ts (Next.js)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  
  // Direct PostgreSQL query (fast!)
  const events = await prisma.event.findMany({
    where: {
      startTime: { gte: new Date(start) },
      endTime: { lte: new Date(end) },
      userId: session.user.id
    },
    orderBy: { startTime: 'asc' }
  });
  
  return Response.json(events);
}
```

### Step 2: Unity REST Client

```csharp
// Unity C# code
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;

public class CircaevumAPI {
    private string baseUrl = "https://api.circaevum.com";
    
    public IEnumerator GetEvents(System.Action<List<Event>> callback) {
        using (UnityWebRequest request = UnityWebRequest.Get($"{baseUrl}/api/events")) {
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success) {
                var events = JsonUtility.FromJson<List<Event>>(request.downloadHandler.text);
                callback(events);
            }
        }
    }
}
```

### Step 3: Add TimescaleDB (Optional)

```sql
-- Install TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb;

-- Convert Event table to hypertable
SELECT create_hypertable('Event', 'startTime');

-- Now time-range queries are super fast!
```

### Step 4: Add Multiplayer (If Needed)

```typescript
// Use Supabase real-time
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Subscribe to event changes
supabase
  .channel('events')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'events'
  }, (payload) => {
    // Update UI in real-time
    updateEvents(payload);
  })
  .subscribe();
```

---

## Comparison: Nakama vs Modern REST API

| Feature | Nakama | REST API + PostgreSQL |
|---------|--------|----------------------|
| **Calendar Data** | ❌ Key-value (slow) | ✅ Relational (fast) |
| **TimescaleDB** | ❌ Hard to integrate | ✅ Easy (just install) |
| **REST API** | ❌ Custom protocol | ✅ Standard HTTP |
| **Unity Integration** | ✅ Native SDK | ⚠️ REST client (easy) |
| **Multiplayer** | ✅ Built-in | ⚠️ Separate service |
| **Complex Queries** | ❌ Limited | ✅ Full SQL |
| **Modern Web** | ❌ Game-focused | ✅ Web-focused |

---

## Final Recommendation

**Replace Nakama with Modern REST API + PostgreSQL**

**Why**:
1. ✅ **Better for calendar data**: Relational database > key-value
2. ✅ **TimescaleDB ready**: Easy to add when needed
3. ✅ **Modern web**: Built for web apps
4. ✅ **Flexible**: Can optimize for your use case
5. ✅ **Unity compatible**: REST client works fine

**Multiplayer**:
- ✅ **Separate concern**: Add later if needed
- ✅ **Options**: Supabase real-time, Colyseus, or custom WebSockets
- ✅ **Not blocking**: Core data API doesn't need multiplayer

**Migration**:
- ✅ **Gradual**: Can run both in parallel
- ✅ **Low risk**: REST API is standard, well-understood
- ✅ **Future-proof**: Modern stack, easy to extend

---

## Next Steps

1. **Build REST API** with Next.js/Express
2. **Use PostgreSQL + Prisma** (you already have this)
3. **Migrate Unity** to REST client (or keep Nakama temporarily)
4. **Add TimescaleDB** if you need it (optional)
5. **Add multiplayer** later if needed (separate service)

**Result**: Modern, flexible backend optimized for calendar data, with multiplayer as separate concern.

