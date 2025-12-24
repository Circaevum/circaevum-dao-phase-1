# Time Projections in Circaevum

## Overview

Circaevum visualizes time as **vertical movement through 3D space**. This document explains how timestamps are mapped to positions in the scene, how events are projected onto worldlines, and how to understand the relationship between calendar dates and 3D coordinates.

---

## Core Concept: Height = Time

In Circaevum, **time flows upward**. Each year equals **100 scene units** vertically. The present moment (your system clock) is the reference point—planets appear at their actual current orbital positions.

### Formula

```
height = (year - CENTURY_START) × HEIGHT_PER_YEAR + fractional_year_progress × HEIGHT_PER_YEAR
```

Where:
- `CENTURY_START = 2000` (reference year)
- `HEIGHT_PER_YEAR = 100` (units per year)
- `fractional_year_progress` accounts for months, days, hours within the year

### Example

- **January 1, 2025** → Height = `(2025 - 2000) × 100 = 2500` units
- **June 15, 2025** → Height ≈ `2500 + (165/365) × 100 ≈ 2545` units
- **December 31, 2025** → Height ≈ `2599` units

---

## Worldlines: Planetary Paths Through Time

Each planet traces a **helical worldline**—a spiral that combines:
1. **Orbital motion** (circular path around the Sun)
2. **Temporal motion** (upward movement through time)

### Earth's Worldline

Earth's worldline is the **reference trajectory**. Events are positioned relative to Earth's path:

