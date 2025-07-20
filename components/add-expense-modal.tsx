"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useContracts } from "@/hooks/use-contracts"
import { Loader2, Plus, RefreshCw } from "lucide-react"
import { CONTRACT_ADDRESSES } from "@/lib/contracts"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  groupId: string
}

export function AddExpenseModal({ isOpen, onClose, groupId }: AddExpenseModalProps) {
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [tokenAddress, setTokenAddress] = useState("0x0000000000000000000000000000000000000000")
  const [loading, setLoading] = useState(false)
  const { addExpense, fetchExpenses } = useContracts()

  const handleAddExpense = async () => {
    if (description && amount) {
      setLoading(true)
      try {
        await addExpense(
          groupId,
          amount,
          tokenAddress,
          description
        )
        await fetchExpenses(groupId)
        onClose()
      } catch (error) {
        console.error("Error adding expense:", error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-green neon-border">
        <DialogHeader>
          <DialogTitle className="neon-text font-mono">Add New Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-green-400 font-mono">
              Description
            </Label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-green-400 font-mono">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-green-400 font-mono">Token</Label>
            <RadioGroup
              defaultValue={tokenAddress}
              onValueChange={setTokenAddress}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="0x0000000000000000000000000000000000000000" id="native" />
                <Label htmlFor="native" className="text-green-400 font-mono">
                  Native (ETH/BDAG)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value={CONTRACT_ADDRESSES.token} id="split-token" />
                <Label htmlFor="split-token" className="text-green-400 font-mono">
                  Split Token (ST)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono bg-transparent"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleAddExpense} className="btn-matrix font-mono" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Add Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
