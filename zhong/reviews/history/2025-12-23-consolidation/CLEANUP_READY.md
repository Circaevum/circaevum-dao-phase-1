# Cleanup Ready: Delete Old Locations

## Status: Ready to Clean

After you commit/push final changes to old locations, run the cleanup script.

---

## What Will Be Deleted

### Old Project Locations
- **Active/** (8.2GB)
  - `TimeBox/` → Now in `DAO/circaevum-dao-phase-1/yang/unity/avp/`
  - `Calendarium/` → Now in `DAO/circaevum-dao-phase-1/yang/unity/quest/`

- **Claude/** (1.0M)
  - `circaevum-package/three-circa/` → Now in `DAO/circaevum-dao-phase-1/yang/web/`

- **ring_station_vr.tsx**
  - → Now in `DAO/circaevum-dao-phase-1/yin/yang-seed/components/RingStationVisualization.tsx`

**Total to delete**: ~8.2GB

---

## What Stays

✅ **DAO/circaevum-dao-phase-1/** - Main consolidated repo
✅ **Archive/** - Already archived Vercel projects (2.9GB)
✅ **Reference/** - Reference projects (683M)
✅ **Documentation/** - Documentation projects (423M)

---

## Steps

### 1. Final Commits/Pushes

```bash
# Commit/push TimeBox
cd Active/TimeBox
git add .
git commit -m "Final commit before consolidation to DAO repo"
git push

# Commit/push Calendarium (if it has git)
cd ../Calendarium
# ... commit/push if needed

# Commit/push three-circa (if it has git)
cd ../../Claude/circaevum-package/three-circa
# ... commit/push if needed
```

### 2. Verify New Locations

```bash
cd /Users/adamsauer/Documents/GitHub/CIR
ls -la DAO/circaevum-dao-phase-1/yang/unity/avp/
ls -la DAO/circaevum-dao-phase-1/yang/web/
```

### 3. Run Cleanup Script

```bash
cd /Users/adamsauer/Documents/GitHub/CIR
./cleanup.sh
```

The script will:
- Ask for confirmation
- Verify new locations exist
- Delete old locations
- Show summary

---

## Manual Cleanup (Alternative)

If you prefer to delete manually:

```bash
cd /Users/adamsauer/Documents/GitHub/CIR

# Delete old locations
rm -rf Active/
rm -rf Claude/
rm -f ring_station_vr.tsx
```

---

## Result

After cleanup:
- ✅ Only `DAO/circaevum-dao-phase-1/` contains active code
- ✅ All old locations removed
- ✅ ~8.2GB freed up
- ✅ Clean, consolidated repository

---

## Safety

The cleanup script:
- ✅ Verifies new locations exist before deleting
- ✅ Asks for confirmation
- ✅ Only deletes specified old locations
- ✅ Doesn't touch Archive/, Reference/, Documentation/

**Note**: The Archive/ folder already contains all the Vercel projects, so they're safe.

---

**Ready when you are!** 🚀