- **Base radius**: `50` units (Earth's orbital distance from Sun)
- **Height**: Calculated from event timestamp using the formula above
- **Orbital angle**: Calculated from the date (accounts for Earth's position in its orbit)

### Event Worldlines

Events are rendered as **arcs parallel to Earth's worldline**, positioned at slightly larger radii:

```
event_radius = EARTH_RADIUS + base_offset + stream_offset + collision_offset
```

Where:
- `base_offset = 5` (minimum distance from Earth)
- `stream_offset = stream_index × 3` (each calendar/stream gets its own layer)
- `collision_offset` (additional spacing for overlapping events)

---

## Zoom Levels and Time Ranges

Each zoom level shows a different **time span** and uses different **height calculations**:

| Level | Name | Time Span | Height Range | Focus |
|-------|------|-----------|--------------|-------|
| 1 | Century | 100 years | 10,000 units | Sun |
| 2 | Decade | 10 years | 1,000 units | Sun |
| 3 | Year | 1 year | 100 units | Sun |
| 4 | Quarter | 3 months | 25 units | Earth |
| 5 | Month | 1 month | ~8.3 units | Earth |
| 6 | Lunar | ~29 days | ~7.7 units | Earth |
| 7 | Week | 7 days | ~1.9 units | Earth |
| 8 | Day | 24 hours | ~0.27 units | Earth |
| 9 | Clock | 8 hours | ~0.27 units | Earth |

### Calculating Visible Range

At zoom level 2 (Decade), with center at 2025:
- **Start**: `2025 - 5 = 2020` (5 years before center)
- **End**: `2025 + 5 = 2030` (5 years after center)
- **Height range**: `2000` to `3000` units

Events outside this range are **culled** (not rendered) for performance.

---

## Event Projection: From Timestamp to 3D Arc

### Step 1: Calculate Heights

```javascript
const startHeight = calculateDateHeight(event.start);
const endHeight = calculateDateHeight(event.end || event.start);
```

### Step 2: Calculate Orbital Angles

Events follow Earth's orbital path, so we need the **orbital angle** at the event's time:

```javascript
function getOrbitalAngle(date) {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = (date - startOfYear) / (24 * 60 * 60 * 1000);
    
    // Earth's vernal equinox (March 20) = angle 0
    const vernalEquinoxDay = 79;
    const daysFromEquinox = dayOfYear - vernalEquinoxDay;
    const fractionOfYear = daysFromEquinox / 365.25;
    
    // Convert to radians (counter-clockwise)
    return (fractionOfYear * Math.PI * 2) % (Math.PI * 2);
}
```

### Step 3: Generate Arc Points

Create points along the arc from start to end:

```javascript
function generateArcPoints(startDate, endDate, radius, startHeight, endHeight) {
    const points = [];
    const steps = 20; // Number of points along arc
    
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const currentDate = interpolateDate(startDate, endDate, t);
        const height = startHeight + (endHeight - startHeight) * t;
        const angle = getOrbitalAngle(currentDate);
        
        // Convert to 3D coordinates
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = height;
        
        points.push(new THREE.Vector3(x, y, z));
    }
    
    return points;
}
```

### Step 4: Render Arc

```javascript
const geometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
const material = new THREE.LineBasicMaterial({
    color: event.color || '#4285F4',
    opacity: 0.8
});
const arc = new THREE.Line(geometry, material);
scene.add(arc);
```

---

## Handling Conflicting Timestamps

### Problem: Multiple Events at Same Time

When multiple events occur simultaneously, they would overlap if placed at the same radius. Circaevum uses **layered offsets**:

1. **Stream-based layering**: Each calendar/stream gets its own base radius
   ```
   Work Calendar: radius = 55
   Personal Calendar: radius = 58
   Garmin Activities: radius = 61
   ```

2. **Collision detection**: Within a stream, overlapping events are stacked
   ```javascript
   function calculateCollisionOffset(event, existingEvents) {
       const overlapping = existingEvents.filter(e => 
           eventsOverlap(e, event)
       );
       return overlapping.length * 0.5; // Small vertical offset
   }
   ```

3. **Visual distinction**: Different colors and optional labels help distinguish events

### Example

Three events at the same time:
- **Work Meeting** (Work Calendar, radius 55)
- **Lunch** (Personal Calendar, radius 58)
- **Run** (Garmin, radius 61)

All visible simultaneously without overlap.

---

## Time Zone Handling

### Current Behavior

Circaevum uses **UTC internally** for all calculations. When you pass a `Date` object:

```javascript
const event = {
    start: new Date('2025-01-15T10:00:00-08:00'), // PST
    // Internally converted to UTC: 2025-01-15T18:00:00Z
};
```

The visualization shows events at their **absolute time position** (UTC), not local time.

### Future Enhancement

For user-facing displays, you can convert back to local time:

```javascript
function formatEventTime(event, timezone) {
    const utcDate = new Date(event.start);
    return utcDate.toLocaleString('en-US', { timeZone: timezone });
}
```

---

## Uploading Custom Files

### Supported Formats

- **ICS/iCalendar** (`.ics`): Standard calendar format
- **CSV**: Comma-separated with date columns
- **JSON**: Custom event format matching `Event` interface

### Timestamp Parsing

Circaevum expects timestamps in these formats:

1. **ISO 8601** (preferred):
   ```
   2025-01-15T10:00:00Z
   2025-01-15T10:00:00-08:00
   ```

2. **Date objects** (JavaScript):
   ```javascript
   new Date('2025-01-15T10:00:00Z')
   ```

3. **Unix timestamps**:
   ```javascript
   new Date(1736942400000) // milliseconds
   ```

### Parsing Example (ICS)

```javascript
// VEVENT block
BEGIN:VEVENT
DTSTART:20250115T100000Z
DTEND:20250115T110000Z
SUMMARY:Team Meeting
DESCRIPTION:Weekly sync
LOCATION:Conference Room A
END:VEVENT

// Parsed to:
{
    id: generateId(),
    title: 'Team Meeting',
    start: new Date('2025-01-15T10:00:00Z'),
    end: new Date('2025-01-15T11:00:00Z'),
    description: 'Weekly sync',
    location: 'Conference Room A',
    source: 'ical',
    streamId: 'imported-calendar-1'
}
```

---

## Understanding the Visualization

### Reading Event Positions

1. **Vertical position (Y-axis)** = Time
   - Higher = Future
   - Lower = Past
   - Present = Current system time

2. **Radial position (X/Z plane)** = Calendar/Stream
   - Closer to center = Earth's worldline
   - Further out = Different calendars/streams
   - Same radius = Same calendar

3. **Arc length** = Event duration
   - Short arc = Brief event (minutes/hours)
   - Long arc = Extended event (days/weeks)

### Navigation Tips

- **Zoom in** to see individual events clearly
- **Zoom out** to see patterns and density
- **Navigate forward/backward** to explore different time periods
- **Click events** to see details and jump to that time

---

## Mathematical Reference

### Height Calculation (Full Precision)

```javascript
function calculateDateHeight(year, month, day, hour = 0) {
    const baseYearHeight = (year - CENTURY_START) * HEIGHT_PER_YEAR;
    
    // Days elapsed this year
    let daysElapsed = 0;
    for (let m = 0; m < month; m++) {
        daysElapsed += getDaysInMonth(year, m);
    }
    daysElapsed += day - 1;
    daysElapsed += hour / 24;
    
    const totalDays = getDaysInYear(year);
    const yearProgress = daysElapsed / totalDays;
    
    return baseYearHeight + (yearProgress * HEIGHT_PER_YEAR);
}
```

### Orbital Angle Calculation

```javascript
function getOrbitalAngle(date) {
    const year = date.getFullYear();
    const startOfYear = new Date(year, 0, 1);
    const dayOfYear = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000));
    
    // Vernal equinox reference (March 20 ≈ day 79)
    const vernalEquinoxDay = 79;
    const daysFromEquinox = dayOfYear - vernalEquinoxDay;
    const fractionOfYear = daysFromEquinox / 365.25;
    
    // Counter-clockwise orbit (viewed from above)
    return (fractionOfYear * Math.PI * 2) % (Math.PI * 2);
}
```

---

## Troubleshooting

### Events Not Showing

1. **Check time range**: Events outside visible range are culled
   ```javascript
   const range = CircaevumAPI.getCurrentTimeRange();
   console.log('Visible range:', range);
   ```

2. **Check visibility**: Stream or event might be hidden
   ```javascript
   CircaevumAPI.setStreamVisibility('my-calendar', true);
   ```

3. **Check height calculation**: Verify timestamp parsing
   ```javascript
   const height = calculateDateHeight(event.start);
   console.log('Event height:', height);
   ```

### Events Overlapping

- Adjust `radiusIncrement` in renderer config
- Use different colors for visual distinction
- Enable collision avoidance in renderer config

### Time Zone Confusion

- All internal calculations use UTC
- Convert to local time only for display
- Store original timezone in `metadata.timezone` if needed

---

## Further Reading

- [API Reference](../API.md) - Complete API documentation
- [Developer Guide](./DEVELOPER_GUIDE.md) - Code modification guide
- [User Guide](./USER_GUIDE.md) - End-user documentation

