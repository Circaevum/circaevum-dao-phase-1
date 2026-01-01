# Circaevum DAO - Phase 1

This GitHub repository serves as the basis for how Circaevum operates as a DAO. It consolidates progress notes and tracks development across all Circaevum projects, providing the framework for DAO governance and contribution tracking. 

**Repository Structure**: This repository focuses on tracking, documentation, and administrative processes. Individual project code repositories are maintained separately to avoid nested git repository conflicts. The `yin/` (backend) and `yang/` (frontend) project directories are located at the parent level alongside this DAO repository.

During Phase 1, this process will probably change. This GitHub will probably change. We're exploring how this works. How we can build an autonomous flywheel that incentivizes transparency and continuous innovation. We are welcome to interpretations, suggestions, and other ideals that continue exploring the nature of this. 

**Circaevum** is a 3D calendar and time visualization system designed to enhance the human cognitive faculties of memory and planning. To learn more, visit https://circaevum.com/.

## Smart Contract Information

- **Contract Name:** Circaevum DAO Governance Token
- **Network:** Solana Mainnet
- **Governance Program Address:** `GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw`
- **Realm Address:** `FDerj19PyQytsD1rL4NGpSeXWT8d7WdRABBxxCEnDj6d`
- **Realm:** https://app.realms.today/dao/FDerj19PyQytsD1rL4NGpSeXWT8d7WdRABBxxCEnDj6d
- **Deployed On:** February 27, 2025

### Token Mint Addresses

