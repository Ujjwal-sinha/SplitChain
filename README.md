# SplitChain - Decentralized Expense Splitting Platform

SplitChain is a blockchain-based decentralized application (dApp) that enables users to create groups, split expenses, and manage shared finances using smart contracts on the blockchain.

## Features

- 🏦 **Smart Contract-based Expense Splitting**: Secure and transparent expense management
- 👥 **Group Management**: Create and manage expense-sharing groups
- 💰 **Multi-Token Support**: Handle expenses in different tokens
- 📊 **Analytics Dashboard**: Track spending patterns and group statistics
- 🔐 **Civic Auth Integration**: Web3-native wallet-based authentication with Civic Auth
- 💼 **Wallet Integration**: Connect with Web3 wallets for secure transactions
- 🏛 **Governance System**: Participate in platform governance decisions

## Technology Stack

- **Frontend**: Next.js, TypeScript, TailwindCSS, shadcn/ui
- **Authentication**: Civic Auth (Web3-native wallet-based authentication)
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

## 🔐 Civic Auth Integration

SplitChain uses **Civic Auth** for Web3-native, wallet-based authentication, providing a seamless and secure user experience without traditional passwords.

### Why Civic Auth?

- **🔒 Enhanced Security**: Blockchain-based authentication eliminates password vulnerabilities
- **⚡ Seamless UX**: One-click wallet-based login
- **🌐 Web3 Native**: Built specifically for blockchain applications
- **🔗 Wallet Integration**: Direct integration with existing Web3 wallets
- **🛡️ Privacy First**: Zero-knowledge authentication
- **⚙️ Easy Integration**: Simple SDK integration with Next.js

### Authentication Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │SplitChain UI│    │ Civic Auth  │    │   Wallet    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │ 1. Click Sign In  │                   │                   │
       │──────────────────▶│                   │                   │
       │                   │ 2. Auth Request   │                   │
       │                   │──────────────────▶│                   │
       │                   │                   │ 3. Connect Wallet │
       │                   │                   │──────────────────▶│
       │                   │                   │ 4. Wallet Ready   │
       │                   │                   │◀──────────────────│
       │                   │ 5. Sign Message   │                   │
       │                   │──────────────────▶│                   │
       │                   │                   │ 6. Sign & Return  │
       │                   │                   │◀──────────────────│
       │                   │ 7. Verify & Token │                   │
       │                   │◀──────────────────│                   │
       │ 8. Access Granted │                   │                   │
       │◀──────────────────│                   │                   │
```

### Key Components

- **Civic Auth Button**: One-click wallet-based sign-in
- **Auth Status Slider**: Real-time authentication progress tracking
- **User Session Management**: Secure JWT token handling
- **Protected Routes**: Server-side authentication verification

### Supported Wallets

- MetaMask
- WalletConnect
- Coinbase Wallet
- Trust Wallet
- Brave Wallet
- And more via WalletConnect

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
   # BlockDAG Network Configuration
   PRIVATE_KEY=your_private_key
   BLOCKDAG_RPC_URL=your_rpc_url
   ETHERSCAN_API_KEY=your_api_key
   MONGODB_URI=your_mongodb_uri
   
   # Civic Auth Configuration
   CIVIC_AUTH_APP_ID=your_civic_app_id
   CIVIC_AUTH_APP_SECRET=your_civic_app_secret
   CIVIC_AUTH_REDIRECT_URI=http://localhost:3000/auth/callback
   CIVIC_JWT_SECRET=your_custom_jwt_secret
   ```

4. Set up Civic Auth:
   - Visit [Civic Auth Console](https://console.civic.com)
   - Create a new application
   - Configure redirect URIs
   - Get your App ID and Secret
   - Update your `.env` file with the credentials

5. Deploy smart contracts:
   ```bash
   npx hardhat run scripts/deploy.js --network blockdag
   ```

6. Start the development server:
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
│   ├── api/auth/        # Civic Auth API routes
│   └── auth/callback/   # Auth callback pages
├── components/          # React components
│   ├── civic-auth-button.tsx    # Civic Auth sign-in button
│   └── auth-status-slider.tsx   # Authentication progress tracker
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

### Civic Auth Testing

Test the authentication flow:

1. **Development Testing**:
   ```bash
   pnpm dev
   ```
   - Navigate to the landing page
   - Click "Sign In with Civic"
   - Test wallet connection flow
   - Verify authentication status

2. **Component Testing**:
   - Test `CivicAuthButton` component
   - Test `AuthStatusSlider` component
   - Verify authentication state management

3. **API Testing**:
   - Test protected API routes
   - Verify JWT token validation
   - Test session management

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Security

### Civic Auth Security Features

- **🔐 Cryptographic Authentication**: Uses blockchain-based identity verification
- **🛡️ JWT Token Security**: Secure session management with automatic refresh
- **🚫 No Password Storage**: Eliminates password-based attack vectors
- **💼 Wallet-Based Security**: Leverages existing wallet security measures
- **🔒 HTTPS Enforcement**: All communications are encrypted
- **🛡️ CSRF Protection**: Built-in CSRF protection for all requests

### Security Best Practices

1. **Environment Variables**: Never commit secrets to version control
2. **Token Validation**: Always validate JWT tokens on the server side
3. **Error Handling**: Implement proper error handling for auth failures
4. **Logging**: Log authentication events for security monitoring
5. **Rate Limiting**: Implement rate limiting for auth endpoints

### Security Checklist

- [ ] Environment variables properly configured
- [ ] HTTPS enabled in production
- [ ] JWT secret is strong and unique
- [ ] Error messages don't leak sensitive information
- [ ] Authentication state properly managed
- [ ] Logout functionality implemented
- [ ] Session timeout configured
- [ ] CSRF protection enabled

If you discover any security-related issues, please email security@splitchain.com instead of using the issue tracker.

## Support

### Civic Auth Support

- **📚 Documentation**: [Civic Auth Official Docs](https://docs.civic.com)
- **💬 Community**: [Civic Discord](https://discord.gg/civic)
- **🐛 Issues**: Create an issue on GitHub for technical problems
- **🔧 Debug Mode**: Enable debug mode for detailed logging

### SplitChain Support

For general SplitChain support, please join our [Discord community](https://discord.gg/splitchain) or open an issue in the repository.

### Troubleshooting

#### Common Civic Auth Issues

1. **"App ID not found" Error**: Ensure `CIVIC_AUTH_APP_ID` is properly set in environment variables
2. **Wallet Connection Fails**: Check if MetaMask is installed and unlocked
3. **Redirect URI Mismatch**: Ensure redirect URI in Civic Auth app matches your configuration
4. **JWT Token Expired**: The SDK automatically handles token refresh
5. **User Not Authenticated**: Ensure `getServerSession()` is used correctly

For detailed troubleshooting, see the [Civic Auth Integration Guide](./CIVIC_AUTH_INTEGRATION.md).
