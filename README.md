## Smart Contract Information

- **Contract Name:** Circaevum DAO Governance Token
- **Network:** Solana Mainnet
- **Contract Address:** `GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw`
- **Deployed On:** February 27, 2025

# Circaevum DAO - Phase 1
The Circaevum DAO operates on a Taiji-inspired governance model (YinYang), emphasizing balance and cyclical progression. The first quarterly meeting will be sometime late March or early April 2025.

> **Legal Status**: This DAO is in the process of being registered as a Wyoming Decentralized Autonomous Organization LLC. The formal Addendum to Articles of Organization can be found in the repository as [Addendum.md](./Addendum.md).

![4o Yin-Yang Art](./images/4o-yin-yang-art.png)

**Abstract**:
On a Quarterly basis, contributions towards the evolution of Circaevum will be tallied, future work will be scoped, votes will take place, revenue will be dispersed, and equity will shift.

This Yin-Yang inspired model is designed to:
- Provide a framework to simplify and streamline this process
- Incentivize long-term contributions
- Keep the company lean and balanced
- Provide an intuitive model for equity distribution
- Serve as a flywheel for innovation and growth
- Be visualized using Circaevum, naturally

Circaevum is a 3D graphics engine for Time. A system to aggregate, index, visualize, and navigate TimeStamps across datasets. As the Solana Blockchain emphasizes the use of TimeStamps for its Proof of History (PoH) consensus mechanism, this is a fitting system to incorporate Circaevum as a DAO with respect to. The Circaevum DAO is a Realms' Community Token DAO on the Solana blockchain, and can be found here: https://app.realms.today/dao/FDerj19PyQytsD1rL4NGpSeXWT8d7WdRABBxxCEnDj6d

---

### Technical Implementation Note

While this technical implementation provides the foundation for the governance structure, not all aspects of the governance model described in this document are directly enforced on-chain. Many governance decisions, including token distributions, equity adjustments, and quarterly assessments, will occur through formal quarterly meetings, with the results being reflected in token distributions and meeting notes. The official documentation, including any updates to this governance model, can be found at https://github.com/Circaevum/circaevum-dao-phase-1

---

