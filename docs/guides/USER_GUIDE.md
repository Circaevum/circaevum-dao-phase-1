# User Guide: Navigating Time in Circaevum

## Welcome

Circaevum is a 3D visualization of time, where calendars and events are projected onto planetary worldlines. This guide helps you understand how to navigate, upload data, and interpret the visualization.

---

## Getting Started

### First Launch

1. **Open the application** in your web browser
2. **Click "EXPLORE THE PROTOTYPE"** to enter the visualization
3. **Use keyboard shortcuts** or **UI buttons** to navigate

### Understanding the View

- **Planets**: Represent actual planetary positions
- **Worldlines**: Helical trails showing planetary paths through time
- **Event Arcs**: Your calendar events, positioned parallel to Earth's worldline
- **Time Markers**: Labels showing dates/times at different zoom levels

---

## Navigation

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **1-9, 0** | Switch zoom levels |
| **W** | Zoom in one level |
| **S** | Zoom out one level |
| **A** | Navigate backward in time |
| **D** | Navigate forward in time |
| **Space** | Smooth return to present |
| **N** | Instant return to present |
| **M** | Toggle Moon worldline |
| **T** | Toggle horizontal time view |
| **R** | Rotate view 90° |

### Mouse Controls

- **Click and drag**: Pan the camera
- **Scroll wheel**: Zoom in/out
- **Click event arc**: Select event, see details

### UI Controls

- **Zoom Slider**: Click numbers 1-9 to jump to zoom levels
- **TIME MARKERS**: Toggle visibility of time labels
- **LIGHT MODE**: Switch between dark and light themes
- **SOUND OFF**: Toggle ambient audio

---

## Zoom Levels Explained

### Level 1: Century (100 years)
**Best for**: Seeing long-term patterns, major life events

- Shows 100 years of planetary motion
- Time markers every 25 years
- Focus: Sun (entire solar system)

### Level 2: Decade (10 years)
**Best for**: Planning years ahead, seeing annual patterns

- Shows 10 years centered on current time
- Time markers every year
- Focus: Sun

### Level 3: Year (1 year)
**Best for**: Annual planning, seasonal events

- Shows one full year
- Time markers every 3 months
- Focus: Sun

### Level 4: Quarter (3 months)
**Best for**: Quarterly planning, seeing monthly patterns

- Shows one quarter (3 months)
- Time markers every month
- Focus: Earth

### Level 5: Month (1 month)
**Best for**: Monthly planning, weekly patterns

- Shows one calendar month
- Time markers every week
- Focus: Earth

### Level 6: Lunar Cycle (~29 days)
**Best for**: Understanding lunar rhythms, monthly cycles

- Shows one lunar cycle
- Time markers every 7 days
- Focus: Earth

### Level 7: Week (7 days)
**Best for**: Weekly planning, daily patterns

- Shows one week
- Time markers every day
- Focus: Earth

### Level 8: Day (24 hours)
**Best for**: Daily scheduling, hourly planning

- Shows one full day
- Time markers every 6 hours
- Focus: Earth

### Level 9: Clock (8 hours)
**Best for**: Detailed hourly view, precise timing

- Shows 8-hour window
- Polar view (looking down at Earth)
- Focus: Earth

---

## Understanding Events

### Event Arcs

Events appear as **colored arcs** positioned near Earth's worldline:

- **Arc position**: Time when event occurs
- **Arc length**: Duration of event
- **Arc color**: Calendar/stream color
- **Arc radius**: Which calendar it belongs to

### Event Streams (Calendars)

Each calendar or data source is a **stream**:

- **Work Calendar**: Blue arcs at one radius
- **Personal Calendar**: Red arcs at another radius
- **Garmin Activities**: Green arcs at another radius

Streams are layered to avoid overlap.

### Reading Event Positions

1. **Vertical position** = Time
   - Higher = Future
   - Lower = Past
   - Present = Current system time

2. **Radial position** = Calendar
   - Closer to center = Earth's worldline
   - Further out = Different calendars

3. **Arc length** = Duration
   - Short = Brief event (minutes/hours)
   - Long = Extended event (days/weeks)

---

## Uploading Calendar Data

### Supported Formats

- **ICS/iCalendar** (`.ics`): Standard calendar format
- **CSV**: Comma-separated values with date columns
- **JSON**: Custom event format

### Uploading ICS Files

1. **Click "Import Calendar"** button (or similar in your wrapper)
2. **Select `.ics` file** from your computer
3. **Wait for processing**: Events will appear as arcs
4. **Check event table**: Verify events loaded correctly

### File Requirements

**ICS Format**:
- Must contain `VEVENT` blocks
- Required fields: `DTSTART`, `SUMMARY`
- Optional fields: `DTEND`, `DESCRIPTION`, `LOCATION`, `COLOR`

