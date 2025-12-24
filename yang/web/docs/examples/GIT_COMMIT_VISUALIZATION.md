# Git Commit Visualization: Development Sprint Arcs

## Overview

Visualize git commits and development sprints as **event arcs** in Circaevum, with platform-specific styling (`yang-avp`, `yang-web`, etc.) and commit markers along the arcs.

---

## Philosophy: Development as Time Streams

**Development sprints are time streams** - they flow through time like events, with commits marking progress along the way. Each platform (yang-avp, yang-web) has its own stream, flowing in parallel like the Yin-Yang seeds.

**Visual Metaphor**:
- **Sprint Arc**: The overall development period (like an event)
- **Commit Dots**: Individual commits along the arc (like milestones)
- **Platform Borders**: Different colors for different platforms (yang-avp, yang-web, yin-nakama, etc.)

---

## Styling Scheme: Platform Colors

### Color Philosophy

**Yang (Frontend) Platforms**:
- **yang-avp** (Apple Vision Pro / Unity): **Blue** border - represents depth, immersion, spatial computing
- **yang-web** (Three.js / Web): **Purple** border - represents creativity, web innovation, accessibility

**Yin (Backend) Platforms**:
- **yin-nakama** (Nakama backend): **Green** border - represents growth, data flow, foundation
- **yin-timescale** (TimescaleDB): **Teal** border - represents time-series, precision, data streams
- **yin-rest** (REST API): **Orange** border - represents connectivity, API endpoints, integration

**Zhong (中) Coordination**:
- **zhong-architecture** (Architecture changes): **Gold** border - represents the center, coordination, balance

### Visual Design

**Arc Structure**:
```
┌─────────────────────────────────────────┐
│  White Polygon Arc (Yang base)          │
│  ┌───────────────────────────────────┐ │
│  │ Blue Border (yang-avp)            │ │
│  │  • • • • • (commit dots)          │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  White Polygon Arc (Yang base)          │
│  ┌───────────────────────────────────┐ │
│  │ Purple Border (yang-web)          │ │
│  │  • • • • • (commit dots)          │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Base Arc**: White polygon (represents Yang - active, creative)
**Border**: Platform-specific color (represents the specific implementation)
**Commit Dots**: Small spheres or bumps along the arc (represent individual commits)

---

## Data Model: Commit Events

### Commit Event Structure

```typescript
interface CommitEvent {
  // Standard Event fields
  id: string;                    // Commit hash (short)
  title: string;                 // Commit message (first line)
  description?: string;          // Full commit message
  start: Date;                   // Commit timestamp
  end?: Date;                    // Optional (for merge commits)
  color?: string;                // Base color (white for Yang)
  
  // Commit-specific fields
  commitHash: string;            // Full commit hash
  author: string;                // Commit author
  platform: string;              // "yang-avp", "yang-web", "yin-nakama", etc.
  borderColor: string;           // Platform border color
  problemId?: string;            // PROBLEM-YIN-XXX, PROBLEM-YANG-XXX, etc.
  sprintId: string;              // Sprint identifier (e.g., "Q1-2025")
  
  // Commit markers
  commits: CommitMarker[];       // Individual commits along the arc
  isMerge: boolean;              // Is this a merge commit?
  filesChanged: number;          // Number of files changed
  linesAdded: number;           // Lines added
  linesDeleted: number;          // Lines deleted
}

