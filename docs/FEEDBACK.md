# User Feedback — Level 5

## Feedback Collection Method
Feedback was gathered organically across diverse public community channels, including **Facebook groups (Web3 & Humanitarian Aid networks), Midnight Developer Discord testing sessions, Telegram Web3 testing channels, and Twitter/X outreach**. Testers connected their Midnight Lace wallet on Preprod, executed shielded contribution circuits, and evaluated the dual-mode donation and QR verification handoff.

---

## Raw Feedback Log

| # | User | Feedback Summary | Date |
|---|------|-----------------|------|
| 1 | `@alex_zkdev` | "Lace wallet connection is seamless on Preprod. Would appreciate a clear toast notification showing the exact transaction hash right after circuit execution." | 2026-08-16 |
| 2 | `@mariah_crypto` | "The UI color palette (warm amber) feels very inviting for a relief platform. Great job making the ZK proof generation feel fast (< 4s)." | 2026-08-18 |
| 3 | `@dev_john` | "On the SaaS Admin tab, it was helpful to see the live contract address. Added a copy button which makes auditing on explorer easy." | 2026-08-20 |
| 4 | `@elena_builds` | "The QR code handoff for disaster relief distribution is a killer feature for field officers without exposing victim identities on-chain." | 2026-08-23 |
| 5 | `@sam_validator` | "Tested edge case: tried submitting zero amount and caught the validation error gracefully before sending to the circuit. Excellent UX safety." | 2026-08-26 |

---

## What We Heard (Themes)

1. **Transaction Auditability & Confirmation**: Users loved the speed of client-side ZK proof generation, but wanted persistent confirmation showing the transaction hash and block explorer link.
2. **Denomination Clarity**: Testers appreciated automatic conversion between raw micro-specks ($10^6$) and formatted whole `$tNIGHT` tokens.
3. **Field Logistics Usability**: The dual-mode transaction modal (Donate vs Receive via QR) received praise for mimicking real-world disaster relief workflows.

---

## What We Changed

| Change | Reason | Commit |
|--------|--------|--------|
| Added transaction hash copy & toast alert | Direct request from user feedback to easily verify proofs on Midnight Explorer | `8d7ed07` |
| Enhanced multi-account portfolio balance aggregator | Ensured sub-account balances in Lace are aggregated accurately to $6,000 tNIGHT | `317878a` |
| Unified Warm Amber & Soft Off-White design system | Improved visual accessibility and trust for humanitarian aid contributors | `876e17a` |
| Implemented explicit witness constraint validation in `contract.ts` | Prevented invalid or zero-value transactions before computing expensive ZK circuits | `Level 4` |

---

## Associated Feedback Datasets
- **Live Form Responses CSV**: [docs/ReliefShield (Responses) - Form Responses 1.csv](ReliefShield%20(Responses)%20-%20Form%20Responses%201.csv)
- **Detailed Participant Dataset**: [docs/user-feedback-responses.csv](user-feedback-responses.csv)
- **Public Google Sheet**: [Live Google Spreadsheet](https://docs.google.com/spreadsheets/d/15N2fwOt7oG_15nAdvVX93dROlNrJEmTb6dVQvwYEMdc/edit?usp=sharing)
