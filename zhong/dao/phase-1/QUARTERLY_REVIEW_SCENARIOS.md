# Quarterly Review Scenarios: Contribution Tracking & Token Awards

## Overview

This document outlines how quarterly reviews work, how GitHub contributions are tallied into tokens, and how multiple frontends/backends are categorized within the YIN/YANG structure.

---

## Quarterly Review Process

### Pre-Review Preparation (Week Before Quarter End)

1. **GitHub History Analysis**
   - Run `commit-tracker.sh` to analyze all commits in the quarter
   - Identify commits tagged with `PROBLEM-YIN-XXX`, `PROBLEM-YANG-XXX`, `PROBLEM-ZHONG-XXX`
   - Calculate contribution metrics (commits, lines changed, files modified)
   - Map contributions to specific problems

2. **Problem Status Review**
   - Review all problems from the quarter
   - Mark problems as COMPLETED, IN_PROGRESS, or BLOCKED
   - Link completed problems to specific commits
   - Document blockers or delays

3. **Contribution Tally**
   - Count contributions per contributor
   - Categorize by problem type (YIN/YANG/ZHONG)
   - Calculate activity levels for decay assessment
   - Identify inactive token holders

### Quarterly Review Meeting (Quarter End)

**Agenda**:
1. **Revenue & Costs** (30 min)
   - Review quarterly revenue
   - Review costs and expenses
   - Calculate profits for distribution

2. **Contribution Tally** (60 min)
   - Present GitHub contribution analysis
   - Review completed problems
   - Award tokens for completed problems
   - Assess activity levels (decay check)

3. **Problem Voting** (45 min)
   - YIN and YANG holders vote on next quarter's 6 problems
   - 3 YIN problems (backend)
   - 3 YANG problems (frontend)
   - Discuss problem priorities and dependencies

4. **Profit Distribution** (15 min)
   - Distribute quarterly profits to YIN and YANG holders
   - Announce annual distribution to Wu Wei holders (if applicable)

5. **Future Investment** (30 min)
   - YIN and YANG holders vote on company investments
   - Review investment opportunities
   - Allocate capital

6. **Rotation** (15 min)
   - Yin-Yang rotates 90° counterclockwise
   - New problems emerge
   - Set goals for next quarter

**Total Time**: ~3.5 hours

---

## GitHub Contribution Tracking

### Commit Tagging System

**Standard Format**:
```
[PROBLEM-TYPE-XXX] [STATUS]: [Description]

- Problem: [Problem Title]
- Type: [YIN/YANG/ZHONG]
- Status: [IN_PROGRESS/COMPLETED/BLOCKED]
- Token: [YIN/YANG/ZHONG]-XXX
- Commit: [COMMIT_HASH]
```

**Examples**:
```
PROBLEM-YIN-001 COMPLETED: Implement Nakama device authentication

- Problem: Nakama Device Authentication
- Type: YIN
- Status: COMPLETED
- Token: YIN-001
- Commit: 24f0c9eaa

PROBLEM-YANG-002 IN_PROGRESS: ISS Data Pod visualization UI

- Problem: ISS Data Pod Visualization
- Type: YANG
- Status: IN_PROGRESS
- Token: YANG-002
- Commit: 6a0e4db10
```

### Contribution Metrics

**What Gets Tracked**:
1. **Commits**: Number of commits per problem
2. **Lines Changed**: Additions and deletions
3. **Files Modified**: Number of files touched
4. **Time Spent**: Estimated from commit frequency
5. **Problem Completion**: Whether problem was completed

**Automated Tracking**:
```bash
# Run commit tracker
./commit-tracker.sh analyze --quarter 25Q1

# Output:
# YIN Contributions:
#   - PROBLEM-YIN-001: 15 commits, 450 lines, 8 files (COMPLETED)
#   - PROBLEM-YIN-002: 12 commits, 320 lines, 6 files (COMPLETED)
#   - PROBLEM-YIN-003: 8 commits, 180 lines, 4 files (IN_PROGRESS)
#
# YANG Contributions:
#   - PROBLEM-YANG-001: 10 commits, 280 lines, 5 files (COMPLETED)
#   - PROBLEM-YANG-002: 5 commits, 120 lines, 3 files (IN_PROGRESS)
```

### Token Award Criteria

**For Problem Completion**:
- ✅ Problem must be marked as COMPLETED
- ✅ Must have minimum 5 commits addressing the problem
- ✅ Must have working implementation (tested)
- ✅ Must be merged to main branch
- ✅ Must be documented

**Token Award Process**:
1. **Identify Completed Problems**: From commit analysis
2. **Verify Completion**: Review code, tests, documentation
3. **Award Token**: Assign token to contributor(s)
4. **Record in Registry**: Update problem registry
5. **Update README**: Link to commits in README.md

