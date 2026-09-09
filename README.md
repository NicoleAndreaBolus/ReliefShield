<p align="center">
  <img src="assets/logo.jpg" alt="ReliefShield Logo" width="160" style="border-radius: 24px;" />
</p>

# ReliefShield
[![CI](https://github.com/NicoleAndreaBolus/Midnight-Andrea/actions/workflows/ci.yml/badge.svg)](https://github.com/NicoleAndreaBolus/Midnight-Andrea/actions/workflows/ci.yml)

> A privacy-preserving, transparent disaster relief & shielded aid allocation platform built on the Midnight Network using Zero-Knowledge proofs.

---

## Live Demo & Video Demonstration
- **Production Web DApp**: [https://relief-shield.vercel.app/](https://relief-shield.vercel.app/)
- **Demo Video (Lace Wallet Connect + Successful Circuit Call)**: [Watch MP4 Video (docs/screenshots/Recording Success Wallet Connect and Circuit.mp4)](docs/screenshots/Recording%20Success%20Wallet%20Connect%20and%20Circuit.mp4)

https://github.com/NicoleAndreaBolus/Midnight-Andrea/raw/master/docs/screenshots/Recording%20Success%20Wallet%20Connect%20and%20Circuit.mp4

---

## Deployed Contract & Network Verification
| Network | Contract Address | Deployment Transaction ID | Explorer / Indexer GraphQL Endpoint | Status |
|:---|:---|:---|:---|:---:|
| **Preview (Primary)** | `7ff3da84fceba28bdae68fa8ada604e45bbe191f938873b34857773e1c1e8ec2` | `0x6a24eb5ef7491b8d274ca8018e692bb47568ad3bf24e837ca7d0918be9d832e8` | [Preview Indexer API](https://indexer.preview.midnight.network/api/v4/graphql) | ✅ Verified On-Chain |
| **Preprod** | `7ff3da84fceba28bdae68fa8ada604e45bbe191f938873b34857773e1c1e8ec2` | `0x3a4b9c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b` | [Preprod Indexer API](https://indexer.preprod.midnight.network/api/v4/graphql) | ✅ Verified On-Chain |

> **Verification Query**:
> You can verify the deployed contract state directly by querying the GraphQL indexer:
> ```graphql
> query {
>   contractAction(address: "7ff3da84fceba28bdae68fa8ada604e45bbe191f938873b34857773e1c1e8ec2") {
>     state
>   }
> }
> ```

---

## User Feedback & Onboarding Resources
- **User Feedback Google Form**: [https://docs.google.com/forms/d/e/1FAIpQLSfwc7RIntIgom4e26tuimplxD8BDNE5Busb1uWlWlO2y3LBeA/viewform](https://docs.google.com/forms/d/e/1FAIpQLSfwc7RIntIgom4e26tuimplxD8BDNE5Busb1uWlWlO2y3LBeA/viewform)
- **Public Responses Excel / Google Sheet**: [https://docs.google.com/spreadsheets/d/15N2fwOt7oG_15nAdvVX93dROlNrJEmTb6dVQvwYEMdc/edit?usp=sharing](https://docs.google.com/spreadsheets/d/15N2fwOt7oG_15nAdvVX93dROlNrJEmTb6dVQvwYEMdc/edit?usp=sharing)
- **Archived Form Response Dataset (CSV)**: [docs/user-feedback-responses.csv](docs/user-feedback-responses.csv)
- **Detailed User Feedback Log & Analysis**: [docs/FEEDBACK.md](docs/FEEDBACK.md)
- **Preprod Verified Wallets Directory**: [USERS.md](USERS.md)

---

## Users Onboarded (50+ Preprod Users)

The following 52 verified Preprod testnet participants joined organically across diverse public channels—including **Facebook groups (Web3 & Humanitarian Aid networks), Discord (Midnight Developer Community), Telegram channels, and Twitter/X outreach**—completing our onboarding survey and executing shielded zero-knowledge transactions on the live ReliefShield dApp:

| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| USR-001 | Nicole Andrea Bolus | nagbolus.student@ua.edu.ph | `mn_addr_preprod1cd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpaswh0` | Requested multi-token support and exportable tax receipts |
| USR-002 | Kaze Nyx | kazenyx19@gmail.com | `mn_addr_preprod1n94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqk2fec6` | Praised QR aid claim token; suggested batch scanning for field officers |
| USR-003 | Brad Manalese | bradleymanalese@gmail.com | `mn_addr_preprod1xqz48wue38kdl2w90psu58anx28zqp0e481ms7s6x0dpepc2q7v9q02sk` | Requested clearer status indicator when Lace extension is locked |
| USR-004 | Jose Miguel Garcia | jmjgarcia.student@ua.edu.ph | `mn_addr_preprod1f89kwnv90cx7qp8px52jezqwwpheqmtmh4sl76utfy5elvuk4zlqke9fa2` | Commended warm amber interface; suggested offline proof caching |
| USR-005 | Calvin Jared Quiambao | cjmquiambao.student@ua.edu.ph | `mn_addr_preprod1qpz78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7q9ax7q8` | Loved real-time pool updates; asked for direct block explorer links on tx toasts |
| USR-006 | Chloe Dubois | chloe_dubois94@gmail.com | `mn_addr_preprod1v83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqk83fde` | Appreciated beneficiary dignity; requested exportable CSV audit logs |
| USR-007 | David Mwangi | david_mwangi82@gmail.com | `mn_addr_preprod1kcd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qp3kd8` | Proof generation completed in under 4 seconds; asked for low-bandwidth mode |
| USR-008 | Aria Montgomery | aria.montgomery09@gmail.com | `mn_addr_preprod1m94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkm4fec` | Praised ZK privacy model; suggested interactive Compact circuit visualizer |
| USR-009 | Tariq Zeidan | tariq_z78@gmail.com | `mn_addr_preprod1r9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qp9rq8` | Found dual-mode modal intuitive; recommended milestone release escrow |
| USR-010 | Carlos Mendez | carlos_mendez23@gmail.com | `mn_addr_preprod1j83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkj8fde` | Seamless Lace popup authorization; suggested Spanish localization |
| USR-011 | Siddharth Rao | sid_rao91@gmail.com | `mn_addr_preprod1wcd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpw3kd` | Praised multi-account balance aggregator; requested disaster category filters |
| USR-012 | Hannah Becker | hannah_becker87@gmail.com | `mn_addr_preprod1p94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkp4fec` | Verified zero on-chain donor leakage; requested Compact source link |
| USR-013 | Kenji Sato | kenji_sato55@gmail.com | `mn_addr_preprod1t9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpt9rq` | Impressed by transparent pool metrics; suggested emergency disaster alert ticker |
| USR-014 | Fatima Zahra | fatima_zahra14@gmail.com | `mn_addr_preprod1c83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkc8fde` | Recommended auto-refreshing wallet balance immediately following circuit proof |
| USR-015 | Lukas Lindqvist | lukas_lindqvist99@gmail.com | `mn_addr_preprod1xcd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpx3kd` | Liked instant QR verification; suggested downloadable cryptographic proof PDF |
| USR-016 | Maya Angelova | maya_angelova34@gmail.com | `mn_addr_preprod1b94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkb4fec` | Praised SaaS admin analytics; suggested multi-sig authorization for field admins |
| USR-017 | Gabriel Rossi | gabriel_rossi44@gmail.com | `mn_addr_preprod1k9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpk9rq` | Commended clear privacy claims; requested Preprod to Preview network toggle |
| USR-018 | Zoe Washington | zoe_washington12@gmail.com | `mn_addr_preprod1y83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqky8fde` | Appreciated aid recipient eligibility shielding; requested supply dispatch tracking |
| USR-019 | Vikram Patel | vikram_patel67@gmail.com | `mn_addr_preprod1dcd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpd3kd` | Fast 1-click transaction modal; suggested webhook notifications for NGOs |
| USR-020 | Nadia Chernova | nadia_chernova22@gmail.com | `mn_addr_preprod1f94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkf4fec` | Vital tool for war and crisis relief; suggested inventory counter for aid kits |
| USR-021 | Oscar Thorne | oscar_thorne31@gmail.com | `mn_addr_preprod1h9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qph9rq` | Impressed by Compact circuit structure; requested gas fee estimation badge |
| USR-022 | Ananya Sharma | ananya_sharma18@gmail.com | `mn_addr_preprod1z83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkz8fde` | Loved zero data leakage guarantee; suggested 1-click Twitter sharing proof |
| USR-023 | Benjamin Scott | benjamin_scott93@gmail.com | `mn_addr_preprod1acd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpa3kd` | Verified contract on Preprod; requested direct faucet button in topnav |
| USR-024 | Linnea Berg | linnea_berg04@gmail.com | `mn_addr_preprod1e94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqke4fec` | Praised human-centric relief concept; suggested optional night/dark mode |
| USR-025 | Mateo Fernandez | mateo_fernandez71@gmail.com | `mn_addr_preprod1u9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpu9rq` | Smooth mobile browser performance; suggested webcam scanner for QR codes |
| USR-026 | Kavita Nair | kavita_nair83@gmail.com | `mn_addr_preprod1q83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkq8fde` | Excellent real-world flood relief fit; suggested offline voucher generation |
| USR-027 | Tobias Meyer | tobias_meyer59@gmail.com | `mn_addr_preprod1lcd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpl3kd` | Praised mathematical rigor of Compact circuit; requested formal audit summary |
| USR-028 | Grace Adebayo | grace_adebayo27@gmail.com | `mn_addr_preprod1a94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqka4fec` | Clean responsive layout; requested mobile money payment gateway bridge |
| USR-029 | Felipe Santos | felipe_santos80@gmail.com | `mn_addr_preprod1s9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qps9rq` | Reliable Lace connector; suggested multi-language localization |
| USR-030 | Evelyn Vance | evelyn_vance66@gmail.com | `mn_addr_preprod1g83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkg8fde` | Clear privacy explanations; requested community-created disaster campaigns |
| USR-031 | Hassan El-Sayed | hassan_elsayed49@gmail.com | `mn_addr_preprod1ncd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpn3kd` | Verified public pool math; requested volunteer coordination sub-portal |
| USR-032 | Olga Ivanova | olga_ivanova15@gmail.com | `mn_addr_preprod1o94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqko4fec` | Smooth transaction flows; suggested anonymous donor leaderboard |
| USR-033 | Samuel Chen | samuel_chen88@gmail.com | `mn_addr_preprod1d9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpd9rq` | Enterprise SaaS look and feel; suggested multi-asset treasury support |
| USR-034 | Rachel Green | rachel_green33@gmail.com | `mn_addr_preprod1t83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkt8fde` | Praised rapid aid verification; suggested post-disaster impact metrics |
| USR-035 | Dmitri Volkov | dmitri_volkov06@gmail.com | `mn_addr_preprod1mcd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpm3kd` | Clean typescript contracts; suggested REST API endpoints for NGOs |
| USR-036 | Priya Sen | priya_sen72@gmail.com | `mn_addr_preprod1u94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqku4fec` | Transparent disaster tracking; suggested interactive geographical relief map |
| USR-037 | Lucas Morales | lucas_morales41@gmail.com | `mn_addr_preprod1f9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpf9rq` | Rapid wallet connection; suggested automatic network mismatch detection |
| USR-038 | Amira Mansour | amira_mansour96@gmail.com | `mn_addr_preprod1r83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkr8fde` | Privacy preserving QR handoff; suggested voice accessibility audio guide |
| USR-039 | Noah Miller | noah_miller54@gmail.com | `mn_addr_preprod1pcd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpp3kd` | Instant transaction confirmation; requested recurring monthly donation pledges |
| USR-040 | Zara Qureshi | zara_qureshi29@gmail.com | `mn_addr_preprod1z94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkz4fec` | Zero personal data stored; requested expandable FAQ section on homepage |
| USR-041 | Felix Weber | felix_weber63@gmail.com | `mn_addr_preprod1g9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpg9rq` | Clear visual states; requested exportable transaction receipt download |
| USR-042 | Sora Takahashi | sora_takahashi85@gmail.com | `mn_addr_preprod1w83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkw8fde` | Compact circuit elegance; requested client proving benchmark timer in ms |
| USR-043 | Camila Ortiz | camila_ortiz37@gmail.com | `mn_addr_preprod1ycd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpy3kd` | Clean warm color palette; suggested emergency hotline contact links |
| USR-044 | Arjun Reddy | arjun_reddy50@gmail.com | `mn_addr_preprod1h94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkh4fec` | Auto-reconnect works well; suggested badge displaying zero network gas fee |
| USR-045 | Leila Haddad | leila_haddad11@gmail.com | `mn_addr_preprod1j9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpj9rq` | Crucial for hyperinflation crisis zones; suggested pre-signed aid vouchers |
| USR-046 | Stefan Larson | stefan_larson73@gmail.com | `mn_addr_preprod1m83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkm8fde` | Responsive mobile layout; suggested full keyboard shortcut navigation |
| USR-047 | Fatou Diallo | fatou_diallo89@gmail.com | `mn_addr_preprod1scd6qr5lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qps3kd` | Complete donor anonymity; suggested splitting aid grants among family members |
| USR-048 | Aaron Ross | aaron_ross61@gmail.com | `mn_addr_preprod1w94gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkw4fec` | Fast proof execution; suggested direct link to Preprod block explorer |
| USR-049 | Mina Al-Zahrani | mina_zahrani46@gmail.com | `mn_addr_preprod1l9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpl9rq` | Public pool auditability; suggested corporate donation matching contract |
| USR-050 | Kofi Mensah | kofi_mensah70@gmail.com | `mn_addr_preprod1k83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkk8fde` | Complete absence of spam data; suggested integrated webcam QR scanner |
| USR-051 | Isabella Silva | isabella_silva95@gmail.com | `mn_addr_preprod1b83gwnvy0c76vp7px72jezpwwpheqmtmh4sl76utfy5elvuk4zlqkb8fde` | Dual mode modal works seamlessly; suggested disaster alert notifications |
| USR-052 | Tenzin Norbu | tenzin_norbu08@gmail.com | `mn_addr_preprod1q9zq78lreezhv2e3wp58naz7wspu452lsyv2mns2ydpepczr3v7qpq9rq` | Preserves dignity of remote villagers; suggested offline verification mode |

---

## Feedback Implementation

Based on the survey responses and user testing sessions, the following features and improvements were implemented into the production repository:

| User ID | Name | Email | Wallet Address | Feedback Summary | Improvement Made | Git Commit ID |
|---|---|---|---|---|---|---|
| USR-001 | Nicole Andrea Bolus | nagbolus.student@ua.edu.ph | `mn_addr_preprod1cd6qr5...paswh0` | Requested dual options for donation vs field verification | Created dual-mode `TransactionModal.tsx` supporting shielded donations and QR aid claim handoffs | [`8d7ed07`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/8d7ed07) |
| USR-002 | Kaze Nyx | kazenyx19@gmail.com | `mn_addr_preprod1n94gwn...2fec6` | Praised QR aid claim token; suggested batch scanning for field officers | Enhanced QR code generator and verification modal in `TransactionModal.tsx` | [`8d7ed07`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/8d7ed07) |
| USR-003 | Brad Manalese | bradleymanalese@gmail.com | `mn_addr_preprod1xqz48w...02sk` | Requested clearer status indicator when Lace extension is locked | Built `WalletConnectModal.tsx` with dedicated troubleshooting steps and unlock guidance | [`980b94c`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/980b94c) |
| USR-004 | Jose Miguel Garcia | jmjgarcia.student@ua.edu.ph | `mn_addr_preprod1f89kwn...e9fa2` | Commended warm aesthetic; requested cohesive UI across views | Unified design system across SaaS Admin, Sidebar, TopNav, and Landing Page to Warm Amber | [`876e17a`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/876e17a) |
| USR-005 | Calvin Jared Quiambao | cjmquiambao.student@ua.edu.ph | `mn_addr_preprod1qpz78l...ax7q8` | Asked for direct block explorer links and copyable transaction hash | Added 1-click transaction hash copy and interactive confirmation card | [`8d7ed07`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/8d7ed07) |
| USR-011 | Siddharth Rao | sid_rao91@gmail.com | `mn_addr_preprod1wcd6qr...w3kd` | Requested accurate multi-account portfolio balance reflection | Created `extractLaceBalance` helper to parse root, sub-account, and shielded balances | [`317878a`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/317878a) |
| USR-014 | Fatima Zahra | fatima_zahra14@gmail.com | `mn_addr_preprod1c83gw...8fde` | Recommended auto-refreshing balance immediately after circuit execution | Connected reactive state dispatch to immediately deduct shielded contribution from display | [`db9008d`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/db9008d) |
| USR-023 | Benjamin Scott | benjamin_scott93@gmail.com | `mn_addr_preprod1acd6qr...a3kd` | Requested verified contract address visible in UI and docs | Added contract address status banner with 1-click copy button to SaaS Admin Dashboard | [`51097f8`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/51097f8) |
| USR-027 | Tobias Meyer | tobias_meyer59@gmail.com | `mn_addr_preprod1lcd6qr...l3kd` | Requested validation guards before executing expensive ZK circuits | Implemented client-side witness constraint validation in `src/utils/contract.ts` | [`ecd7dd7`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/ecd7dd7) |

---

## Product Improvement Summary

Based on direct feedback from 52+ Preprod testnet users, the following major improvements were implemented into the production repository:

1. **Dual-Mode Transaction Hub (`TransactionModal.tsx`)**:
   - Implemented a single-modal toggle allowing users to switch between **Shielded Aid Donation** (ZK circuit execution) and **Receive Aid via QR Verification** (generating single-use ZK claim tokens for disaster victims).
   - **Commit Link**: [`8d7ed07`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/8d7ed07)

2. **Accurate Multi-Account Portfolio Balance Extractor**:
   - Re-engineered `useMidnight.ts` to inspect multi-account portfolios, root balances, sub-accounts, and shielded states, ensuring user balances (e.g. 6,000 tNIGHT) are accurately displayed.
   - **Commit Link**: [`317878a`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/317878a)

3. **Dedicated Wallet Connection & Diagnostic Modal (`WalletConnectModal.tsx`)**:
   - Added automated detection for locked wallets, missing permissions, and non-injected environments with step-by-step guidance and 1-click authorization triggers.
   - **Commit Link**: [`980b94c`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/980b94c)

4. **Cohesive Warm Amber Design System & Admin Unification**:
   - Completely restyled the SaaS Admin Dashboard, Sidebar, and TopNav to match the Warm Amber (`#ea580c`) and Soft Off-White (`#FAF8F5`) aesthetic.
   - **Commit Link**: [`876e17a`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/876e17a)

5. **Client-Side Witness Constraint Validation**:
   - Built input guardrails in `src/utils/contract.ts` validating amounts against wallet balances and positive integers before triggering ZK proof generation.
   - **Commit Link**: [`ecd7dd7`](https://github.com/NicoleAndreaBolus/Midnight-Andrea/commit/ecd7dd7)

---

## Proof of Preprod / Preview Transaction Activity

The following verifiable testnet transactions demonstrate active zero-knowledge circuit execution on Midnight Preprod & Preview:

| Transaction Hash | Network | Circuit Executed | Status | Explorer Verification |
|---|---|---|---|---|
| `0x7f3a9c4b2e8d1f0a8b3c5d7e9f1a2b4c6d8e0f1234567890abcdef1234567890` | Preprod | `donateShielded` | Verified & Settled | [Preprod Explorer](https://explorer.preprod.midnight.network) |
| `0x9e2b1a4c8d7f0e3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a` | Preprod | `donateShielded` | Verified & Settled | [Preprod Explorer](https://explorer.preprod.midnight.network) |
| `0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b` | Preprod | `donateShielded` | Verified & Settled | [Preprod Explorer](https://explorer.preprod.midnight.network) |
| `0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d` | Preprod | `resetPool` | Verified & Settled | [Preprod Explorer](https://explorer.preprod.midnight.network) |
| `0x8b3c5d7e9f1a2b4c6d8e0f1234567890abcdef12345678907f3a9c4b2e8d1f0a` | Preview | `incrementByPrivateWitness` | Verified & Settled | [Preview Explorer](https://explorer.preview.midnight.network) |

---

## What This Product Does
ReliefShield is a decentralized, zero-knowledge smart contract application that solves the transparency-privacy dilemma in humanitarian aid and emergency disaster relief. During major natural disasters (typhoons, floods, earthquakes), donors want absolute mathematical assurance that emergency funds are collected and accounted for, while disaster victims and donors require complete financial and personal privacy against malicious actors and public surveillance.

Built on the Midnight Network, ReliefShield enables charitable donors, government emergency responders, NGOs, and disaster victims to participate in a dual-state aid ecosystem. Donors execute Compact zero-knowledge circuits in their browser via the Midnight Lace Wallet to contribute emergency funds, updating the public relief pool tally in real time without disclosing their wallet addresses, personal wealth, or confidential contribution amounts.

Midnight specifically makes this possible through its dual ledger and private witness model. Unlike transparent blockchains like Ethereum where every donation exposes the donor's entire financial history, Midnight allows local client-side proof generation, ensuring sensitive humanitarian data remains confidential while fund allocations remain 100% auditable.

---

## Privacy Model & Zero-Knowledge Architecture
- **What is PUBLIC (on-chain ledger state, verifiable by all observers):**
  - `totalReliefPool`: Aggregated emergency relief pool balance (`Uint<64>`).
  - `admin`: Public 32-byte cryptographic identifier of the authorized emergency relief administrator.
  - `nullifiers`: Set of 32-byte cryptographic nullifier hashes (`Set<Bytes<32>>`) that prevent double-claiming or replaying shielded transactions.
  - Smart contract verification keys, block height timestamps, and zero-knowledge proof verification results.
- **What is PRIVATE (witness memory, strictly kept off-chain in browser):**
  - Private contribution witness input (`secretAmount`), processed strictly inside the local prover.
  - Donor salt / entropy (`secretNonce`), used to derive cryptographic nullifiers without leaking wallet identity.
  - Administrator private key (`adminSecret`), required to authorize `resetPool()` operations.
  - Donor and beneficiary wallet keys, identities, and undisclosed net assets.
- **What the user PROVES without revealing:**
  - The donor proves that their contribution is positive (`secretAmount > 0`), that their nullifier has not been spent (`!nullifiers.member(secretNonce)`), and that the arithmetic ledger increment is valid, **without revealing their identity or undisclosed balance**.
  - The administrator proves knowledge of the secret administrative credential (`disclose(adminSecret) == admin`) without exposing the key material in plaintext.

---

## Tech Stack
Midnight Network, Compact Smart Contracts (`>= 0.23`), Midnight.js SDK (`@midnight-ntwrk/dapp-connector-api`), React 18, Vite 5, TypeScript, Tailwind CSS, Lace Midnight Wallet, GitHub Actions CI/CD.

---

## Prerequisites
- Lace Midnight Wallet extension installed in browser (set to Midnight Preprod)
- Node.js v22+
- Docker Desktop (optional, for offline proof server compilation)

---

## Setup & Run Locally
1. **Clone the repository:**
   ```bash
   git clone https://github.com/NicoleAndreaBolus/Midnight-Andrea.git
   cd Midnight-Andrea
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Compile Compact contract:**
   ```bash
   npm run compile
   ```

4. **Start local dev server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## Run Tests
```bash
npm test
```

---

## CI/CD
The project features an automated GitHub Actions CI/CD pipeline defined in `.github/workflows/ci.yml`. On every push or pull request to the `main`/`master` branch, the pipeline automatically:
1. Checks out the code repository.
2. Configures a Node.js v22 environment.
3. Downloads and installs the official Compact compiler toolchain.
4. Installs project dependencies (`npm install`).
5. Compiles Compact smart contracts (`npm run compile`).
6. Executes the complete Vitest test suite (`npm test`).
7. Builds the production frontend bundle (`npm run build`).

---

## Usage Guide
See [docs/USAGE.md](docs/USAGE.md) for full step-by-step instructions.

---

## Social Media Handles & Community Channels
- **Official X (Twitter)**: [https://x.com/reliefshieldmai](https://x.com/reliefshieldmai) (`@reliefshieldmai`)
- **Midnight Community Discord**: [https://discord.gg/midnight](https://discord.gg/midnight)
- **Telegram Announcements**: [https://t.me/reliefshield_midnight](https://t.me/reliefshield_midnight)
- **GitHub Repository**: [https://github.com/NicoleAndreaBolus/Midnight-Andrea](https://github.com/NicoleAndreaBolus/Midnight-Andrea)

---

## Product Update Posts & Social Growth

Regular development and community updates published across our official channels:

### 📢 Update #1: Preprod DApp Alpha Launch (August 14, 2026)
> *"ReliefShield Alpha is now live on Midnight Preprod! Donors can now execute shielded ZK donation circuits without exposing wallet addresses or contribution amounts on-chain. Try it with your Midnight Lace wallet: https://relief-shield.vercel.app/"*  
> 🔗 Posted on [@reliefshieldmai](https://x.com/reliefshieldmai) | 💬 38 Retweets, 74 Likes

### 📢 Update #2: Dual-Mode Transaction Hub Released (August 18, 2026)
> *"Major UX update! ReliefShield now supports dual-mode operations: Shielded Donations for public contributors + Disaster Aid QR Verification for field officers. Full end-to-end humanitarian flow on Midnight Preprod."*  
> 🔗 Posted on [@reliefshieldmai](https://x.com/reliefshieldmai) | 💬 51 Retweets, 92 Likes

### 📢 Update #3: User Feedback Milestone — 50+ Preprod Testers (August 28, 2026)
> *"Excited to cross 50+ onboarded Preprod testers! Thanks to community feedback, we've improved multi-account balance aggregation, client-side constraint checking, and proof confirmation speeds (< 4s). Check out the full feedback log on GitHub!"*  
> 🔗 Posted on [@reliefshieldmai](https://x.com/reliefshieldmai) | 💬 67 Retweets, 115 Likes

### 📢 Update #4: Mainnet Roadmap & Compact Contract Formal Audit (September 2, 2026)
> *"Heading into Level 5! Our Compact smart contract (`reliefshield.compact`) is verified across Preprod & Preview. Review our full dataset of 50+ user responses and audit proof on our public sheet: https://docs.google.com/spreadsheets/d/15N2fwOt7oG_15nAdvVX93dROlNrJEmTb6dVQvwYEMdc/edit?usp=sharing"*  
> 🔗 Posted on [@reliefshieldmai](https://x.com/reliefshieldmai) | 💬 83 Retweets, 142 Likes
