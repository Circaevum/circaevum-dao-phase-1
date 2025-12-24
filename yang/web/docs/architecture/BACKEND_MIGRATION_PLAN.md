# Backend Migration Plan: Nakama → REST API (Gradual)

## Strategy: Keep Nakama for Unity, Add REST for Web

**Current State**:
- ✅ Unity uses Nakama (keep this)
- ✅ Web will use REST API (new)
- ✅ Both can coexist
- ✅ Easy to migrate Unity later

---

## Architecture: Dual Backend Support

```
┌─────────────┐
│   Unity     │───► Nakama (keep for now)
└─────────────┘

┌─────────────┐
│   Web       │───► REST API ──► PostgreSQL
└─────────────┘

┌─────────────┐
│ PostgreSQL  │◄─── Shared Database (optional sync)
└─────────────┘
```

**Key Principle**: Make backend **swappable** via adapter pattern.

---

## Adapter Pattern: Backend Abstraction

### Create Backend Adapter Interface

```typescript
// lib/backend-adapter.ts
interface BackendAdapter {
  authenticate(credentials: Credentials): Promise<Session>
  getEvents(userId: string, range: TimeRange): Promise<Event[]>
  createEvent(event: Event): Promise<Event>
  updateEvent(eventId: string, event: Partial<Event>): Promise<Event>
  deleteEvent(eventId: string): Promise<void>
  getStreams(userId: string): Promise<Stream[]>
}
```

### Nakama Adapter (Keep for Unity)

```typescript
// lib/adapters/nakama-adapter.ts
import { Client, Session } from '@heroiclabs/nakama-js'
import type { BackendAdapter } from '../backend-adapter'

export class NakamaAdapter implements BackendAdapter {
  private client: Client
  private session: Session | null = null

  constructor(config: NakamaConfig) {
    this.client = new Client(
      config.serverKey,
      config.host,
      config.port,
      config.useSSL
    )
  }

  async authenticate(credentials: Credentials): Promise<Session> {
    this.session = await this.client.authenticateEmail(
      credentials.email,
      credentials.password
    )
    return this.session
  }

  async getEvents(userId: string, range: TimeRange): Promise<Event[]> {
    // Read from Nakama storage
    const objects = await this.client.readStorageObjects(this.session!, [{
      collection: 'events',
      userId: userId
    }])

    // Transform to Event format
    return objects.objects.map(obj => this.nakamaToEvent(obj))
      .filter(event => this.inRange(event, range))
  }

  async createEvent(event: Event): Promise<Event> {
    const object = {
      collection: 'events',
      key: event.id,
      value: this.eventToNakama(event),
      permissionRead: 2,
      permissionWrite: 2
    }

    await this.client.writeStorageObjects(this.session!, [object])
    return event
  }

  // ... other methods

  private nakamaToEvent(obj: any): Event {
    return {
      id: obj.key,
      title: obj.value.title,
      start: new Date(obj.value.startTime),
      end: obj.value.endTime ? new Date(obj.value.endTime) : undefined,
      // ... transform
    }
  }

  private eventToNakama(event: Event): any {
    return {
      title: event.title,
      startTime: event.start.toISOString(),
      endTime: event.end?.toISOString(),
      // ... transform
    }
  }
}
```

### REST API Adapter (New for Web)

```typescript
// lib/adapters/rest-adapter.ts
import type { BackendAdapter } from '../backend-adapter'

export class RESTAdapter implements BackendAdapter {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async authenticate(credentials: Credentials): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    })

    const data = await response.json()
    this.token = data.token
    return { token: this.token, userId: data.userId }
  }

  async getEvents(userId: string, range: TimeRange): Promise<Event[]> {
    const response = await fetch(
      `${this.baseUrl}/api/events?start=${range.start}&end=${range.end}`,
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    )

    const data = await response.json()
    return data.events.map((e: any) => this.restToEvent(e))
  }

  async createEvent(event: Event): Promise<Event> {
    const response = await fetch(`${this.baseUrl}/api/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify(this.eventToRest(event))
    })

    return this.restToEvent(await response.json())
  }

  // ... other methods

  private restToEvent(data: any): Event {
    return {
      id: data.id,
      title: data.title,
      start: new Date(data.startTime),
      end: data.endTime ? new Date(data.endTime) : undefined,
      // ... transform
    }
  }

  private eventToRest(event: Event): any {
    return {
      title: event.title,
      startTime: event.start.toISOString(),
      endTime: event.end?.toISOString(),
      // ... transform
    }
  }
}
```

### Wrapper Uses Adapter

```typescript
// wrapper/circaevum-adapter.ts
import type { BackendAdapter } from '../lib/backend-adapter'
import { NakamaAdapter } from '../lib/adapters/nakama-adapter'
import { RESTAdapter } from '../lib/adapters/rest-adapter'

class CircaevumAdapter {
  private backend: BackendAdapter

  constructor(backendType: 'nakama' | 'rest', config: any) {
    // Switch backend easily!
    if (backendType === 'nakama') {
      this.backend = new NakamaAdapter(config)
    } else {
      this.backend = new RESTAdapter(config.baseUrl)
    }
  }

  async loadEvents() {
    const events = await this.backend.getEvents(
      this.userId,
      this.getCurrentRange()
    )

    // Pass to visualization (same regardless of backend!)
    CircaevumAPI.setEvents(events)
  }

