# Decay Mechanics: Maintaining Active Participation

## Philosophy: Balance Through Activity

In Taiji philosophy, **Yin and Yang must be balanced**. Both represent active contribution (solving problems), so both require active participation to maintain value. Decay mechanics ensure that tokens remain aligned with ongoing contribution rather than becoming passive holdings.

---

## Decay Structure

### Tokens with Decay

| Token Type | Decay Trigger | Decay Rate | Protection Mechanism |
|------------|---------------|------------|---------------------|
| **YIN** | Inactive for 2+ quarters | 0.1% per quarter | Active contribution resets decay |
| **YANG** | Inactive for 2+ quarters | 0.1% per quarter | Active contribution resets decay |
| **Wu Wei** | Inactive governance participation | 0.1% per quarter | Voting/participation resets decay |

### Tokens Without Decay

| Token Type | Reason |
|------------|--------|
| **Zhong (中)** | Central coordination - stable center point, no decay |

---

## YIN Decay Mechanics

### Why YIN Decays

**Balance**: YIN and YANG must be balanced in Taiji philosophy. Both represent active contribution, so both should require active participation.

**Backend Work is Active**: While backend work is foundational, it's not passive. Backend systems require:
- Ongoing maintenance
- Updates and improvements
- Bug fixes and optimizations
- Integration with new systems

**Incentive Alignment**: Decay ensures YIN token holders remain engaged with backend development rather than holding tokens passively.

### Decay Rules

1. **Inactivity Threshold**: 2 quarters (6 months) without contribution
2. **Decay Rate**: 0.1% per quarter after threshold
3. **Minimum Value**: Decay stops at 1.0% (cannot go below)
4. **Reset Mechanism**: Any active contribution resets decay timer

### Example: YIN Token Decay

```
Initial: YIN token = 2.7% profit-sharing
Q1: Active contribution ✅ (no decay)
Q2: Active contribution ✅ (no decay)
Q3: No contribution ⚠️ (threshold reached)
Q4: No contribution → 2.6% (decay begins)
Q5: No contribution → 2.5% (continues)
Q6: Active contribution ✅ (decay resets to 2.7%)
```

---

## YANG Decay Mechanics

### Why YANG Decays

**Balance**: YANG must balance with YIN. Both require active participation.

**Frontend Work is Active**: Frontend work requires:
- Ongoing user feedback integration
- UI/UX improvements
- Feature updates
- Performance optimizations

**Incentive Alignment**: Decay ensures YANG token holders remain engaged with frontend development.

### Decay Rules

1. **Inactivity Threshold**: 2 quarters (6 months) without contribution
2. **Decay Rate**: 0.1% per quarter after threshold
3. **Minimum Value**: Decay stops at 1.0% (cannot go below)
4. **Reset Mechanism**: Any active contribution resets decay timer

### Example: YANG Token Decay

```
Initial: YANG token = 2.7% profit-sharing + 2.7% equity
Q1: Active contribution ✅ (no decay)
Q2: Active contribution ✅ (no decay)
Q3: No contribution ⚠️ (threshold reached)
Q4: No contribution → 2.6% profit + 2.6% equity
Q5: No contribution → 2.5% profit + 2.5% equity
Q6: Active contribution ✅ (decay resets to 2.7%)
```

---

## Wu Wei Decay Mechanics

### Why Wu Wei Decays

**Governance Participation**: Wu Wei holders are investors who should participate in governance decisions. Decay encourages active engagement.

**Long-term Alignment**: While Wu Wei receives annual distributions (long-term focus), governance participation ensures alignment with company direction.

### Decay Rules

1. **Inactivity Threshold**: 2 quarters (6 months) without governance participation (voting)
2. **Decay Rate**: 0.1% per quarter after threshold
3. **Minimum Value**: Decay stops at 1.0% (cannot go below)
4. **Reset Mechanism**: Voting in any governance decision resets decay timer

### Example: Wu Wei Token Decay

