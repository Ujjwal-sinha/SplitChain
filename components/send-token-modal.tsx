
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, AlertTriangle, Loader2 } from "lucide-react"
import { useContracts } from "@/hooks/use-contracts"
import { useWallet } from "@/components/wallet-provider"
import { ethers } from "ethers"

interface SendTokenModalProps {
  trigger: React.ReactNode
  splitBalance: string
}

export function SendTokenModal({ trigger, splitBalance }: SendTokenModalProps) {
  const [open, setOpen] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const { isConnected, address } = useWallet()
  const { isCorrectNetwork } = useContracts()

  const handleSend = async () => {
    if (!isConnected || !address) {
      setError("Please connect your wallet")
      return
    }

    if (!isCorrectNetwork) {
      setError("Please switch to BlockDAG network")
      return
    }

    if (!recipientAddress || !amount) {
      setError("Please fill in all fields")
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(recipientAddress)) {
      setError("Invalid recipient address")
      return
    }

    if (parseFloat(amount) <= 0 || parseFloat(amount) > parseFloat(splitBalance)) {
      setError("Invalid amount")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const signer = await provider.getSigner()
        
        // Get the token contract
        const { getContract } = await import('@/lib/contracts')
        const tokenContract = getContract('token', signer)
        
        const amountWei = ethers.parseEther(amount)
        const tx = await tokenContract.transfer(recipientAddress, amountWei)
        await tx.wait()

        setSuccess(`Successfully sent ${amount} SPLIT tokens to ${recipientAddress}`)
        setRecipientAddress("")
        setAmount("")
        
        // Close modal after 2 seconds
        setTimeout(() => {
          setOpen(false)
          setSuccess("")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to send tokens")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass-white neon-white-border">
        <DialogHeader>
          <DialogTitle className="neon-white-text flex items-center font-mono">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <Send className="w-4 h-4 text-black" />
            </div>
            Send SPLIT Tokens
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-mono">
            Send SPLIT tokens to another wallet address.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {error && (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500/20 bg-green-500/10">
              <AlertDescription className="text-green-300">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="recipient" className="text-green-300 font-mono">
              Recipient Address
            </Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="glass-green border-green-500/30 text-green-100 placeholder:text-green-400/60 font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-green-300 font-mono">
              Amount (Available: {splitBalance} SPLIT)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="glass-green border-green-500/30 text-green-100 placeholder:text-green-400/60 font-mono"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)} 
            className="border-slate-500/50 text-slate-300 hover:bg-slate-500/10 font-mono"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            className="btn-matrix font-mono"
            disabled={loading || !isConnected || !isCorrectNetwork}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Tokens
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
