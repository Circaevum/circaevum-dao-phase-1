# Dual Versioning System

## Overview
The Circaevum DAO uses a dual versioning system that provides both simplicity and detail:

### **Semantic Version (simplified)**: `vYY.Q.TT` (Calendar-based)
- **YY** = Year (two digits)
- **Q** = Quarter number (1-4)
- **TT** = TAIJI level (00-09)
  - Example: `v25.3.08` (2025 Q3, TAIJI 8)

### **Detailed Context (subject/body)**: `<YANG_new>-<YANG_upkeep>-<YANG_center> <TAIJI> <YIN_new>-<YIN_upkeep>-<YIN_center>`
- Example subject: `v25.3.08 001000-000000-0 8 027000-000000-0 API Gateway Enhancement`
- Both YANG and YIN use a 6-6-1 code; TAIJI is a single digit between them.

## TAIJI as Unifying Factor

The TAIJI point serves as the **unifying factor** between both version formats:

### **Semantic Version**: `v(t) = 0.4.08[25Q3]`
- TAIJI (08) = Coordination level
- Shows integration/coordination maturity

### **Detailed Version**: `v(t) log = 0.4.08[25Q3] 2003000-002000-2 7 2027000-003000-2`
- TAIJI (7) = Same coordination level in both semantic and detailed
- Provides full context of all progress sections including lone dots

## Quarterly Progression Example

### **Q1 2025: Foundation**

#### **Week-by-Week Progression**
```
Week 1:  v(t) = 0.4.00[25Q1]     v25.1.0 000000-000000-0 0 000000-000000-0      (Initial state)
Week 2:  v(t) = 0.4.03[25Q1]     v25.1.3 100400-000000-0 3 100400-000000-0      (YANG-001@1:4, YIN-001@38:4, TAIJI-001@37:3)
Week 3:  v(t) = 0.4.06[25Q1]     v25.1.6 100900-000000-0 6 100800-000000-0      (Added YIN-002@39:4, YANG-001@1:5, TAIJI-001@37:3)
Week 4:  v(t) = 0.4.10[25Q1]    v25.1.10 101600-000000-0 10 101400-000000-0    (YANG-001@1:7, TAIJI-001@37:4, YIN-001@38:6, YIN-002@39:5)
Week 5:  v(t) = 0.4.15[25Q1]    v25.1.15 102400-000000-0 15 101800-000000-0    (Added YIN-003@40:4, YANG-001@1:8, TAIJI-001@37:5)
Week 6:  v(t) = 0.4.21[25Q1]    v25.1.21 103300-000000-0 21 102200-000000-0    (Added YIN-004@41:4, YANG-001@1:9, TAIJI-001@37:6)
Week 7:  v(t) = 0.4.30[25Q1]    v25.1.30 104200-000000-0 30 103100-000000-0    (All completed: YANG-001@1:9, TAIJI-001@37:9, YIN-001@38:9, YIN-002@39:9, YIN-003@40:9)
```

### **Q2 2025: Features**

#### **Week-by-Week Progression**
```
Week 8:  v25.2.0     v25Q2.0.0.0      (Quarter reset - new features start)
Week 9:  v25.2.4     v25Q2.4.0.4      (YANG-002@2:4 - ISS Data Pod Visualization)
Week 10: v25.2.8     v25Q2.8.4.8      (Added YIN-004@41:4 - Mobile optimization)
Week 11: v25.2.12    v25Q2.12.8.12    (YANG-002@2:4, YIN-004@41:4, TAIJI-002@37:4)
Week 12: v25.2.16    v25Q2.16.12.16   (YANG-003@3:4, YIN-005@42:4, TAIJI-002@37:4)
Week 13: v25.2.20    v25Q2.20.16.20   (YANG-002@2:4, YIN-004@41:4, TAIJI-002@37:4)
Week 14: v25.2.24    v25Q2.24.20.24   (YANG-003@3:4, YIN-005@42:4, TAIJI-002@37:4)
Week 15: v25.2.28    v25Q2.28.24.28   (YANG-002@2:4, YIN-004@41:4, TAIJI-002@37:4)
Week 16: v25.2.32    v25Q2.32.28.32   (YANG-003@3:4, YIN-005@42:4, TAIJI-002@37:4)
Week 17: v25.2.36    v25Q2.36.32.36   (YANG-002@2:4, YIN-004@41:4, TAIJI-002@37:4)
Week 18: v25.2.40    v25Q2.40.36.40   (YANG-003@3:4, YIN-005@42:4, TAIJI-002@37:4)
Week 19: v25.2.44    v25Q2.44.40.44   (YANG-002@2:4, YIN-004@41:4, TAIJI-002@37:4)
Week 20: v25.2.48    v25Q2.48.44.48   (YANG-003@3:4, YIN-005@42:4, TAIJI-002@37:4)
```

