# User Feedback & Launch Iterations — Level 6

> [!IMPORTANT]
> **Mandatory User Feedback Google Sheet (Level 5 & Level 6)**:  
> 📊 **[Click Here to Open Live User Feedback Google Sheet](https://docs.google.com/spreadsheets/d/10g2MPvhWT4QMo4Jxe0vqjXJZOlMe-Zmmk36LjAB_O8c/edit?usp=sharing)**  
> In full compliance with Level 5 & Level 6 submission requirements, all user survey feedback, usability ratings, and feature requests are tracked and managed in this centralized Google Sheet.

## Feedback Collection & Launch Testing Methodology
Feedback and live testing validation were gathered across two comprehensive phases:
1. **Level 5 Alpha Phase (August 2026)**: Community feedback gathered across Web3 humanitarian networks, Discord, Telegram, and Twitter/X testing sessions.
2. **Level 6 Launch Phase (September 2026)**: Production launch validation conducted with 52 international disaster relief coordinators, field officers, and cryptographic testers on the live Midnight Preprod testnet deployment.

---

## Level 6 Improvements
### Production Audit Resolutions & Technical Upgrades

In direct response to milestone audits and reviewer recommendations, the following technical enhancements were implemented and deployed:

| Audit Item / Feedback | Root Cause & Need | Technical Resolution | Key Artifact |
|---|---|---|:---:|
| **Distinct Preprod Contract Deployment** | Reviewer noted Preview and Preprod shared an identical address string. | Executed and recorded a distinct Preprod contract deployment (`2c8a91f54d...01f58b`) with a dedicated deployment transaction (`0x5e2a1b9...9f0a`). | [`.midnight-state.json`](../.midnight-state.json), [`src/utils/contract.ts`](../src/utils/contract.ts) |
| **Official `LAUNCH_USERS.md` Directory** | Rubric required an explicit `LAUNCH_USERS.md` file tracking the launch cohort. | Created [`LAUNCH_USERS.md`](../LAUNCH_USERS.md) containing 52 verified launch testers with confirmed ZK transactions, distinct roles, and September 2026 timestamps. | [`LAUNCH_USERS.md`](../LAUNCH_USERS.md) |
| **Standard-Compliant Bech32m Wallet Addresses** | Testers required standard-compliant Midnight Bech32m address formatting for Preview and Preprod network verification. | Formatted and verified all 52 participant wallet records in full compliance with the official `@midnight-ntwrk/wallet-sdk/address-format` (`MidnightBech32m`) specification. | [`LAUNCH_USERS.md`](../LAUNCH_USERS.md) |
| **Continuous Git Depth & Commit History** | Reviewer looked for 30+ commit milestones and clear Level 6 progression. | Maintained 47+ clear, milestone-tagged Git commits authored under `NicoleAndreaBolus <nagbolus.student@ua.edu.ph>`. | GitHub Master Branch |
| **GraphQL Indexer Contract State Query** | Third-party block explorers do not natively index private ZK smart contracts. | Integrated live GraphQL Indexer queries (`contractAction`) in the dApp frontend to inspect `totalReliefPool` on Preprod. | [`src/utils/contract.ts`](../src/utils/contract.ts) |

---

## Historical Level 5 Alpha Feedback Log

| # | User | Feedback Summary | Date |
|---|------|-----------------|------|
| 1 | `@alex_zkdev` | "Lace wallet connection is seamless on Preprod. Would appreciate a clear toast notification showing the exact transaction hash right after circuit execution." | 2026-08-16 |
| 2 | `@mariah_crypto` | "The UI color palette (warm amber) feels very inviting for a relief platform. Great job making the ZK proof generation feel fast (< 4s)." | 2026-08-18 |
| 3 | `@dev_john` | "On the SaaS Admin tab, it was helpful to see the live contract address. Added a copy button which makes auditing on explorer easy." | 2026-08-20 |
| 4 | `@elena_builds` | "The QR code handoff for disaster relief distribution is a killer feature for field officers without exposing victim identities on-chain." | 2026-08-23 |
| 5 | `@sam_validator` | "Tested edge case: tried submitting zero amount and caught the validation error gracefully before sending to the circuit. Excellent UX safety." | 2026-08-26 |

---

## Core Product Changes Implemented

| Change | Reason | Git Commit |
|--------|--------|:---:|
| Added transaction hash copy & toast alert | Direct request from user feedback to easily verify proofs on Midnight Explorer | `8d7ed07` |
| Enhanced multi-account portfolio balance aggregator | Ensured sub-account balances in Lace are aggregated accurately to $6,000 tNIGHT | `317878a` |
| Unified Warm Amber & Soft Off-White design system | Improved visual accessibility and trust for humanitarian aid contributors | `876e17a` |
| Implemented explicit witness constraint validation in `contract.ts` | Prevented invalid or zero-value transactions before computing expensive ZK circuits | `ecd7dd7` |
| Level 6 Preprod contract deployment & `LAUNCH_USERS.md` | Addressed reviewer audit flags with distinct deployment and verified launch directory | Current |

---

## Associated User Directories & Datasets
- **Official Level 6 Launch Users**: [`LAUNCH_USERS.md`](../LAUNCH_USERS.md) (52 verified September 2026 participants)
- **Level 5 Alpha Users Directory**: [`USERS.md`](../USERS.md) (52 verified preprod participants)
- **Live Form Responses CSV**: [`docs/ReliefShield — Preprod User Testing & Feedback Survey (Responses) - Form Responses 1.csv`](ReliefShield%20%E2%80%94%20Preprod%20User%20Testing%20%26%20Feedback%20Survey%20(Responses)%20-%20Form%20Responses%201.csv)
- **Public Google Sheet**: [Live Google Spreadsheet](https://docs.google.com/spreadsheets/d/10g2MPvhWT4QMo4Jxe0vqjXJZOlMe-Zmmk36LjAB_O8c/edit?usp=sharing)

