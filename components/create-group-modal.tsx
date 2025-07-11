"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { X, Plus, Users, Sparkles } from "lucide-react"

interface CreateGroupModalProps {
  onClose: () => void
  onGroupCreated: (groupId: string) => void
}

export function CreateGroupModal({ onClose, onGroupCreated }: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("")
  const [inviteAddress, setInviteAddress] = useState("")
  const [invitedMembers, setInvitedMembers] = useState<string[]>([])

  const handleAddMember = () => {
    if (inviteAddress && !invitedMembers.includes(inviteAddress)) {
      setInvitedMembers([...invitedMembers, inviteAddress])
      setInviteAddress("")
    }
  }

  const handleRemoveMember = (address: string) => {
    setInvitedMembers(invitedMembers.filter((member) => member !== address))
  }

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      // Simulate group creation
      const newGroupId = Math.random().toString(36).substr(2, 9)
      onGroupCreated(newGroupId)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md glass-blue neon-blue-border animate-in fade-in-0 zoom-in-95 duration-300">
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
              <Users className="w-4 h-4 text-black" /> {/* Icon color */}
            </div>
            Create New Group
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Group Name */}
          <div>
            <Label htmlFor="groupName" className="text-blue-400 font-mono mb-2 block">
              {" "}
              {/* Changed to blue */}
              Group Name
            </Label>
            <Input
              id="groupName"
              placeholder="e.g., Weekend Trip, Office Lunch..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="bg-black/50 border-blue-500/30 text-blue-400 placeholder:text-blue-400/50 font-mono" /* Changed to blue */
            />
          </div>

          {/* Invite Members */}
          <div>
            <Label className="text-blue-400 font-mono mb-2 block">Invite Members</Label> {/* Changed to blue */}
            <div className="flex space-x-2">
              <Input
                placeholder="Enter wallet address or ENS name"
                value={inviteAddress}
                onChange={(e) => setInviteAddress(e.target.value)}
                className="bg-black/50 border-blue-500/30 text-blue-400 placeholder:text-blue-400/50 font-mono" /* Changed to blue */
                onKeyPress={(e) => e.key === "Enter" && handleAddMember()}
              />
              <Button
                onClick={handleAddMember}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-black font-mono"
              >
                {" "}
                {/* Changed to blue */}
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Invited Members List */}
          {invitedMembers.length > 0 && (
            <div>
              <Label className="text-blue-400 font-mono mb-2 block">Invited Members ({invitedMembers.length})</Label>{" "}
              {/* Changed to blue */}
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {invitedMembers.map((address, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg glass-blue border border-blue-500/20" /* Changed to glass-blue */
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6 bg-gradient-to-r from-blue-500 to-green-500">
                        {" "}
                        {/* Mixed gradient */}
                        <AvatarFallback className="text-black text-xs">
                          {" "}
                          {/* Icon color */}
                          {address.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-blue-400 text-sm font-mono">{address}</span> {/* Changed to blue */}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMember(address)}
                      className="text-slate-400 hover:text-red-400 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Button */}
          <Button
            onClick={handleCreateGroup}
            disabled={!groupName.trim()}
            className="btn-matrix w-full font-mono disabled:opacity-50 disabled:cursor-not-allowed" /* Themed button */
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Start Group
          </Button>

          <p className="text-xs text-slate-400 text-center font-mono">
            {" "}
            {/* Themed text */}
            Group members will be notified via their connected wallets
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
