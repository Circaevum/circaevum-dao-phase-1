#!/bin/bash
# Cleanup Script: Remove Old Project Locations
# Run this AFTER final commits/pushes to old locations

set -e

echo "=== Circaevum Cleanup Script ==="
echo ""
echo "This will DELETE:"
echo "  - Active/ (TimeBox, Calendarium)"
echo "  - Claude/ (three-circa)"
echo "  - ring_station_vr.tsx"
echo ""
echo "These are now in: DAO/circaevum-dao-phase-1/"
echo ""
read -p "Have you committed/pushed all changes? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted. Please commit/push first."
    exit 1
fi

echo ""
echo "Verifying new locations exist..."
if [ ! -d "DAO/circaevum-dao-phase-1/yang/unity/avp" ]; then
    echo "ERROR: DAO/circaevum-dao-phase-1/yang/unity/avp not found!"
    exit 1
fi

if [ ! -d "DAO/circaevum-dao-phase-1/yang/web" ]; then
    echo "ERROR: DAO/circaevum-dao-phase-1/yang/web not found!"
    exit 1
fi

echo "✅ New locations verified"
echo ""
echo "Deleting old locations..."

# Delete old project locations
if [ -d "Active" ]; then
    echo "  Deleting Active/..."
    rm -rf Active/
    echo "  ✅ Active/ deleted"
fi

if [ -d "Claude" ]; then
    echo "  Deleting Claude/..."
    rm -rf Claude/
    echo "  ✅ Claude/ deleted"
fi

if [ -f "ring_station_vr.tsx" ]; then
    echo "  Deleting ring_station_vr.tsx..."
    rm -f ring_station_vr.tsx
    echo "  ✅ ring_station_vr.tsx deleted"
fi

echo ""
echo "=== Cleanup Complete ==="
echo ""
echo "Remaining structure:"
echo "  - DAO/circaevum-dao-phase-1/ (main repo)"
echo "  - Archive/ (archived projects)"
echo "  - Reference/ (reference projects)"
echo "  - Documentation/ (documentation)"
echo ""
echo "All active code is now in DAO/circaevum-dao-phase-1/"

