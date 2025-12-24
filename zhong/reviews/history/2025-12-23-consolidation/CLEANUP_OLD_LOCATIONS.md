# Cleanup Plan: Old File Locations

## Current Situation

Files were **COPIED** (not moved) during consolidation. Original locations still exist:

### Original Locations (Still Exist)

1. **Web Project**:
   - `Claude/circaevum-package/three-circa/` → Still exists
   - Copied to: `DAO/circaevum-dao-phase-1/yang/web/`

2. **TimeBox (AVP)**:
   - `Active/TimeBox/` → Still exists
   - Copied to: `DAO/circaevum-dao-phase-1/yang/unity/avp/`

3. **Calendarium (Quest)**:
   - `Active/Calendarium/` → Still exists (if it existed)
   - Copied to: `DAO/circaevum-dao-phase-1/yang/unity/quest/`

4. **Ring Station**:
   - `ring_station_vr.tsx` → Still exists
   - Copied to: `DAO/circaevum-dao-phase-1/yin/yang-seed/components/RingStationVisualization.tsx`

---

## Options

### Option 1: Keep Both (Safe)

**Pros**:
- ✅ Backup in case something goes wrong
- ✅ Can reference old structure
- ✅ No risk of data loss

**Cons**:
- ❌ Duplicate files
- ❌ Confusion about which is current
- ❌ Takes up space

### Option 2: Archive Old Locations

**Action**: Move old locations to an `Archive/` folder

**Pros**:
- ✅ Keeps backup
- ✅ Clear that new location is current
- ✅ Can reference if needed

**Cons**:
- ⚠️ Still takes up space
- ⚠️ Need to remember where archive is

### Option 3: Delete Old Locations (Risky)

**Action**: Delete original locations after verifying new locations work

**Pros**:
- ✅ No duplicates
- ✅ Clear single source of truth
- ✅ Saves space

**Cons**:
- ❌ Risk of data loss if something went wrong
- ❌ Can't reference old structure easily

---

## Recommended: Option 2 (Archive)

### Steps

1. **Verify new locations work**:
   ```bash
   # Test that files are accessible in new locations
   cd DAO/circaevum-dao-phase-1
   # Verify structure, test builds, etc.
   ```

2. **Create Archive folder**:
   ```bash
   cd /Users/adamsauer/Documents/GitHub/CIR
   mkdir -p Archive/2025-Q1-consolidation
   ```

3. **Move old locations to Archive**:
   ```bash
   # Archive web project
   mv Claude/circaevum-package/three-circa Archive/2025-Q1-consolidation/
   
   # Archive TimeBox
   mv Active/TimeBox Archive/2025-Q1-consolidation/
   
   # Archive Calendarium (if exists)
   mv Active/Calendarium Archive/2025-Q1-consolidation/ 2>/dev/null || echo "Calendarium not found"
   
   # Archive ring_station_vr.tsx
   mv ring_station_vr.tsx Archive/2025-Q1-consolidation/ 2>/dev/null || echo "ring_station_vr.tsx not found"
   ```

4. **Create Archive README**:
   ```markdown
   # Archive: Pre-Consolidation (Q1 2025)
   
   These files were moved to `DAO/circaevum-dao-phase-1/` during consolidation.
   
   **New Locations**:
   - `three-circa/` → `DAO/circaevum-dao-phase-1/yang/web/`
   - `TimeBox/` → `DAO/circaevum-dao-phase-1/yang/unity/avp/`
   - `Calendarium/` → `DAO/circaevum-dao-phase-1/yang/unity/quest/`
   - `ring_station_vr.tsx` → `DAO/circaevum-dao-phase-1/yin/yang-seed/components/RingStationVisualization.tsx`
   
   **Date**: March 2025
   ```

---

## Verification Checklist

Before deleting/archiving, verify:

- [ ] New locations have all files
- [ ] File sizes match (roughly)
- [ ] Git history preserved (if needed)
- [ ] Builds work from new locations
- [ ] No broken references
- [ ] Documentation updated

---

## Quick Commands

### Check File Counts
```bash
# Compare file counts
find Active/TimeBox -type f | wc -l
find DAO/circaevum-dao-phase-1/yang/unity/avp -type f | wc -l
```

### Check Sizes
```bash
du -sh Active/TimeBox
du -sh DAO/circaevum-dao-phase-1/yang/unity/avp
```

### Archive (Safe)
```bash
cd /Users/adamsauer/Documents/GitHub/CIR
mkdir -p Archive/2025-Q1-consolidation
mv Claude/circaevum-package/three-circa Archive/2025-Q1-consolidation/
mv Active/TimeBox Archive/2025-Q1-consolidation/
```

---

## Recommendation

**Archive the old locations** after verifying new locations work. This:
- ✅ Keeps backup
- ✅ Makes it clear new location is current
- ✅ Can reference if needed
- ✅ Low risk

**Timeline**: Archive after you've verified the new structure works for a few days/weeks.

