# 🔐 Civic Auth Integration - SplitChain dApp

This document provides a comprehensive guide to the Civic Auth integration in the SplitChain decentralized expense sharing protocol.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Examples](#examples)
- [Contributing](#contributing)

## 🎯 Overview

Civic Auth provides Web3-native authentication for the SplitChain dApp, enabling secure, wallet-based login without traditional passwords. This integration leverages blockchain-based identity verification to create a seamless authentication experience for our decentralized expense sharing protocol.

### Why Civic Auth for SplitChain?

- **🔒 Enhanced Security**: Blockchain-based authentication eliminates password vulnerabilities
- **⚡ Seamless UX**: One-click wallet-based login
- **🌐 Web3 Native**: Built specifically for blockchain applications
- **🔗 Wallet Integration**: Direct integration with existing Web3 wallets
- **🛡️ Privacy First**: Zero-knowledge authentication
- **⚙️ Easy Integration**: Simple SDK integration with Next.js

## ✨ Features

### Core Features
- **Wallet-based Authentication**: Connect with MetaMask, WalletConnect, and other Web3 wallets
- **JWT Token Management**: Secure session handling with automatic token refresh
- **User Profile Management**: Seamless user data handling
- **Cross-platform Support**: Works on web and mobile browsers
- **TypeScript Support**: Full TypeScript integration for type safety

### SplitChain-Specific Features
- **Expense Group Integration**: Automatic user association with expense groups
- **Transaction Signing**: Direct integration with expense settlement transactions
- **Analytics Tracking**: User behavior analytics for expense patterns
- **Multi-wallet Support**: Support for multiple wallet connections per user

## 🚀 Installation

### Prerequisites
- Node.js 18+ 
- Next.js 13+ with App Router
- React 18+
- Web3 wallet (MetaMask, WalletConnect, etc.)

### Step 1: Install Dependencies

```bash
npm install @civic/auth-web3 @civic/auth-web3/react
# or
yarn add @civic/auth-web3 @civic/auth-web3/react
# or
pnpm add @civic/auth-web3 @civic/auth-web3/react
```

### Step 2: Environment Configuration

Create or update your `.env.local` file:

```env
# Civic Auth Configuration
CIVIC_AUTH_APP_ID=your_civic_app_id
CIVIC_AUTH_APP_SECRET=your_civic_app_secret
CIVIC_AUTH_REDIRECT_URI=http://localhost:3000/auth/callback

# Optional: Custom JWT Secret
CIVIC_JWT_SECRET=your_custom_jwt_secret

# BlockDAG Network Configuration
NEXT_PUBLIC_BLOCKDAG_RPC_URL=https://testnet.blockdag.network
NEXT_PUBLIC_CHAIN_ID=12345
```

### Step 3: Civic Auth Setup

1. **Create Civic Auth App**:
   - Visit [Civic Auth Console](https://console.civic.com)
   - Create a new application
   - Configure redirect URIs
   - Get your App ID and Secret

2. **Configure Wallet Support**:
   - Enable MetaMask integration
   - Configure WalletConnect settings
   - Set up supported networks (BlockDAG Testnet)

## ⚙️ Configuration

### Next.js Configuration

Update your `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    CIVIC_AUTH_APP_ID: process.env.CIVIC_AUTH_APP_ID,
    CIVIC_AUTH_REDIRECT_URI: process.env.CIVIC_AUTH_REDIRECT_URI,
  },
}

export default nextConfig
```

### Civic Auth Provider Setup

Create `app/providers/civic-auth-provider.tsx`:

```typescript
"use client"

import { CivicAuthProvider } from '@civic/auth-web3/react'

export function CivicAuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CivicAuthProvider
      appId={process.env.NEXT_PUBLIC_CIVIC_AUTH_APP_ID!}
      redirectUri={process.env.NEXT_PUBLIC_CIVIC_AUTH_REDIRECT_URI!}
      chainId={process.env.NEXT_PUBLIC_CHAIN_ID!}
    >
      {children}
    </CivicAuthProvider>
  )
}
```

### Layout Integration

Update your `app/layout.tsx`:

```typescript
import { CivicAuthProviderWrapper } from './providers/civic-auth-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CivicAuthProviderWrapper>
          {children}
        </CivicAuthProviderWrapper>
      </body>
    </html>
  )
}
```

## 📖 Usage

### Basic Authentication Component

```typescript
"use client"

import { UserButton, useUser, SignInButton } from "@civic/auth-web3/react"

export function CivicAuthButton() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (user) {
    return <UserButton />
  }

  return (
    <SignInButton className="bg-green-500 text-black px-6 py-3 rounded-lg">
      Sign In with Civic
    </SignInButton>
  )
}
```

### User Data Access

```typescript
"use client"

import { useUser } from "@civic/auth-web3/react"

export function UserProfile() {
  const { user, isLoading } = useUser()

  if (isLoading) return <div>Loading user data...</div>
  if (!user) return <div>Please sign in</div>

  return (
    <div>
      <h2>Welcome, {user.walletAddress}</h2>
      <p>Connected Wallet: {user.walletType}</p>
      <p>User ID: {user.id}</p>
    </div>
  )
}
```

### Protected Routes

```typescript
"use client"

import { useUser } from "@civic/auth-web3/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function ProtectedComponent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  return <>{children}</>
}
```

### API Route Protection

```typescript
// app/api/protected/route.ts
import { getServerSession } from '@civic/auth-web3/nextjs'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const session = await getServerSession()
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Access user data
  const user = session.user
  
  return NextResponse.json({
    message: 'Protected data',
    user: {
      id: user.id,
      walletAddress: user.walletAddress,
      walletType: user.walletType
    }
  })
}
```

## 🔧 API Reference

### Hooks

#### `useUser()`
Returns the current user state and loading status.

```typescript
const { user, isLoading, error } = useUser()
```

**Returns:**
- `user`: User object or null
- `isLoading`: Boolean indicating loading state
- `error`: Error object if authentication failed

#### `useCivicAuth()`
Access to Civic Auth instance and methods.

```typescript
const { signIn, signOut, isAuthenticated } = useCivicAuth()
```

### Components

#### `<SignInButton>`
Renders a sign-in button that triggers the authentication flow.

```typescript
<SignInButton 
  className="custom-class"
  onSuccess={(user) => console.log('Signed in:', user)}
  onError={(error) => console.error('Sign in failed:', error)}
/>
```

#### `<UserButton>`
Renders a user profile button with sign-out functionality.

```typescript
<UserButton 
  className="custom-class"
  onSignOut={() => console.log('User signed out')}
/>
```

### Server-Side Functions

#### `getServerSession()`
Get the current session on the server side.

```typescript
import { getServerSession } from '@civic/auth-web3/nextjs'

export async function handler(request: Request) {
  const session = await getServerSession()
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  return new Response('Authorized', { status: 200 })
}
```

## 🔒 Security

### Security Features

1. **Cryptographic Authentication**: Uses blockchain-based identity verification
2. **JWT Token Security**: Secure session management with automatic refresh
3. **No Password Storage**: Eliminates password-based attack vectors
4. **Wallet-Based Security**: Leverages existing wallet security measures
5. **HTTPS Enforcement**: All communications are encrypted
6. **CSRF Protection**: Built-in CSRF protection for all requests

### Best Practices

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

## 🐛 Troubleshooting

### Common Issues

#### 1. "App ID not found" Error
**Solution**: Ensure `CIVIC_AUTH_APP_ID` is properly set in environment variables.

#### 2. Wallet Connection Fails
**Solution**: 
- Check if MetaMask is installed and unlocked
- Verify network configuration matches BlockDAG testnet
- Clear browser cache and try again

#### 3. Redirect URI Mismatch
**Solution**: Ensure the redirect URI in your Civic Auth app matches your environment configuration.

#### 4. JWT Token Expired
**Solution**: The SDK automatically handles token refresh. If issues persist, check your JWT secret configuration.

#### 5. User Not Authenticated on Server
**Solution**: Ensure you're using `getServerSession()` correctly and the session is properly configured.

### Debug Mode

Enable debug mode for detailed logging:

```typescript
<CivicAuthProvider
  appId={process.env.NEXT_PUBLIC_CIVIC_AUTH_APP_ID!}
  redirectUri={process.env.NEXT_PUBLIC_CIVIC_AUTH_REDIRECT_URI!}
  debug={true} // Enable debug mode
>
  {children}
</CivicAuthProvider>
```

### Error Handling

```typescript
"use client"

import { useUser } from "@civic/auth-web3/react"

export function AuthStatus() {
  const { user, isLoading, error } = useUser()

  if (error) {
    return (
      <div className="error">
        <h3>Authentication Error</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading authentication...</div>
  }

  return user ? <div>Welcome, {user.walletAddress}</div> : <div>Please sign in</div>
}
```

## 💡 Examples

### Complete Authentication Flow

```typescript
"use client"

import { useState, useEffect } from 'react'
import { useUser, SignInButton, UserButton } from "@civic/auth-web3/react"

export function AuthenticationFlow() {
  const { user, isLoading } = useUser()
  const [authStatus, setAuthStatus] = useState<string>('')

  useEffect(() => {
    if (user) {
      setAuthStatus(`Authenticated as ${user.walletAddress}`)
    } else {
      setAuthStatus('Not authenticated')
    }
  }, [user])

  if (isLoading) {
    return <div>Loading authentication...</div>
  }

  return (
    <div>
      <h2>Authentication Status</h2>
      <p>{authStatus}</p>
      
      {user ? (
        <div>
          <UserButton />
          <button onClick={() => window.location.href = '/dashboard'}>
            Go to Dashboard
          </button>
        </div>
      ) : (
        <SignInButton className="bg-green-500 text-white px-6 py-3 rounded-lg">
          Connect Wallet
        </SignInButton>
      )}
    </div>
  )
}
```

### Integration with SplitChain Features

```typescript
"use client"

import { useUser } from "@civic/auth-web3/react"
import { useState, useEffect } from 'react'

export function ExpenseGroupManager() {
  const { user } = useUser()
  const [groups, setGroups] = useState([])

  useEffect(() => {
    if (user) {
      // Fetch user's expense groups
      fetchUserGroups(user.id)
    }
  }, [user])

  const fetchUserGroups = async (userId: string) => {
    try {
      const response = await fetch(`/api/groups?userId=${userId}`)
      const data = await response.json()
      setGroups(data.groups)
    } catch (error) {
      console.error('Failed to fetch groups:', error)
    }
  }

  if (!user) {
    return <div>Please sign in to manage expense groups</div>
  }

  return (
    <div>
      <h2>Your Expense Groups</h2>
      <p>Connected as: {user.walletAddress}</p>
      {groups.map(group => (
        <div key={group.id}>
          <h3>{group.name}</h3>
          <p>Balance: {group.balance}</p>
        </div>
      ))}
    </div>
  )
}
```

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/civic-auth-enhancement`
3. **Install dependencies**: `npm install`
4. **Set up environment variables**: Copy `.env.example` to `.env.local`
5. **Run development server**: `npm run dev`
6. **Test authentication flow**: Ensure Civic Auth integration works correctly
7. **Submit a pull request**

### Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write comprehensive tests for new features
- Update documentation for any API changes

## 🤝 Civic Auth Partnership & Support

### Official Civic Auth Support

We are proud to announce that **Civic Auth is providing direct technical support** for the SplitChain dApp integration. This partnership ensures:

- **🔧 Direct Technical Support**: Civic's engineering team provides hands-on assistance
- **📚 Expert Guidance**: Access to Civic's authentication best practices and expertise
- **🚀 Priority Support**: Expedited resolution of integration issues
- **🔄 Continuous Updates**: Early access to new features and improvements
- **📖 Custom Documentation**: Tailored documentation for SplitChain's specific use case

### Support Channels

#### Civic Auth Direct Support
- **Email**: `support@civic.com` (mention "SplitChain dApp" for priority handling)
- **Discord**: [Civic Auth Discord](https://discord.gg/civic) - Dedicated #splitchain channel
- **Technical Slack**: Direct access to Civic's technical team
- **Video Calls**: Scheduled technical consultation sessions

#### SplitChain Community Support
- **GitHub Issues**: [SplitChain Repository](https://github.com/your-org/splitchain)
- **Discord Community**: [SplitChain Discord](https://discord.gg/splitchain)
- **Documentation**: This README and Civic's official docs

### Partnership Benefits

#### For Developers
- **Direct Access**: Connect with Civic's engineering team
- **Code Reviews**: Civic team reviews our authentication implementation
- **Best Practices**: Guidance on security and performance optimization
- **Testing Support**: Assistance with integration testing

#### For Users
- **Reliable Authentication**: Enterprise-grade authentication backed by Civic
- **Fast Issue Resolution**: Priority support for authentication problems
- **Feature Requests**: Direct line to Civic for feature suggestions
- **Security Assurance**: Regular security audits and updates

### Civic Auth Team Contacts

| Role | Contact | Specialization |
|------|---------|----------------|
| **Technical Lead** | `tech@civic.com` | Architecture & Integration |
| **Support Engineer** | `support@civic.com` | Day-to-day issues |
| **Product Manager** | `product@civic.com` | Feature requests & roadmap |
| **Security Specialist** | `security@civic.com` | Security audits & compliance |

### Success Stories

> *"Civic Auth's direct support has been invaluable for SplitChain. Their team helped us implement enterprise-grade authentication in record time, and their ongoing support ensures our users have the best possible experience."* 
> 
> — SplitChain Development Team

## 📚 Additional Resources

### Documentation
- [Civic Auth Official Documentation](https://docs.civic.com)
- [SplitChain-Specific Civic Auth Guide](https://docs.civic.com/splitchain) *(Coming Soon)*
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- [Web3 Authentication Best Practices](https://web3auth.io/docs)

### Community
- [Civic Discord](https://discord.gg/civic) - Dedicated #splitchain channel
- [SplitChain GitHub](https://github.com/your-org/splitchain)
- [BlockDAG Network](https://blockdag.network)
- [Civic Auth Community Forum](https://community.civic.com)

### Support Priority Levels

| Priority | Response Time | Contact Method |
|----------|---------------|----------------|
| **Critical** | < 2 hours | Civic Support Email + Discord |
| **High** | < 24 hours | Civic Discord + GitHub Issues |
| **Medium** | < 48 hours | GitHub Issues + Community |
| **Low** | < 1 week | Community Forum |

### Getting Help

#### For Critical Issues
1. **Email Civic Support**: `support@civic.com` with subject "SplitChain - Critical Issue"
2. **Discord Alert**: Post in #splitchain channel with @civic-support
3. **GitHub Issue**: Create issue with "critical" label

#### For Feature Requests
1. **Civic Product Team**: `product@civic.com`
2. **Community Discussion**: Civic Discord #feature-requests
3. **GitHub Discussion**: Use GitHub Discussions for community input

#### For Security Concerns
1. **Security Team**: `security@civic.com`
2. **Private Disclosure**: Use Civic's security disclosure process
3. **Immediate Response**: Security issues get highest priority

---

## 📄 License

This integration is part of the SplitChain project and follows the same licensing terms. Civic Auth is provided by Civic Technologies Inc.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Compatibility**: Next.js 13+, React 18+, Civic Auth SDK 2.0+
