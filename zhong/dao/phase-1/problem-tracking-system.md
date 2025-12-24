# Circaevum DAO Problem Tracking System

## Overview

This system provides precise tracking of individual problems through versioning and commit history, enabling the README.md to point directly to specific commits for accurate progress overview.

## Problem Identification Schema

### Problem Format
```
PROBLEM-[TYPE]-[NUMBER]: [Title]
```

**Types:**
- `YIN` - Backend problems (infrastructure, data processing, APIs)
- `YANG` - Frontend problems (UI, user experience, visualization)
- `ZHONG` - Coordination problems (architecture, integration, governance) - The Center Contract (中)

**Examples:**
- `PROBLEM-YIN-001: Nakama Device Authentication`
- `PROBLEM-YANG-002: ISS Data Pod Visualization`
- `PROBLEM-ZHONG-001: Zhong (中) Architecture - The Center Contract`

## Version Integration System

### Version Number Format
```
v[MAJOR].[MINOR].[PATCH]-[PROBLEM_ID]
```

**Examples:**
- `v0.4.07-PROBLEM-YIN-001` - Version 0.4.07 addressing Problem YIN-001
- `v0.4.08-PROBLEM-YANG-002` - Version 0.4.08 addressing Problem YANG-002
- `v0.4.03-PROBLEM-ZHONG-001` - Version 0.4.03 addressing Problem ZHONG-001

### Commit Message Format
```
[PROBLEM-ID] [Action]: [Description]

- Problem: [Problem Title]
- Type: [YIN/YANG/ZHONG]
- Status: [IN_PROGRESS/COMPLETED/BLOCKED]
- Token: [YIN/YANG/ZHONG]
- Commit: [COMMIT_HASH]
```

**Examples:**
```
PROBLEM-YIN-001 COMPLETED: Implement Nakama device authentication system

- Problem: Nakama Device Authentication
- Type: YIN
- Status: COMPLETED
- Token: YIN
- Commit: 17be6b882
```

## Problem Registry

### Q1 2025 Problems

#### YIN Problems (Backend)
- `PROBLEM-YIN-001`: Nakama Device Authentication ✅ COMPLETED
  - **Versions**: v0.4.03-v0.4.04
  - **Commits**: 24f0c9eaa, abaa48cee
  - **Token**: YIN-001 awarded
  - **Description**: Device authentication and session management system

- `PROBLEM-YIN-002`: Google Calendar Integration ✅ COMPLETED
  - **Versions**: v0.4.02-v0.4.05
  - **Commits**: f5b83519b, b3c9c068b
  - **Token**: YIN-002 awarded
  - **Description**: Google Calendar API integration with event rendering

- `PROBLEM-YIN-003`: Sleep Data Visualization ✅ COMPLETED
  - **Versions**: v0.4.06
  - **Commits**: 17be6b882
  - **Token**: YIN-003 awarded
  - **Description**: Garmin sleep data processing and visualization

- `PROBLEM-YIN-004`: Mobile Device Optimization 🔄 IN_PROGRESS
  - **Versions**: v0.4.07
  - **Commits**: [Current development]
  - **Token**: YIN-004 pending
  - **Description**: Performance and compatibility improvements for mobile platforms

#### YANG Problems (Frontend)
- `PROBLEM-YANG-001`: Space Station Memory Palace UI ✅ COMPLETED
  - **Versions**: v0.4.03-v0.4.04
  - **Commits**: 24f0c9eaa, 6a0e4db10
  - **Token**: YANG-001 awarded
  - **Description**: Visual representation of system architecture

- `PROBLEM-YANG-002`: ISS Data Pod Visualization 📋 PLANNED
  - **Versions**: v0.4.08-v0.4.09 (Q2 2025)
  - **Commits**: [Future development]
  - **Token**: YANG-002 pending
  - **Description**: User interface for displaying space station data

- `PROBLEM-YANG-003`: User Login Flow Enhancement 📋 PLANNED
  - **Versions**: v0.4.10-v0.4.11 (Q2 2025)
  - **Commits**: [Future development]
  - **Token**: YANG-003 pending
  - **Description**: Streamlined authentication experience

#### ZHONG Problems (Coordination - The Center Contract)
- `PROBLEM-ZHONG-001`: Zhong (中) Architecture - The Center Contract ✅ COMPLETED
  - **Versions**: v0.4.03-v0.4.04
  - **Commits**: 24f0c9eaa, abaa48cee
  - **Token**: ZHONG-001 awarded
  - **Description**: Central coordination system for all components (formerly "Space Station Memory Palace")

## Commit History Integration

### Problem Tracking in Commits
Each commit that addresses a problem should include:
1. **Problem ID** in commit message
2. **Status update** (IN_PROGRESS/COMPLETED/BLOCKED)
3. **Token award** when completed
4. **Version number** with problem ID