interface CommitMarker {
  hash: string;                  // Short commit hash
  timestamp: Date;               // Commit time
  message: string;               // Commit message
  position: number;              // Position along arc (0-1)
  size: number;                 // Dot size (based on impact)
}
```

### Sprint Arc Structure

```typescript
interface SprintArc {
  id: string;                    // Sprint ID (e.g., "Q1-2025-yang-avp")
  title: string;                 // Sprint title (e.g., "Q1 2025 - Apple Vision Pro")
  platform: string;              // "yang-avp", "yang-web", etc.
  start: Date;                   // Sprint start date
  end: Date;                     // Sprint end date
  color: string;                 // Base color (white)
  borderColor: string;           // Platform border color
  commits: CommitEvent[];        // All commits in sprint
  problemIds: string[];          // Problems addressed (PROBLEM-YANG-001, etc.)
  version?: string;              // Version number (e.g., "v0.4.07")
}
```

---

## Visualization: Arc Rendering

### Arc with Commit Dots

**Implementation**:
1. **Base Arc**: White polygon arc (standard event arc)
2. **Border**: Colored border based on platform
3. **Commit Dots**: Small spheres positioned along the arc at commit timestamps

**Arc Rendering**:
```javascript
// Render sprint arc with commits
function renderSprintArc(sprintArc) {
  // 1. Create base arc (white polygon)
  const baseArc = createEventArc({
    id: sprintArc.id,
    title: sprintArc.title,
    start: sprintArc.start,
    end: sprintArc.end,
    color: '#FFFFFF', // White base (Yang)
    radius: calculateRadius(sprintArc.platform),
    streamId: sprintArc.platform
  });
  
  // 2. Add colored border
  const border = createArcBorder({
    arc: baseArc,
    color: sprintArc.borderColor, // Platform color
    width: 2, // Border width
    opacity: 0.8
  });
  
  // 3. Add commit dots along arc
  sprintArc.commits.forEach(commit => {
    const position = calculatePositionOnArc(commit.timestamp, sprintArc);
    const dot = createCommitDot({
      position: position,
      size: calculateDotSize(commit), // Based on impact
      color: sprintArc.borderColor,
      commit: commit
    });
    baseArc.add(dot);
  });
  
  return baseArc;
}
```

### Commit Dot Sizing

**Size based on impact**:
- **Small** (0.5 units): Minor commits (typos, formatting)
- **Medium** (1.0 units): Regular commits (features, fixes)
- **Large** (1.5 units): Major commits (problem completions, architecture changes)

**Calculation**:
```javascript
function calculateDotSize(commit) {
  const impact = commit.linesAdded + commit.linesDeleted;
  if (impact < 50) return 0.5;      // Small
  if (impact < 200) return 1.0;     // Medium
  return 1.5;                        // Large
}
```

### Commit Dot Interaction

**Hover/Click**:
- **Hover**: Show commit message, author, timestamp
- **Click**: Show full commit details (hash, files changed, diff stats)
- **Tooltip**: Display commit information

---

## Platform-Specific Styling

### yang-avp (Apple Vision Pro / Unity)

**Color Scheme**:
- **Base**: White (#FFFFFF)
- **Border**: Blue (#4285F4) - Google Blue, represents depth and immersion
- **Commit Dots**: Blue (#4285F4) with slight glow

**Visual**:
```
White Arc
┌─────────────────────────────────────┐
│ 🔵 Blue Border                      │
│  • • • • • • • (commit dots)       │
└─────────────────────────────────────┘
```

**Example**:
```javascript
const yangAvpSprint = {
  platform: 'yang-avp',
  borderColor: '#4285F4', // Blue
  baseColor: '#FFFFFF',   // White
  commits: [
    { hash: '24f0c9eaa', message: 'PROBLEM-YANG-001 COMPLETED', ... },
    { hash: '6a0e4db10', message: 'UI improvements', ... }
  ]
};
```

### yang-web (Three.js / Web)

**Color Scheme**:
- **Base**: White (#FFFFFF)
- **Border**: Purple (#9C27B0) - Material Purple, represents creativity and web innovation
- **Commit Dots**: Purple (#9C27B0) with slight glow

**Visual**:
```
White Arc
┌─────────────────────────────────────┐
│ 🟣 Purple Border                    │
│  • • • • • • • (commit dots)       │
└─────────────────────────────────────┘
```

**Example**:
```javascript
const yangWebSprint = {
  platform: 'yang-web',
  borderColor: '#9C27B0', // Purple
  baseColor: '#FFFFFF',   // White
  commits: [
    { hash: 'abc123def', message: 'Three.js event renderer', ... },
    { hash: 'def456ghi', message: 'Web UI improvements', ... }
  ]
};
```

### yin-nakama (Nakama Backend)

**Color Scheme**:
- **Base**: Dark Gray (#424242) - Yin base (receptive, foundational)
- **Border**: Green (#4CAF50) - Growth, data flow
- **Commit Dots**: Green (#4CAF50)

**Visual**:
```
Dark Gray Arc (Yin base)
┌─────────────────────────────────────┐
│ 🟢 Green Border                     │
│  • • • • • • • (commit dots)       │
└─────────────────────────────────────┘
```

### yin-timescale (TimescaleDB)

**Color Scheme**:
- **Base**: Dark Gray (#424242)
- **Border**: Teal (#009688) - Time-series, precision
- **Commit Dots**: Teal (#009688)

### zhong-architecture (Architecture Changes)

**Color Scheme**:
- **Base**: Light Gray (#E0E0E0) - Center, balance
- **Border**: Gold (#FFC107) - Central coordination
- **Commit Dots**: Gold (#FFC107)

---

## Git History Integration

### Parsing Git Commits

**Git Command**:
```bash
# Get commits for a sprint
git log --since="2025-01-01" --until="2025-03-31" \
  --pretty=format:'%H|%an|%ad|%s' \
  --date=iso \
  --all
