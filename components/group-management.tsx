"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Plus, Users, SettingsIcon, Trash2, UserPlus, Copy, ExternalLink, Shield, Zap, Code } from "lucide-react"

interface GroupManagementProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
}

const mockGroups = [
  {
    id: "1",
    name: "Crypto Meetup",
    description: "Monthly crypto meetup expenses",
    members: [
      { id: "1", name: "You", address: "0x1234...5678", role: "admin", avatar: "Y" },
      { id: "2", name: "alice.eth", address: "0x2345...6789", role: "member", avatar: "A" },
      { id: "3", name: "bob.eth", address: "0x3456...7890", role: "member", avatar: "B" },
      { id: "4", name: "charlie.eth", address: "0x4567...8901", role: "member", avatar: "C" },
    ],
    contractAddress: "0xabcd...ef12",
    totalExpenses: 1247.5,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "DeFi Research",
    description: "Research group for DeFi protocols",
    members: [
      { id: "1", name: "You", address: "0x1234...5678", role: "admin", avatar: "Y" },
      { id: "5", name: "defi.eth", address: "0x5678...9012", role: "member", avatar: "D" },
    ],
    contractAddress: "0x1234...5678",
    totalExpenses: 892.25,
    status: "active",
    createdAt: "2024-01-20",
  },
]

