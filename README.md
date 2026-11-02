# 🎓 CertChain: NFT-Based Certificate Issuance System

Certificates issued as ERC-721 NFTs on the Ethereum Sepolia testnet. Anyone can verify a certificate on-chain without trusting a middleman, and issuers can revoke one if needed.

**Live demo:** _add your Vercel link here_
**Contract (Sepolia):** [`0xb1b3736833Dc380C955bDED8d8e3A98c71242b71`](https://sepolia.etherscan.io/address/0xb1b3736833Dc380C955bDED8d8e3A98c71242b71)

<!-- Add screenshots here:
![Verify page](./screenshots/verify.png)
![Admin panel](./screenshots/admin.png)
-->

## Why this exists

Paper and PDF certificates are easy to forge and hard to check. CertChain stores each certificate on a public blockchain, so the record can't be edited quietly and verification takes one lookup.

## Features

- **Issue:** the contract owner mints a certificate NFT to a student's wallet (name, course, issue date).
- **Verify:** anyone enters a token ID and sees the certificate details and whether it is still valid. This is a read-only call, so it costs no gas.
- **Revoke:** the owner can mark a certificate as revoked, and the verify page then shows it as invalid.
- **Wallet login:** MetaMask connection via ethers.js.
- **Owner-only minting:** issuing and revoking are restricted to the contract owner (OpenZeppelin `Ownable`).

## Tech stack

| Layer | Tools |
| --- | --- |
| Smart contract | Solidity 0.8.28, OpenZeppelin ERC-721 |
| Dev and deploy | Hardhat 3, Alchemy RPC |
| Frontend | React, Vite, ethers.js v6 |
| Storage | IPFS via Pinata (metadata upload script) |
| Network | Ethereum Sepolia testnet |
| Hosting | Vercel |

## How it works

```
Admin (MetaMask) ──issueCertificate()──▶ CertificateNFT contract ──▶ Sepolia
                                                  ▲
Anyone ──────────verifyCertificate(tokenId)───────┘  (read-only, free)
```

Each certificate stores the recipient name, course name, issue timestamp and a revoked flag on-chain, plus a metadata URI for the NFT. Token IDs start at **0**.

### Contract functions

| Function | Who can call | What it does |
| --- | --- | --- |
| `issueCertificate(recipient, recipientName, courseName, tokenURI_)` | Owner | Mints a new certificate NFT |
| `verifyCertificate(tokenId)` | Anyone | Returns name, course, date, validity and metadata URI |
| `revokeCertificate(tokenId)` | Owner | Marks a certificate as revoked |

## Repositories

- **Frontend:** this repo
- **Smart contracts:** `certchain-contracts` (Hardhat project)

## Run the frontend locally

You need Node.js 18+ and the MetaMask extension set to **Sepolia**.

```bash
git clone https://github.com/Pooja16-2006/certchain-frontend.git
cd certchain-frontend
npm install
npm run dev
```

Open `http://localhost:5173` and click **Connect Wallet**.

The contract address and ABI live in `src/contract.js`. If you deploy your own copy of the contract, update the address there.

## Deploy the contract yourself

In the `certchain-contracts` repo, create a `.env` file:

```
SEPOLIA_RPC_URL=your_alchemy_sepolia_url
SEPOLIA_PRIVATE_KEY=your_testnet_wallet_private_key
PINATA_JWT=your_pinata_jwt
```

> Use a throwaway testnet wallet. Never commit `.env`, and never use a wallet that holds real funds.

Then:

```bash
npm install
npx hardhat compile
node scripts/deploy.js
```

You need some Sepolia test ETH for gas. Get it from a Sepolia faucet.

## Project status

- [x] ERC-721 certificate contract deployed on Sepolia
- [x] Issue and verify flow working end to end
- [x] MetaMask wallet connection
- [x] Dark glass-style UI
- [ ] Certificate metadata pinned to IPFS from the admin form (currently a placeholder URI)
- [ ] QR code on each certificate linking to the verify page
- [ ] Revoke button in the admin panel

## Author

**Pooja M**, final-year B.E. Information Science, Sai Vidya Institute of Technology, Bengaluru
GitHub: [Pooja16-2006](https://github.com/Pooja16-2006)