```

**Parse Output**:
```javascript
function parseGitCommits(gitOutput, platform, sprintId) {
  const commits = gitOutput.split('\n').map(line => {
    const [hash, author, date, message] = line.split('|');
    
    // Extract problem ID if present
    const problemMatch = message.match(/PROBLEM-(YIN|YANG|ZHONG)-(\d+)/);
    const problemId = problemMatch ? `PROBLEM-${problemMatch[1]}-${problemMatch[2]}` : null;
    
    return {
      hash: hash.substring(0, 7), // Short hash
      fullHash: hash,
      author: author,
      timestamp: new Date(date),
      message: message,
      problemId: problemId,
      platform: platform,
      sprintId: sprintId
    };
  });
  
  return commits;
}
```

### Creating Sprint Arcs from CHANGELOG

**Parse CHANGELOG.md**:
```javascript
function parseChangelog(changelogText, platform) {
  const sprints = [];
  
  // Parse version sections
  const versionRegex = /## \[(\d+\.\d+\.\d+)\] - (\d{4}-\d{2}-\d{2})/g;
  let match;
  
  while ((match = versionRegex.exec(changelogText)) !== null) {
    const version = match[1];
    const date = new Date(match[2]);
    
    // Extract quarter from date
    const quarter = getQuarter(date);
    const sprintId = `Q${quarter}-${date.getFullYear()}-${platform}`;
    
    // Extract commits from this version
    const versionSection = extractVersionSection(changelogText, version);
    const commits = extractCommits(versionSection, platform);
    
    sprints.push({
      id: sprintId,
      title: `v${version} - ${platform}`,
      platform: platform,
      start: date,
      end: calculateSprintEnd(date, quarter),
      version: version,
      commits: commits,
      borderColor: getPlatformColor(platform)
    });
  }
  
  return sprints;
}
```

---

## Example: TimeBox CHANGELOG Visualization

### Q1 2025 Sprint (yang-avp)

**From CHANGELOG.md**:
- **v0.4.07** (2025-03-15): Mobile Optimization
- **v0.4.06** (2024-12-30): Sleep Data Visualization
- **v0.4.05** (2024-07-30): Event Rendering Persistence
- **v0.4.04** (2024-07-30): Space Station Memory Palace
- **v0.4.03** (2024-12-19): ControlStation Architecture

**Visualization**:
```
Q1 2025 - yang-avp Sprint Arc
┌─────────────────────────────────────────────────────────┐
│ 🔵 Blue Border (yang-avp)                               │
│                                                          │
│  • v0.4.03  • v0.4.04  • v0.4.05  • v0.4.06  • v0.4.07 │
│  (Dec 19)   (Jul 30)   (Jul 30)   (Dec 30)   (Mar 15)  │
│                                                          │
│  PROBLEM-ZHONG-001  PROBLEM-YIN-003  PROBLEM-YIN-004   │
└─────────────────────────────────────────────────────────┘
```

**Commit Dots**:
- **Large dots**: Problem completions (PROBLEM-ZHONG-001, PROBLEM-YIN-003)
- **Medium dots**: Version releases (v0.4.07, v0.4.06)
- **Small dots**: Regular commits

---

## Integration with CircaevumAPI

### API Methods

```javascript
// Add sprint arc
CircaevumAPI.addSprintArc({
  id: 'Q1-2025-yang-avp',
  title: 'Q1 2025 - Apple Vision Pro',
  platform: 'yang-avp',
  start: new Date('2025-01-01'),
  end: new Date('2025-03-31'),
  commits: [...],
  borderColor: '#4285F4' // Blue
});

