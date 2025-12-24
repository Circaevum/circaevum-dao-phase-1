# TimescaleDB Setup Guide

## Current Status

Your Prisma schema declares `timescaledb` extension:
```prisma
extensions = [pgcrypto, timescaledb]
```

**Important**: This is just a **declaration** - TimescaleDB must be installed separately in your PostgreSQL database. Nakama doesn't include TimescaleDB by default.

---

## Do You Need TimescaleDB?

### When TimescaleDB Helps

✅ **You have**:
- Millions of events
- Frequent time-range queries
- Need for time-series aggregations
- Long-term data retention

### When Standard PostgreSQL is Fine

✅ **You can skip TimescaleDB if**:
- < 100K events per user
- Simple time-range queries work fine
- Standard PostgreSQL indexes are sufficient
- You want simpler setup

**For most calendar apps**: Standard PostgreSQL with proper indexes is sufficient.

---

## Installing TimescaleDB (If Needed)

### Option 1: Install on Existing PostgreSQL

```bash
# Connect to your PostgreSQL database
psql -h your-host -U postgres -d nakama

# Install TimescaleDB extension
CREATE EXTENSION IF NOT EXISTS timescaledb;

# Verify installation
SELECT * FROM pg_extension WHERE extname = 'timescaledb';
```

### Option 2: Use TimescaleDB Cloud/Hosted

- **Timescale Cloud**: Managed TimescaleDB (paid)
- **Self-hosted**: Install TimescaleDB on your server

### Option 3: Docker (Development)

```yaml
# docker-compose.yml
services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    environment:
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

---

## Converting Event Table to Hypertable

**Only if you installed TimescaleDB**:

```sql
-- Connect to your database
psql -h your-host -U postgres -d nakama

-- Convert Event table to hypertable
SELECT create_hypertable('Event', 'startTime');

-- Verify
SELECT * FROM timescaledb_information.hypertables;
```

**Benefits**:
- Automatic time-based partitioning
- Faster time-range queries
- Better compression for old data

---

## Performance Comparison

### Standard PostgreSQL (What You Have Now)

```sql
-- This works fine for most use cases
SELECT * FROM "Event"
WHERE "startTime" >= '2025-01-01'
  AND "startTime" < '2025-02-01'
  AND "userId" = '...';

-- With proper index (you have this):
CREATE INDEX idx_event_start_time ON "Event"("startTime", "endTime");
```

**Performance**: Good for < 1M events per user

### TimescaleDB (If You Install It)

```sql
-- Same query, but TimescaleDB optimizes it
SELECT * FROM "Event"
WHERE "startTime" >= '2025-01-01'
  AND "startTime" < '2025-02-01'
  AND "userId" = '...';

-- TimescaleDB only scans relevant partitions
```

**Performance**: Better for > 1M events, time-series aggregations

---

## Recommendation

**For Circaevum**:

1. **Start with standard PostgreSQL** (what you have)
   - ✅ Simpler setup
   - ✅ Works fine for calendar data
   - ✅ Your indexes are already good

2. **Consider TimescaleDB later if**:
   - You have millions of events
   - Time-range queries become slow
   - You need time-series analytics

3. **For now**: Standard PostgreSQL + proper indexes is sufficient

---

## Checking Your Current Setup

```sql
-- Check if TimescaleDB is installed
SELECT * FROM pg_extension WHERE extname = 'timescaledb';

-- If empty, TimescaleDB is NOT installed
-- Your Prisma schema declaration doesn't install it
```

---

## Next Steps

1. **Keep current PostgreSQL setup** (it's fine!)
2. **Monitor performance** as you scale
3. **Consider TimescaleDB** if you hit performance issues
4. **Focus on proper indexing** first (you already have this)

**Bottom line**: You don't need TimescaleDB right now. Standard PostgreSQL with your existing indexes will work great for calendar data.

