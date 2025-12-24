# Markdown File Organization Methodology

**Purpose**: Prevent root directory inflation by establishing clear patterns for where markdown files belong.

---

## Core Principle

**Root directory should contain ONLY**:
- `README.md` - Main entry point
- `Addendum.md` - Legal/DAO structure
- `LICENSE` - Legal license

**Everything else goes in appropriate subdirectories.**

---

## File Categorization Rules

### 1. Session Notes & Work Logs
**Location**: `zhong/reviews/history/YYYY-MM-DD-description/`

**Examples**:
- `zhong/reviews/history/2025-12-23-consolidation/`
- `zhong/reviews/history/2026-01-15-q1-review/`
- `zhong/reviews/history/2026-02-01-unity-extraction/`

**What goes here**:
- Session summaries
- Cleanup logs
- Migration notes
- Implementation summaries
- Organization notes
- Temporary planning documents

**Pattern**: Create dated folder → Put all related markdown files inside → Reference from `zhong/reviews/CHANGELOG.md`

---

### 2. Handoff Documents
**Location**: `zhong/reviews/HANDOFF-YYYY-MM-DD.md` or consolidate into single `zhong/reviews/CONSOLIDATION-YYYY-MM-DD.md`

**What goes here**:
- Notes for future AI/developers
- Project state snapshots
- Quick start guides for specific work
- Context about decisions made

**Rule**: If multiple handoff files exist, consolidate into one dated file with clear sections.

---

### 3. Documentation
**Location**: `docs/` organized by category

**Structure**:
```
docs/
├── architecture/     # System architecture docs
├── guides/          # User/developer guides
├── philosophy/      # Philosophical/conceptual docs
├── examples/        # Example files, templates
├── reference/       # API references, setup guides
└── README.md        # Documentation index
```

**Examples**:
- Architecture decisions → `docs/architecture/`
- How-to guides → `docs/guides/`
- Example templates → `docs/examples/`
- API docs → `docs/reference/`

---

### 4. DAO Governance
**Location**: `zhong/dao/phase-1/` or `zhong/` subdirectories

**Examples**:
- Team roles → `zhong/dao/phase-1/TEAM_ROLES.md`
- Investment structure → `zhong/milestones/`
- Problem tracking → `zhong/problems/`
- Tracking guides → `zhong/tracking/`

---

### 5. Project-Specific Documentation
**Location**: Within project directories

**Examples**:
- `yang/web/README.md` - Web project docs
- `yang/unity/avp/README.md` - AVP project docs
- `yin/nakama/README.md` - Nakama backend docs
- `yang/web/docs/` - Web-specific documentation

**Rule**: Keep documentation close to the code it describes.

---

### 6. Examples & Templates
**Location**: `docs/examples/` with subdirectories by category

**Structure**:
```
docs/examples/
├── versioning/      # Versioning system examples
├── templates/       # Document templates
└── scenarios/       # Usage scenarios
```

---

## Decision Tree: Where Does My File Go?

1. **Is it a session/work log or temporary planning doc?**
   → `zhong/reviews/history/YYYY-MM-DD-description/`

2. **Is it a handoff/note for future developers?**
   → `zhong/reviews/HANDOFF-YYYY-MM-DD.md` (or consolidate into existing)

3. **Is it permanent documentation?**
   → `docs/` (architecture, guides, reference, examples, philosophy)

4. **Is it DAO governance related?**
   → `zhong/` subdirectories (dao/, milestones/, problems/, tracking/)

5. **Is it project-specific?**
   → Within project directory (yang/web/, yang/unity/, yin/nakama/, etc.)

6. **Is it a legal/essential entry point?**
   → Root (README.md, Addendum.md, LICENSE only)

---

## Naming Conventions

### Session/History Folders
- Format: `YYYY-MM-DD-description`
- Use lowercase, hyphens: `2025-12-23-consolidation`
- Be descriptive but concise

### Handoff Documents
- Format: `HANDOFF-YYYY-MM-DD.md` or `CONSOLIDATION-YYYY-MM-DD.md`
- Capital letters for clarity
- Include date for versioning

### Documentation Files
- UPPERCASE_WITH_UNDERSCORES.md (architecture, guides, reference)
- Or: lowercase-with-hyphens.md (examples, project-specific)
- Be consistent within each directory

---

## Cleanup Rules

### When to Clean Up
- After completing a major session/work
- When root directory has >5 markdown files (excluding README, Addendum, LICENSE)
- Quarterly during reviews

### Cleanup Process
1. Identify files by category
2. Move to appropriate location per rules above
3. Consolidate similar files (e.g., multiple handoff docs → one dated file)
4. Update references in README.md and other key files
5. Update `zhong/reviews/CHANGELOG.md` with cleanup entry

### What to Extract Before Moving
- Key decisions made
- Current state snapshots
- Important gotchas/lessons learned
- References to critical files/paths

---

## Anti-Patterns (Don't Do This)

❌ **Create multiple summary files in root**
- Instead: Consolidate into one dated document

❌ **Keep session notes in root**
- Instead: Move to `zhong/reviews/history/`

❌ **Duplicate content across files**
- Instead: Reference, don't repeat

❌ **Mix temporary and permanent docs**
- Instead: Separate by purpose (history/ vs docs/)

❌ **Create new organizational files in root**
- Instead: Use existing structure (zhong/, docs/, yang/, yin/)

---

## Maintenance

**Review Quarterly**:
- Check root directory for new markdown files
- Review `zhong/reviews/history/` for old sessions that can be archived
- Consolidate related documentation

**Reference This Document**:
- Before creating new markdown files
- During cleanup sessions
- When organizing new work

---

**Last Updated**: December 23, 2025  
**Maintained By**: This methodology should be referenced and followed for all future markdown file creation.