**Multiple Contributors**:
- If multiple people contribute to same problem:
  - Primary contributor: Full token
  - Secondary contributors: Fractional tokens or recognition
  - Or: Token goes to lead contributor, others get credit

---

## Multiple Frontends & Backends: Naming Conventions

### The Challenge

With multiple frontends (Unity, Three.js) and backends (Nakama, TimescaleDB), how do we categorize contributions?

**Options**:
1. **Sub-tokens**: `YANG-UNITY-001`, `YANG-THREE-001`, `YIN-NAKAMA-001`, `YIN-TIMESCALE-001`
2. **Categories**: YANG (Unity), YANG (Three.js), YIN (Nakama), YIN (TimescaleDB)
3. **Problem Tags**: `PROBLEM-YANG-001 [Unity]`, `PROBLEM-YIN-001 [Nakama]`

### Recommended Approach: Problem Tags with Categories

**Structure**:
- **Main Token**: YIN-001, YANG-001 (18 of each)
- **Category Tag**: [Unity], [Three.js], [Nakama], [TimescaleDB]
- **Problem ID**: PROBLEM-YANG-001 [Unity]

**Example**:
```
PROBLEM-YANG-001 [Unity] COMPLETED: Apple Vision Pro worldline rendering

- Problem: Worldline Rendering for Vision Pro
- Type: YANG
- Category: Unity
- Status: COMPLETED
- Token: YANG-001
- Commit: abc123def

PROBLEM-YANG-002 [Three.js] COMPLETED: Web-based event visualization

- Problem: Web Event Visualization
- Type: YANG
- Category: Three.js
- Status: COMPLETED
- Token: YANG-002
- Commit: def456ghi
```

### Token Registry with Categories

**YANG Tokens** (Frontend):
- YANG-001: [Unity] - Apple Vision Pro worldline rendering
- YANG-002: [Three.js] - Web-based event visualization
- YANG-003: [Unity] - Meta Quest UI improvements
- YANG-004: [Three.js] - Event table component
- ... (18 total)

**YIN Tokens** (Backend):
- YIN-001: [Nakama] - Device authentication system
- YIN-002: [TimescaleDB] - Time-series event storage
- YIN-003: [Nakama] - Google Calendar integration
- YIN-004: [TimescaleDB] - Query optimization
- ... (18 total)

### Why This Approach?

**Benefits**:
1. ✅ **Flexibility**: Can have multiple frontends/backends without token explosion
2. ✅ **Clarity**: Clear categorization of where work was done
3. ✅ **Balance**: Still maintains 18 YIN + 18 YANG tokens (perfect balance)
4. ✅ **Tracking**: Easy to see which platforms are getting attention
5. ✅ **Scalability**: Can add new platforms without changing token structure

**Alternative Consideration**: Sub-tokens
- Could have `YANG-UNITY-001` through `YANG-UNITY-018` and `YANG-THREE-001` through `YANG-THREE-018`
- But this breaks the 18+18 balance
- Makes governance more complex
- Not recommended for maintaining Taiji balance

---

## Quarterly Review Scenario: Q1 2025 Example

### Pre-Review Analysis

**GitHub History** (TimeBox repository):
```
Commits analyzed: 47
Problems addressed: 5
Contributors: 3

YIN Contributions:
- PROBLEM-YIN-001 [Nakama]: 15 commits, 450 lines (COMPLETED) ✅
- PROBLEM-YIN-002 [Nakama]: 12 commits, 320 lines (COMPLETED) ✅
- PROBLEM-YIN-003 [Nakama]: 8 commits, 180 lines (COMPLETED) ✅
- PROBLEM-YIN-004 [Nakama]: 5 commits, 120 lines (IN_PROGRESS) 🔄

YANG Contributions:
- PROBLEM-YANG-001 [Unity]: 10 commits, 280 lines (COMPLETED) ✅

ZHONG Contributions:
- PROBLEM-ZHONG-001: 8 commits, 200 lines (COMPLETED) ✅
```

### Review Meeting

**1. Revenue & Costs**:
- Revenue: $25,000
- Costs: $15,000
- Profit: $10,000

**2. Contribution Tally**:
- **YIN-001**: Awarded to Contributor A (Nakama device auth)
- **YIN-002**: Awarded to Contributor A (Google Calendar integration)
- **YIN-003**: Awarded to Contributor B (Sleep data visualization)
- **YANG-001**: Awarded to Contributor C (Unity worldline rendering)
- **ZHONG-001**: Awarded to Contributor A (Zhong architecture)

**3. Problem Voting**:
- **YIN Problems** (voted by YIN/YANG holders):
  1. Mobile Device Optimization [Nakama] (continuing)
  2. TimescaleDB Integration [TimescaleDB] (new)
  3. REST API Adapter [REST] (new)
  
