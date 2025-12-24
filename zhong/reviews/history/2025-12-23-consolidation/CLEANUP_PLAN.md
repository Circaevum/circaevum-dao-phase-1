# Cleanup Plan: Remove Old Projects

## Strategy

**Everything not in `DAO/circaevum-dao-phase-1/` will be deleted.**

After final commits/pushes, we'll remove:
1. Old project locations (Active/, Claude/, etc.)
2. Large Vercel-generated prototypes
3. Unnecessary experimental projects

---

## Projects to Delete

### Old Locations (After Final Commit/Push)
- `Active/TimeBox/` → Now in `DAO/circaevum-dao-phase-1/yang/unity/avp/`
- `Active/Calendarium/` → Now in `DAO/circaevum-dao-phase-1/yang/unity/quest/`
- `Claude/circaevum-package/three-circa/` → Now in `DAO/circaevum-dao-phase-1/yang/web/`
- `ring_station_vr.tsx` → Now in `DAO/circaevum-dao-phase-1/yin/yang-seed/components/`

### Vercel Projects (Large/Unnecessary)
- `v0-temporal-uploads/`
- `v0-toggle-timelines/`
- `vercel-circa-01/`
- `vervel-config/`
- `vercel/`
- `circa-3d/`
- `circa-account-dashboard/`
- `circa-web/`
- `circa-turbo/`

### Cloudflare Experiments
- `cloudfare-nextjs/`
- `sundial-cloudfare-1/`
- `docusaurus2cloudfare/`

### Other Unnecessary
- `circaevum-landing 2/` (duplicate)
- `sundial-logo/` (just logo)
- `react-account-mgmt/` (duplicate)
- `circa-vercel/` (if not needed)
- `circaevum-landing/` (if not needed)

### Keep (Reference/Active)
- `DAO/circaevum-dao-phase-1/` ✅ **KEEP** (main repo)
- `Reference/` (if exists)
- `Archive/` (if exists)
- `Documentation/` (if exists)

---

## Cleanup Commands

### Step 1: Check Sizes
```bash
cd /Users/adamsauer/Documents/GitHub/CIR
du -sh v0-* vercel-* circa-* cloudfare-* docusaurus* sundial-* 2>/dev/null | sort -h
```

### Step 2: Delete Vercel Projects
```bash
rm -rf v0-temporal-uploads/
rm -rf v0-toggle-timelines/
rm -rf vercel-circa-01/
rm -rf vervel-config/
rm -rf vercel/
rm -rf circa-3d/
rm -rf circa-account-dashboard/
rm -rf circa-web/
rm -rf circa-turbo/
```

### Step 3: Delete Cloudflare Experiments
```bash
rm -rf cloudfare-nextjs/
rm -rf sundial-cloudfare-1/
rm -rf docusaurus2cloudfare/
```

### Step 4: Delete Other Unnecessary
```bash
rm -rf "circaevum-landing 2/"
rm -rf sundial-logo/
rm -rf react-account-mgmt/
```

### Step 5: Delete Old Locations (After Final Commit/Push)
```bash
# After you've committed/pushed these:
rm -rf Active/
rm -rf Claude/
rm -f ring_station_vr.tsx
```

---

## Safety Check

Before deleting, verify:
- [ ] All projects committed/pushed
- [ ] New locations in DAO repo work
- [ ] No important code in old locations
- [ ] Sizes match (roughly)

---

## Result

After cleanup:
- ✅ Only `DAO/circaevum-dao-phase-1/` remains
- ✅ All code consolidated
- ✅ No duplicates
- ✅ Clean repository

