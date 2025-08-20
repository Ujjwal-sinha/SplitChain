"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useContracts } from "@/hooks/use-contracts"
import { useUser } from "@civic/auth-web3/react"
import { Plus, X } from "lucide-react"

interface CreateGroupModalProps {
  onClose: () => void
  onGroupCreated: () => void
}

export function CreateGroupModal({ onClose, onGroupCreated }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [members, setMembers] = useState<string[]>([""])
  const [isCreating, setIsCreating] = useState(false)
  const { createGroup } = useContracts()
  const { user } = useUser()

  // Use Civic Auth user information
  const isConnected = !!user
  const address = (user as any)?.wallet?.address || ""

  const handleAddMember = () => {
    setMembers([...members, ""])
  }

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index))
    }
  }

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...members]
    newMembers[index] = value
    setMembers(newMembers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isConnected || !address) {
      alert("Please connect your wallet first")
      return
    }

    if (!groupName.trim()) {
      alert("Please enter a group name")
      return
    }

    const validMembers = members
      .map(member => member.trim())
      .filter(member => member.length > 0)
      .filter(member => member !== address) // Remove creator from members list

    if (validMembers.length === 0) {
      alert("Please add at least one member")
      return
    }

    setIsCreating(true)
    try {
      await createGroup(groupName, validMembers)
      onGroupCreated()
      onClose()
    } catch (error) {
      console.error("Error creating group:", error)
      alert("Failed to create group. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="glass-green neon-border max-w-md">
        <DialogHeader>
          <DialogTitle className="neon-text font-mono">Create New Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="groupName" className="text-green-400 font-mono">Group Name</Label>
            <Input
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Enter group name"
              className="bg-slate-900/50 border-green-500/30 text-green-300 placeholder:text-green-400/50 font-mono"
              required
            />
          </div>

          <div>
            <Label className="text-green-400 font-mono">Members</Label>
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={index} className="flex space-x-2">
                  <Input
                    value={member}
                    onChange={(e) => handleMemberChange(index, e.target.value)}
                    placeholder="Enter wallet address"
                    className="bg-slate-900/50 border-green-500/30 text-green-300 placeholder:text-green-400/50 font-mono"
                  />
                  {members.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveMember(index)}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMember}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating || !isConnected}
              className="flex-1 btn-matrix font-mono"
            >
              {isCreating ? "Creating..." : "Create Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}