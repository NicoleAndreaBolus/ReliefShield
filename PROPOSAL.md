# Product Proposal

## What is the product, and who uses it?
ReliefShield is a privacy-preserving, transparent disaster relief management and shielded aid allocation platform built on the Midnight Network using Zero-Knowledge smart contracts written in Compact. It is designed for charitable donors, disaster relief organizations, government emergency management agencies, and disaster victims. Donors contribute emergency funds to relief campaigns using zero-knowledge proofs without exposing their wallet identity, personal net worth, or raw financial witness inputs to the public, while ensuring on-chain mathematically verifiable fund tallies and transparent aid disbursement.

## Why Midnight specifically?
Transparent blockchains like Ethereum or Bitcoin expose every donor's wallet address, transaction history, balance, and aid recipient identities on public block explorers, creating severe safety and privacy risks for vulnerable disaster victims and donors. Midnight specifically solves this by combining a transparent public ledger state with zero-knowledge private circuit witnesses. Donors and field officers generate client-side zero-knowledge proofs in their browser (via the Lace Midnight Wallet DApp Connector), proving that contributions and aid claims satisfy smart contract rules without disclosing the underlying witness amounts or participant identities on-chain.

## Data Model
| Data Point | Type | Disclosed To |
|---|---|---|
| Public Relief Pool & Campaign Counter | Public ledger | Everyone (On-chain) |
| Smart Contract Verification Keys | Public ledger | Everyone (On-chain) |
| Individual Donor Contribution Amount (`secretAmount`) | Private witness | No one (Stays on user browser) |
| Donor Wallet Private Key & Identity | Private witness | No one (Stays on user browser) |
| Beneficiary Aid Claim Token | Private witness | No one (Stays on user browser) |
| On-Chain Validity Proof | Zero-Knowledge Proof | Everyone (Verifiable on-chain) |

## Mainnet Feasibility
Yes, ReliefShield is fully realistic to reach Mainnet by Level 6. The core Compact smart contract logic (`reliefshield.compact`), proof server integration, and client browser ZK proof generation via Lace Midnight Wallet are fully modular, lightweight, and engineered for high-throughput zero-knowledge verification across Midnight's Preview, Preprod, and upcoming Mainnet environments.