export function GroupManagement({ onPageChange }: GroupManagementProps) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [newMemberAddress, setNewMemberAddress] = useState("")
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")

  const selectedGroupData = mockGroups.find((g) => g.id === selectedGroup)

  const handleAddMember = () => {
    if (newMemberAddress.trim()) {
      console.log("Adding member:", newMemberAddress)
      setNewMemberAddress("")
    }
  }

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      console.log("Creating group:", { name: newGroupName, description: newGroupDescription })
      setNewGroupName("")
      setNewGroupDescription("")
      setShowCreateGroup(false)
    }
  }

  return (
    <div className="flex min-h-screen matrix-bg">
      <Sidebar onPageChange={onPageChange} currentPage="group" />
      {/* Removed <div className="digital-grid-overlay" /> */}
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold neon-text font-mono mb-2">Group Management</h1>
              <p className="text-green-400/70 font-mono">Manage your decentralized expense groups</p>
            </div>
            <Button onClick={() => setShowCreateGroup(true)} className="btn-matrix font-mono">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>

          {showCreateGroup && (
            <Card className="glass-white neon-white-border">
              {" "}
              {/* Changed to glass-white and neon-white-border */}
              <CardHeader>
                <CardTitle className="neon-white-text font-mono">Create New Group</CardTitle>{" "}
                {/* Changed to neon-white-text */}
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="groupName" className="text-slate-400 font-mono">
                    {" "}
                    {/* Changed to slate */}
                    Group Name
                  </Label>
                  <Input
                    id="groupName"
                    placeholder="e.g., Weekend Trip, Office Lunch..."
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="bg-black/50 border-slate-500/30 text-slate-400 placeholder:text-slate-400/50 font-mono" /* Changed to slate */
                  />
                </div>
                <div>
                  <Label htmlFor="groupDescription" className="text-slate-400 font-mono">
                    {" "}
                    {/* Changed to slate */}
                    Description
                  </Label>
                  <Input
                    id="groupDescription"
                    placeholder="Enter group description..."
                    value={newGroupDescription}
                    onChange={(e) => setNewGroupDescription(e.target.value)}
                    className="bg-black/50 border-slate-500/30 text-slate-400 placeholder:text-slate-400/50 font-mono" /* Changed to slate */
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleCreateGroup} className="btn-matrix font-mono">
                    Create Group
                  </Button>
                  <Button
                    onClick={() => setShowCreateGroup(false)}
                    variant="outline"
                    className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono bg-transparent" /* Changed to slate */
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Groups List */}
            <div className="lg:col-span-1">
              <Card className="glass-green neon-border">
                <CardHeader>
                  <CardTitle className="neon-text font-mono">Your Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockGroups.map((group) => (
                    <div
                      key={group.id}
                      onClick={() => setSelectedGroup(group.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all border ${
                        selectedGroup === group.id
                          ? "glass-green-strong border-green-500/50 neon-glow"
                          : "glass-green border-green-500/20 hover:border-green-500/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold neon-text font-mono">{group.name}</h3>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-mono text-xs">
                          {group.members.length} members
                        </Badge>
                      </div>
                      <p className="text-sm text-green-400/70 mb-2">{group.description}</p>
                      <div className="flex items-center justify-between text-xs text-green-400/50 font-mono">
                        <span>${group.totalExpenses.toFixed(2)} total</span>
                        <span>{group.status}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Group Details */}
            <div className="lg:col-span-2">
              {selectedGroupData ? (
                <div className="space-y-6">
                  {/* Group Info */}
                  <Card className="glass-white neon-white-border">
                    {" "}
                    {/* Changed to glass-white and neon-white-border */}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="neon-white-text font-mono">{selectedGroupData.name}</CardTitle>{" "}
                        {/* Changed to neon-white-text */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono bg-transparent" /* Changed to slate */
                        >
                          <SettingsIcon className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-slate-400/80 font-mono">{selectedGroupData.description}</p>{" "}
                      {/* Changed to slate */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-lg glass-white border border-slate-500/20">
                          {" "}
                          {/* Changed to glass-white */}
                          <div className="text-sm text-slate-400/70 font-mono">Contract Address</div>{" "}
                          {/* Changed to slate */}
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-slate-400">{selectedGroupData.contractAddress}</span>{" "}
                            {/* Changed to slate */}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-slate-400/70 hover:text-slate-400" /* Changed to slate */
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-slate-400/70 hover:text-slate-400" /* Changed to slate */
                            >
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="p-3 rounded-lg glass-white border border-slate-500/20">
                          {" "}
                          {/* Changed to glass-white */}
                          <div className="text-sm text-slate-400/70 font-mono">Total Expenses</div>{" "}
                          {/* Changed to slate */}
                          <div className="text-xl font-bold neon-white-text font-mono">
                            {" "}
                            {/* Changed to neon-white-text */}${selectedGroupData.totalExpenses.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Members */}
                  <Card className="glass-white neon-white-border">
                    {" "}
                    {/* Changed to glass-white and neon-white-border */}
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="neon-white-text font-mono">
                          {" "}
                          {/* Changed to neon-white-text */}
                          Members ({selectedGroupData.members.length})
                        </CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono bg-transparent" /* Changed to slate */
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Add Member
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Add Member Form */}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Enter wallet address or ENS name..."
                          value={newMemberAddress}
                          onChange={(e) => setNewMemberAddress(e.target.value)}
                          className="bg-black/50 border-slate-500/30 text-slate-400 placeholder:text-slate-400/50 font-mono" /* Changed to slate */
                        />
                        <Button onClick={handleAddMember} className="btn-matrix font-mono">
                          Add
                        </Button>
                      </div>

                      {/* Members List */}
                      <div className="space-y-3">
                        {selectedGroupData.members.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 rounded-lg glass-white border border-slate-500/20" /* Changed to glass-white */
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-10 h-10 bg-gradient-to-r from-slate-500 to-green-500">
                                {" "}
                                {/* Mixed gradient */}
                                <AvatarFallback className="text-black font-semibold">{member.avatar}</AvatarFallback>{" "}
                                {/* Icon color */}
                              </Avatar>
                              <div>
                                <p className="font-semibold neon-white-text font-mono">{member.name}</p>{" "}
                                {/* Changed to neon-white-text */}
                                <p className="text-sm text-slate-400/70 font-mono">{member.address}</p>{" "}
                                {/* Changed to slate */}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                className={`font-mono text-xs ${
                                  member.role === "admin"
                                    ? "bg-green-500/30 text-green-200 border-green-500/50"
                                    : "bg-slate-500/20 text-slate-300 border-slate-500/30" // Changed to slate
                                }`}
                              >
                                {member.role}
                              </Badge>
                              {member.role !== "admin" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-400/70 hover:text-red-400 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Features */}
                  <Card className="glass-white neon-white-border">
                    {" "}
                    {/* Changed to glass-white and neon-white-border */}
                    <CardHeader>
                      <CardTitle className="neon-white-text font-mono flex items-center">
                        {" "}
                        {/* Changed to neon-white-text */}
                        <Shield className="w-5 h-5 mr-2 text-slate-400" /> {/* Changed to slate */}
                        Security Features
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg glass-white border border-slate-500/20">
                          {" "}
                          {/* Changed to glass-white */}
                          <div className="flex items-center space-x-2 mb-2">
                            <Code className="w-5 h-5 text-slate-400" /> {/* Changed to slate */}
                            <span className="font-semibold neon-white-text font-mono">Smart Contract</span>{" "}
                            {/* Changed to neon-white-text */}
                          </div>
                          <p className="text-sm text-slate-400/70 font-mono">
                            {" "}
                            {/* Changed to slate */}
                            Automated expense splitting with cryptographic proof
                          </p>
                        </div>

                        <div className="p-4 rounded-lg glass-white border border-slate-500/20">
                          {" "}
                          {/* Changed to glass-white */}
                          <div className="flex items-center space-x-2 mb-2">
                            <Zap className="w-5 h-5 text-slate-400" /> {/* Changed to slate */}
                            <span className="font-semibold neon-white-text font-mono">Gas Optimization</span>{" "}
                            {/* Changed to neon-white-text */}
                          </div>
                          <p className="text-sm text-slate-400/70 font-mono">
                            Layer 2 scaling for minimal transaction costs
                          </p>{" "}
                          {/* Changed to slate */}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="glass-white neon-white-border h-96 flex items-center justify-center">
                  {" "}
                  {/* Changed to glass-white and neon-white-border */}
                  <div className="text-center">
                    <Users className="w-16 h-16 text-slate-400/50 mx-auto mb-4" /> {/* Changed to slate */}
                    <p className="text-slate-400/70 font-mono">Select a group to view details</p>{" "}
                    {/* Changed to slate */}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