### **Q3 2025: Integration**

#### **Week-by-Week Progression**
```
Week 21: v25.3.0     v25Q3.0.0.0      (Quarter reset - integration focus)
Week 22: v25.3.4     v25Q3.4.4.4      (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 23: v25.3.8     v25Q3.8.8.8      (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 24: v25.3.12    v25Q3.12.12.12   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 25: v25.3.16    v25Q3.16.16.16   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 26: v25.3.20    v25Q3.20.20.20   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 27: v25.3.24    v25Q3.24.24.24   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 28: v25.3.28    v25Q3.28.28.28   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 29: v25.3.32    v25Q3.32.32.32   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 30: v25.3.36    v25Q3.36.36.36   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 31: v25.3.40    v25Q3.40.40.40   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 32: v25.3.44    v25Q3.44.44.44   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
Week 33: v25.3.48    v25Q3.48.48.48   (YANG-004@4:4, YIN-006@43:4, TAIJI-002@37:4)
```

## Git Log Integration

### **Commit Message Format**
```
🔧YIN-004🔄🌳@41:6 Mobile optimization testing

- Problem: PROBLEM-YIN-004
- Action: IN_PROGRESS
- Branch: main
- Dot Position: 41
- Contribution: 6
- Token: YIN-004
- Quarter: 25Q3
- Semantic Version: v(t) = 0.4.08[25Q3]
- Detailed Version: v25Q3.3000.27000.7
- Dot Progress: 25Q3 2-003000-002000 7 2-027000-003000
```

### **Git Log Display**
```
$ git log --oneline
* mno3456 v25.3.08 001000-000000-0 8 027000-000000-0 API Gateway Enhancement
* abc1234 v25.3.07 001000-000000-0 7 026000-000000-0 Integration planning
```

## Benefits of Dual Versioning

### **1. Semantic Version Benefits**
- **Standard**: Follows familiar `MAJOR.MINOR.PATCH` convention
- **Simple**: Easy to read and understand at a glance
- **Temporal**: Clear time-based progression
- **TAIJI Focus**: Emphasizes coordination/integration maturity

### **2. Detailed Version Benefits**
- **Complete Context**: Shows all progress components
- **Commit History**: Rich information for detailed tracking
- **Progress Analysis**: Full breakdown of YANG/YIN/TAIJI contributions
- **Debugging**: Helps identify specific areas of development

### **3. TAIJI Unification**
- **Consistent**: Same TAIJI value in both versions
- **Coordination Focus**: Emphasizes the importance of integration
- **Quality Indicator**: Higher TAIJI = better coordination
- **Cross-Reference**: Easy to correlate between versions

## Version Evolution Patterns

### **Quarterly Reset Pattern**
```
Q1: v25.1.30 → v25.2.0     (Foundation → Features)
Q2: v25.2.48 → v25.3.0     (Features → Integration)
Q3: v25.3.48 → v25.4.0     (Integration → Enterprise)
Q4: v25.4.48 → v26.1.0     (Enterprise → New Year)
```

### **TAIJI Progression**
- **0-3**: Initial coordination
- **4-6**: Active integration
- **7-9**: Mature coordination
- **9**: Fully integrated system

### **Development Focus**
- **Q1**: Foundation (TAIJI 0-9)
- **Q2**: Features (TAIJI 0-9)
- **Q3**: Integration (TAIJI 0-9)
- **Q4**: Enterprise (TAIJI 0-9)

This dual versioning system provides the best of both worlds: simplicity for quick reference and detail for comprehensive tracking, with TAIJI serving as the unifying factor that emphasizes the importance of coordination and integration in the Circaevum DAO development process!