```
Initial: Wu Wei token = 2.7% profit-sharing + 2.7% equity
Q1: Voted on governance ✅ (no decay)
Q2: Voted on governance ✅ (no decay)
Q3: No voting ⚠️ (threshold reached)
Q4: No voting → 2.6% profit + 2.6% equity
Q5: No voting → 2.5% profit + 2.5% equity
Q6: Voted on governance ✅ (decay resets to 2.7%)
```

---

## Decay Protection Mechanisms

### Active Contribution Resets Decay

**For YIN/YANG**:
- Solving a problem (any size)
- Contributing code/design
- Participating in problem discussions
- Reviewing pull requests
- Testing and bug reporting

**For Wu Wei**:
- Voting on governance proposals
- Participating in quarterly meetings
- Providing strategic input
- Engaging with DAO discussions

### Decay Calculation

```javascript
function calculateDecay(token, quartersInactive) {
  if (quartersInactive < 2) {
    return 0; // No decay before threshold
  }
  
  const quartersDecayed = quartersInactive - 2;
  const decayAmount = quartersDecayed * 0.001; // 0.1% per quarter
  const minValue = 0.01; // 1.0% minimum
  
  return Math.max(0, Math.min(decayAmount, token.baseValue - minValue));
}
```

---

## Balance: Yin and Yang Together

### Perfect Reflection

**Taiji Balance**: Yin and Yang are complementary opposites that must be perfectly balanced. They reflect each other in every way:

**Identical Characteristics**:
- ✅ **Governance**: Both have voting rights
- ✅ **Equity**: Both have equity ownership (2.7% per token)
- ✅ **Profit-Sharing**: Both receive quarterly profit distributions
- ✅ **Decay**: Both decay at the same rate (0.1% per quarter)
- ✅ **Threshold**: Both have the same inactivity threshold (2 quarters)
- ✅ **Reset**: Both reset with active participation

**Result**: Perfect balance - Yin and Yang are true reflections of each other. Neither has an advantage. Both require ongoing engagement and both receive equal benefits.

---

## Comparison: Old vs New

| Aspect | Old Structure | New Structure (Balanced) |
|--------|---------------|--------------------------|
| **YIN Decay** | ❌ No | ✅ Yes (balanced with YANG) |
| **YANG Decay** | ✅ Yes | ✅ Yes (balanced with YIN) |
| **Balance** | ❌ Imbalanced | ✅ Balanced (Taiji principle) |
| **Incentive** | ❌ YIN can be passive | ✅ Both require activity |

---

## Implementation

### Quarterly Reconciliation

During quarterly reconciliation:
1. **Check Activity**: Review contributions for each token holder
2. **Calculate Decay**: Apply decay for inactive tokens
3. **Reset Timers**: Reset decay for active contributors
4. **Update Values**: Adjust profit-sharing percentages
5. **Notify Holders**: Inform token holders of decay status

### Example Reconciliation

```
Q1 2025 Reconciliation:

YIN Tokens:
- YIN-001: Active ✅ (no decay, 2.7%)
- YIN-002: Active ✅ (no decay, 2.7%)
- YIN-003: Inactive 3 quarters → 2.4% (decayed)

YANG Tokens:
- YANG-001: Active ✅ (no decay, 2.7%)
- YANG-002: Inactive 2 quarters → 2.6% (decay begins)

Wu Wei Tokens:
- WW-001: Voted ✅ (no decay, 2.7%)
- WW-002: No voting 3 quarters → 2.4% (decayed)
```

---

## Summary

**Balanced Decay Structure**:
- ✅ **YIN**: Decays if inactive (balanced with YANG)
- ✅ **YANG**: Decays if inactive (balanced with YIN)
- ✅ **Wu Wei**: Decays if governance inactive
- ✅ **Zhong**: No decay (stable center)

**Result**: Perfect Taiji balance - Yin and Yang behave similarly, requiring active participation to maintain value. Both decay at the same rate, maintaining harmony and alignment with ongoing contribution.

