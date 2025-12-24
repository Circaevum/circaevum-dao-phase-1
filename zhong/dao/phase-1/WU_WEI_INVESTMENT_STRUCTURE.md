# Wu Wei (无为) Investment Token Structure

## Philosophy: Effortless Action

**Wu Wei** (无为) means "effortless action" or "non-action" - action that happens naturally without forcing. In the context of investment:

- **Investors provide capital** (effortless from the company's perspective - no direct labor required)
- **Capital flows naturally** into the company (like water flowing downhill)
- **Investment enables growth** without requiring active contribution from investors
- **Balance**: Investors balance against active contributors (YIN/YANG)

---

## Current Structure Analysis

### Current Wu Wei Design (Issues)

| Aspect | Current | Problem |
|--------|---------|---------|
| **Profit-Sharing** | ❌ No | Investors don't benefit from profits - not intuitive |
| **Equity** | ✅ Yes | Good - they own part of the company |
| **Governance** | ✅ Yes | Good - they can vote |
| **Decay** | ✅ Yes (dilution) | Makes sense - inactive investors dilute |

**Problem**: Investors provide capital but don't get profit-sharing. This is counterintuitive - why invest if you don't share in profits?

---

## Proposed Wu Wei Structure

### Option 1: Investment Milestones (Recommended)

**Concept**: Each Wu Wei token represents a **specific investment milestone** (e.g., $50k, $100k, $250k, etc.)

**Structure**:
- **18 Wu Wei tokens** = 18 investment milestones
- Each token represents a **funding round** or **investment threshold**
- Tokens are **awarded** when investment milestones are reached
- Tokens can be **purchased** by investors at each milestone

**Benefits**:
- ✅ **Intuitive**: Clear investment milestones
- ✅ **Scalable**: Can adjust milestone amounts as company grows
- ✅ **Transparent**: Each token = specific investment amount
- ✅ **Flexible**: Different investors can participate at different milestones

**Token Characteristics**:
| Token Type | Percentage Cap | # of Tokens | Governance? | Equity? | Profit-Sharing? | Decay Mechanic? |
|------------|----------------|-------------|-------------|---------|-----------------|-----------------|
| Zhong (中) | 2.8% | 1 | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No |
| YANG | 2.7% | 18 | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (if inactive) |
| YIN | 2.7% | 18 | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (if inactive) |
| Wu Wei | 2.7% | 18 | ✅ Yes | ✅ Yes | ✅ Yes (long-term) | ✅ Yes (if inactive) |

**Profit-Sharing Mechanism**:
- **Quarterly Distributions**: Wu Wei holders receive profit-sharing
- **Long-term Focus**: Profit-sharing is **accumulated** and distributed annually (vs quarterly for YIN/YANG)
- **Equity Appreciation**: Wu Wei holders benefit from equity value growth
- **Decay Protection**: Active investors (participating in governance) maintain full value

---

### Option 2: Investment Tiers

**Concept**: Wu Wei tokens represent **investment tiers** (Seed, Series A, Series B, etc.)

**Structure**:
- **18 Wu Wei tokens** = 18 investment tiers
- Each tier has a **minimum investment amount**
- Tokens are **purchased** at each tier level
- Higher tiers get **preferential profit-sharing rates**

**Tier Example**:
- **Tier 1-6**: Seed Round ($10k-$50k per token)
- **Tier 7-12**: Series A ($50k-$250k per token)
- **Tier 13-18**: Series B+ ($250k+ per token)

**Benefits**:
- ✅ **Clear Tiers**: Investors know what they're buying into
- ✅ **Scalable**: Can add more tiers as company grows
- ✅ **Incentivizes Larger Investments**: Higher tiers get better rates

---

### Option 3: Investment Pools

**Concept**: Wu Wei tokens represent **investment pools** that accumulate capital

**Structure**:
- **18 Wu Wei tokens** = 18 investment pools
- Each pool has a **target amount** (e.g., $100k per pool)
- Investors contribute to pools
- Pools are **filled sequentially** (Pool 1, then Pool 2, etc.)
- Each filled pool = 1 Wu Wei token distributed proportionally

**Benefits**:
- ✅ **Collective Investment**: Multiple investors can contribute to same pool
- ✅ **Proportional Distribution**: Tokens distributed based on contribution
- ✅ **Clear Progress**: Easy to see which pools are filled

---

## Recommended: Option 1 (Investment Milestones)

### Implementation

**18 Investment Milestones** (Tier-Based System):

**Seed Tier (Tokens 1-6)** - Active Now:
1. **WW-001**: $25,000 - Initial seed funding
2. **WW-002**: $50,000 - Product development
3. **WW-003**: $75,000 - Team expansion
4. **WW-004**: $100,000 - Infrastructure setup
5. **WW-005**: $150,000 - Marketing launch
6. **WW-006**: $200,000 - Seed round complete

**Growth Tier (Tokens 7-12)** - Unlocks at $200k+ or $5M valuation:
7. **WW-007**: $250,000 - Series A start
8. **WW-008**: $350,000 - Growth acceleration
9. **WW-009**: $500,000 - Market expansion
10. **WW-010**: $750,000 - Team scaling
11. **WW-011**: $1,000,000 - Product maturity
12. **WW-012**: $1,500,000 - Growth round complete

**Scale Tier (Tokens 13-18)** - Unlocks at $1.5M+ or $20M valuation:
13. **WW-013**: $2,000,000 - Series B start
14. **WW-014**: $3,000,000 - Market leadership
15. **WW-015**: $5,000,000 - Global expansion
16. **WW-016**: $7,500,000 - Enterprise focus
17. **WW-017**: $10,000,000 - Scale acceleration
18. **WW-018**: $15,000,000+ - Scale round complete

**Flexibility**: Milestones can be adjusted annually based on company valuation, growth rate, and DAO governance vote. See `INVESTMENT_MILESTONE_SYSTEM.md` for details.

**Token Distribution**:
- Each milestone reached = 1 Wu Wei token available
- Token can be **purchased** by investor(s) who funded that milestone
- If multiple investors fund a milestone, tokens are distributed proportionally
- Tokens can be **transferred** or **sold** (with DAO approval)

**Profit-Sharing**:
- **Annual Distribution**: Wu Wei holders receive profit-sharing **annually** (vs quarterly for YIN/YANG)
- **Accumulation**: Quarterly profits are **accumulated** and distributed at year-end
- **Rate**: Same percentage as YIN/YANG (2.7% per token), but annual vs quarterly
- **Long-term Focus**: Encourages long-term investment thinking

**Governance**:
- ✅ **Voting Rights**: Wu Wei holders can vote on governance decisions
- ✅ **Investment Decisions**: Wu Wei holders vote on how to use invested capital
- ✅ **Strategic Direction**: Can influence company strategy

**Equity**:
- ✅ **Ownership**: Each Wu Wei token = 2.7% equity
- ✅ **Appreciation**: Equity value grows with company value
- ✅ **Transferable**: Tokens can be transferred/sold (with DAO approval)

**Decay Protection**:
- **Active Participation**: Investors who participate in governance maintain full value
- **Inactive Investors**: Tokens held by inactive investors can be diluted (reduced percentage)
- **Mechanism**: If investor doesn't vote for 2+ quarters, their token percentage can be reduced by 0.1% per quarter (minimum 1.0%)

---

## Updated Token Structure

### Complete Token Breakdown

| Token Type | Percentage Cap | # of Tokens | Governance? | Equity? | Profit-Sharing? | Distribution? | Decay? |
|------------|----------------|-------------|-------------|---------|-----------------|---------------|--------|
| **Zhong (中)** | 2.8% | 1 | ✅ Yes | ✅ Yes | ✅ Yes | Quarterly | ❌ No |
| **YANG** | 2.7% | 18 | ✅ Yes | ✅ Yes | ✅ Yes | Quarterly | ✅ Yes (if inactive) |
| **YIN** | 2.7% | 18 | ❌ No | ❌ No | ✅ Yes | Quarterly | ❌ No |
| **Wu Wei** | 2.7% | 18 | ✅ Yes | ✅ Yes | ✅ Yes | **Annual** | ✅ Yes (if inactive) |

**Key Differences**:
- **YIN**: Governance, equity, quarterly profit-sharing (backend contributors) - **decay if inactive** (balanced with YANG)
- **YANG**: Governance, equity, quarterly profit-sharing (frontend contributors) - **decay if inactive** (balanced with YIN)
- **Wu Wei**: Governance, equity, **annual** profit-sharing (investors - long-term focus) - **decay if inactive**
- **Zhong**: Central coordination, all benefits, no decay (stable center)

**YIN and YANG are perfectly balanced**: Both have identical governance rights, equity, profit-sharing, and decay mechanics. They reflect each other in every way, maintaining Taiji balance.

---

## Investment Flow

### How Investors Participate

1. **Identify Milestone**: Company identifies next investment milestone (e.g., $250k)
2. **Announce**: DAO announces milestone and token availability
3. **Investment**: Investor(s) provide capital to reach milestone
4. **Token Award**: Wu Wei token(s) awarded to investor(s) proportionally
5. **Governance**: Investor receives voting rights and equity
6. **Annual Distribution**: Investor receives profit-sharing annually

### Example: Milestone 7 ($250k)

- **Target**: $250k investment
- **Investor A**: Contributes $150k (60%)
- **Investor B**: Contributes $100k (40%)
- **Token Distribution**:
  - Investor A: 0.6 Wu Wei tokens (1.62% equity, 1.62% profit-sharing)
  - Investor B: 0.4 Wu Wei tokens (1.08% equity, 1.08% profit-sharing)
- **Or**: Full token to primary investor, fractional tokens to others

---

## Benefits of This Structure

1. **Intuitive for Investors**:
   - ✅ Clear investment milestones
   - ✅ Profit-sharing (annual, long-term focus)
   - ✅ Equity ownership
   - ✅ Governance participation

2. **Balanced with Contributors**:
   - ✅ YIN/YANG get quarterly distributions (active work)
   - ✅ Wu Wei gets annual distributions (passive investment)
   - ✅ Both benefit from company growth

3. **Long-term Alignment**:
   - ✅ Annual distributions encourage long-term thinking
   - ✅ Equity appreciation rewards patient capital
   - ✅ Governance participation maintains engagement

4. **Flexible and Scalable**:
   - ✅ Milestone amounts can adjust as company grows
   - ✅ Multiple investors can participate per milestone
   - ✅ Tokens can be transferred/sold (with approval)

---

## Comparison: Old vs New

| Aspect | Old Wu Wei | New Wu Wei |
|--------|-----------|------------|
| **Profit-Sharing** | ❌ No | ✅ Yes (annual) |
| **Intuitive?** | ❌ No | ✅ Yes |
| **Investment Clarity** | ❌ Vague | ✅ Clear milestones |
| **Long-term Focus** | ❌ No mechanism | ✅ Annual distributions |
| **Investor Benefit** | ❌ Limited | ✅ Full participation |

---

## Implementation Notes

### Smart Contract Updates

- Update Wu Wei token to include profit-sharing mechanism
- Add annual distribution schedule (vs quarterly)
- Implement milestone tracking
- Add decay protection for active investors

### Documentation Updates

- Update README.md with new Wu Wei structure
- Create investment milestone tracker
- Document profit-sharing schedule
- Explain long-term vs short-term distributions

### Governance Updates

- Define investment milestone amounts
- Establish token distribution rules
- Set profit-sharing rates
- Define decay protection criteria

---

## Summary

**Zhong (中)** = The Center Contract (1 token, central coordination)

**Wu Wei (无为)** = Investment Milestones (18 tokens, effortless capital flow)
- ✅ **Profit-Sharing**: Annual distributions (long-term focus)
- ✅ **Equity**: 2.7% per token
- ✅ **Governance**: Voting rights
- ✅ **Milestones**: Clear investment thresholds
- ✅ **Decay Protection**: Active investors maintain full value

**Result**: Intuitive investment structure that balances passive capital (Wu Wei) with active contribution (YIN/YANG), all centered on Zhong (中).