// Add commit event
CircaevumAPI.addCommitEvent({
  id: '24f0c9eaa',
  title: 'PROBLEM-YANG-001 COMPLETED',
  platform: 'yang-avp',
  start: new Date('2025-01-15'),
  commitHash: '24f0c9eaa',
  borderColor: '#4285F4'
});

// Load from git history
CircaevumAPI.loadGitHistory({
  repository: 'TimeBox',
  platform: 'yang-avp',
  since: '2025-01-01',
  until: '2025-03-31'
});
```

---

## Styling Summary

| Platform | Base Color | Border Color | Hex Code | Symbol |
|----------|------------|--------------|----------|--------|
| **yang-avp** | White | Blue | #4285F4 | 🔵 |
| **yang-web** | White | Purple | #9C27B0 | 🟣 |
| **yin-nakama** | Dark Gray | Green | #4CAF50 | 🟢 |
| **yin-timescale** | Dark Gray | Teal | #009688 | 🔷 |
| **yin-rest** | Dark Gray | Orange | #FF9800 | 🟠 |
| **zhong-architecture** | Light Gray | Gold | #FFC107 | 🟡 |

**Visual Hierarchy**:
- **Yang platforms**: White base (active, creative)
- **Yin platforms**: Dark Gray base (receptive, foundational)
- **Zhong**: Light Gray base (center, balance)
- **Borders**: Platform-specific colors (distinction)
- **Commit Dots**: Same color as border (consistency)

---

## Implementation Notes

### Arc Rendering

1. **Base Arc**: Standard event arc rendering (white polygon)
2. **Border**: Additional geometry with platform color
3. **Commit Dots**: Small spheres positioned along arc at commit timestamps
4. **Interaction**: Hover/click handlers for commit details

### Performance

- **Batch Rendering**: Render all commits in a sprint together
- **LOD (Level of Detail)**: Simplify commit dots at distance
- **Culling**: Only render visible sprints

### Data Source

- **Git History**: Parse from `git log` output
- **CHANGELOG**: Parse from CHANGELOG.md files
- **API**: Load from GitHub API or local git repository

---

## Summary

**Git commits as event arcs**:
- ✅ Sprint arcs with platform-specific borders
- ✅ Commit dots along arcs (size based on impact)
- ✅ Color-coded by platform (yang-avp: blue, yang-web: purple, etc.)
- ✅ Interactive (hover/click for commit details)
- ✅ Aligned with Taiji philosophy (Yang = white, Yin = dark, Zhong = gold)

**Result**: Beautiful visualization of development history, showing how different platforms (yang-avp, yang-web) flow through time with commits marking progress along the way.

