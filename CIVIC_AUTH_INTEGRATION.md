# 🔐 Civic Auth Integration - SplitChain dApp

This document provides a comprehensive guide to the Civic Auth integration in the SplitChain decentralized expense sharing protocol, including technical implementation, setup instructions, and visual workflow diagrams.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Implementation Details](#implementation-details)
- [Components](#components)
- [API Integration](#api-integration)
- [User Experience](#user-experience)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Block Diagram](#block-diagram)

## 🎯 Overview

Civic Auth provides Web3-native authentication for SplitChain, enabling secure, wallet-based login without traditional passwords. This integration leverages blockchain-based identity verification to create a seamless authentication experience for our decentralized expense sharing protocol.

### Why Civic Auth for SplitChain?

- **🔒 Enhanced Security**: Blockchain-based authentication eliminates password vulnerabilities
- **⚡ Seamless UX**: One-click wallet-based login
- **🌐 Web3 Native**: Built specifically for blockchain applications
- **🔗 Wallet Integration**: Direct integration with existing Web3 wallets
- **🛡️ Privacy First**: Zero-knowledge authentication
- **⚙️ Easy Integration**: Simple SDK integration with Next.js

## 🏗️ Architecture

### System Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Browser  │    │   Civic Auth    │    │  SplitChain dApp │
│                 │    │     Service     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │ 1. Click Sign In      │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │ 2. Wallet Connect     │                       │
         │◀──────────────────────│                       │
         │                       │                       │
         │ 3. Sign Message       │                       │
         │──────────────────────▶│                       │
         │                       │                       │
         │ 4. JWT Token          │                       │
         │◀──────────────────────│                       │
         │                       │                       │
         │ 5. Access Granted     │                       │
         │──────────────────────────────────────────────▶│
```

### Authentication Flow

1. **User Initiation**: User clicks "Sign In with Civic" button
2. **Civic Auth Request**: SplitChain requests authentication via Civic's Web3 auth SDK
3. **Wallet Connection**: User connects their Web3 wallet (MetaMask, etc.) to Civic
4. **Identity Verification**: Civic verifies user identity using blockchain-based credentials
5. **JWT Token Generation**: Civic generates a secure JWT token with user's wallet address
6. **Access Granted**: User is authenticated and can access SplitChain features

## 🚀 Installation & Setup

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

## 🔧 Implementation Details

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

## 🧩 Components

### 1. Civic Auth Button Component

**File**: `components/civic-auth-button.tsx`

```typescript
"use client"

import { UserButton, useUser, SignInButton } from "@civic/auth-web3/react"

interface CivicAuthButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function CivicAuthButton({
  className,
  variant = "default",
  size = "default",
}: CivicAuthButtonProps) {
  const { user } = useUser()

  if (user) {
    return <UserButton />
  }

  return (
    <SignInButton
      className={`${
        variant === "default"
          ? "bg-gradient-to-r from-slate-600 to-green-600 hover:from-slate-700 hover:to-green-700 text-white border-0 shadow-lg shadow-slate-500/25"
          : ""
      } ${className}`}
    />
  )
}
```

### 2. Auth Status Slider Component

**File**: `components/auth-status-slider.tsx`

```typescript
"use client"

import { useState, useEffect } from "react"
import { useUser } from "@civic/auth-web3/react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Loader2, 
  Wallet, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock
} from "lucide-react"

export function AuthStatusSlider({ className }: { className?: string }) {
  const { user, isLoading, error } = useUser()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [statusMessage, setStatusMessage] = useState("Ready to sign in")

  const steps = [
    { name: "Initializing", message: "Preparing authentication..." },
    { name: "Connecting", message: "Connecting to wallet..." },
    { name: "Verifying", message: "Verifying identity..." },
    { name: "Creating Session", message: "Creating secure session..." },
    { name: "Complete", message: "Successfully authenticated!" }
  ]

  useEffect(() => {
    if (isLoading) {
      // Simulate progress during loading
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) {
            const newProgress = prev + 20
            const stepIndex = Math.floor(newProgress / 20)
            setCurrentStep(stepIndex)
            setStatusMessage(steps[stepIndex]?.message || "Processing...")
            return newProgress
          }
          return prev
        })
      }, 1000)

      return () => clearInterval(interval)
    }

    if (user) {
      setProgress(100)
      setCurrentStep(4)
      setStatusMessage("Successfully authenticated!")
    }

    if (error) {
      setStatusMessage("Authentication failed. Please try again.")
    }

    // Reset to initial state when user logs out
    if (!user && !isLoading && !error) {
      setProgress(0)
      setCurrentStep(0)
      setStatusMessage("Ready to sign in")
    }
  }, [isLoading, user, error])

  // Component JSX with progress bar, status indicators, and user feedback
  return (
    <Card className={`bg-gradient-to-r from-slate-500/10 to-blue-500/10 border-slate-500/20 ${className}`}>
      <CardContent className="p-4">
        {/* Progress visualization and status display */}
      </CardContent>
    </Card>
  )
}
```

### 3. Landing Page Integration

**File**: `components/landing-page.tsx`

```typescript
import { CivicAuthButton } from "@/components/civic-auth-button"
import { AuthStatusSlider } from "@/components/auth-status-slider"

