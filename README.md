# SplitChain - Decentralized Expense Splitting Platform

SplitChain is a blockchain-based decentralized application (dApp) that enables users to create groups, split expenses, and manage shared finances using smart contracts on the blockchain.

## Features

- 🏦 **Smart Contract-based Expense Splitting**: Secure and transparent expense management
- 👥 **Group Management**: Create and manage expense-sharing groups
- 💰 **Multi-Token Support**: Handle expenses in different tokens
- 📊 **Analytics Dashboard**: Track spending patterns and group statistics
- 🔐 **Wallet Integration**: Connect with Web3 wallets for secure transactions
- 🏛 **Governance System**: Participate in platform governance decisions

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, shadcn/ui
- **Smart Contracts**: Solidity, Hardhat
- **Backend**: MongoDB
- **Blockchain**: BlockDAG Network
- **Testing**: Hardhat Test Suite

## BlockDAG Integration

SplitChain is built on the BlockDAG blockchain network, which offers several advantages:

- **High Throughput**: BlockDAG's DAG-based structure enables parallel transaction processing
- **Low Transaction Fees**: Cost-effective expense splitting and group management
- **Fast Finality**: Quick transaction confirmations for better user experience
- **Scalability**: Handles multiple group transactions efficiently
- **RPC Endpoint**: Connect to BlockDAG testnet at `https://rpc.primordial.bdagscan.com`
- **Block Explorer**: View transactions on [BDAGScan](https://bdagscan.com)

### Network Configuration

To interact with the BlockDAG network:

1. Add BlockDAG network to MetaMask:
   - Network Name: BlockDAG Testnet
   - RPC URL: https://rpc.primordial.bdagscan.com
   - Chain ID: [Your Chain ID]
   - Currency Symbol: BDAG
   - Block Explorer URL: https://bdagscan.com

2. Configure Hardhat for BlockDAG deployment in `hardhat.config.ts`:
   ```typescript
   networks: {
     blockdag: {
       url: process.env.BLOCKDAG_RPC_URL,
       accounts: [process.env.PRIVATE_KEY]
     }
   }
   ```

## Smart Contracts

The platform consists of multiple smart contracts:

- `SplitChainToken.sol`: Native platform token
- `SplitChainCore.sol`: Core expense splitting functionality
- `SplitChainFactory.sol`: Group creation and management
- `SplitChainMultiToken.sol`: Multi-token support
- `SplitChainAnalytics.sol`: On-chain analytics
- `SplitChainGovernance.sol`: Platform governance

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm
- A Web3 wallet (e.g., MetaMask)
- MongoDB database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ujjwal-sinha/SplitChain.git
   cd splitchain-dapp
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Configure environment variables:
   Create a .env file with the following variables:
   ```
   PRIVATE_KEY=your_private_key
   BLOCKDAG_RPC_URL=your_rpc_url
   ETHERSCAN_API_KEY=your_api_key
   MONGODB_URI=your_mongodb_uri
   ```

4. Deploy smart contracts:
   ```bash
   npx hardhat run scripts/deploy.js --network blockdag
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

### Smart Contract Deployment

Current contract addresses on BlockDAG network:

- SplitChain Token: `0x5170Ef6BfEF4708D8c505a97500b4de4927E1159`
- SplitChain Core: `0xc2f107F0869895e3C06BFF00194b9f8c8eb7294b`
- SplitChain Factory: `0xeDdc8b9D2b5f42F9141B63DF169FB84645bfaa7c`
- SplitChain MultiToken: `0x7e9BB714b8bCf3021d08Ae701373Cd73235De147`
- SplitChain Analytics: `0x3f4e2551Bc9f4Ab132A51b270A57e3A9196F821D`
- SplitChain Governance: `0xc906fafF1678A08e91B2a48039817cA41910F58F`

## Project Structure

```
├── app/                  # Next.js app directory
├── components/          # React components
├── contracts/          # Solidity smart contracts
├── hooks/             # Custom React hooks
├── lib/               # Utility functions
├── public/            # Static assets
├── styles/            # CSS styles
├── test/              # Contract test files
└── types/             # TypeScript type definitions
```

## Testing

Run the test suite:

```bash
npx hardhat test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Security

If you discover any security-related issues, please email security@splitchain.com instead of using the issue tracker.

## Support

For support, please join our [Discord community](https://discord.gg/splitchain) or open an issue in the repository.
