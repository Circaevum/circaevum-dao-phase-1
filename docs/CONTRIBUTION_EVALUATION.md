# Contribution Evaluation Methods

**Purpose**: Establish effective methods for evaluating progress and contributions across all project types (Unity, Web, Backend) for quarterly DAO reviews and token distribution.

---

## Evaluation Method Matrix

| Method | Unity Projects | Web Projects | Backend Projects | Effectiveness | Effort |
|--------|---------------|--------------|------------------|---------------|--------|
| **Git Commits** | ⚠️ Limited (not in repo) | ✅ Excellent | ✅ Excellent | High | Low |
| **Screenshots/Videos** | ✅ Essential | ✅ Good | ❌ Not applicable | Very High | Medium |
| **Build Artifacts** | ✅ Essential | ✅ Good | ✅ Good | High | Medium |
| **Changelogs** | ✅ Excellent | ✅ Excellent | ✅ Excellent | Very High | Low |
| **Version Numbers** | ✅ Excellent | ✅ Excellent | ✅ Excellent | High | Low |
| **Test Results** | ✅ Good | ✅ Excellent | ✅ Excellent | High | Medium |
| **Documentation Updates** | ✅ Good | ✅ Good | ✅ Good | Medium | Low |

---

## Recommended Approach: Multi-Method Evaluation

**Best Practice**: Use **2-3 complementary methods** for each project type to get a complete picture of progress.

### For Unity Projects (yang-avp, yang-quest)

**Primary Methods** (Required):
1. **Screenshots/Videos** - Visual proof of progress
2. **Build Artifacts** - Working builds demonstrate completion
3. **Changelogs** - Document what changed

**Secondary Methods** (Recommended):
4. **Version Numbers** - Tie versions to problem IDs
5. **Documentation** - Architecture/design docs

**Why Unity Needs Visual Evidence**:
- Unity projects are visual/3D by nature
- Code changes alone don't show user-facing progress
- Screenshots prove features work in context
- Videos demonstrate interactions and flow

### For Web Projects (yang-web)

**Primary Methods**:
1. **Git Commits** - Full commit history available
2. **Changelogs** - Document feature additions
3. **Live Demos** - Working URLs (localhost or deployed)

**Secondary Methods**:
4. **Screenshots** - UI/UX changes
5. **Test Coverage** - Automated tests

### For Backend Projects (yin-nakama, yin-timescale, yin-rest)

**Primary Methods**:
1. **Git Commits** - Code contributions
2. **API Documentation** - Endpoints, schemas
3. **Test Results** - Integration/unit tests

**Secondary Methods**:
4. **Performance Metrics** - Response times, throughput
5. **Changelogs** - API versioning

---

## Unity-Specific Contribution Tracking

### Problem: Unity Projects Not in Git

**Solution**: Create a **Unity Contribution Package** for each problem/progress update.

#### Unity Contribution Package Structure

```
yang/unity/contributions/
├── 2025-Q1/
│   ├── PROBLEM-YANG-001/
│   │   ├── screenshots/
│   │   │   ├── feature-overview.png
│   │   │   ├── before-after-1.png
│   │   │   └── interaction-demo.png
│   │   ├── videos/
│   │   │   └── feature-demo.mp4 (optional)
│   │   ├── builds/
│   │   │   ├── TimeBox-v0.4.03-build.apk (AVP)
│   │   │   └── Calendarium-v0.4.03-build.apk (Quest)
│   │   ├── changelog.md
│   │   └── contribution-summary.md
│   └── PROBLEM-YANG-002/
│       └── ...
```

#### Contribution Summary Template

```markdown
# PROBLEM-YANG-001: Zhong (中) UI - The Center Contract Interface

## Problem ID
PROBLEM-YANG-001

## Status
✅ COMPLETED

## Version
v0.4.03 → v0.4.04

## Date Range
2025-01-15 → 2025-02-28

## What Changed
- Added center contract interface UI
- Implemented navigation system
- Created 3D visualization components

## Visual Evidence
- [Screenshot 1: Overview](./screenshots/feature-overview.png)
- [Screenshot 2: Navigation](./screenshots/navigation.png)
- [Video Demo](./videos/feature-demo.mp4)

## Build Artifacts
- [AVP Build v0.4.04](./builds/TimeBox-v0.4.04-build.app)
- [Quest Build v0.4.04](./builds/Calendarium-v0.4.04-build.apk)

## Testing
- ✅ Tested on Apple Vision Pro
- ✅ Tested on Meta Quest 3
- ✅ Performance: 90fps average

## Git Commits (Related)
- Main repo commits that reference this problem
- Links to documentation updates

## Token Award
YANG-001 pending
```

---

## Universal Evaluation Checklist

For each contribution/progress update, evaluate:

### ✅ Core Requirements
- [ ] **Problem ID linked** - Clear PROBLEM-YIN/YANG-XXX reference
- [ ] **Status updated** - IN_PROGRESS → COMPLETED
- [ ] **Version documented** - Version number or commit hash
- [ ] **Date range** - When work started/completed

### ✅ Evidence Required (by project type)

**Unity Projects**:
- [ ] At least 2-3 screenshots showing progress
- [ ] Build artifact (working build)
- [ ] Changelog entry
- [ ] Video demo (optional but recommended)

**Web Projects**:
- [ ] Git commits with problem ID tags
- [ ] Working demo URL or localhost instructions
- [ ] Changelog entry
- [ ] Screenshots (if UI changed)