// In the hero section
<div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
  <CivicAuthButton
    size="lg"
    className="bg-green-500 text-black px-8 py-4 text-lg font-mono rounded-none border-0 shadow-lg shadow-green-500/25 hover:bg-green-600"
  />
  <Button
    variant="outline"
    size="lg"
    onClick={() => onPageChange("dashboard")}
    className="border-green-500/50 text-green-400 hover:bg-green-500/10 px-8 py-4 text-lg font-mono bg-transparent neon-border"
  >
    <LayoutDashboard className="w-5 h-5 mr-2" />
    Dashboard
  </Button>
</div>

{/* Auth Status Slider */}
<div className="max-w-md mx-auto mb-16">
  <AuthStatusSlider />
</div>
```

## 🔌 API Integration

### API Route Handler

**File**: `app/api/auth/[...civicauth]/route.ts`

```typescript
import { handler } from '@civic/auth-web3/nextjs'

export const GET = handler()
export const POST = handler()
export const PUT = handler()
export const DELETE = handler()
```

### Protected API Routes

**File**: `app/api/protected/route.ts`

```typescript
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

## 🎨 User Experience

### Authentication States

1. **Ready State**: Shows "Ready to sign in" with 0% progress
2. **Loading State**: Shows progress bar with step-by-step updates
3. **Success State**: Shows "Successfully authenticated!" with user info
4. **Error State**: Shows error message with retry option
5. **Logout State**: Resets to initial state for new sign-in

### Visual Feedback

- **Progress Bar**: Real-time progress from 0% to 100%
- **Step Indicators**: Visual dots showing current authentication stage
- **Status Messages**: Clear explanations of what's happening
- **Color Coding**: Blue for loading, green for success, red for errors
- **Icons**: Contextual icons for each state

### Responsive Design

- **Mobile Optimized**: Works seamlessly on all screen sizes
- **Touch Friendly**: Large touch targets for mobile users
- **Accessibility**: Screen reader friendly with proper ARIA labels

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

## 📊 Block Diagrams

### Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SplitChain dApp                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   User Browser  │    │   Civic Auth    │    │  SplitChain dApp │         │
│  │                 │    │     Service     │    │                 │         │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘         │
│           │                       │                       │                 │
│           │ 1. Click Sign In      │                       │                 │
│           │──────────────────────▶│                       │                 │
│           │                       │                       │                 │
│           │ 2. Wallet Connect     │                       │                 │
│           │◀──────────────────────│                       │                 │
│           │                       │                       │                 │
│           │ 3. Sign Message       │                       │                 │
│           │──────────────────────▶│                       │                 │
│           │                       │                       │                 │
│           │ 4. JWT Token          │                       │                 │
│           │◀──────────────────────│                       │                 │
│           │                       │                       │                 │
│           │ 5. Access Granted     │                       │                 │
│           │──────────────────────────────────────────────▶│                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Authentication Workflow

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
       │                   │                   │                   │
