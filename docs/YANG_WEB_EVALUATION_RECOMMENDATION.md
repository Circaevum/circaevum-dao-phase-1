# Yang-Web (Three.js) Contribution Evaluation Recommendation

## Context

The `yang-web` project (Three.js visualization) is newer and uses different tools than Unity projects. Since it's a web project tracked in git, we need evaluation methods that leverage git's strengths while still capturing visual progress.

---

## Recommended Evaluation Methods for yang-web

### Primary Methods (Required)

1. **Git Commits** ⭐⭐⭐⭐⭐
   - **Why**: Full commit history available in repository
   - **How**: Tag commits with `PROBLEM-YANG-XXX`
   - **Metrics**: Commit count, lines changed, files modified
   - **Benefit**: Automatic, detailed, auditable

2. **Changelog** ⭐⭐⭐⭐⭐
   - **Why**: Documents user-facing changes clearly
   - **How**: Update `yang/web/CHANGELOG.md` with each version
   - **Content**: Features added, bugs fixed, improvements
   - **Benefit**: Quick overview of progress

3. **Screenshots** ⭐⭐⭐⭐
   - **Why**: Visual proof of UI/UX changes
   - **How**: Take 2-3 screenshots per feature/version
   - **Storage**: Commit screenshots to `yang/web/screenshots/` or store in contribution package
   - **Benefit**: Shows actual visual progress

### Secondary Methods (Recommended)

4. **Working Demo URL** ⭐⭐⭐⭐
   - **Why**: Proves functionality works
   - **How**: Deploy to localhost or staging environment
   - **Documentation**: Include URL in changelog/commit message
   - **Benefit**: Can test actual implementation

5. **Test Coverage** ⭐⭐⭐
   - **Why**: Proves code quality and reliability
   - **How**: Write unit/integration tests
   - **Metrics**: Test coverage percentage
   - **Benefit**: Ensures maintainability

---

## Evaluation Workflow for yang-web

### For Each Version Iteration

1. **Development Phase**:
   ```bash
   # Work on feature
   git checkout -b feature/PROBLEM-YANG-004
   # ... make changes ...
   ```

2. **Documentation Phase**:
   ```bash
   # Take screenshots (2-3 showing the feature)
   # Update CHANGELOG.md
   # Write/update tests
   ```

3. **Commit Phase**:
   ```bash
   git add .
   git commit -m "PROBLEM-YANG-004 IN_PROGRESS: Three.js event renderer v1.0
   
   - Added event rendering system
   - Implemented zoom controls
   - Added time marker visualization
   
   Screenshots: screenshots/event-renderer-v1.0.png
   Version: v1.0.0
   Status: IN_PROGRESS"
   ```

4. **Completion Phase**:
   ```bash
   # Update status to COMPLETED
   git commit -m "PROBLEM-YANG-004 COMPLETED: Three.js event renderer v1.0.1
   
   - Completed event rendering system
   - Added tests (95% coverage)
   - Updated documentation
   - Deployed to localhost:8080
   
   Screenshots: screenshots/event-renderer-v1.0.1-*.png
   Version: v1.0.1
   Status: COMPLETED
   Tests: Yes (95% coverage)
   Demo: http://localhost:8080"
   ```

---

## Contribution Package Structure for yang-web

While git commits are primary, optional contribution packages can help with quarterly reviews:

```
yang/web/contributions/
└── 2025-Q2/
    └── PROBLEM-YANG-004/
        ├── screenshots/
        │   ├── event-renderer-v1.0.0-overview.png
        │   ├── event-renderer-v1.0.0-zoom.png
        │   └── event-renderer-v1.0.1-complete.png
        ├── changelog-entry.md
        └── contribution-summary.md
```

**Note**: Unlike Unity projects, git commits serve as the primary contribution package. The contribution folder is optional and mainly for organizing screenshots and summary documents for quarterly reviews.

---

## Evaluation Criteria for yang-web

### Completion Criteria (for Token Award)

- ✅ Problem marked COMPLETED in commit/changelog
- ✅ Minimum 5 commits addressing the problem
- ✅ Working demo available (localhost or deployed)
- ✅ Screenshots showing the feature (2-3 minimum)
- ✅ Changelog entry updated
- ✅ Documentation updated
- ✅ Tests written (recommended: 70%+ coverage)

### Contribution Scoring (0-10 points)

- **Completion** (0-3): Was problem completed?
- **Git Activity** (0-2): Commits, lines changed, files modified
- **Visual Evidence** (0-2): Screenshots, working demo
- **Quality** (0-2): Tests, documentation
- **Integration** (0-1): Works with other components

---

## Example: PROBLEM-YANG-004 Evaluation

### Version Iterations

**v1.0.0** (IN_PROGRESS):
- Git commits: 12 commits, 380 lines, 15 files
- Screenshots: 2 (overview, zoom controls)
- Changelog: Updated
- Tests: Partial (50% coverage)
- Demo: http://localhost:8080
- **Score**: 7/10

**v1.0.1** (COMPLETED):
- Git commits: 8 commits, 150 lines, 5 files
- Screenshots: 3 (complete feature set)
- Changelog: Updated
- Tests: Complete (95% coverage)
- Demo: http://localhost:8080
- Documentation: Updated
- **Score**: 9/10
- **Token Award**: YANG-004 ✅

---

## Comparison: Unity vs Web Evaluation

| Aspect | Unity Projects | Web Projects (yang-web) |
|--------|---------------|------------------------|
| **Primary Evidence** | Screenshots + Builds | Git Commits |
| **Secondary Evidence** | Build Artifacts | Screenshots + Changelog |
| **Tertiary Evidence** | Changelog | Working Demo + Tests |
| **Version Tracking** | Build version numbers | Git tags + Semantic versioning |
| **Storage** | Contribution packages | Git repository |
| **Automation** | Manual collection | Git-based (automatic metrics) |

---

## Recommendations Summary

### For yang-web Specifically:

1. **Leverage Git** ✅
   - Use git commits as primary evidence
   - Tag commits with PROBLEM-YANG-XXX
   - Use commit-tracker.sh for metrics

2. **Visual Documentation** ✅
   - Take 2-3 screenshots per version
   - Store in `yang/web/screenshots/` or commit to git
   - Include in contribution summary for quarterly reviews

3. **Semantic Versioning** ✅
   - Use semantic versioning (v1.0.0, v1.0.1, etc.)
   - Link versions to problem IDs
   - Document in CHANGELOG.md

4. **Working Demos** ✅
   - Always have a working demo URL
   - Document in commit messages and changelog
   - Use localhost:8080 or staging environment

5. **Quality Indicators** ✅
   - Write tests (aim for 70%+ coverage)
   - Update documentation
   - Ensure integration works

---

## Quick Start Checklist for yang-web Contributions

When working on a YANG problem for yang-web:

- [ ] Create feature branch: `feature/PROBLEM-YANG-XXX`
- [ ] Tag commits with problem ID
- [ ] Take 2-3 screenshots showing progress
- [ ] Update `yang/web/CHANGELOG.md`
- [ ] Write/update tests
- [ ] Ensure demo works (localhost:8080)
- [ ] Update documentation
- [ ] Commit with descriptive message including:
  - Problem ID
  - Status (IN_PROGRESS/COMPLETED)
  - Version number
  - Screenshot references
  - Demo URL (if applicable)

---

**Last Updated**: December 23, 2025  
**Applies To**: yang-web (Three.js visualization project)

