"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useWallet } from "@/components/wallet-provider"
import { X, Wallet, ExternalLink, Copy, LogOut, Settings, Shield, Zap } from "lucide-react"

interface WalletSelectionModalProps {
  onClose: () => void
  onWalletConnected: () => void
  isConnected?: boolean
}

// Enhanced wallet detection function
const detectWallets = () => {
  if (typeof window === "undefined" || !window.ethereum) return { detected: [], hasEthereum: false }

  const detected = []
  const ethereum = window.ethereum

  // Check for multiple providers
  if (ethereum.providers && Array.isArray(ethereum.providers)) {
    ethereum.providers.forEach((provider: any) => {
      if (provider.isMetaMask) detected.push("MetaMask")
      if (provider.isCoinbaseWallet) detected.push("Coinbase Wallet")
      if (provider.isTrust || provider.isTrustWallet) detected.push("Trust Wallet")
      if (provider.isRabby) detected.push("Rabby Wallet")
      if (provider.isExodus) detected.push("Exodus")
      if (provider.isBraveWallet) detected.push("Brave Wallet")
    })
  } else {
    // Single provider detection
    if (ethereum.isMetaMask) detected.push("MetaMask")
    if (ethereum.isCoinbaseWallet) detected.push("Coinbase Wallet")
    if (ethereum.isTrust || ethereum.isTrustWallet) detected.push("Trust Wallet")
    if (ethereum.isRabby) detected.push("Rabby Wallet")
    if (ethereum.isExodus) detected.push("Exodus")
    if (ethereum.isBraveWallet) detected.push("Brave Wallet")
  }

  return { detected: [...new Set(detected)], hasEthereum: true }
}

// Enhanced wallet options with better detection
const getWalletOptions = () => {
  const { detected, hasEthereum } = detectWallets()

  return [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "🦊",
      description: "Connect using MetaMask wallet",
      installed:
        hasEthereum &&
        (window.ethereum?.isMetaMask ||
          window.ethereum?.providers?.some((p: any) => p.isMetaMask) ||
          detected.includes("MetaMask")),
      downloadUrl: "https://metamask.io/download/",
      detected: detected.includes("MetaMask"),
    },
    {
      id: "coinbase",
      name: "Coinbase Wallet",
      icon: "🔵",
      description: "Connect using Coinbase Wallet",
      installed:
        hasEthereum &&
        (window.ethereum?.isCoinbaseWallet ||
          window.ethereum?.providers?.some((p: any) => p.isCoinbaseWallet) ||
          detected.includes("Coinbase Wallet")),
      downloadUrl: "https://www.coinbase.com/wallet",
      detected: detected.includes("Coinbase Wallet"),
    },
    {
      id: "trust",
      name: "Trust Wallet",
      icon: "🛡️",
      description: "Connect using Trust Wallet",
      installed:
        hasEthereum &&
        (window.ethereum?.isTrust ||
          window.ethereum?.isTrustWallet ||
          window.ethereum?.providers?.some((p: any) => p.isTrust || p.isTrustWallet) ||
          detected.includes("Trust Wallet")),
      downloadUrl: "https://trustwallet.com/",
      detected: detected.includes("Trust Wallet"),
    },
    {
      id: "rabby",
      name: "Rabby Wallet",
      icon: "🐰",
      description: "Connect using Rabby Wallet",
      installed:
        hasEthereum &&
        (window.ethereum?.isRabby ||
          window.ethereum?.providers?.some((p: any) => p.isRabby) ||
          detected.includes("Rabby Wallet")),
      downloadUrl: "https://rabby.io/",
      detected: detected.includes("Rabby Wallet"),
    },
    {
      id: "brave",
      name: "Brave Wallet",
      icon: "🦁",
      description: "Connect using Brave Wallet",
      installed:
        hasEthereum &&
        (window.ethereum?.isBraveWallet ||
          window.ethereum?.providers?.some((p: any) => p.isBraveWallet) ||
          detected.includes("Brave Wallet")),
      downloadUrl: "https://brave.com/wallet/",
      detected: detected.includes("Brave Wallet"),
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "🔗",
      description: "Connect using mobile wallet",
      installed: true,
      downloadUrl: "https://walletconnect.com/",
      detected: false,
    },
  ]
}