```

### Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           React Component Architecture                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐              ┌─────────────────┐                      │
│  │  Landing Page   │              │ Civic Auth SDK  │                      │
│  │                 │              │                 │                      │
│  │  ┌───────────┐  │              │  ┌───────────┐  │                      │
│  │  │Civic Auth │──┼──────────────┼──│CivicAuth  │  │                      │
│  │  │  Button   │  │              │  │ Provider  │  │                      │
│  │  └───────────┘  │              │  └───────────┘  │                      │
│  │                 │              │                 │                      │
│  │  ┌───────────┐  │              │  ┌───────────┐  │                      │
│  │  │   Auth    │──┼──────────────┼──│SignIn     │  │                      │
│  │  │  Status   │  │              │  │ Button    │  │                      │
│  │  │  Slider   │  │              │  └───────────┘  │                      │
│  │  └───────────┘  │              │                 │                      │
│  └─────────────────┘              │  ┌───────────┐  │                      │
│                                   │  │UserButton │  │                      │
│  ┌─────────────────┐              │  └───────────┘  │                      │
│  │   State Mgmt    │              └─────────────────┘                      │
│  │                 │                                                       │
│  │  ┌───────────┐  │              ┌─────────────────┐                      │
│  │  │   useUser │──┼──────────────│   API Routes    │                      │
│  │  │   Hook    │  │              │                 │                      │
│  │  └───────────┘  │              │  ┌───────────┐  │                      │
│  │                 │              │  │   Auth    │  │                      │
│  │  ┌───────────┐  │              │  │  Handler  │  │                      │
│  │  │  Progress │  │              │  └───────────┘  │                      │
│  │  │   State   │  │              │                 │                      │
│  │  └───────────┘  │              │  ┌───────────┐  │                      │
│  └─────────────────┘              │  │Protected  │  │                      │
│                                   │  │ Endpoints │  │                      │
│                                   │  └───────────┘  │                      │
│                                   └─────────────────┘                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Data Flow Diagram                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   User      │    │   Frontend  │    │   Backend   │    │ Blockchain  │  │
│  │  Input      │    │ Components  │    │   API       │    │  (BlockDAG) │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                   │                   │                   │      │
│         │ 1. Click Sign In  │                   │                   │      │
│         │──────────────────▶│                   │                   │      │
│         │                   │ 2. Auth Request   │                   │      │
│         │                   │──────────────────▶│                   │      │
│         │                   │                   │ 3. Verify Wallet  │      │
│         │                   │                   │──────────────────▶│      │
│         │                   │                   │ 4. Wallet Valid   │      │
│         │                   │                   │◀──────────────────│      │
│         │                   │ 5. JWT Token      │                   │      │
│         │                   │◀──────────────────│                   │      │
│         │ 6. Access Granted │                   │                   │      │
│         │◀──────────────────│                   │                   │      │
│         │                   │                   │                   │      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Security Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Security Architecture                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   User      │    │   Civic     │    │   JWT       │    │   Protected │  │
│  │  Wallet     │    │   Auth      │    │   Token     │    │   Resources │  │
│  └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘  │
│         │                   │                   │                   │      │
│         │ 1. Sign Message   │                   │                   │      │
│         │──────────────────▶│                   │                   │      │
│         │                   │ 2. Verify Sig     │                   │      │
│         │                   │──────────────────▶│                   │      │
│         │                   │ 3. Generate JWT   │                   │      │
│         │                   │──────────────────▶│                   │      │
│         │                   │                   │ 4. Validate Token │      │
│         │                   │                   │──────────────────▶│      │
│         │                   │                   │ 5. Access Granted │      │
│         │                   │                   │◀──────────────────│      │
│         │                   │                   │                   │      │
│                                                                             │
│  🔐 Cryptographic Verification  |  🔑 JWT Token Security  |  🛡️ CSRF Protection │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 📚 Additional Resources

### Documentation
- [Civic Auth Official Documentation](https://docs.civic.com)
- [Next.js Authentication Guide](https://nextjs.org/docs/authentication)
- [Web3 Authentication Best Practices](https://web3auth.io/docs)

### Community
- [Civic Discord](https://discord.gg/civic)
- [SplitChain GitHub](https://github.com/your-org/splitchain)
- [BlockDAG Network](https://blockdag.network)

### Support
- **Technical Issues**: Create an issue on GitHub
- **Civic Auth Support**: Contact Civic support team
- **SplitChain Questions**: Join our Discord community

---

