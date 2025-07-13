
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Copy, Check } from "lucide-react"

interface ReceiveTokenModalProps {
  trigger: React.ReactNode
  address?: string
}

export function ReceiveTokenModal({ trigger, address }: ReceiveTokenModalProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass-white neon-white-border">
        <DialogHeader>
          <DialogTitle className="neon-white-text flex items-center font-mono">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
              <QrCode className="w-4 h-4 text-black" />
            </div>
            Receive SPLIT Tokens
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-mono">
            Share your wallet address to receive SPLIT tokens.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center space-y-4">
            <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
              <QrCode className="w-32 h-32 text-black" />
            </div>
            <p className="text-slate-400 text-sm font-mono">
              QR Code for wallet address
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-green-300 font-mono text-sm">Your Wallet Address:</p>
            <div className="flex items-center space-x-2">
              <Badge className="glass-green border-green-500/30 text-green-100 font-mono flex-1 justify-start p-3">
                {address ? `${address.slice(0, 10)}...${address.slice(-8)}` : "Not connected"}
              </Badge>
              <Button
                size="sm"
                onClick={handleCopyAddress}
                className="btn-matrix font-mono"
                disabled={!address}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-slate-400 text-sm font-mono">
              Share this address to receive SPLIT tokens
            </p>
            <p className="text-green-400/70 text-xs font-mono">
              Only send SPLIT tokens to this address on BlockDAG network
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
