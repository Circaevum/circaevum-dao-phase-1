# Storage Strategy: Nakama + PostgreSQL vs Alternatives

## Current Architecture: Nakama + PostgreSQL

### What You Have

- **Nakama**: Game server with Unity SDK
- **PostgreSQL**: Database (standard PostgreSQL, not TimescaleDB)
- **Unity Integration**: Existing Unity builds using Nakama
- **Web Integration**: Web apps using Nakama JS client

**Note**: Your Prisma schema declares `timescaledb` extension, but this is just a declaration - TimescaleDB must be installed separately in PostgreSQL. Nakama doesn't include TimescaleDB by default.

---

## Analysis: Is Nakama + PostgreSQL Optimal?

### ✅ Why Nakama Makes Sense

**1. Unity Integration**
- ✅ **Native Unity SDK**: Nakama has first-class Unity support
- ✅ **Cross-platform**: Same API for Unity and web
- ✅ **Real-time**: Built-in real-time features (if you need them)
- ✅ **Already Working**: You have Unity builds using it

**2. Unified API**
- ✅ **Same Backend**: Unity and web use same Nakama instance
- ✅ **Consistent Data**: No sync issues between platforms
- ✅ **Single Source of Truth**: One database, multiple clients

**3. Built-in Features**
- ✅ **Authentication**: Email, device, custom auth
- ✅ **Storage**: Key-value storage (your events)
- ✅ **Real-time**: WebSocket support (for live updates)
- ✅ **Social**: Friends, groups (if you need them)

### ⚠️ Potential Overhead

**1. Game Server for Calendar Data?**
- ⚠️ **Overkill?**: Nakama is designed for multiplayer games
- ⚠️ **Complexity**: More moving parts than simple REST API
- ⚠️ **Cost**: Nakama server + PostgreSQL (vs simpler stack)

**2. Storage Model**
- ⚠️ **Key-Value**: Nakama storage is key-value (not relational)
- ⚠️ **Query Limitations**: Harder to do complex time-range queries
- ⚠️ **No Native Time-Series**: Even with TimescaleDB, Nakama abstracts it

**3. Web-Only Use Case**
- ⚠️ **If Unity goes away**: Nakama might be overkill
- ⚠️ **Simpler alternatives**: REST API + PostgreSQL might be easier

---

## Alternative Architectures

### Option 1: Hybrid Approach (Recommended)

**Keep Nakama for Unity, Add REST API for Web**

```
┌─────────────┐
│   Unity     │───┐
│   (Nakama)  │   │
└─────────────┘   │
                  ├──► Nakama Server ──► PostgreSQL (TimescaleDB)
┌─────────────┐   │
│   Web       │───┤
│   (REST)    │   │
└─────────────┘   │
                  │
┌─────────────┐   │
│   Web       │───┘
│   (Nakama)  │
└─────────────┘
```

**Benefits**:
- ✅ Unity keeps using Nakama (no changes)
- ✅ Web can use simpler REST API (easier development)
- ✅ Both write to same PostgreSQL database
- ✅ Flexibility: Use best tool for each platform

**Implementation**:
```javascript
// REST API layer (Next.js/Express)
app.post('/api/events', async (req, res) => {
  // Direct PostgreSQL queries (using Prisma)
  const events = await prisma.event.findMany({
    where: {
      startTime: { gte: req.query.start },
      endTime: { lte: req.query.end }
    }
  });
  res.json(events);
});

// Nakama still works for Unity
// Both write to same PostgreSQL database
```

### Option 2: Pure REST API (If Unity Goes Away)

**If you deprecate Unity builds**:

```
┌─────────────┐
│   Web       │───► REST API ──► PostgreSQL (TimescaleDB)
│   (React)   │
└─────────────┘
```

**Benefits**:
- ✅ Simpler architecture
- ✅ Better for time-series queries (direct SQL)
- ✅ Easier to optimize (TimescaleDB features)
- ✅ Standard REST patterns

**Trade-offs**:
- ❌ Lose Unity integration
- ❌ Need to migrate existing Unity users

### Option 3: Keep Nakama, Optimize Storage

**Use Nakama but optimize for calendar data**:

```javascript
// Custom Nakama storage functions
function getEventsInRange(userId, startTime, endTime) {
  // Use Nakama's storage but with optimized queries
  // Can still leverage TimescaleDB through Nakama
}

// Or use Nakama's RPC functions
client.rpc(session, "get_events_in_range", {
  start_time: startTime,
  end_time: endTime
});
```

**Benefits**:
- ✅ Keep Unity integration
- ✅ Optimize for calendar queries
- ✅ Still unified API

---

## PostgreSQL + TimescaleDB: Perfect for Calendar Data

### Why TimescaleDB is Ideal

**1. Time-Series Optimization**
```sql
-- TimescaleDB hypertable for events
CREATE TABLE events (
  id UUID PRIMARY KEY,
  user_id UUID,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  title TEXT,
  -- ...
);

-- Convert to hypertable (TimescaleDB magic)
SELECT create_hypertable('events', 'start_time');

-- Super fast time-range queries
SELECT * FROM events
WHERE start_time >= '2025-01-01'
  AND start_time < '2025-02-01'
  AND user_id = '...';
```

