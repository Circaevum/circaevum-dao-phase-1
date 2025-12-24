# Developer Guide: Modifying Circaevum

## Overview

This guide helps developers understand the codebase structure, make modifications, and contribute to Circaevum. The codebase is organized into **modular JavaScript files** that can be modified independently.

---

## Project Structure

```
circaevum-three/
├── index.html              # Entry point, UI structure
├── circaevum/
│   ├── css/
│   │   └── styles.css      # All styling
│   └── js/
│       ├── config.js       # Constants, planet data, zoom levels
│       ├── datetime.js     # Time calculations, date utilities
│       ├── events.js       # Event data model, API interface
│       ├── event-renderer.js # 3D event rendering
│       ├── event-ui.js     # Table/list UI for events
│       └── main.js         # Three.js scene, rendering loop
└── docs/
    └── ...                 # Documentation
```

---

## Module Responsibilities

### `config.js`
**Purpose**: All constants and configuration

**What to modify**:
- Planet orbital data (distances, sizes, colors)
- Zoom level definitions (time spans, camera distances)
- Scene settings (background color, fog, star count)
- Time markers for each zoom level

**Example modification**:
```javascript
// Change Earth's orbital radius
const PLANET_DATA = [
    // ... other planets
    { 
        name: 'Earth', 
        distance: 60,  // Changed from 50
        // ...
    }
];
```

### `datetime.js`
**Purpose**: Time calculations and date utilities

**What to modify**:
- Height calculation formulas
- Date parsing and formatting
- Navigation offset calculations
- Progress calculations (year, quarter, month, etc.)

**Example modification**:
```javascript
// Change height per year
const HEIGHT_PER_YEAR = 150; // Changed from 100

// This affects all time-to-height conversions
```

### `events.js`
**Purpose**: Event data model and API interface

**What to modify**:
- Event data structure
- API methods (`setEvents`, `getEvents`, etc.)
- Event validation
- Stream management

**Example modification**:
```javascript
// Add custom event property
function validateEvent(event) {
    // ... existing validation
    if (event.priority) {
        // Handle priority field
    }
}
```

### `event-renderer.js`
**Purpose**: Rendering events as 3D worldline arcs

**What to modify**:
- Arc geometry generation
- Collision avoidance algorithm
- Color/material handling
- Label positioning

**Example modification**:
```javascript
// Change arc thickness
const material = new THREE.LineBasicMaterial({
    linewidth: 5, // Changed from 2
    // ...
});
```

### `event-ui.js`
**Purpose**: Table/list UI for navigating events

**What to modify**:
- Table layout and styling
- Event filtering/sorting
- Click handlers
- Search functionality

**Example modification**:
```javascript
// Add custom column
function renderEventRow(event) {
    return `
        <tr>
            <td>${event.title}</td>
            <td>${formatDate(event.start)}</td>
            <td>${event.priority || 'Normal'}</td> <!-- New column -->
        </tr>
    `;
}
```

### `main.js`
**Purpose**: Three.js scene setup and rendering loop

**What to modify**:
- Scene initialization
- Camera controls
- Planet rendering
- Animation loop
- User input handling

**Example modification**:
```javascript
// Change camera movement speed
let cameraTransitionSpeed = 0.25; // Changed from 0.15
```

---

## Common Modifications

### Adding a New Zoom Level

1. **Update `config.js`**:
```javascript
const ZOOM_LEVELS = {
    // ... existing levels
    10: { 
        name: 'HOUR', 
        span: '1 hour', 
        distance: 15, 
        height: 120, 
        timeYears: 0.000114, // 1 hour in years
        focusTarget: 'earth' 
    }
};
```

2. **Update `datetime.js`**:
```javascript
// Add navigation offset
let selectedMinuteOffset = 0;

// Add height calculation for hour view
function getHeightForHour(year, month, day, hour) {
    const dayHeight = HEIGHT_PER_YEAR / 365.25;
    const hourHeight = dayHeight / 24;
    return calculateDateHeight(year, month, day, hour);
}
```

3. **Update `main.js`**:
```javascript
// Add zoom level handling
case 10: // Hour view
    // Camera positioning, time markers, etc.
    break;
```

4. **Update `index.html`**:
```html
<div class="zoom-option" data-zoom="10">
    <div class="zoom-number">10</div>
    <div class="zoom-desc">Hour</div>
</div>
```

### Changing Event Arc Appearance

**In `event-renderer.js`**:

```javascript
// Use TubeGeometry instead of Line for thicker arcs
function createEventWorldline(event) {
    const curve = new THREE.CatmullRomCurve3(arcPoints);
    const geometry = new THREE.TubeGeometry(curve, 20, 0.5, 8, false);
    const material = new THREE.MeshBasicMaterial({
        color: event.color,
        transparent: true,
        opacity: 0.6
    });
    return new THREE.Mesh(geometry, material);
}
```

### Adding Event Labels

**In `event-renderer.js`**:

```javascript
function createEventLabel(event, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = '#ffffff';
    context.font = '24px Arial';
    context.fillText(event.title, 10, 30);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.copy(position);
    
    return sprite;
}
```

### Customizing Collision Avoidance

**In `event-renderer.js`**:

```javascript
function calculateEventRadius(streamId, eventIndex, overlappingEvents) {
    const baseRadius = EARTH_ORBIT_RADIUS + 5;
    const streamIndex = getStreamIndex(streamId);
    const streamOffset = streamIndex * 3;
    
    // Custom collision detection
    if (overlappingEvents.length > 0) {
        // Stack vertically with larger spacing
        const verticalOffset = overlappingEvents.length * 1.0;
        return baseRadius + streamOffset + verticalOffset;
    }
    
    return baseRadius + streamOffset;
}
```