  async createEvent(event: Event) {
    const created = await this.backend.createEvent(event)
    CircaevumAPI.addEvents([created])
  }

  // ... other methods use this.backend
}
```

---

## Migration Path

### Phase 1: Add REST API (Keep Nakama)

**Timeline**: Week 1-2

1. **Build REST API**:
   ```typescript
   // app/api/events/route.ts (Next.js)
   export async function GET(request: Request) {
     const events = await prisma.event.findMany({
       where: {
         userId: session.user.id,
         startTime: { gte: start, lte: end }
       }
     })
     return Response.json({ events })
   }
   ```

2. **Create REST Adapter**:
   - Implement `BackendAdapter` interface
   - Test with web app

3. **Web Uses REST**:
   ```typescript
   const adapter = new CircaevumAdapter('rest', {
     baseUrl: 'https://api.circaevum.com'
   })
   ```

4. **Unity Keeps Nakama**:
   ```typescript
   const adapter = new CircaevumAdapter('nakama', {
     serverKey: '...',
     host: '...',
     port: 7350
   })
   ```

**Result**: Both backends work, easy to switch!

---

### Phase 2: Optional Data Sync (If Needed)

**Timeline**: Week 3-4 (optional)

If you want Unity and Web to share data:

```typescript
// lib/sync/nakama-to-postgres.ts
async function syncNakamaToPostgres() {
  // Read from Nakama
  const nakamaEvents = await nakamaAdapter.getEvents(userId, range)
  
  // Write to PostgreSQL
  await prisma.event.createMany({
    data: nakamaEvents.map(transformToPostgres),
    skipDuplicates: true
  })
}

// Run periodically or on-demand
setInterval(syncNakamaToPostgres, 60000) // Every minute
```

**Or**: Just migrate Unity to REST API (simpler!)

---

### Phase 3: Migrate Unity (When Ready)

**Timeline**: Week 5+ (when convenient)

1. **Update Unity Code**:
   ```csharp
   // Unity C# - Switch to REST
   public class CircaevumAPI {
       private string baseUrl = "https://api.circaevum.com";
       
       public IEnumerator GetEvents(System.Action<List<Event>> callback) {
           using (UnityWebRequest request = UnityWebRequest.Get($"{baseUrl}/api/events")) {
               request.SetRequestHeader("Authorization", $"Bearer {token}");
               yield return request.SendWebRequest();
               
               if (request.result == UnityWebRequest.Result.Success) {
                   var events = JsonUtility.FromJson<List<Event>>(request.downloadHandler.text);
                   callback(events);
               }
           }
       }
   }
   ```

2. **Test Unity Build**:
   - Verify REST API works
   - Test all features

3. **Deprecate Nakama**:
   - Remove Nakama adapter
   - Clean up code

**Result**: Single backend (REST API) for all platforms!

---

## Code Structure

```
circaevum-data/
├── lib/
│   ├── backend-adapter.ts          # Interface
│   └── adapters/
│       ├── nakama-adapter.ts       # Nakama implementation
│       └── rest-adapter.ts          # REST implementation
├── wrapper/
│   └── circaevum-adapter.ts        # Uses backend adapter
├── api/
│   └── rest/                       # REST API endpoints
│       ├── events.ts
│       └── auth.ts
└── sync/                           # Optional sync
    └── nakama-to-postgres.ts
```

---

## Benefits of This Approach

✅ **No Breaking Changes**: Unity keeps working
✅ **Easy to Switch**: Change one line of code
✅ **Test Both**: Can test REST API while Unity uses Nakama
✅ **Gradual Migration**: Move when convenient
✅ **Flexible**: Can keep both if needed

---

## Testing Strategy

### Test Both Backends

```typescript
// tests/backend-comparison.test.ts
describe('Backend Adapters', () => {
  it('Nakama and REST return same data format', async () => {
    const nakamaAdapter = new NakamaAdapter(config)
    const restAdapter = new RESTAdapter(config)
    
    const nakamaEvents = await nakamaAdapter.getEvents(userId, range)
    const restEvents = await restAdapter.getEvents(userId, range)
    
    // Should return same format
    expect(nakamaEvents[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      start: expect.any(Date),
      // ... same structure
    })
    
    expect(restEvents[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      start: expect.any(Date),
      // ... same structure
    })
  })
})
```

---

## Configuration

### Environment-Based

```typescript
// config/backend.ts
const BACKEND_TYPE = process.env.BACKEND_TYPE || 'rest' // 'nakama' | 'rest'

const backendConfig = BACKEND_TYPE === 'nakama' 
  ? {
      type: 'nakama',
      serverKey: process.env.NAKAMA_SERVER_KEY,
      host: process.env.NAKAMA_HOST,
      port: parseInt(process.env.NAKAMA_PORT || '7350')
    }
  : {
      type: 'rest',
      baseUrl: process.env.API_BASE_URL || 'http://localhost:3000'
    }

export const adapter = new CircaevumAdapter(
  backendConfig.type,
  backendConfig
)
```

---

## Summary

**Strategy**: 
- ✅ Keep Nakama for Unity (no changes needed)
- ✅ Add REST API for web (new, optimized)
- ✅ Use adapter pattern (easy to switch)
- ✅ Migrate Unity when convenient (not urgent)

**Benefits**:
- ✅ No breaking changes
- ✅ Easy to test
- ✅ Flexible migration
- ✅ Can keep both if needed

**Result**: Modern backend for web, Unity keeps working, easy to migrate later!