**2. Automatic Partitioning**
- ✅ **By time**: Events partitioned by month/year automatically
- ✅ **Query performance**: Only scans relevant partitions
- ✅ **Retention policies**: Auto-delete old events

**3. Time-Series Functions**
```sql
-- Aggregate events by day
SELECT time_bucket('1 day', start_time) AS day,
       COUNT(*) AS event_count
FROM events
WHERE user_id = '...'
GROUP BY day
ORDER BY day;
```

### Current Setup

Looking at your Prisma schema:
```prisma
datasource db {
  provider = "postgresql"
  extensions = [pgcrypto, timescaledb]  // Declaration only - needs installation
}

model Event {
  startTime    DateTime
  endTime      DateTime?
  @@index([startTime, endTime])  // ✅ Good indexing
}
```

**Note**: The `timescaledb` extension declaration in Prisma doesn't mean it's installed. You need to:
1. Install TimescaleDB extension in PostgreSQL (if you want it)
2. Convert `Event` table to TimescaleDB hypertable (optional optimization)
3. Use time-series queries instead of key-value storage

---

## Recommendation: Hybrid Architecture

### Keep Nakama for Unity, Add REST API for Web

**Why**:

1. **Unity Integration**: Keep existing Unity builds working
2. **Web Optimization**: Use REST API + direct PostgreSQL queries
3. **Same Database**: Both write to PostgreSQL (standard PostgreSQL is fine)
4. **Flexibility**: Best tool for each platform

**Note**: TimescaleDB is optional - standard PostgreSQL with proper indexes works great for calendar data. Consider TimescaleDB later if you scale to millions of events.

### Implementation

**1. Keep Nakama for Unity**:
```csharp
// Unity C# code (unchanged)
var client = new Client("serverkey", "host", 7350, false);
var session = await client.AuthenticateDeviceAsync(deviceId);
var objects = await client.ReadStorageObjectsAsync(session, ...);
```

**2. Add REST API for Web**:
```typescript
// Next.js API route
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');
  
  // Direct TimescaleDB query (super fast)
  const events = await prisma.$queryRaw`
    SELECT * FROM events
    WHERE start_time >= ${start}
      AND start_time < ${end}
      AND user_id = ${userId}
    ORDER BY start_time
  `;
  
  return Response.json(events);
}
```

**3. Unified Data Model**:
```typescript
// Both Nakama and REST API use same Event model
interface Event {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  // ... same format for both
}
```

**4. TimescaleDB (Optional)**:
- Standard PostgreSQL works fine for calendar data
- Consider TimescaleDB if you scale to millions of events
- See `TIMESCALEDB_SETUP.md` for installation guide

---

## Migration Path

### Phase 1: Current State
- ✅ Nakama + PostgreSQL (TimescaleDB)
- ✅ Unity using Nakama
- ✅ Web using Nakama JS client

### Phase 2: Add REST API
- ✅ Keep Nakama for Unity
- ✅ Add REST API endpoints for web
- ✅ Both write to same PostgreSQL
- ✅ Test REST API performance

### Phase 3: Optimize
- ✅ Convert Event table to TimescaleDB hypertable
- ✅ Use time-series queries for web
- ✅ Keep Nakama for Unity (or migrate if needed)

### Phase 4: Evaluate
- ✅ Measure performance (REST vs Nakama)
- ✅ Decide: Keep both or migrate Unity to REST?

---

## Performance Comparison

### Nakama Storage (Key-Value)
```javascript
// Read all events for user
const objects = await client.readStorageObjects(session, [{
  collection: 'events',
  userId: userId
}]);

// Problem: Reads ALL events, then filter in memory
// No time-range filtering at database level
```

### Direct PostgreSQL (TimescaleDB)
```sql
-- Read events in time range (super fast)
SELECT * FROM events
WHERE user_id = $1
  AND start_time >= $2
  AND start_time < $3;

-- TimescaleDB only scans relevant partitions
-- Indexed queries are 10-100x faster
```

---

## Final Recommendation

**Use Hybrid Approach**:

1. **Keep Nakama for Unity** (if you have active Unity users)
2. **Add REST API for Web** (better performance, simpler)
3. **Use TimescaleDB** (you already have it!)
4. **Same PostgreSQL database** (unified data)

**Benefits**:
- ✅ Best performance for web (direct SQL queries)
- ✅ Keep Unity integration (no breaking changes)
- ✅ TimescaleDB optimization (you're already set up)
- ✅ Flexibility (can migrate Unity later if needed)

**If Unity goes away**: Migrate to pure REST API + PostgreSQL (TimescaleDB)

---

## Next Steps

1. **Keep current Nakama setup** (don't break Unity)
2. **Add REST API layer** for web (Next.js/Express)
3. **Convert Event table to hypertable** (TimescaleDB)
4. **Use time-series queries** for web endpoints
5. **Measure performance** and optimize

**Result**: Best of both worlds - Unity compatibility + web optimization.