**Backend Projects**:
- [ ] Git commits with problem ID tags
- [ ] API documentation updates
- [ ] Test results
- [ ] Changelog entry

### ✅ Quality Indicators
- [ ] **Documentation** - Code/docs updated
- [ ] **Testing** - Tests written/passing
- [ ] **Integration** - Works with other components
- [ ] **Performance** - Meets performance targets

---

## Quarterly Review Evaluation Process

### Step 1: Collect Evidence (Week Before Review)

**For Unity Projects**:
```bash
# Create contribution package
mkdir -p yang/unity/contributions/$(date +%Y-Q%q)/PROBLEM-YANG-XXX
# Add screenshots, builds, changelog
# Create contribution-summary.md
```

**For Web/Backend Projects**:
```bash
# Run commit tracker
./zhong/tracking/commit-tracker.sh analyze --quarter 25Q1

# Review changelogs
cat yang/web/CHANGELOG.md
cat yin/nakama/CHANGELOG.md
```

### Step 2: Aggregate by Problem

For each problem (PROBLEM-YIN/YANG-XXX):
1. Collect all evidence (commits, screenshots, builds, docs)
2. Verify completion criteria met
3. Calculate contribution metrics
4. Prepare for token award evaluation

### Step 3: Evaluate Contribution Value

**Scoring Factors**:
- **Completion** (0-3 points): Was problem completed?
- **Quality** (0-3 points): Documentation, testing, performance
- **Evidence** (0-2 points): Screenshots, builds, demos
- **Impact** (0-2 points): How important was this problem?

**Total**: 0-10 points per problem

### Step 4: Token Award Decision

**Criteria for Token Award**:
- ✅ Problem marked COMPLETED
- ✅ Minimum 6/10 contribution score
- ✅ Evidence package complete
- ✅ Integration tested
- ✅ Documentation updated

---

## Most Effective Methods (Ranked)

### 1. **Changelogs** ⭐⭐⭐⭐⭐
**Why**: 
- Universal (works for all project types)
- Low effort to maintain
- Clear documentation of progress
- Easy to review

**Implementation**:
- Maintain CHANGELOG.md in each project
- Link to problem IDs
- Update with each feature/completion

### 2. **Screenshots/Videos** ⭐⭐⭐⭐⭐
**Why**:
- Essential for Unity (visual proof)
- Valuable for web (UI/UX changes)
- Shows actual user-facing progress
- Easy to review quickly

**Implementation**:
- Take 2-3 screenshots per feature
- Include before/after when applicable
- Store in contribution packages (Unity) or commit screenshots (Web)

### 3. **Git Commits** ⭐⭐⭐⭐
**Why**:
- Excellent for Web/Backend
- Full history and context
- Automatic metrics (lines changed, files)
- Links code to problems

**Implementation**:
- Tag commits with PROBLEM-YIN/YANG-XXX
- Use commit-tracker.sh for analysis
- Link commits in changelogs

### 4. **Build Artifacts** ⭐⭐⭐⭐
**Why**:
- Proves working implementation
- Can test/demo actual progress
- Essential for Unity
- Shows integration works

**Implementation**:
- Store builds in contribution packages
- Version builds with problem IDs
- Include test instructions

### 5. **Version Numbers** ⭐⭐⭐
**Why**:
- Simple progress indicator
- Ties to problem IDs
- Easy to track over time
- Universal

**Implementation**:
- Use semantic versioning
- Link versions to problems
- Document in changelogs

---

## Recommendations by Project Type

### Unity Projects (AVP, Quest)
**Use**: Screenshots + Builds + Changelogs
- Screenshots prove visual progress
- Builds prove working implementation
- Changelogs document changes
- Git commits less useful (projects not tracked)

### Web Projects (yang-web)
**Use**: Git Commits + Changelogs + Screenshots
- Git commits provide full history
- Changelogs document features
- Screenshots show UI changes
- Builds less critical (easy to deploy)

### Backend Projects (yin-nakama, etc.)
**Use**: Git Commits + API Docs + Tests
- Git commits show code contributions
- API docs show interface changes
- Tests prove functionality
- Screenshots not applicable

---

## Implementation Strategy

### Phase 1: Establish Standards (Now)
1. ✅ Create this evaluation guide
2. Create contribution package template for Unity
3. Update changelog templates with problem IDs
4. Establish screenshot/video standards

### Phase 2: Quarterly Integration (Next Review)
1. Collect evidence using new standards
2. Evaluate contributions with new criteria
3. Award tokens based on evidence
4. Refine process based on results

### Phase 3: Automation (Future)
1. Automate evidence collection where possible
2. Build contribution dashboard
3. Generate quarterly review reports
4. Link evidence to token awards

---

## Quick Reference

**For Unity Development**:
- ✅ Take 2-3 screenshots per feature
- ✅ Save build artifacts with version numbers
- ✅ Write changelog entries
- ✅ Create contribution-summary.md
- ✅ Store in `yang/unity/contributions/YYYY-QX/PROBLEM-XXX/`

**For Web Development**:
- ✅ Tag commits with PROBLEM-YANG-XXX
- ✅ Update CHANGELOG.md
- ✅ Take screenshots of UI changes
- ✅ Deploy/link working demos

**For Backend Development**:
- ✅ Tag commits with PROBLEM-YIN-XXX
- ✅ Update API documentation
- ✅ Write/update tests
- ✅ Document performance metrics

---

**Last Updated**: December 23, 2025  
**Maintained By**: Circaevum DAO - Zhong (中)

