# Circles Visualization Tool

## Overview

`circles.py` is a visualization tool for the Circaevum DAO's Yin-Yang circle model. It creates an interactive visualization of hexagonally packed circles representing the 37-circle structure used in the token system.

## The 37-Circle Model

The Circaevum DAO uses a hexagonal arrangement of 37 circles:
- **1 center circle** (Taiji Point - CEO/2.8%)
- **6 circles** in first ring (YANG/YIN tokens)
- **12 circles** in second ring
- **18 circles** in outer ring

Total: **37 circles** = 36 tokens (18 YANG + 18 YIN) + 1 Taiji Point

## Usage

```bash
cd zhong/tracking
python3 circles.py
```

This will display an interactive visualization where you can click circles to change their colors, representing different states (white, yellow, orange, black, gray).

## Requirements

```bash
pip install matplotlib numpy
```

## Customization

The script currently draws 1 ring (center + 6 circles = 7 total). To visualize the full 37-circle structure:

```python
# Change the last line:
hex_rings(2, circle_radius=1)  # For 3 rings total (37 circles)
```

Ring counts:
- `hex_rings(0)`: 1 circle (center)
- `hex_rings(1)`: 7 circles (center + 6)
- `hex_rings(2)`: 19 circles (center + 6 + 12)
- `hex_rings(3)`: 37 circles (center + 6 + 12 + 18)

## Purpose

This tool helps visualize:
- Token distribution in the DAO
- Yin-Yang balance
- The hexagonal packing structure
- Interactive exploration of the circle model

---

**Related Documentation**: See `zhong/dao/phase-1/` for DAO structure details

