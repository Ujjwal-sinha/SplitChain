"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { X, Users, Plus, AlertTriangle } from "lucide-react"
import { useContracts } from "@/hooks/use-contracts"
import { useWallet } from "@/components/wallet-provider"

interface CreateGroupModalProps {
  trigger?: React.ReactNode
  onGroupCreated?: (group: any) => void
  onClose?: () => void
}

export function CreateGroupModal({ trigger, onGroupCreated, onClose }: CreateGroupModalProps) {
  const [open, setOpen] = useState(onClose ? true : false)
  const [groupName, setGroupName] = useState("")
  const [newMemberAddress, setNewMemberAddress] = useState("")
  const [members, setMembers] = useState<string[]>([])
  const [error, setError] = useState("")

  const { isConnected, address } = useWallet()
  const { createGroup, loading, isCorrectNetwork } = useContracts()

  const addMember = () => {
    if (newMemberAddress && !members.includes(newMemberAddress)) {
      // Basic address validation
      if (!/^0x[a-fA-F0-9]{40}$/.test(newMemberAddress)) {
        setError("Invalid Ethereum address format")
        return
      }
      setMembers([...members, newMemberAddress])
      setNewMemberAddress("")
      setError("")
    }
  }

  const removeMember = (memberAddress: string) => {
    setMembers(members.filter((member) => member !== memberAddress))
  }

  const handleCreateGroup = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!isCorrectNetwork) {
      setError("Please switch to BlockDAG Testnet")
      return
    }

    if (!groupName.trim()) {
      setError("Please enter a group name")
      return
    }

    if (members.length === 0) {
      setError("Please add at least one member")
      return
    }

    try {
      setError("")
      // Add the current user to members if not already included
      const allMembers = address && !members.includes(address) 
        ? [address, ...members] 
        : members

      const txHash = await createGroup(groupName.trim(), allMembers)

      const newGroup = {
        id: Date.now().toString(),
        name: groupName,
        members: allMembers.length,
        totalExpenses: 0,
        yourBalance: 0,
        txHash
      }

      onGroupCreated?.(newGroup)
      setOpen(false)
      setGroupName("")
      setMembers([])
      setError("")
      onClose?.()
    } catch (err: any) {
      setError(err.message || "Failed to create group")
    }
  }

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen)
      if (!newOpen && onClose) {
        onClose()
      }
    }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="glass-white neon-white-border animate-in fade-in-0 zoom-in-95 duration-300">
        <DialogHeader>
          <DialogTitle className="neon-white-text flex items-center font-mono">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-4 h-4 text-black" />
            </div>
            Create New Group
          </DialogTitle>
          <DialogDescription className="text-slate-400 font-mono space-y-2">
            <p>Setup a new group to start splitting expenses with friends.</p>
            <p className="text-sm text-slate-500">All members will need a wallet address to participate in expense splitting.</p>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
              {error && (
                <Alert className="border-red-500/20 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="groupName" className="text-green-300 font-mono">
                  Group Name
                </Label>
                <Input
                  id="groupName"
                  placeholder="e.g., Weekend Trip, Roommates, Lunch Group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="glass-green border-green-500/30 text-green-100 placeholder:text-green-400/60 font-mono"
                />
                <p className="text-xs text-slate-400">Choose a memorable name that describes your group's purpose</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newMemberAddress" className="text-green-300 font-mono flex items-center justify-between">
                  <span>Invite Members</span>
                  <span className="text-xs text-slate-400">({members.length} added)</span>
                </Label>
                <div className="flex space-x-2">
                  <div className="flex-1 space-y-1">
                    <Input
                      id="newMemberAddress"
                      placeholder="0x... (Ethereum wallet address)"
                      value={newMemberAddress}
                      onChange={(e) => setNewMemberAddress(e.target.value)}
                      className="glass-green border-green-500/30 text-green-100 placeholder:text-green-400/60 font-mono"
                    />
                    <p className="text-xs text-slate-400">Enter your friend's Ethereum wallet address</p>
                  </div>
                  <Button 
                    onClick={addMember} 
                    className="btn-matrix font-mono self-start"
                    title="Add member to group"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>

              {members.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-green-300 font-mono">Added Members</Label>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto p-2 rounded-md glass-green border border-green-500/30">
                    {members.map((member, index) => (
                      <Badge 
                        key={member} 
                        className="glass-green border-green-500/30 text-green-100 font-mono flex items-center justify-between w-full p-2"
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">#{index + 1}</span>
                          <span className="truncate">{member}</span>
                        </span>
                        <Button 
                          variant="ghost" 
                          onClick={() => removeMember(member)} 
                          className="hover:text-red-500"
                          title="Remove member"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setOpen(false)
              onClose?.()
            }} 
            className="border-slate-500/50 text-slate-300 hover:bg-slate-500/10 font-mono"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCreateGroup} 
            className="btn-matrix font-mono"
            disabled={loading || !isConnected || !isCorrectNetwork}
          >
            <Users className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Create Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}