- **YANG Problems** (voted by YIN/YANG holders):
  1. ISS Data Pod Visualization [Unity] (new)
  2. Three.js Event Renderer [Three.js] (new)
  3. User Login Flow Enhancement [Unity] (new)

**4. Profit Distribution**:
- YIN holders: $5,000 (50% of $10,000)
- YANG holders: $5,000 (50% of $10,000)
- Wu Wei holders: (Annual distribution, accumulated)

**5. Future Investment**:
- Voted: Invest $3,000 in TimescaleDB infrastructure
- Voted: Invest $2,000 in Three.js documentation

**6. Rotation**:
- Yin-Yang rotates 90° counterclockwise
- New problems flow through Zhong (中)
- Q2 2025 begins

---

## Contribution Tracking by Platform

### Frontend Platforms (YANG)

**Unity** (Apple Vision Pro, Meta Quest):
- Track commits in `TimeBox/` and `Calendarium/` repositories
- Tag: `[Unity]` or `[VisionPro]` or `[Quest]`
- Examples:
  - `PROBLEM-YANG-001 [Unity] [VisionPro]`: Vision Pro specific
  - `PROBLEM-YANG-002 [Unity] [Quest]`: Quest specific
  - `PROBLEM-YANG-003 [Unity]`: Cross-platform Unity

**Three.js** (Web):
- Track commits in `circaevum-package/three-circa/` repository
- Tag: `[Three.js]` or `[Web]`
- Examples:
  - `PROBLEM-YANG-004 [Three.js]`: Web visualization
  - `PROBLEM-YANG-005 [Three.js]`: Event rendering

### Backend Platforms (YIN)

**Nakama**:
- Track commits in repositories using Nakama
- Tag: `[Nakama]`
- Examples:
  - `PROBLEM-YIN-001 [Nakama]`: Device authentication
  - `PROBLEM-YIN-002 [Nakama]`: Storage adapter

**TimescaleDB**:
- Track commits in repositories using TimescaleDB
- Tag: `[TimescaleDB]` or `[PostgreSQL]`
- Examples:
  - `PROBLEM-YIN-003 [TimescaleDB]`: Time-series storage
  - `PROBLEM-YIN-004 [TimescaleDB]`: Query optimization

**REST API**:
- Track commits in REST API implementations
- Tag: `[REST]` or `[API]`
- Examples:
  - `PROBLEM-YIN-005 [REST]`: REST API endpoints
  - `PROBLEM-YIN-006 [REST]`: API authentication

---

## Automated Contribution Analysis

### Script Enhancement

**Enhanced `commit-tracker.sh`**:
```bash
# Analyze by platform
./commit-tracker.sh analyze --platform Unity --quarter 25Q1
./commit-tracker.sh analyze --platform Three.js --quarter 25Q1
./commit-tracker.sh analyze --platform Nakama --quarter 25Q1
./commit-tracker.sh analyze --platform TimescaleDB --quarter 25Q1

# Analyze by problem type
./commit-tracker.sh analyze --type YIN --quarter 25Q1
./commit-tracker.sh analyze --type YANG --quarter 25Q1

# Generate quarterly report
./commit-tracker.sh report --quarter 25Q1 --output quarterly-report.md
```

**Report Output**:
```markdown
# Q1 2025 Contribution Report

## YIN Contributions (Backend)
- **Nakama**: 35 commits, 950 lines, 3 problems (2 completed)
- **TimescaleDB**: 12 commits, 320 lines, 1 problem (in progress)

## YANG Contributions (Frontend)
- **Unity**: 25 commits, 680 lines, 2 problems (1 completed)
- **Three.js**: 15 commits, 420 lines, 1 problem (in progress)

## Token Awards
- YIN-001: Contributor A (Nakama device auth)
- YIN-002: Contributor A (Google Calendar)
- YIN-003: Contributor B (Sleep data)
- YANG-001: Contributor C (Unity worldlines)
```

---

## Summary

**Quarterly Review Process**:
1. Analyze GitHub history with commit tracker
2. Tally contributions by problem and platform
3. Award tokens for completed problems
4. Vote on next quarter's problems
5. Distribute profits
6. Rotate Yin-Yang 90°

**Naming Conventions**:
- **Main Structure**: YIN-001 through YIN-018, YANG-001 through YANG-018
- **Category Tags**: [Unity], [Three.js], [Nakama], [TimescaleDB], [REST]
- **Problem Format**: `PROBLEM-YANG-001 [Unity] COMPLETED: Description`

**Benefits**:
- ✅ Maintains 18+18 token balance
- ✅ Clear platform categorization
- ✅ Flexible for multiple frontends/backends
- ✅ Easy to track and analyze
- ✅ Scalable for future platforms

