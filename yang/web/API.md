# Circaevum Three.js API Reference

## Overview

`CircaevumAPI` is the public interface for integrating event data with the Circaevum 3D time visualization. This API is designed to be **framework-agnostic** and **backend-agnostic**—you can use it with any data source (Nakama, Google Calendar, local files, etc.).

---

## Installation

### Option 1: NPM Package (Future)
```bash
npm install circaevum-three
```

### Option 2: Script Tag
```html
<script src="https://cdn.circaevum.com/three/v1.0.0/circaevum-three.js"></script>
```

### Option 3: Local Build
```html
<script src="./circaevum/js/config.js"></script>
<script src="./circaevum/js/datetime.js"></script>
<script src="./circaevum/js/events.js"></script>
<script src="./circaevum/js/event-renderer.js"></script>
<script src="./circaevum/js/main.js"></script>
```

---

## Initialization

```javascript
// Initialize the visualization
CircaevumAPI.init({
    container: document.getElementById('canvas-container'),
    onReady: () => {
        console.log('Circaevum initialized');
    }
});
```

---

## Event Management

### `setEvents(events: Event[])`

Replace all events in the visualization.

```javascript
const events = [
    {
        id: 'event-1',
        title: 'Team Meeting',
        start: new Date('2025-01-15T10:00:00Z'),
        end: new Date('2025-01-15T11:00:00Z'),
        color: '#4285F4',
        streamId: 'work-calendar',
        source: 'google_calendar'
    }
];

CircaevumAPI.setEvents(events);
```

### `addEvents(events: Event[])`

Add new events without removing existing ones.

```javascript
CircaevumAPI.addEvents([newEvent1, newEvent2]);
```

### `removeEvents(eventIds: string[])`

Remove events by ID.

```javascript
CircaevumAPI.removeEvents(['event-1', 'event-2']);
```

### `getEvents(): Event[]`

Get all currently loaded events.

```javascript
const allEvents = CircaevumAPI.getEvents();
```

### `getEventsInRange(start: Date, end: Date): Event[]`

Get events within a time range.

```javascript
const start = new Date('2025-01-01');
const end = new Date('2025-01-31');
const januaryEvents = CircaevumAPI.getEventsInRange(start, end);
```

---

## Stream Management

### `setStreams(streams: Stream[])`

Define event streams (collections/calendars) for grouping and filtering.

```javascript
CircaevumAPI.setStreams([
    {
        id: 'work-calendar',
        name: 'Work Calendar',
        source: 'google_calendar',
        color: '#4285F4',
        visible: true
    },
    {
        id: 'personal-calendar',
        name: 'Personal',
        source: 'ical',
        color: '#EA4335',
        visible: true
    }
]);
```

### `setStreamVisibility(streamId: string, visible: boolean)`

Show or hide all events in a stream.

```javascript
// Hide work calendar events
CircaevumAPI.setStreamVisibility('work-calendar', false);
```

---

## Navigation

### `navigateToTime(date: Date)`

Smoothly navigate the camera to a specific time.

```javascript
const targetDate = new Date('2025-06-15T12:00:00Z');
CircaevumAPI.navigateToTime(targetDate);
```

### `navigateToEvent(eventId: string)`

Navigate to an event's time position.

```javascript
CircaevumAPI.navigateToEvent('event-1');
```

### `getCurrentTimeRange(): { start: Date, end: Date }`

Get the currently visible time range based on zoom level.

```javascript
const range = CircaevumAPI.getCurrentTimeRange();
console.log(`Viewing ${range.start} to ${range.end}`);
```

---

## Event Listeners

### `on(event: string, callback: Function)`

Subscribe to events.

```javascript
CircaevumAPI.on('event:click', (event) => {
    console.log('Event clicked:', event.id);
});

CircaevumAPI.on('time:change', (data) => {
    console.log('Time changed:', data.currentTime);
});

CircaevumAPI.on('zoom:change', (data) => {
    console.log('Zoom level:', data.level);
});
```

### `off(event: string, callback: Function)`

Unsubscribe from events.

```javascript
const handler = (event) => console.log(event);
CircaevumAPI.on('event:click', handler);
// Later...
CircaevumAPI.off('event:click', handler);
```

### Available Events