**Example ICS**:
```
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:20250115T100000Z
DTEND:20250115T110000Z
SUMMARY:Team Meeting
DESCRIPTION:Weekly sync
LOCATION:Conference Room A
END:VEVENT
END:VCALENDAR
```

### CSV Format

Required columns:
- `title` or `summary`: Event name
- `start` or `start_time`: Start date/time
- `end` or `end_time`: End date/time (optional)

Optional columns:
- `description`: Event description
- `location`: Event location
- `color`: Hex color code

**Example CSV**:
```csv
title,start,end,color
Team Meeting,2025-01-15T10:00:00Z,2025-01-15T11:00:00Z,#4285F4
Lunch,2025-01-15T12:00:00Z,2025-01-15T13:00:00Z,#EA4335
```

---

## Navigating Events

### Finding Events

1. **Use zoom levels**: Zoom in to see individual events clearly
2. **Navigate time**: Use A/D keys to move through time
3. **Check event table**: See list of events in visible range
4. **Search**: Use search box in event table (if available)

### Selecting Events

- **Click arc**: Select event in 3D scene
- **Click table row**: Select event in list
- **See details**: Event information appears in panel

### Jumping to Events

- **Double-click event**: Navigate camera to event time
- **Use "Go to Event" button**: Jump to selected event
- **Keyboard shortcut**: Press `G` to go to selected event (if implemented)

---

## Understanding Timestamps

### Time Zones

Circaevum uses **UTC (Coordinated Universal Time)** internally:

- All events are stored and displayed in UTC
- Your local timezone is used for display only
- Upload files with timezone information if available

### Date Formats

Supported formats:
- **ISO 8601**: `2025-01-15T10:00:00Z`
- **Date strings**: `January 15, 2025 10:00 AM`
- **Unix timestamps**: `1736942400000` (milliseconds)

### Conflicting Timestamps

If multiple events occur at the same time:

- **Different calendars**: Shown at different radii (no overlap)
- **Same calendar**: Stacked vertically with small offsets
- **Visual distinction**: Different colors help identify events

---

## Tips & Tricks

### Performance

- **Zoom out** to see overview (fewer events rendered)
- **Zoom in** to see details (more events rendered)
- **Hide streams**: Toggle visibility of calendars you don't need

### Navigation

- **Use Space bar**: Quick return to present
- **Use zoom slider**: Fast level switching
- **Pan camera**: Get different viewing angles

### Event Management

- **Group by stream**: Organize events into calendars
- **Use colors**: Assign distinct colors to different event types
- **Check table view**: Easier to see all events at once

---

## Troubleshooting

### Events Not Showing

1. **Check time range**: Events outside visible range are hidden
   - Zoom out or navigate to event's time period

2. **Check visibility**: Stream might be hidden
   - Toggle stream visibility in settings

3. **Check file format**: Ensure file is valid ICS/CSV/JSON
   - Verify required fields are present

### Events Overlapping

- **Normal behavior**: Events at same time are layered
- **Use colors**: Different colors help distinguish
- **Zoom in**: See individual events more clearly

### Performance Issues

- **Too many events**: Limit visible time range
- **Browser**: Use modern browser (Chrome, Firefox, Safari, Edge)
- **Hardware**: WebGL requires graphics acceleration

---

## Advanced Features

### Custom Colors

Assign colors to calendars/streams:
- **Hex codes**: `#4285F4` (blue), `#EA4335` (red)
- **Per event**: Override stream color for specific events
- **Color picker**: Use UI to select colors

### Event Filtering

Filter events by:
- **Stream/Calendar**: Show only specific calendars
- **Time range**: Show events in visible window
- **Search**: Find events by title/description

### Exporting

Export visible events:
- **ICS format**: Download as `.ics` file
- **CSV format**: Download as `.csv` file
- **JSON format**: Download as `.json` file

---

## Getting Help

### Documentation

- **API Reference**: For developers integrating Circaevum
- **Developer Guide**: For modifying the codebase
- **Projections Guide**: Understanding time-to-space mapping

### Support

- **GitHub Issues**: Report bugs or request features
- **Community**: Join discussions and share ideas

---

## Glossary

- **Worldline**: Path of an object through spacetime (helical trail)
- **Stream**: Collection of events from one calendar/source
- **Arc**: 3D representation of an event's duration
- **Zoom Level**: Time scale (century, decade, year, etc.)
- **Orbital Angle**: Position of planet in its orbit
- **Height**: Vertical position representing time
- **Radius**: Distance from center (Sun) in orbital plane

---

*"Time is what we want most, but what we use worst."* — William Penn

