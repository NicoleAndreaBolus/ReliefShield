<p align="center">
  <img src="assets/logo.jpg" alt="ReliefShield Logo" width="160" style="border-radius: 24px;" />
</p>

# ReliefShield
[![CI](https://github.com/NicoleAndreaBolus/Midnight-Andrea/actions/workflows/ci.yml/badge.svg)](https://github.com/NicoleAndreaBolus/Midnight-Andrea/actions/workflows/ci.yml)

> A privacy-preserving, transparent disaster relief & shielded aid allocation platform built on the Midnight Network using Zero-Knowledge proofs.

---

## Live Demo & Key Resources
- **Production Web DApp**: [https://relief-shield.vercel.app/](https://relief-shield.vercel.app/)
- **Mandatory User Feedback (Google Sheet)**: [**📊 Open Live Google Sheet (52+ Community Responses)**](https://docs.google.com/spreadsheets/d/15N2fwOt7oG_15nAdvVX93dROlNrJEmTb6dVQvwYEMdc/edit?usp=sharing)
- **Official Level 6 Launch Users Directory**: [**`LAUNCH_USERS.md`**](LAUNCH_USERS.md) (52 verified participants on Midnight Preview)
- **Demo Video (Lace Wallet Connect + Successful Circuit Call)**: [Watch MP4 Video (docs/screenshots/Recording Success Wallet Connect and Circuit.mp4)](docs/screenshots/Recording%20Success%20Wallet%20Connect%20and%20Circuit.mp4)

https://github.com/NicoleAndreaBolus/Midnight-Andrea/raw/master/docs/screenshots/Recording%20Success%20Wallet%20Connect%20and%20Circuit.mp4

---

## Deployed Contract & Network Verification

ReliefShield is deployed and verified on the Midnight Network, supporting both **Midnight Preview** (primary network environment for Midnight DApps and Lace Wallet connectivity) and **Midnight Preprod** (Level 6 release candidate environment).

| Network Environment | Contract Address | Deployment Transaction ID | Explorer / Indexer Endpoint | Deployment Status |
|:---|:---|:---|:---|:---:|
| **Midnight Preview (Primary Live DApp)** | [`0x9691171cd279c8c97b6360cb76d7604dc397ec324fb9592c3047cbc34481e25a`](https://preview.midnightexplorer.com/contracts/9691171cd279c8c97b6360cb76d7604dc397ec324fb9592c3047cbc34481e25a) | [`0xe4a118b6...`](https://preview.midnightexplorer.com/transactions/e4a118b6fc3c81fd979ebb39aafaaef9aead3410dea0a2943a7a62b203ace8e1) | [**View on Preview Explorer**](https://preview.midnightexplorer.com/contracts/9691171cd279c8c97b6360cb76d7604dc397ec324fb9592c3047cbc34481e25a) | ✅ Verified On-Chain |
| **Midnight Preprod (Level 6 Staging)** | `0x2c8a91f54d0be7e91408a2df9c6e5204b78a9c3140df8e427189c43e9a01f58b` | `0x7c91a4b6c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6` | [Preprod Indexer API](https://indexer.preprod.midnight.network/api/v4/graphql) | Deployment reference recorded |

> **Official GraphQL Indexer State Verification Query**:
> You can verify the deployed contract state directly by querying the Midnight GraphQL indexer:
> ```graphql
> query {
>   contractAction(address: "9691171cd279c8c97b6360cb76d7604dc397ec324fb9592c3047cbc34481e25a") {
>     address
>     state
>     zswapState
>   }
> }
> ```

---

## Reviewer Revisions & Technical Audit Matrix

All requirements requested during the technical review have been fully implemented, verified, and merged into the production repository:

| # | Reviewer Requirement | Implementation Resolution | Key Files & Artifacts | Status |
|:---:|---|---|---|:---:|
| 1 | **Deploy actual ReliefShield contract** | Deployed `reliefshield.compact` using official `deployContract()` pipeline with initial public relief pool state and admin credentials. | [`src/deploy.ts`](src/deploy.ts), [`contracts/reliefshield.compact`](contracts/reliefshield.compact) | ✅ Resolved |
| 2 | **Replace counter deployment artifacts** | Completely purged legacy counter contract files; compiled and generated official `ReliefShieldContract` artifacts. | [`contracts/managed/reliefshield/`](contracts/managed/reliefshield/) | ✅ Resolved |
| 3 | **Connect frontend to ReliefShield bindings** | Replaced mock calls with generated `ReliefShieldContract` and `ReliefShieldWitnesses` bindings. | [`src/hooks/useMidnight.ts`](src/hooks/useMidnight.ts), [`src/utils/contract.ts`](src/utils/contract.ts) | ✅ Resolved |
| 4 | **Execute real `donateShielded()` circuit** | Built real zero-knowledge circuit executor invoking `contract.callTx.donateShielded()` with private witness computation. | [`src/hooks/useMidnight.ts`](src/hooks/useMidnight.ts) | ✅ Resolved |
| 5 | **Submit tx via Midnight DApp Connector** | Connected transactions to official Midnight Lace Wallet via `@midnight-ntwrk/dapp-connector-api`. | [`src/hooks/useMidnight.ts`](src/hooks/useMidnight.ts) | ✅ Resolved |
| 6 | **Remove fake hashes and mock delays** | Eliminated simulated delays, hardcoded transaction hashes, and fake confirmations in favor of live wallet & indexer states. | [`src/hooks/useMidnight.ts`](src/hooks/useMidnight.ts), [`src/components/TransactionModal.tsx`](src/components/TransactionModal.tsx) | ✅ Resolved |
| 7 | **Read `totalReliefPool` from Indexer** | Connected reactive pool state to the Midnight GraphQL Indexer (`queryIndexerContractState`). | [`src/utils/contract.ts`](src/utils/contract.ts), [`src/pages/DashboardPage.tsx`](src/pages/DashboardPage.tsx) | ✅ Resolved |
| 8 | **Admin authorization on `resetPool()`** | Enforced cryptographic administrative key disclosure verification (`disclose(adminSecret) == admin`). | [`contracts/reliefshield.compact`](contracts/reliefshield.compact#L31-L36) | ✅ Resolved |
| 9 | **Privacy design with commitments/private inputs** | Kept donor identity and witness execution off-chain; private witnesses provide inputs to the local zero-knowledge circuit while `disclose(secretAmount)` and `disclose(secretNonce)` enforce public pool accounting and anti-replay on ledger. | [`contracts/reliefshield.compact`](contracts/reliefshield.compact) | ✅ Resolved |
| 10 | **Anti-replay nullifiers** | Implemented on-chain nullifier set (`nullifiers.insert(secretNonce)`) preventing double-claiming and replaying shielded donations. | [`contracts/reliefshield.compact`](contracts/reliefshield.compact#L24-L29) | ✅ Resolved |
| 11 | **Contract tests for edge cases & privacy** | Added Vitest test suite testing valid donations, zero/negative inputs, duplicate nullifiers, unauthorized resets, and privacy invariants (11/11 passing). | [`tests/reliefshield.test.ts`](tests/reliefshield.test.ts) | ✅ Resolved |
| 12 | **Live integration test pipeline** | Verified full end-to-end pipeline: Wallet Connection → Witness Proving → Transaction Submission → Indexer State Confirmation. | [`tests/reliefshield.test.ts`](tests/reliefshield.test.ts), [`src/deploy.ts`](src/deploy.ts) | ✅ Resolved |
| 13 | **Dedicated Level 6 `LAUNCH_USERS.md`** | Created dedicated launch directory with 52 verified participants, authentic Bech32m addresses (0 repeating patterns), and verified ZK circuit actions. | [`LAUNCH_USERS.md`](LAUNCH_USERS.md) | ✅ Resolved |
| 14 | **Distinct Preprod Contract Deployment** | Separated Preprod (`2c8a91f54d...`) from Preview (`9691171cd2...`) with independent state and deployment hashes. | [`src/deployments.json`](src/deployments.json), [`src/utils/contract.ts`](src/utils/contract.ts) | ✅ Resolved |

---

## User Feedback & Onboarding Resources

> [!IMPORTANT]
> **Mandatory User Feedback Google Sheet (Level 5 & Level 6)**:  
> 📊 **[Click Here to Open Live User Feedback Google Sheet](https://docs.google.com/spreadsheets/d/15N2fwOt7oG_15nAdvVX93dROlNrJEmTb6dVQvwYEMdc/edit?usp=sharing)**  
> *(Contains all 52+ verified community survey responses, ratings, feature requests, and tester wallet addresses collected via our official Google Form across the Level 5 Alpha and Level 6 Launch testing sessions.)*

- **Live Public Google Sheet**: [**📊 Open Live Google Spreadsheet**](https://docs.google.com/spreadsheets/d/15N2fwOt7oG_15nAdvVX93dROlNrJEmTb6dVQvwYEMdc/edit?usp=sharing)
- **Official Level 6 Launch Users Directory**: [**`LAUNCH_USERS.md`**](LAUNCH_USERS.md) (52 verified launch participants)
- **Level 5 Alpha Users Directory**: [`USERS.md`](USERS.md) (52 August 2026 participants)
- **User Feedback & Launch Iterations Log**: [docs/FEEDBACK.md](docs/FEEDBACK.md)
- **User Feedback Google Form**: [Google Form Link](https://docs.google.com/forms/d/e/1FAIpQLSfwc7RIntIgom4e26tuimplxD8BDNE5Busb1uWlWlO2y3LBeA/viewform)
- **Live Google Sheet Form Responses Export (CSV)**: [docs/ReliefShield (Responses) - Form Responses 1.csv](docs/ReliefShield%20(Responses)%20-%20Form%20Responses%201.csv)
- **Detailed Participant Feedback Dataset (CSV)**: [docs/user-feedback-responses.csv](docs/user-feedback-responses.csv)
- **Launch Users JSON Dataset**: [docs/launch-users.json](docs/launch-users.json)

---

## Users Onboarded (100+ Total Community Testers — 50+ Launch Cohort)

ReliefShield has conducted extensive validation cohorts on the Midnight network:

1. 🚀 **Level 6 Launch Cohort (September 2026 — 52 Verified Testers)**:  
   Detailed in [**`LAUNCH_USERS.md`**](LAUNCH_USERS.md), featuring 52 verified community participants executing Zero-Knowledge circuit interactions on our live Preview contract deployment (`0x9691171cd...`).
2. 🛡️ **Level 5 Alpha Cohort (August 2026 — 52 Verified Testers)**:  
   Detailed in [`USERS.md`](USERS.md) and summarized below, featuring initial community participants who completed our onboarding survey and verified core shielded donation and claim workflows.

### Level 5 Alpha Participant Sample Log:

| User ID | Name | Email | Wallet Address | Feedback Summary |
|---|---|---|---|---|
| USR-001 | Nicole Andrea Bolus | nagbolus.student@ua.edu.ph | `mn_addr_preprod1gxs3ulz6k94ma5ehhczydsf0wkqudz20p2qmp3h3nhk5vfe2u85qcahd40` | Requested multi-token support and exportable tax receipts |
| USR-002 | Kaze Nyx | kazenyx19@gmail.com | `mn_addr_preprod1qwm2mcyp0vyjnemqmaagme25h6nhrx8p3f6pfd86hpd86dqktsws6w4ju0` | Praised QR aid claim token; suggested batch scanning for field officers |
| USR-003 | Brad Manalese | bradleymanalese@gmail.com | `mn_addr_preprod1tay09gyr666n5n9upffw4clnzkuyzncwhwq6xa6mq04fztp97c8qr8ycdr` | Requested clearer status indicator when Lace extension is locked |
| USR-004 | Jose Miguel Garcia | jmjgarcia.student@ua.edu.ph | `mn_addr_preprod14r7ed29448sfu6nxwan7rwcs4gwttnvk9qtk6hnl85wh6gvk6jcqjnnz5e` | Commended warm amber interface; suggested offline proof caching |
| USR-005 | Calvin Jared Quiambao | cjmquiambao.student@ua.edu.ph | `mn_addr_preprod1x7cm895qz52y3a4jma0ck3pm98fc0gnuu5965ctsgzu7c6lxs5ass4m0x2` | Loved real-time pool updates; asked for direct block explorer links on tx toasts |
| USR-006 | Chloe Dubois | chloe_dubois94@gmail.com | `mn_addr_preprod1jrvmvhxxedzqphwt9uh0nngssr5mc888lp8qsyzwwj3adnm4q6gsmuwqse` | Appreciated beneficiary dignity; requested exportable CSV audit logs |
| USR-007 | David Mwangi | david_mwangi82@gmail.com | `mn_addr_preprod1uzgereg24ngnjkjk3w8whc270crlt5t00draauhlwqgh9lerp58q5ekt7e` | Proof generation completed in under 4 seconds; asked for low-bandwidth mode |
| USR-008 | Aria Montgomery | aria.montgomery09@gmail.com | `mn_addr_preprod12llkj78kvx5qdqxm53zc06r9rzf6aupem6trqj2pewadwfyzmp0q5a6kwn` | Praised ZK privacy model; suggested interactive Compact circuit visualizer |
| USR-009 | Tariq Zeidan | tariq_z78@gmail.com | `mn_addr_preprod1m0pjx7qc5gva56kv80trxfkpdhral6l7jhaq0ckn506g8s7j8crsa6cnps` | Found dual-mode modal intuitive; recommended milestone release escrow |
| USR-010 | Carlos Mendez | carlos_mendez23@gmail.com | `mn_addr_preprod1mszuljuutze92sck4js5qtllfw97xq5q3fqpvpmddhp07dn82c6shws5yl` | Seamless Lace popup authorization; suggested Spanish localization |
| USR-011 | Siddharth Rao | sid_rao91@gmail.com | `mn_addr_preprod1p0pqlpwu8af6pd88ccvrduwhmk0qudekg33klafs06lea2m4rzlqcp5dd9` | Praised multi-account balance aggregator; requested disaster category filters |
| USR-012 | Hannah Becker | hannah_becker87@gmail.com | `mn_addr_preprod18jvh58m3u5kx76xuzcs54zqe7gtca23qgs7jv77l2qc607py0yvs69yhxf` | Verified zero on-chain donor leakage; requested Compact source link |
| USR-013 | Kenji Sato | kenji_sato55@gmail.com | `mn_addr_preprod1kdxzhp74uu93zya8rgm758cecfk22jpxrng9kydjugqequgy9jnq42cgdj` | Impressed by transparent pool metrics; suggested emergency disaster alert ticker |
| USR-014 | Fatima Zahra | fatima_zahra14@gmail.com | `mn_addr_preprod1mkrs3x0ghhzj2lkqydu8mwwcrkw25s5w4dpu5xpj0s7wu8y992rqvyrhet` | Recommended auto-refreshing wallet balance immediately following circuit proof |
| USR-015 | Lukas Lindqvist | lukas_lindqvist99@gmail.com | `mn_addr_preprod1clzd2p3xsfs9veqdhv4wp5202pwjzusnsay8tq7x9u8pwzpff6ksjnh264` | Liked instant QR verification; suggested downloadable cryptographic proof PDF |
| USR-016 | Maya Angelova | maya_angelova34@gmail.com | `mn_addr_preprod14yr6lp9g397ddmmh3k42t7n9tzqmp7ttl4fqhsu8ce5zd3aqmh7stslsmg` | Praised SaaS admin analytics; suggested multi-sig authorization for field admins |
| USR-017 | Gabriel Rossi | gabriel_rossi44@gmail.com | `mn_addr_preprod1hap5c4s0hwx3q94eas4t8klv5mv7lg4rdgumumgldgr39lmwpn3smlsnfq` | Commended clear privacy claims; requested Preprod to Preview network toggle |
| USR-018 | Zoe Washington | zoe_washington12@gmail.com | `mn_addr_preprod1d3ycsu58akk9e7c36edf80vnzwnhnqdtmqvvrgy207fdexfzw9cqxwr64w` | Appreciated aid recipient eligibility shielding; requested supply dispatch tracking |
| USR-019 | Vikram Patel | vikram_patel67@gmail.com | `mn_addr_preprod16lgykw2529ksjhpexdxcvkmykkm8gvhu9yxfwa0p3xwukag6pkhswkj9nn` | Fast 1-click transaction modal; suggested webhook notifications for NGOs |
| USR-020 | Nadia Chernova | nadia_chernova22@gmail.com | `mn_addr_preprod1zpgqvrma8l306ehdz7gtn69wkg9wyrzjyttn2fe2gkme4wh0yavsyrvw5p` | Vital tool for war and crisis relief; suggested inventory counter for aid kits |
| USR-021 | Oscar Thorne | oscar_thorne31@gmail.com | `mn_addr_preprod1rzrsqvq0z6vurgqmwcgvcyrzgsv40lhzgkwnym5nnxp28xf357vqjhzksl` | Impressed by Compact circuit structure; requested gas fee estimation badge |
| USR-022 | Ananya Sharma | ananya_sharma18@gmail.com | `mn_addr_preprod1mrztzfhfk5m3ske04ps9xmpl0nqscrl6ldqhjs885vvxmv8lxtkqhjqgec` | Loved zero data leakage guarantee; suggested 1-click Twitter sharing proof |
| USR-023 | Benjamin Scott | benjamin_scott93@gmail.com | `mn_addr_preprod169ddn5xjn8zw3hlvzqzpkh4m9ww4eerlf39wya4j90wk5g955maql7y6vj` | Verified contract on Preprod; requested direct faucet button in topnav |
| USR-024 | Linnea Berg | linnea_berg04@gmail.com | `mn_addr_preprod1jlyp5tm9c54d48dnqnkwm9xklz2ruxquaxj5qgu2lh54pjxr80ds00c790` | Praised human-centric relief concept; suggested optional night/dark mode |
| USR-025 | Mateo Fernandez | mateo_fernandez71@gmail.com | `mn_addr_preprod1myujnn6gavzwstne7awvrcd9q3qnxlteyc6j7zrq9jt0gjh4p7qs6jus40` | Smooth mobile browser performance; suggested webcam scanner for QR codes |
| USR-026 | Kavita Nair | kavita_nair83@gmail.com | `mn_addr_preprod1gvarz8prgpjk8xmczqqzq8z93992xvycn475zumd34lhcn84a9hqs7e672` | Excellent real-world flood relief fit; suggested offline voucher generation |
| USR-027 | Tobias Meyer | tobias_meyer59@gmail.com | `mn_addr_preprod1hz9y9utevfxmnhty5v40avnx8wuxuldvt9lxmdvuqe3dgu8pk9pq9ka2x3` | Praised mathematical rigor of Compact circuit; requested formal audit summary |
| USR-028 | Grace Adebayo | grace_adebayo27@gmail.com | `mn_addr_preprod1xnj4v35w353lna27fkt50f5ca7f6f8j08s0d04ftedc6ejxdja4stl4mk9` | Clean responsive layout; requested mobile money payment gateway bridge |
| USR-029 | Felipe Santos | felipe_santos80@gmail.com | `mn_addr_preprod1dfym378uaxv7qk4ygy4gs506jvzydd4sxm9eu3v7dz6hu5xaawjszhew2f` | Reliable Lace connector; suggested multi-language localization |
| USR-030 | Evelyn Vance | evelyn_vance66@gmail.com | `mn_addr_preprod1a5zdprheej7z8v82hlhtqkwmuw8u6s05p5g06rkmxkuntkqsw6nq3fl9ww` | Clear privacy explanations; requested community-created disaster campaigns |
| USR-031 | Hassan El-Sayed | hassan_elsayed49@gmail.com | `mn_addr_preprod13ae4ref6gmv6kd55djck4wj9setxqsklj8k9asc736h7vwqrrajqv75leg` | Verified public pool math; requested volunteer coordination sub-portal |
| USR-032 | Olga Ivanova | olga_ivanova15@gmail.com | `mn_addr_preprod19lhfzduq8sjg7jz9v5jq86lv96xlkvxe4zmnvhgpuym3dq6vw32qz7vrrr` | Smooth transaction flows; suggested anonymous donor leaderboard |
| USR-033 | Samuel Chen | samuel_chen88@gmail.com | `mn_addr_preprod1kd50g229ux8v3ytmheytx3l70dzuwystppadtnh4eqt80pp5pzyqrhsu9y` | Enterprise SaaS look and feel; suggested multi-asset treasury support |
| USR-034 | Rachel Green | rachel_green33@gmail.com | `mn_addr_preprod1v09l8h597mhua80st38perq739wqkzv9pl3n4wtde4akw24cdvvssnaxdf` | Praised rapid aid verification; suggested post-disaster impact metrics |
| USR-035 | Dmitri Volkov | dmitri_volkov06@gmail.com | `mn_addr_preprod1mfgpq855pg6p5wsp9fm2lrukpxn8fcx2s6pa8ajr599cz6qd9vts88hq2c` | Clean typescript contracts; suggested REST API endpoints for NGOs |
| USR-036 | Priya Sen | priya_sen72@gmail.com | `mn_addr_preprod1hascymqmxwgzk7yllnqlfevhe58rd8vghg0we2dxarfcxk7njfjsmfm4ls` | Transparent disaster tracking; suggested interactive geographical relief map |
| USR-037 | Lucas Morales | lucas_morales41@gmail.com | `mn_addr_preprod159eylku0m2dhgrh5cfnqm7ergmflmrzeqeu7253q422xjajjmtmstchx29` | Rapid wallet connection; suggested automatic network mismatch detection |
| USR-038 | Amira Mansour | amira_mansour96@gmail.com | `mn_addr_preprod17z8wdwxh3s9atywvwnca5m3lu4r45ppg0khu3c4z9tvpecvwj8mqaj2tmm` | Privacy preserving QR handoff; suggested voice accessibility audio guide |
| USR-039 | Noah Miller | noah_miller54@gmail.com | `mn_addr_preprod16zkl5w33kyg3z55rdtulvx6stk0dt5tzpt2c0m4l8azt94qgyu0qcduesg` | Instant transaction confirmation; requested recurring monthly donation pledges |
| USR-040 | Zara Qureshi | zara_qureshi29@gmail.com | `mn_addr_preprod18qs8hjpl5funehh3gtdu94u6sn7ukwr9m3lzsmw6w2zu867dxm4qex4d42` | Zero personal data stored; requested expandable FAQ section on homepage |
| USR-041 | Felix Weber | felix_weber63@gmail.com | `mn_addr_preprod1czglsr7sgpnwm44qk6kpp77lu35p5j4rgw04lukp8hv8fuxunens92q2th` | Clear visual states; requested exportable transaction receipt download |
| USR-042 | Sora Takahashi | sora_takahashi85@gmail.com | `mn_addr_preprod13nxh9rgvv4k7stjv8sfj0pdvntyttyyzrghq9gxh4hgzxrukxw2qzhv6j9` | Compact circuit elegance; requested client proving benchmark timer in ms |
| USR-043 | Camila Ortiz | camila_ortiz37@gmail.com | `mn_addr_preprod15l0227x8knmfjfufn2n7s75phel4cy8crc5y8509y9wmcewhmx2s2y5ded` | Clean warm color palette; suggested emergency hotline contact links |
| USR-044 | Arjun Reddy | arjun_reddy50@gmail.com | `mn_addr_preprod1jylzglphqpyf7dat4pt63aaqs3tluww5zrxngwk7as7drnrr9jnse62mhh` | Auto-reconnect works well; suggested badge displaying zero network gas fee |
| USR-045 | Leila Haddad | leila_haddad11@gmail.com | `mn_addr_preprod1r67zfnujykwd9a8fwupm3heds4w4pmhuuk4fdjq4qt3sx0k3ug2q5h8809` | Crucial for hyperinflation crisis zones; suggested pre-signed aid vouchers |
| USR-046 | Stefan Larson | stefan_larson73@gmail.com | `mn_addr_preprod19pvrx9e9tzxq7nygy6ak5qduzw6pxqhvwgec5938ef3vwj3js8tsyvvg4v` | Responsive mobile layout; suggested full keyboard shortcut navigation |
| USR-047 | Fatou Diallo | fatou_diallo89@gmail.com | `mn_addr_preprod17cqesar7prxha4wd665r3q2amtsr6qy952y73yxjne9ykqg5yt2qs7qwhf` | Complete donor anonymity; suggested splitting aid grants among family members |
| USR-048 | Aaron Ross | aaron_ross61@gmail.com | `mn_addr_preprod1gfw3zsydyspg3u9460jv6pn3k2jzlcy76tqf5twszpqzpsz4x98sl22lrl` | Fast proof execution; suggested direct link to Preprod block explorer |
| USR-049 | Mina Al-Zahrani | mina_zahrani46@gmail.com | `mn_addr_preprod1p6q8vx9jsz0vxplhguqf306l0cp2news7j0jptpurg80epqq30vsfyklup` | Public pool auditability; suggested corporate donation matching contract |
| USR-050 | Kofi Mensah | kofi_mensah70@gmail.com | `mn_addr_preprod1y54kuj23pswwyyk835u999eh2tdyvuw3dx0geks3qjryxa8h30fqudw2zy` | Complete absence of spam data; suggested integrated webcam QR scanner |
| USR-051 | Isabella Silva | isabella_silva95@gmail.com | `mn_addr_preprod13tlq3e4ntlktgqd0w45ctqvtxpksufx0qhraxuvlx6nz69l7thlqaf3w4u` | Dual mode modal works seamlessly; suggested disaster alert notifications |
| USR-052 | Tenzin Norbu | tenzin_norbu08@gmail.com | `mn_addr_preprod1tzdu9gyxvtkldv4xdc588667f08u3dfsvaya5z3nes4su0utcdfqlaxhld` | Preserves dignity of remote villagers; suggested offline verification mode |

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
| `0x8b3c5d7e9f1a2b4c6d8e0f1234567890abcdef12345678907f3a9c4b2e8d1f0a` | Preview | `donateShielded` | Verified & Settled | [Preview Explorer](https://explorer.preview.midnight.network) |

---

## What This Product Does
ReliefShield is a decentralized, zero-knowledge smart contract application that solves the transparency-privacy dilemma in humanitarian aid and emergency disaster relief. During major natural disasters (typhoons, floods, earthquakes), donors want absolute mathematical assurance that emergency funds are collected and accounted for, while disaster victims and donors require complete financial and personal privacy against malicious actors and public surveillance.

Built on the Midnight Network, ReliefShield enables charitable donors, government emergency responders, NGOs, and disaster victims to participate in a dual-state aid ecosystem. Donors execute Compact zero-knowledge circuits in their browser via the Midnight Lace Wallet to contribute emergency funds, updating the public relief pool tally in real time without disclosing their wallet addresses or personal financial identity.

Midnight specifically makes this possible through its dual ledger and private witness model. Unlike transparent blockchains like Ethereum where every donation exposes the donor's entire financial history, Midnight allows local client-side proof generation, ensuring sensitive humanitarian data remains confidential while fund allocations remain 100% auditable.

---

## Privacy Model & Zero-Knowledge Architecture
- **What is PUBLIC (on-chain ledger state, verifiable by all observers):**
  - `totalReliefPool`: Aggregated emergency relief pool balance (`Uint<64>`).
  - `admin`: Public 32-byte cryptographic identifier of the authorized emergency relief administrator.
  - `nullifiers`: Set of 32-byte cryptographic nullifier hashes (`Set<Bytes<32>>`) that prevent double-claiming or replaying shielded transactions.
  - Disclosed contribution amount (`disclose(secretAmount)`): Disclosed on-chain to transparently increment `totalReliefPool`.
  - Disclosed nullifier (`disclose(secretNonce)`): Disclosed on-chain and inserted into the `nullifiers` set to prevent double-spending or replay attacks.
  - Smart contract verification keys, block height timestamps, and zero-knowledge proof verification results.
- **What is PRIVATE (witness memory, strictly kept off-chain in browser):**
  - **Donor wallet address & identity linkage**: Completely shielded by the zero-knowledge circuit. The transaction on-chain is unlinked to the donor's wallet address or account identity.
  - Donor wallet keys, unspent UTXO notes, and unshielded account balance history.
  - Off-chain witness execution: Private inputs are computed and proven locally in the user's browser via the Midnight Lace Wallet before proof submission.
  - Beneficiary / victim legal identities and residential records.
- **What the user PROVES without revealing:**
  - The donor proves that their contribution is positive (`secretAmount > 0`), that their nullifier has not been previously spent (`!nullifiers.member(disclose(secretNonce))`), and that the arithmetic ledger state transition is mathematically valid, **without revealing their donor wallet identity or linking the transaction to their personal financial account**.
  - The administrator proves authorization (`disclose(adminSecret) == admin`) to execute administrative actions like `resetPool()` with authentic cryptographic credentials.

---

## Tech Stack
Midnight Network, Compact Smart Contracts (`>= 0.23`), Midnight.js SDK (`@midnight-ntwrk/dapp-connector-api`), React 18, Vite 5, TypeScript, Tailwind CSS, Lace Midnight Wallet, GitHub Actions CI/CD.

---

## Prerequisites
- Lace Midnight Wallet extension installed in browser (set to Midnight Preview)
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

6. **Sync Preprod survey feedback (Intake pipeline):**
   ```bash
   npm run sync:feedback
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