- **YIN Token (Community Token):** `8J2Xt2G3US2yWTwDtKxGUwwKCnNzNcoXwEMVPwV6HTzw`
  - [View on Solana Explorer](https://explorer.solana.com/address/8J2Xt2G3US2yWTwDtKxGUwwKCnNzNcoXwEMVPwV6HTzw/metadata)
- **YANG Token (Council Token):** `7E8nSaFbB1LwAKZXUVcH2jBkS9RR5FgzQi3xdHAToShX`
  - [View on Solana Explorer](https://explorer.solana.com/address/7E8nSaFbB1LwAKZXUVcH2jBkS9RR5FgzQi3xdHAToShX/metadata)

**To find these tokens on exchanges or DEXs:**
- Search for the mint address on Solana DEXs like Jupiter, Raydium, or Orca
- These are governance tokens and may have limited liquidity
- Always verify the mint address matches the addresses above when trading

> **Legal Status**: This DAO is in the process of being registered as a Wyoming Decentralized Autonomous Organization LLC. The formal Addendum to Articles of Organization can be found in the repository as [Addendum.md](./Addendum.md).

The Circaevum DAO operates on a Taiji-inspired governance model (Yin-Yang), emphasizing balance and cyclical progression. On a quarterly basis, contributions towards the evolution of Circaevum will be tallied, future work will be scoped, votes will take place, revenue will be dispersed, and equity will shift.

![4o Yin-Yang Art](./images/4o-yin-yang-art.png)

---

## Yin-Yang Token Structure

**Yin (阴)** and **Yang (阳)**: YIN and YANG tokens are perfectly balanced with identical characteristics. Both represent contributors—YIN focuses on backend problems, YANG focuses on frontend problems. Both have governance rights, equity (2.7% per token), profit-sharing (2.7% per token, quarterly), and the same decay mechanics (0.1% per quarter if inactive for 2+ quarters). Both have 18 tokens total. The only difference is their problem focus area.

**YIN/YANG Token Maintenance** (Same for Both):
- Tokens require active participation to maintain their full value
- Holders must complete contributions to prevent decay
- Decay rate is 0.1% per quarter after 2 quarters of inactivity
- Active contribution resets decay to full value

**Wu Wei (无为)**: Represents investors. Wu Wei tokens provide governance participation for investors. Unlike YIN and YANG token holders who are active contributors, Wu Wei token holders are investors who provide capital but not direct labor contributions. Wu Wei holders participate in governance decisions. Wu Wei token equity is determined through negotiations and may differ from the fixed 2.7% structure of YIN/YANG tokens. Wu Wei tokens can be transferred and are subject to decay mechanics if the investor becomes inactive in governance participation.

**Zhong (中)**: The center of the Yin Yang, representing the CEO. Zhong is the only token that is immune to decay mechanics.

### Token Characteristics

| Token Type | Percentage Cap | # of Tokens Issued | Governance? | Equity? | Profit-Sharing? | Conversion Possible? | Transferable? | Burnable? | Decay Mechanic? |
|------------|----------------|--------------------|-------------|---------|-----------------|----------------------|---------------|-----------|-----------------|
| Zhong (中) | 2.8% | 1 | ✅ Yes | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| YANG | 2.7% | 18 | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (if inactive) |
| YIN | 2.7% | 18 | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (if inactive) |
| Wu Wei | Negotiated | 18 | ✅ Yes | Negotiated | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes (potential dilution by governance) |

### Quarterly Development Review Sequence

1. All Revenue enters the Treasury, and payments to Costs for the Quarter are deployed. The remaining Profits will be set aside for Steps 4 and 5
2. The accumulated contributions of the previous Quarter are tallied up
3. YANG token holders vote on the next Quarter's needs, and estimated costs are set aside from Profits (YIN equivalents using Yin-to-Yang conversion formula are included in vote regardless of YIN consumption decision)
4. 1st half of remaining Profits is set aside for YIN token holders (unless converting to YANG)
5. 2nd half of profits is divided amongst YANG holders on burned 2.7% equivalent, then is voted on for future investments in the company.
6. The YinYang rotates 90 degrees counterclockwise 
7. The Next Quarter begins

### Contributor's Perspective

YIN and YANG token holders have identical rights: both have governance (voting rights), equity (2.7% per token), and profit-sharing (2.7% per token, quarterly). Contributors earn tokens based on their problem focus area—backend contributors earn YIN tokens, frontend contributors earn YANG tokens. Both token types are perfectly balanced and equal in all respects.

### Mathematical Harmony

The token structure creates a perfect balance that aligns with Taiji principles:

- 18 YANG tokens (2.7% each) = 48.6% equity
- 18 YIN tokens (2.7% each) = 48.6% equity  
- 1 Zhong (中) token (2.8%) = 2.8% equity
- 18 Wu Wei tokens (equity negotiated per investment) = balance

**Total: ~100% equity structure**

This structure naturally forms a hexagonal arrangement with 37 circles (1 in center, surrounded by 6 in the first ring, and 12 in the second ring, 18 in the outer ring). Zhong (中) sits at the center, with YIN and YANG tokens in balanced distribution, creating visual and mathematical harmony.

![Circles Yin-Yang](./images/circles-yinyang-orbit-gray.png)

This tokenomics model ensures perfect equilibrium between contributors and investors, with a slightly weighted center point to provide direction and resolve ties - a true embodiment of Taiji principles of balance, harmony, and cyclical progression.

---

## Project Status

### Current Development

**Backend (Yin)**:
- ✅ Nakama Device Authentication System
- ✅ Google Calendar Integration
- ✅ Sleep Data Visualization
- 🔄 Mobile Device Optimization (in progress)

**Frontend (Yang)**:
- ✅ Web visualization (Three.js) - Available at [circaevum.com](https://circaevum.com/)
- 📋 Account configuration and data upload/management (next priority)
  - yang-web yin-seed: Backend adapters/APIs
  - yin yang-seed: UI components
- ✅ Unity Apple Vision Pro - Active development
- ✅ Unity Meta Quest - Active development

---

## Repository Organization

**Current Structure** (as of January 2026):
- **`circaevum-dao-phase-1/`** (this repo) - DAO governance, tracking, documentation
- **`yin/`** (separate directory) - Backend projects (nakama, timescale, rest, yang-seed)
- **`yang/`** (separate directory) - Frontend projects (web, unity/avp, unity/quest)

Individual projects maintain their own git repositories. This separation avoids nested git repository conflicts while keeping the DAO repository focused on governance and tracking.

## Quick Start

**Web Visualization**:
```bash
cd ../yang/web
python3 -m http.server 8080
```
Open http://localhost:8080 or visit [circaevum.com](https://circaevum.com/)

**Note**: Project directories (`yin/`, `yang/`) are located at the parent level alongside this DAO repository.

---

**Note**: The official documentation, including any updates to this governance model or GitHub repository, can be found at https://github.com/Circaevum/circaevum-dao-phase-1 and will only be updated based on a majority decision of governance token holders.