| Event | Payload | Description |
|-------|---------|-------------|
| `event:click` | `{ event: Event }` | User clicked an event in 3D scene |
| `event:select` | `{ event: Event }` | Event selected in table/list |
| `time:change` | `{ currentTime: Date }` | Current time position changed |
| `zoom:change` | `{ level: number, name: string }` | Zoom level changed |
| `ready` | `{}` | Visualization initialized |

---

## Rendering Configuration

### `setEventRenderer(config: RendererConfig)`

Configure how events are rendered.

```javascript
CircaevumAPI.setEventRenderer({
    arcWidth: 2,              // Line width
    showLabels: true,         // Show event titles
    labelDistance: 50,        // Distance from arc for labels
    collisionAvoidance: true, // Auto-adjust radii to avoid overlaps
    minRadiusOffset: 5,       // Minimum distance from Earth orbit
    radiusIncrement: 3        // Space between event layers
});
```

### `refresh()`

Force a re-render of all events (useful after config changes).

```javascript
CircaevumAPI.setEventRenderer({ arcWidth: 5 });
CircaevumAPI.refresh();
```

---

## Lifecycle

### `init(config?: InitConfig)`

Initialize the visualization.

```javascript
CircaevumAPI.init({
    container: document.getElementById('canvas'),
    initialZoom: 2, // Decade view
    initialTime: new Date(), // Current time
    theme: 'dark' // or 'light'
});
```

### `destroy()`

Clean up resources.

```javascript
CircaevumAPI.destroy();
```

---

## Event Data Model

### `Event`

```typescript
interface Event {
    // Required
    id: string;                    // Unique identifier
    title: string;                 // Event title
    start: Date | string;          // ISO 8601 or Date object
    end?: Date | string;           // Optional end time
    
    // Optional metadata
    description?: string;
    location?: string;
    allDay?: boolean;              // true if no time component
    
    // Source tracking
    source: string;                // "ical", "google_calendar", etc.
    sourceId?: string;             // Original ID from source
    streamId: string;              // Collection/calendar ID
    
    // Visual properties
    color?: string;                // Hex color (e.g., "#4285F4")
    visible?: boolean;              // Show/hide this event
    
    // Extended metadata
    metadata?: {
        [key: string]: any;
    };
    
    // Timestamps
    createdAt?: Date | string;
    updatedAt?: Date | string;
}
```

### `Stream`

```typescript
interface Stream {
    id: string;                    // Unique identifier
    name: string;                  // Display name
    description?: string;
    source: string;                // "google_calendar", "ical", etc.
    color: string;                 // Default color (#hex)
    visible: boolean;              // Show/hide entire stream
    eventCount?: number;           // Optional count
}
```

---

## Example: Complete Integration

```javascript
// 1. Initialize
CircaevumAPI.init({
    container: document.getElementById('circaevum-canvas'),
    onReady: () => {
        console.log('Ready!');
    }
});

// 2. Set up streams
CircaevumAPI.setStreams([
    {
        id: 'work',
        name: 'Work Calendar',
        source: 'google_calendar',
        color: '#4285F4',
        visible: true
    }
]);

// 3. Load events from your backend
async function loadEvents() {
    const response = await fetch('/api/events');
    const events = await response.json();
    
    // Transform to CircaevumAPI format
    const normalizedEvents = events.map(event => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
        color: event.color,
        streamId: event.collectionId,
        source: event.source
    }));
    
    CircaevumAPI.setEvents(normalizedEvents);
}

// 4. Handle user interactions
CircaevumAPI.on('event:click', async (data) => {
    const event = data.event;
    console.log('Clicked:', event.title);
    
    // Show details modal, navigate, etc.
    showEventDetails(event);
});

// 5. Sync with time changes
CircaevumAPI.on('time:change', (data) => {
    // Optionally fetch new events for visible range
    const range = CircaevumAPI.getCurrentTimeRange();
    loadEventsInRange(range.start, range.end);
});

loadEvents();
```

---

## Error Handling

The API throws errors for invalid input:

```javascript
try {
    CircaevumAPI.setEvents([
        { id: 'bad-event' } // Missing required fields
    ]);
} catch (error) {
    console.error('Invalid event:', error.message);
}
```

---

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebGL support.

---

## Version

Current API version: `1.0.0`

Check `CircaevumAPI.version` for runtime version detection.

