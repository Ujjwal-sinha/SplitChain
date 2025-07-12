"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Wallet, Copy, ExternalLink, Zap } from "lucide-react"

// Update to use the real wallet data from context
import { useWallet } from "@/components/wallet-provider"

export function WalletCard() {
  const { address, ensName, balance, chainId } = useWallet()

  // Update to use the real wallet data from context
  const walletAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Not connected"
  const displayName = ensName || walletAddress
  const ethBalance = balance || "0.00"

  const tokens = [
    { symbol: "ETH", balance: ethBalance, value: "$4,890" },
    { symbol: "WETH", balance: "1.23", value: "$2,460" },
    { symbol: "USDC", balance: "1,250", value: "$1,250" },
  ]

  return (
    <Card className="glass-white neon-white-border h-full">
      {" "}
      {/* Changed to glass-white and neon-white-border */}
      <CardHeader>
        <CardTitle className="neon-white-text flex items-center font-mono">
          {" "}
          {/* Changed to neon-white-text */}
          <Wallet className="w-5 h-5 mr-2 text-slate-400" /> {/* Changed to slate */}
          Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wallet Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12 bg-gradient-to-r from-slate-500 to-green-500">
            {" "}
            {/* Mixed gradient */}
            <AvatarFallback className="text-black font-semibold">AE</AvatarFallback> {/* Icon color */}
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold neon-white-text font-mono">{displayName}</p> {/* Changed to neon-white-text */}
            <div className="flex items-center space-x-2">
              <p className="text-sm text-slate-400/70 font-mono">{walletAddress}</p> {/* Changed to slate */}
              <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400/70 hover:text-slate-400">
                {" "}
                {/* Changed to slate */}
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* Network Badge */}
        <div className="flex items-center justify-between">
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-mono">
            {" "}
            {/* Themed badge */}
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
            BlockDAG Testnet
          </Badge>
          <Button size="sm" variant="ghost" className="text-slate-400/70 hover:text-slate-400">
            {" "}
            {/* Changed to slate */}
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Token Balances */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-slate-300 font-mono">Token Balances</h4> {/* Changed to slate */}
          {tokens.map((token) => (
            <div key={token.symbol} className="flex items-center justify-between p-2 rounded-lg glass-white">
              {" "}
              {/* Changed to glass-white */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-slate-500 to-green-500 rounded-full flex items-center justify-center">
                  {" "}
                  {/* Mixed gradient */}
                  <Zap className="w-3 h-3 text-black" /> {/* Icon color */}
                </div>
                <span className="neon-white-text font-medium font-mono">{token.symbol}</span>{" "}
                {/* Changed to neon-white-text */}
              </div>
              <div className="text-right">
                <p className="neon-white-text font-semibold font-mono">{token.balance}</p>{" "}
                {/* Changed to neon-white-text */}
                <p className="text-xs text-slate-400/70 font-mono">{token.value}</p> {/* Changed to slate */}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 bg-transparent font-mono"
          >
            {" "}
            {/* Changed to slate */}
            Send
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 bg-transparent font-mono"
          >
            {" "}
            {/* Changed to slate */}
            Receive
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