export function WalletSelectionModal({ onClose, onWalletConnected, isConnected = false }: WalletSelectionModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [walletOptions, setWalletOptions] = useState(getWalletOptions())
  const { connectWallet, disconnectWallet, address, ensName, balance, chainId, switchNetwork } = useWallet()

  // Update wallet detection when modal opens
  useEffect(() => {
    const updateWalletOptions = () => {
      setWalletOptions(getWalletOptions())
    }

    updateWalletOptions()

    // Listen for ethereum provider changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("connect", updateWalletOptions)
      window.ethereum.on("disconnect", updateWalletOptions)

      return () => {
        window.ethereum?.removeListener("connect", updateWalletOptions)
        window.ethereum?.removeListener("disconnect", updateWalletOptions)
      }
    }
  }, [])

  const handleWalletConnect = async (walletId: string) => {
    setConnecting(walletId)
    setError(null)

    try {
      // Check if any wallet is available
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet extension detected. Please install a Web3 wallet.")
      }

      await connectWallet(walletId)
      onWalletConnected()
    } catch (err: any) {
      setError(err.message)
      setConnecting(null)
    }
  }

  const handleDisconnect = () => {
    disconnectWallet()
    onClose()
  }

  const handleSwitchToBlockDAG = async () => {
    try {
      await switchNetwork(12345) // Example BlockDAG chain ID
    } catch (err: any) {
      setError(err.message)
    }
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
        <Card className="w-full max-w-md glass-blue neon-blue-border animate-in fade-in-0 zoom-in-95 duration-300 mx-auto my-auto">
          {" "}
          {/* Changed to glass-blue and neon-blue-border */}
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-2 top-2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
            <CardTitle className="neon-blue-text flex items-center font-mono">
              {" "}
              {/* Changed to neon-blue-text */}
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                {" "}
                {/* Mixed gradient */}
                <Wallet className="w-4 h-4 text-black" /> {/* Icon color */}
              </div>
              Wallet Connected
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Info */}
            <div className="p-4 rounded-lg glass-blue border border-blue-500/20">
              {" "}
              {/* Changed to glass-blue */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full" />
                  <span className="neon-blue-text font-medium font-mono">{ensName || formatAddress(address)}</span>{" "}
                  {/* Changed to neon-blue-text */}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0 text-blue-400/70 hover:text-blue-400" /* Changed to blue */
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
              <div className="text-sm text-blue-400/70 font-mono mb-2">Balance: {balance} ETH</div>{" "}
              {/* Changed to blue */}
              <div className="flex items-center justify-between">
                <Badge
                  className={`font-mono ${
                    chainId === 12345
                      ? "bg-green-500/20 text-green-300 border-green-500/30"
                      : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                  }`}
                >
                  {chainId === 12345 ? "BlockDAG Testnet" : `Chain ID: ${chainId}`}
                </Badge>
                {chainId !== 12345 && (
                  <Button
                    size="sm"
                    onClick={handleSwitchToBlockDAG}
                    className="bg-blue-600 hover:bg-blue-700 text-black text-xs px-2 py-1 h-6 font-mono" /* Changed to blue */
                  >
                    Switch to BlockDAG
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent font-mono" /* Changed to blue */
                onClick={() => window.open(`https://explorer.blockdag.network/address/${address}`, "_blank")}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Explorer
              </Button>
              <Button
                variant="outline"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 bg-transparent font-mono"
              >
                {" "}
                {/* Changed to blue */}
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>

            {/* Security Notice */}
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              {" "}
              {/* Changed to blue */}
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-400 mt-0.5" /> {/* Changed to blue */}
                <div>
                  <p className="text-sm text-blue-300 font-medium font-mono">Secure Connection</p>{" "}
                  {/* Changed to blue */}
                  <p className="text-xs text-blue-400/80 font-mono">Your wallet is connected securely to SplitChain</p>{" "}
                  {/* Changed to blue */}
                </div>
              </div>
            </div>

            {/* Disconnect Button */}
            <Button
              onClick={handleDisconnect}
              variant="outline"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 bg-transparent font-mono"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Disconnect Wallet
            </Button>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
      <div className="w-full max-w-lg mx-auto my-8">
        <Card className="glass-blue neon-blue-border animate-in fade-in-0 zoom-in-95 duration-300">
          {" "}
          {/* Changed to glass-blue and neon-blue-border */}
          <CardHeader className="relative pb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-2 top-2 text-slate-400 hover:text-white z-10"
            >
              <X className="w-4 h-4" />
            </Button>
            <CardTitle className="neon-blue-text flex items-center text-xl font-mono">
              {" "}
              {/* Changed to neon-blue-text */}
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center mr-3">
                {" "}
                {/* Mixed gradient */}
                <Wallet className="w-4 h-4 text-black" /> {/* Icon color */}
              </div>
              Connect Wallet
            </CardTitle>
            <p className="text-blue-400/70 text-sm mt-2 font-mono">
              {" "}
              {/* Changed to blue */}
              Connect your wallet to start using SplitChain for decentralized expense sharing.
            </p>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            {/* Detection Status */}
            {typeof window !== "undefined" && window.ethereum && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-300 font-medium font-mono">
                      {detectWallets().detected.length > 0
                        ? `${detectWallets().detected.length} Wallet Extension${detectWallets().detected.length > 1 ? "s" : ""} Detected`
                        : "Web3 Wallet Detected"}
                    </p>
                    <p className="text-xs text-green-400/80 font-mono">
                      {detectWallets().detected.length > 0
                        ? `Available: ${detectWallets().detected.join(", ")}`
                        : "Generic Web3 wallet available"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {typeof window !== "undefined" && !window.ethereum && (
              <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-orange-300 font-medium font-mono">No Wallet Extensions Found</p>
                    <p className="text-xs text-orange-400/80 font-mono">Please install a Web3 wallet to continue</p>
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Options */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-blue-300 mb-3 font-mono">Choose your wallet:</h3>{" "}
              {/* Changed to blue */}
              {walletOptions.map((wallet) => (
                <Button
                  key={wallet.id}
                  onClick={() => handleWalletConnect(wallet.id)}
                  disabled={connecting === wallet.id || !wallet.installed}
                  className="w-full justify-between p-4 h-auto glass-blue hover:glass-blue-strong border border-blue-500/20 hover:border-blue-500/40 text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-mono" /* Changed to blue */
                  variant="ghost"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl flex-shrink-0">{wallet.icon}</span>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium neon-blue-text font-mono">{wallet.name}</p>{" "}
                        {/* Changed to neon-blue-text */}
                        {wallet.detected && (
                          <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" title="Detected" />
                        )}
                      </div>
                      <p className="text-xs text-blue-400/70 font-mono">{wallet.description}</p> {/* Changed to blue */}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    {wallet.detected && (
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs font-mono">
                        Detected
                      </Badge>
                    )}
                    {!wallet.installed && (
                      <Badge variant="outline" className="border-orange-500/30 text-orange-400 text-xs font-mono">
                        Install
                      </Badge>
                    )}
                    {connecting === wallet.id && (
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    )}
                  </div>
                </Button>
              ))}
            </div>

            {/* BlockDAG Info */}
            <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-green-500/10 border border-blue-500/20 mt-4">
              {" "}
              {/* Mixed gradient */}
              <div className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" /> {/* Changed to blue */}
                <div>
                  <p className="text-sm text-blue-300 font-medium font-mono">Powered by BlockDAG</p>{" "}
                  {/* Changed to blue */}
                  <p className="text-xs text-blue-400/80 font-mono">
                    Fast, secure, and low-cost transactions on the BlockDAG network
                  </p>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400 font-mono">{error}</p>
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-slate-500 text-center mt-4 font-mono">
              By connecting a wallet, you agree to SplitChain's Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