### Example Commit History
```
17be6b882 PROBLEM-YIN-003 COMPLETED: HR sprites work
b3c9c068b PROBLEM-YIN-002 COMPLETED: Vibecoding worked for once, things fixed. 0.4.05
6a0e4db10 PROBLEM-YANG-001 IN_PROGRESS: Adjust naming for station lighting
24f0c9eaa PROBLEM-TAIJI-001 COMPLETED: v0403 ControlStation
abaa48cee PROBLEM-YIN-001 IN_PROGRESS: 0402 updates and fresh shift to Windsurf editor
f5b83519b PROBLEM-YIN-002 IN_PROGRESS: v0402 complete DDMMYY buttons
```

## README.md Integration

### Problem Status Section
The README.md should include a section that links directly to commits:

```markdown
### Current Problems (Q1 2025 - Updated March 2025)

**Back-End (Yin) Problems:**
1. **Mobile Device Optimization** 🔄 IN_PROGRESS
   - **Problem ID**: PROBLEM-YIN-004
   - **Version**: v0.4.07
   - **Commit**: [Current development]
   - **Token**: YIN-004 pending

**Front-End (Yang) Problems:**
2. **ISS Data Pod Visualization** 📋 PLANNED
   - **Problem ID**: PROBLEM-YANG-002
   - **Version**: v0.4.08-v0.4.09 (Q2 2025)
   - **Commit**: [Future development]
   - **Token**: YANG-002 pending

**Completed Problems (Q1 2025):**
- ✅ **Nakama Device Authentication** ([PROBLEM-YIN-001](https://github.com/Circaevum/TimeBox/commit/24f0c9eaa))
- ✅ **Google Calendar Integration** ([PROBLEM-YIN-002](https://github.com/Circaevum/TimeBox/commit/b3c9c068b))
- ✅ **Sleep Data Visualization** ([PROBLEM-YIN-003](https://github.com/Circaevum/TimeBox/commit/17be6b882))
- ✅ **Zhong (中) Architecture** ([PROBLEM-ZHONG-001](https://github.com/Circaevum/TimeBox/commit/24f0c9eaa)) - The Center Contract
```

## Token Award System

### Token Assignment
- **YIN Tokens**: Awarded for completed backend problems
- **YANG Tokens**: Awarded for completed frontend problems  
- **ZHONG Tokens**: Awarded for completed coordination problems (The Center Contract)

### Token Registry
```
YIN-001: Nakama Device Authentication (24f0c9eaa)
YIN-002: Google Calendar Integration (b3c9c068b)
YIN-003: Sleep Data Visualization (17be6b882)
YANG-001: Zhong (中) UI - The Center Contract interface (6a0e4db10)
ZHONG-001: Zhong (中) Architecture - The Center Contract (24f0c9eaa)
```

## Automation Scripts

### Problem Tracking Script
```bash
# Track a new problem
./track-problem.sh PROBLEM-YIN-005 "Adaptive Data Rendering System"

# Mark problem as completed
./complete-problem.sh PROBLEM-YIN-004 17be6b882

# Generate README updates
./update-readme-problems.sh
```

### Commit Message Generator
```bash
# Generate commit message for problem
./generate-commit.sh PROBLEM-YIN-004 COMPLETED "Mobile optimization complete"
```

## Quarterly Reconciliation Process

### Q1 2025 Reconciliation (March 2025)
1. **Review Commit History**: Analyze commits for problem completion
2. **Update Problem Registry**: Mark completed problems and award tokens
3. **Update README.md**: Link to specific commits for completed problems
4. **Scope Q2 Problems**: Define new problems based on development velocity
5. **Update Version Numbers**: Align with quarterly cycles

### Problem Completion Criteria
- **YIN Problems**: Backend functionality working and tested
- **YANG Problems**: Frontend features implemented and user-tested
- **ZHONG Problems**: Integration and coordination systems operational (The Center Contract)

## Benefits of This System

1. **Precision**: Each problem is uniquely identified and tracked
2. **Transparency**: Direct links to commit history for verification
3. **Accountability**: Clear token awards tied to specific problems
4. **Automation**: Scripts can generate updates from commit history
5. **Governance**: DAO members can verify progress through commits
6. **Historical Record**: Complete audit trail of problem-solving progress

## Implementation Steps

1. **Retroactively Tag Existing Commits**: Apply problem IDs to existing commits
2. **Update README.md**: Include problem tracking section with commit links
3. **Create Automation Scripts**: Build tools for ongoing problem tracking
4. **Establish Commit Standards**: Ensure all future commits follow the format
5. **Train Development Team**: Educate on problem tracking system
6. **Integrate with DAO Governance**: Align token awards with problem completion

---

**Last Updated**: March 2025
**Next Review**: June 2025 (Q2 2025)
**System Owner**: Circaevum DAO Governance
