# Circaevum DAO Commit Tracker - Advanced Guide

## Overview
Advanced progress tracking system with quarter/year and dot-level contribution codes that tracks individual progress across all 37 dots in the Yin-Yang model.

## Dot Progress Code System

### Format: `25Q3 0-002684-910040 4 0-001239-004000`
- **25Q3** = Quarter and Year (2025 Q3)
- **0-002684-910040** = YANG section (Center-New-Upkeep, 1-6-6 digits)
- **4** = TAIJI Center progress (1 digit, position 37)
- **0-001239-004000** = YIN section (Center-New-Upkeep, 1-6-6 digits)

### Dot Position Mapping
```
YANG New:      Positions 1-17   (Problems YANG-001 to YANG-017)
YANG Center:   Position 18      (Central dot in YANG area)
YANG Upkeep:   Positions 19-35  (Problems YANG-019 to YANG-035)
TAIJI Center:  Position 37      (Main central TAIJI dot)
YIN New:       Positions 38-54  (Problems YIN-001 to YIN-017)
YIN Center:    Position 55      (Central dot in YIN area)
YIN Upkeep:    Positions 56-73  (Problems YIN-018 to YIN-035)
```

## Human-Interpretable Progress Codes

### Format: `🔧YIN-001✅🌳@38:8`
- **🔧** = Problem type (YIN=backend, 🎨=frontend, ⚖️=coordination)
- **YIN-001** = Problem ID
- **✅** = Status (📋=planned, 🚀=started, 🔄=in-progress, 🧪=testing, ✅=completed, 🚫=blocked)
- **🌳** = Branch (🌳=main, 🌿=feature, 🐛=bugfix, 🔥=hotfix, 🏷️=release)
- **@38** = Dot position (1-73)
- **:8** = Contribution value (0-9)

## Quick Commands

### Track a new problem
```bash
./commit-tracker.sh track PROBLEM-YIN-005 "Adaptive Data Rendering" IN_PROGRESS main 5
```

### Update problem status and contribution
```bash
./commit-tracker.sh update PROBLEM-YIN-004 COMPLETED 8 abc123
```

### Generate commit message
```bash
./commit-tracker.sh commit PROBLEM-YIN-004 IN_PROGRESS "Working on mobile optimization" 5
```

### Generate multi-dot commit (coordinated changes)
```bash
./commit-tracker.sh multi-dot PROBLEM-YIN-004 IN_PROGRESS "Mobile+UI sync" "38:5,1:3,37:2"
```

### Show progress dashboard
```bash
./commit-tracker.sh dashboard
```

## Example Output

### Progress Dashboard
```
🌐 Circaevum DAO Progress Dashboard
==================================

📅 Current Quarter: 25Q1

🔧 YIN Problems:
  🔧YIN-001✅🌳@38:8 Nakama Device Authentication
  🔧YIN-002✅🌳@39:9 Google Calendar Integration
  🔧YIN-003✅🌳@40:7 Sleep Data Visualization
  🔧YIN-004🔄🌿@41:5 Mobile Device Optimization

🎨 YANG Problems:
  🎨YANG-001✅🌳@1:9 Space Station Memory Palace UI
  🎨YANG-002📋🌿@2:0 ISS Data Pod Visualization
  🎨YANG-003📋🌿@3:0 User Login Flow Enhancement

⚖️ TAIJI Problems:
  ⚖️TAIJI-001✅🌳@37:8 Space Station Memory Palace Architecture

🎯 Dot Progress Summary:
  YANG New (1-18): 1 completed, 2 planned
  YANG Upkeep (19-36): 0 active
  TAIJI (37): 1 completed
  YIN New (38-55): 3 completed, 1 in progress
  YIN Upkeep (56-73): 0 active

📊 Current Dot Progress Code:
  25Q1 001000-000000 8 003900-000000
```

### Generated Commit Message
```
🔧YIN-004🔄🌿@41:5 Working on mobile optimization

- Problem: PROBLEM-YIN-004
- Action: IN_PROGRESS
- Branch: main
- Dot Position: 41
- Contribution: 5
- Token: YIN-004
- Quarter: 25Q1
- Dot Progress: 25Q1 001000-000000 8 003900-000000
```

### Generated Multi-Dot Commit Message
```
🌐MULTI-DOT Mobile+UI sync

- Primary Problem: PROBLEM-YIN-004
- Action: IN_PROGRESS
- Branch: main
- Quarter: 25Q3
- Dot Changes:  YIN-New@38:5 YANG-New@1:3 TAIJI@37:2
- Commit Dot Progress: 25Q3 000000-000000 0 000000-000000
```

## Multi-Dot Commit System

### Coordinated Changes
For commits that affect multiple dots simultaneously (e.g., frontend+backend changes):

**Format**: `dot:contribution,dot:contribution,...`
- **38:5** = Dot 38 (YIN-New) with contribution 5
- **1:3** = Dot 1 (YANG-New) with contribution 3
- **37:2** = Dot 37 (TAIJI) with contribution 2

**Example**: `"38:5,1:3,37:2"` represents:
- Backend mobile optimization (dot 38, contribution 5)
- Frontend UI updates (dot 1, contribution 3)
- Architecture coordination (dot 37, contribution 2)

### Multi-Dot Commit Benefits
- **Coordinated Tracking**: Track related changes across multiple dots
- **Change Summary**: Clear overview of all affected dots
- **Commit Context**: Understand the full scope of changes
- **Progress Aggregation**: Multiple dots updated in single commit

## Contribution Value System

### Individual Dot Progress (0-9)
- **0** = No progress/contribution
- **1-3** = Initial work/planning
- **4-6** = Active development
- **7-8** = Testing/refinement
- **9** = Complete/fully contributed

### Aggregated Progress
Each 6-digit section represents the sum of individual dot contributions:
- **YANG New**: Sum of positions 1-18 (max: 999999)
- **YANG Upkeep**: Sum of positions 19-36 (max: 999999)
- **YIN New**: Sum of positions 38-55 (max: 999999)
- **YIN Upkeep**: Sum of positions 56-73 (max: 999999)

## Benefits
- **Precise Tracking**: Individual dot-level progress tracking
- **Coordinated Changes**: Multi-dot commits for related frontend/backend work
- **Quarterly Alignment**: Progress codes include quarter/year
- **Visual**: See progress at a glance with emoji codes
- **Branch-aware**: Track work across parallel branches
- **Token-tied**: Direct link between problems and token awards
- **Commit-ready**: Generate standardized commit messages
- **Mathematical**: Aggregated progress calculations

## Integration with README.md
The README can now show:
```markdown
**Current Problems:**
- 🔧YIN-004🔄🌿@41:5 Mobile Device Optimization
- 🎨YANG-002📋🌿@2:0 ISS Data Pod Visualization

**Completed Problems:**
- 🔧YIN-001✅🌳@38:8 Nakama Device Authentication
- 🎨YANG-001✅🌳@1:9 Space Station Memory Palace UI

**Current Dot Progress:**
25Q1 001000-000000 8 003900-000000
```

## Advanced Features
- **Automatic Quarter Detection**: Current quarter automatically calculated
- **Dot Position Calculation**: Automatic mapping of problem IDs to dot positions
- **Multi-Dot Coordination**: Track related changes across multiple dots
- **Contribution Aggregation**: Automatic calculation of section totals
- **Progress Visualization**: Clear dashboard showing all 37 dots
- **Historical Tracking**: Complete audit trail of dot-level contributions

---

**Usage**: `./commit-tracker.sh help` for full documentation
