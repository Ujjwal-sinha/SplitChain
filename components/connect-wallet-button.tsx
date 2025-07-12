"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { WalletSelectionModal } from "@/components/wallet-selection-modal"
import { useWallet } from "@/components/wallet-provider"
import { Wallet, ChevronDown } from "lucide-react"

interface ConnectWalletButtonProps {
  onConnect?: () => void
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function ConnectWalletButton({
  onConnect,
  className,
  variant = "default",
  size = "default",
}: ConnectWalletButtonProps) {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const { isConnected, address, ensName, disconnectWallet } = useWallet()

  const handleConnect = () => {
    setShowWalletModal(true)
  }

  const handleWalletConnected = () => {
    setShowWalletModal(false)
    onConnect?.()
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 bg-slate-500/5 backdrop-blur-sm font-mono" // Changed to slate
          onClick={() => setShowWalletModal(true)}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
          {ensName || formatAddress(address)}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>

        {showWalletModal && (
          <WalletSelectionModal
            onClose={() => setShowWalletModal(false)}
            onWalletConnected={handleWalletConnected}
            isConnected={true}
          />
        )}
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        variant={variant}
        size={size}
        className={`${
          variant === "default"
            ? "bg-gradient-to-r from-slate-600 to-green-600 hover:from-slate-700 hover:to-green-700 text-white border-0 shadow-lg shadow-slate-500/25" // Mixed gradient
            : ""
        } ${className}`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        Connect Wallet
      </Button>

      {showWalletModal && (
        <WalletSelectionModal onClose={() => setShowWalletModal(false)} onWalletConnected={handleWalletConnected} />
      )}
    </>
  )
}
