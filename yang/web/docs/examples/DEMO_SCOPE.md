# Demo Scope: Working Integration

## Goal

Create a **working demo** where:
1. ✅ `circaevum-yang` works **independently** (standalone visualization)
2. ✅ `circaevum-yin` wraps `circaevum-yang` (full integration)
3. ✅ Both work **together** (upload ICS → parse → visualize)

---

## Architecture (Yin-Yang Aligned)

```
┌─────────────────────┐
│  circaevum-yang      │  ← YANG (Front-End)
│  (Visualization)     │     Standalone: ✅ Works independently
│                      │     API: CircaevumAPI (Space Station Memory Palace)
└──────────┬───────────┘
           │
           │ API Contract
           │ (Space Station Memory Palace)
           ▼
┌─────────────────────┐
│  circaevum-yin       │  ← YIN (Back-End)
│  (Data/Auth)        │     Wraps: ✅ Integrates with circaevum-yang
│                      │     Features: ICS upload, REST API, auth
└─────────────────────┘
```

---

## Phase 1: circaevum-yang Standalone

### Features

**Core Visualization** (Already Works):
- ✅ Planetary worldlines
- ✅ Time navigation (zoom levels, A/D keys)
- ✅ Current time display

**Event System** (To Build):
- ✅ `events.js` - Event data model & API
- ✅ `event-renderer.js` - Worldline arc rendering
- ✅ `event-ui.js` - Table/list UI

### Standalone Demo

```html
<!-- circaevum-yang/index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Circaevum Yang - Standalone Demo</title>
</head>
<body>
    <div id="canvas-container"></div>
    <div id="event-table"></div>
    
    <script src="circaevum/js/config.js"></script>
    <script src="circaevum/js/datetime.js"></script>
    <script src="circaevum/js/events.js"></script>
    <script src="circaevum/js/event-renderer.js"></script>
    <script src="circaevum/js/event-ui.js"></script>
    <script src="circaevum/js/main.js"></script>
    
    <script>
        // Standalone demo: Load test events
        const testEvents = [
            {
                id: '1',
                title: 'Team Meeting',
                start: new Date('2025-06-15T10:00:00Z'),
                end: new Date('2025-06-15T11:00:00Z'),
                color: '#4285F4',
                streamId: 'test',
                source: 'manual'
            },
            {
                id: '2',
                title: 'Lunch',
                start: new Date('2025-06-15T12:00:00Z'),
                end: new Date('2025-06-15T13:00:00Z'),
                color: '#EA4335',
                streamId: 'test',
                source: 'manual'
            }
        ];
        
        // Initialize visualization
        CircaevumAPI.init({
            container: document.getElementById('canvas-container'),
            onReady: () => {
                // Load test events
                CircaevumAPI.setEvents(testEvents);
                console.log('Standalone demo ready!');
            }
        });
    </script>
</body>
</html>
```

**Result**: Visualization works independently with test events ✅

---

## Phase 2: circaevum-yin Integration

### Features

**REST API** (Minimal for Demo):
- ✅ `POST /api/upload` - ICS file upload
- ✅ `GET /api/events` - Get events (mock data for demo)

**ICS Parser**:
- ✅ Parse VEVENT blocks
- ✅ Extract SUMMARY, DTSTART, DTEND
- ✅ Convert to CircaevumAPI format

**React UI**:
- ✅ File upload component
- ✅ Event table component
- ✅ Visualization wrapper

### Integration Demo

```tsx
// circaevum-yin/src/app/page.tsx
'use client'

import { useState } from 'react'
import { CircaevumViewer } from '@/components/CircaevumViewer'
import { EventUpload } from '@/components/EventUpload'
import { EventTable } from '@/components/EventTable'

export default function Home() {
  const [events, setEvents] = useState([])
  
  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    
    const { events: newEvents } = await response.json()
    setEvents([...events, ...newEvents])
    
    // Update visualization (Space Station Memory Palace)
    if (window.CircaevumAPI) {
      window.CircaevumAPI.addEvents(newEvents)
    }
  }
  
  return (
    <div>
      <h1>Circaevum Yin - Integration Demo</h1>
      
      <EventUpload onUpload={handleUpload} />
      
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <CircaevumViewer />
        </div>
        <div style={{ width: '300px' }}>
          <EventTable events={events} />
        </div>
      </div>
    </div>
  )
}
```

**Result**: Full integration (upload → parse → visualize) ✅

---

## Implementation Checklist

### circaevum-yang (Standalone)

- [ ] Create `events.js` - Event data model & API interface
- [ ] Create `event-renderer.js` - Worldline arc rendering with collision avoidance
- [ ] Create `event-ui.js` - Table/list UI for events
- [ ] Update `main.js` - Integrate event rendering
- [ ] Test standalone demo with test events

### circaevum-yin (Integration)

- [ ] Set up Next.js project
- [ ] Create ICS parser (`parsers/ical.ts`)
- [ ] Create upload API endpoint (`app/api/upload/route.ts`)
- [ ] Create React components (EventUpload, EventTable, CircaevumViewer)
- [ ] Load `circaevum-yang` script
- [ ] Test full integration (upload ICS → visualize)

### Both Together

- [ ] Verify `circaevum-yang` works standalone
- [ ] Verify `circaevum-yin` wraps `circaevum-yang`
- [ ] Test end-to-end flow
- [ ] Document the integration

---

## Success Criteria

✅ **Standalone**: `circaevum-yang` visualizes test events without backend
✅ **Integration**: `circaevum-yin` uploads ICS, parses, visualizes events
✅ **Both Work**: Full flow from upload to visualization
✅ **API Contract**: Space Station Memory Palace (CircaevumAPI) works as bridge

---

## Timeline

**Today's Scope**:
1. Build `circaevum-yang` event system (events.js, event-renderer.js, event-ui.js)
2. Create minimal `circaevum-yin` (ICS parser + upload endpoint)
3. Test both standalone and integrated
4. Document the demo

**Result**: Working demo showing both repos functioning independently and together!