### Yin-Yang Characteristics
**Yin**: Adaptive, darkness, source of emergence
- Yin represents the individual. 1 YIN token is awarded for each completed task. 75 tasks (75 YIN tokens) tracked using [Linear](https://linear.app/) are equivalent to 1 YANG token, and can be converted to YANG at any time as long as YANG eligibility permits.
- This estimate is generally assuming a contributor completes 1.5 tasks per week. Some weeks they might complete 2, others 1, and others 0. Over a year, this approach applied over 50 weeks generally averages out to 75 points. So, for roughly a year's worth of work, an early contributor could earn 2.7% equity in the company.
- YIN is the Community Token in Realms' Community Token DAO configuration.
- This takes up half of a Yin Yang, with a small hole where Yin coagulates into a ball of Yang, which is independent of the other half of the Yin Yang, which also includes a hole

**Yang**: Active, full of light and density, carries the inertia and momentum of the company
- Yang represents the company. The overall company is a ball of energy with inertia, and it needs to shed effectively 1 YANG token per quarter to offer incentive to the YIN pool. For the early core development, YANG will be shed initially from Adam's initial shares, and then once those balance with those disspersed, YANG will begin to shed from the YANG pool.
- YANG is the Council Token in Realms' Community Token DAO configuration.
- The hole in Yang is to represent the portion of Yang that is lost to make way for the proportional incoming Yang.

**YANG Token Maintenance**:
- YANG tokens require active participation to maintain their full value
- Holders must complete 18 tasks annually to prevent equity decay
- Annual decay rate is 0.9% equity (1/3 of a YANG token's value) if no tasks are completed
- For every 2 tasks completed, the annual decay is reduced by 0.1%
- Complete all 18 tasks to fully prevent decay (0% loss)
- After 3 years of zero activity, a YANG token would lose its entire 2.7% equity value

**Wu Wei**: Wu Wei represents the investors. 
- Wu Wei constitutes the other half of governance and equity, balancing against the active contributors.
- Each Wu Wei token's value will be determined through negotiations between investors and majority equity holders.
- Unlike YIN token holders who are active contributors, Wu Wei token holders are investors who provide capital but not direct labor contributions.
- Wu Wei holders participate in governance decisions but do not receive profit-sharing distributions.
- Wu Wei tokens can be transferred and are subject to decay mechanics if the investor becomes inactive in governance participation.

![](./images/yinyangcoins.png)
### Token Characteristics
---
| Token Type                          | Percentage Cap | # of Tokens Issued | Governance? | Equity? | Profit-Sharing? | Conversion Possible? | Transferable? | Burnable? | Decay Mechanic?                          |
|-------------------------------------|----------------|--------------------|-------------|---------|-----------------|----------------------|---------------|-----------|------------------------------------------|
| Taiji Point                         | 2.8%           | 1                  | ✅ Yes      | ✅ Yes  | ✅ Yes          | ❌ No                | ✅ Yes        | ✅ Yes    | ❌ No                                   |
| YANG                                | 2.7%           | 18                 | ✅ Yes      | ✅ Yes  | ✅ Yes          | ✅ Yes               | ✅ Yes        | ✅ Yes    | ✅ Yes (if inactive before fully earned) |
| YIN                                 | N/A            | 1,350              | ❌ No       | ❌ No   | ✅ Yes          | ✅ Yes               | ✅ Yes        | ✅ Yes    | ❌ No                                    |
| Wu Wei                              | 2.7%           | 18                 | ✅ Yes      | ✅ Yes  | ❌ No           | ✅ Yes               | ✅ Yes        | ✅ Yes    | ✅ Yes (potential dilution by governance)|
---

### Yin-Yang Geometry
- In a standard Yin Yang model when examined along a line that bisects the center and each of the smaller circles, there are 6 equal segments of equal length in progression: White, Black, White, and then Black, White, Black. The single Black within the first half represents the diameter of the inner black circle (the Yin [black] within the surrounding Yang [white]). The single White within the second half represents the diameter of the inner white circle (the Yang [white] within the surrounding Yin [black]).
- Using this geometry, we can assume that if the radius of an inner circle is 1 (½ of diameter), then the radius of the full circle is 6. 
- Knowing this, the area of an inner circle is PI*r^2, or in this case PI*1^2. The area of the full circle is PI*6^2. To find the percentage of the inner circle to the outer, we find ourselves with (PI*1)/(PI*36), which simplifies to 1/36, or 2.77%
- When stacking 36 circles, the hexagonal arrangement naturally finds balance with 37 circles (one in the middle). Naturally, this comes as a simple way to establish the CEO role as the 37th circle. With 1/37 = 0.027027027 repeating, to make it simple 2.7% is attributed to each circle, with the remainders added to the CEO's share (2.8%) to serve as a tie breaker in close votes.

![Circles Yin-Yang](./images/circles-yinyang-orbit-gray.png)

(imagine each of the gray circles [YIN] is actually 75 circles stacked on top of each other)

**Taiji Point**:
- The Taiji Point is the center of the Yin Yang, and represents the CEO. The Taiji Point is the only token that is immune to decay mechanics.

## Quarterly Development Review Sequence

1. All Revenue enters the Treasury, and payments to Costs for the Quarter are deployed. The remaining Profits will be set aside for Steps 4 and 5
2. The accumulated contributions of the previous Quarter are tallied up
3. YANG token holders vote on the next Quarter's needs, and estimated costs are set aside from Profits (YIN equivalents using Yin-to-Yang conversion formula are included in vote regardless of YIN consumption decision)
4. 1st half of remaining Profits is set aside for YIN token holders (unless converting to YANG)
5. 2nd half of profits is divided amongst YANG holders on burned 2.7% equivalent, then is voted on for future investments in the company.
6. The YinYang rotates 90 degrees counterclockwise 
7. The Next Quarter begins
![Circles Orbit](./images/circles-quarter.png)

### Contributor's Perspective
Upon reaching 75 YIN tokens, the contributor can convert these 75 YIN tokens into 1 YANG token, which is valued at 2.7% of equity and voting rights. So in about a year, a contributor can have 1 YANG token, which is valued at 2.7% of the company. YANG token holders earn both equity and profit-sharing rights. YIN token holders (who haven't converted to YANG) receive profit-sharing but no equity ownership.

## Additional Resources

- [Circaevum Whitepaper](https://your-whitepaper-url.com)
- [User Guide](https://your-user-guide-url.com)
- [Developer Documentation](https://your-developer-docs-url.com)
- [Articles of Incorporation](./Addendum.md)

**Note**: The official documentation, including any updates to this governance model or GitHub repository, can be found at https://github.com/Circaevum/circaevum-dao-phase-1 and will only be updated based on a majority decision of governance token holders.

**Decay Mechanics**: 
- YANG tokens are subject to the maintenance requirements and decay rates described above
- YIN tokens do not deplete and remain as earned
- Wu Wei tokens are subject to potential dilution as determined by governance votes

### Mathematical Harmony

The token structure creates a perfect balance that aligns with Taiji principles:

- 18 YANG tokens (75 tasks each) = 1,350 tasks = 18 developer years
- 18 Wu Wei tokens (equivalent value of 75 tasks each) = 18 developer years
- 1 Taiji Point token (slightly larger at 2.8%) ≈ 1 developer year

**Total: 37 developer years of value**

This structure naturally forms a hexagonal arrangement with 37 circles (1 in center, surrounded by 6 in the first ring, and 12 in the second ring, 18 in the outer ring). The Taiji Point sits at the center, with equal distribution of YANG and Wu Wei tokens in the surrounding rings, creating both visual and mathematical harmony.

This tokenomics model ensures perfect equilibrium between contributors and investors, with a slightly weighted center point to provide direction and resolve ties - a true embodiment of Taiji principles of balance, harmony, and cyclical progression.
