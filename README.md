# circaevum-dao-phase-1
The Yin Yang Inspired Smart Contract for Phase 1 of Circaevum's DAO Governance

![Circles Yin-Yang](./images/circles-yinyang-orbit.png)

📌 **Abstract**:
On a Quarterly basis, contributions towards the evolution of Circaevum will be tallied, future work will be scoped, votes will take place, and revenue will be dispersed.

This Yin-Yang inspired model is designed to:
- Incentivize long-term contributions
- Keep the company lean and balanced
- Provide an intuitive model for equity ownership
- Create a valuation method for Phase 1 as a DAO

### Token Characteristics

| Token Type                          | Percentage Cap | # of Tokens Issued | Governance? | Equity? | Profit-Sharing? | Conversion Possible? | Transferable? | Burnable? | Decay Mechanic?                          |
|-------------------------------------|----------------|--------------------|-------------|---------|-----------------|----------------------|---------------|-----------|------------------------------------------|
| Origin                              | 2.71%          | 1                  | ✅ Yes      | ✅ Yes  | ✅ Yes          | ❌ No                | ✅ Yes        | ✅ Yes    | ❌ No                                   |
| Yang                                | 2.7%           | 18                 | ✅ Yes      | ✅ Yes  | ✅ Yes          | ✅ Yes               | ✅ Yes        | ✅ Yes    | ✅ Yes (if inactive before fully earned) |
| Yin                                 | 2.7%           | 18                 | ❌ No       | ❌ No   | ✅ Yes          | ✅ Yes               | ✅ Yes        | ✅ Yes    | ✅ Yes (depletes if inactive)            |
| Dark Matter                         | 2.7%           | N/A                | ✅ Yes      | ✅ Yes  | ❌ No           | ❌ No                | ✅ Yes        | ✅ Yes    | ❌ No                                   |
| Origin Orbit                        | 0%             | 36                 | ❌ No       | ❌ No   | ❌ No           | Can Apply to Yin/Yang| ✅ Yes        | ✅ Yes    | ❌ No                                   |
| Mantle Orbit                        | 0%             | Infinite           | ❌ No       | ❌ No   | ❌ No           | Can Apply to Yin/Yang| ✅ Yes        | ✅ Yes    | ❌ No                                   |
---

![Circles Orbit](./images/circles-orbit.png)

### Yin-Yang Characteristics
- Yin = adaptive, darkness, source of emergence
- This takes up half of a Yin Yang, with a small hole where Yin coagulates into a ball of Yang, which is independent of the other half of the Yin Yang, which also includes a hole
- Yang = conservative, resistant to change, source of decay, full of light and density
- The hole in Yang is to represent the portion of Yang that is lost to make way for the proportional incoming Yang

Yin-Yang Geometry
- A standard Yin Yang model when examined along a line that bisects each of the smaller circles, there are 6 equal segments of equal length in progression: White, Black, White, and then Black, White, Black. The single Black within the first half represents the diameter of the inner black circle (the Yin [black] within the surrounding Yang [white]). The single White within the second half represents the diameter of the inner white circle (the Yang [white] within the surrounding Yin [black]).
- Using this geometry, we can assume that if the radius of an inner circle is 1 (½ of diameter), then the radius of the full circle is 6. 
- Knowing this, the area of an inner circle is PI*r^2, or in this case PI*1^2. The area of the full circle is PI*6^2. To find the percentage of the inner circle to the outer, we find ourselves with (PI*1)/(PI*36), which simplifies to 1/36, or 2.77%
- If the radius = ½, then the percentage = 0.69%
- If the radius = 1, then the percentage = 2.77%
- If the radius = 2, then the percentage = 11.11%

Corporate Governance Significance
- Yin represents Quarterly accumulated contributions from members of the Circaevum team. This is estimated as points calculated based on the time and rate of influence on Circaevum's growth, which is estimated by the team at the beginning of a quarter when the work is scoped out, and re-evaluated at the end to sure up numbers. 
- Yang represents long-term ownership in the voting rights of the DAO. 
- During a Quarterly review, accumulated Yin contributions can be converted into direct payments (if profits are sufficient), or Yin can be converted into Yang based on the Yin-toYang Conversion Formula

📅 Quarterly Development Review Sequence

1️⃣ All Revenue enters the Treasury, and payments to Costs for the Quarter are deployed. The remaining Profits will be set aside for Steps 4 and 5
2️⃣ The accumulated contributions of the previous Quarter are tallied up
3️⃣ Yang token holders vote on the next Quarter's needs, and estimated costs are set aside from Profits (Yin equivalents using Yin-toYang formula are included in vote regardless of Yin consumption decision)
4️⃣ 1st half of remaining Profits is set aside for Yin token holders to vote on.
    - Option 1 - Yin holder can convert Yin to Yang for long-term incentives
    - Option 2 - Yin holder can cash out their portion of this 1st half of Profits
5️⃣ 2nd half of profits → Yang holders cash out without losing ownership.

![Circles Orbit](./circles-orbit.png)

📌 Next Steps

🚀 Complete Aragon DAO Setup
🚀 Start manual tracking of Yin accrual & profit-sharing
🚀 Test governance process before automating with Solidity

You can copy & paste this into Cursor to update the README. Let me know if any details need tweaking! 🚀