---

## Debugging

### Enable Debug Mode

Add to `main.js`:

```javascript
const DEBUG = true;

function debugLog(...args) {
    if (DEBUG) {
        console.log('[Circaevum]', ...args);
    }
}
```

### Visual Debugging

Add debug helpers to `main.js`:

```javascript
function showDebugInfo() {
    const info = {
        currentZoom: currentZoom,
        selectedTime: getSelectedDateTime(),
        eventCount: CircaevumAPI.getEvents().length,
        visibleRange: CircaevumAPI.getCurrentTimeRange()
    };
    console.table(info);
}

// Call from browser console
window.debugCircaevum = showDebugInfo;
```

### Performance Monitoring

```javascript
let frameCount = 0;
let lastTime = performance.now();

function animate() {
    requestAnimationFrame(animate);
    
    // ... existing animation code
    
    // Performance monitoring
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
        console.log(`FPS: ${frameCount}`);
        frameCount = 0;
        lastTime = now;
    }
}
```

---

## Testing Changes

### Local Development Server

```bash
# Python
python3 -m http.server 8000

# Node.js
npx serve .

# VS Code Live Server
# Right-click index.html → "Open with Live Server"
```

### Testing Event Loading

```javascript
// In browser console
const testEvents = [
    {
        id: 'test-1',
        title: 'Test Event',
        start: new Date(),
        end: new Date(Date.now() + 3600000),
        color: '#FF0000',
        streamId: 'test-stream',
        source: 'manual'
    }
];

CircaevumAPI.setEvents(testEvents);
```

### Testing Navigation

```javascript
// Navigate to specific date
CircaevumAPI.navigateToTime(new Date('2025-06-15'));

// Check current range
console.log(CircaevumAPI.getCurrentTimeRange());
```

---

## Code Style Guidelines

### Naming Conventions

- **Variables**: `camelCase` (e.g., `currentZoom`, `eventCount`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `HEIGHT_PER_YEAR`, `CENTURY_START`)
- **Functions**: `camelCase` (e.g., `calculateDateHeight`, `createEventWorldline`)
- **Classes**: `PascalCase` (e.g., `EventRenderer`, `EventManager`)

### File Organization

- **One concept per file**: Keep modules focused
- **Dependencies at top**: Import/require statements first
- **Exports at bottom**: Public API clearly defined
- **Comments for complex logic**: Explain "why", not "what"

### Example Structure

```javascript
/**
 * Module: event-renderer.js
 * Purpose: Render events as 3D worldline arcs
 */

// ============================================
// IMPORTS / DEPENDENCIES
// ============================================
// (Three.js, config.js, datetime.js, events.js)

// ============================================
// CONSTANTS
// ============================================
const BASE_RADIUS_OFFSET = 5;
const RADIUS_INCREMENT = 3;

// ============================================
// PRIVATE FUNCTIONS
// ============================================
function calculateEventRadius(event) {
    // ...
}

// ============================================
// PUBLIC API
// ============================================
const EventRenderer = {
    render: function(events) {
        // ...
    },
    clear: function() {
        // ...
    }
};

// ============================================
// EXPORTS
// ============================================
window.EventRenderer = EventRenderer;
```

---

## Contributing

### Before Making Changes

1. **Read the architecture**: Understand the separation between visualization and data layers
2. **Check existing issues**: See if your change is already planned
3. **Test locally**: Ensure changes work in your environment

### Making Changes

1. **Create a branch**: `git checkout -b feature/my-feature`
2. **Make focused changes**: One feature or fix per branch
3. **Update documentation**: Modify relevant docs if API changes
4. **Test thoroughly**: Verify in multiple browsers/zoom levels

### Submitting Changes

1. **Write clear commit messages**: Explain what and why
2. **Update CHANGELOG.md**: Document user-facing changes
3. **Create pull request**: Link to related issues

---

## Common Pitfalls

### 1. Modifying Global State Incorrectly

❌ **Bad**:
```javascript
// Directly modifying datetime.js variables
currentYear = 2026; // Breaks navigation
```

✅ **Good**:
```javascript
// Use navigation functions
navigateToTime(new Date('2026-01-01'));
```

### 2. Breaking API Contract

❌ **Bad**:
```javascript
// Changing API method signature
CircaevumAPI.setEvents(events, options); // Added parameter
```

✅ **Good**:
```javascript
// Add new method instead
CircaevumAPI.setEventsWithOptions(events, options);
// Keep old method for backward compatibility
```

### 3. Performance Issues

❌ **Bad**:
```javascript
// Recreating all events every frame
function animate() {
    events.forEach(event => {
        scene.remove(event.mesh);
        createEventWorldline(event);
    });
}
```

✅ **Good**:
```javascript
// Only update when events change
let eventsDirty = false;
CircaevumAPI.on('events:changed', () => {
    eventsDirty = true;
});

function animate() {
    if (eventsDirty) {
        updateEventMeshes();
        eventsDirty = false;
    }
}
```

---

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [API Reference](../API.md)
- [Projections Guide](./PROJECTIONS.md)
- [Architecture Overview](../ARCHITECTURE.md)

---

## Getting Help

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check relevant docs first
- **Code Comments**: Read inline documentation

---

*Happy coding! Remember: the visualization layer should remain backend-agnostic and user-data-free for open-source compatibility.*

