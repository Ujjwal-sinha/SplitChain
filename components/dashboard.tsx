"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { WalletCard } from "@/components/wallet-card"
import { BalanceFlow } from "@/components/balance-flow"
import { CreateGroupModal } from "@/components/create-group-modal"
import { useContracts } from "@/hooks/use-contracts"
import { useWallet } from "@/components/wallet-provider"
import { Plus, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownLeft, Settings, Loader2, ChevronLeft, Zap, Activity } from "lucide-react"

interface DashboardProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
  onGroupSelect: (groupId: string) => void
  onCreateGroup: () => void
}

export function Dashboard({ onPageChange, onGroupSelect, onCreateGroup }: DashboardProps) {
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const { groups, loading, fetchGroups, createGroup, testContractConnection } = useContracts()
  const { isConnected, isCorrectNetwork, address } = useWallet()

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      fetchGroups()
    }
  }, [isConnected, isCorrectNetwork, fetchGroups])

  const handleCreateGroup = () => {
    setShowCreateGroup(true)
    if (onCreateGroup) {
      onCreateGroup()
    }
  }

  const handleGroupCreated = () => {
    // Add the new group to the list
    setShowCreateGroup(false)
    fetchGroups() // Refresh groups after creation
  }

  const testGroupCreation = async () => {
    if (!address) return

    try {
      const testMembers = [
        address,
        "0x742d35Cc8C8B4E4dA4E5a8c4e3B2e4b3c9C8B4E4", // Test address 1
        "0x853e46Dd9D9F5F5eE5e5F9F5f4C4F5c4D4D9D5F5"  // Test address 2
      ]

      await createGroup("Test Group " + Date.now(), testMembers)
      console.log("Test group created successfully!")
    } catch (error) {
      console.error("Error creating test group:", error)
    }
  }

  const testContracts = async () => {
    try {
      const result = await testContractConnection()
      alert(`✅ Contracts Working!\nToken: ${result.tokenName} (${result.tokenSymbol})\nBalance: ${result.balance}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`❌ Contract Test Failed: ${errorMessage}`)
    }
  }

  return (
    <div className="flex min-h-screen matrix-bg">
      <Sidebar onPageChange={onPageChange} currentPage="dashboard" />
      <main className="flex-1 p-6 ml-64 animate-in fade-in-0 zoom-in-95 duration-500">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange("landing")}
                className="text-slate-400 hover:text-white mr-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold neon-text font-mono mb-2">Dashboard</h1>
                <p className="text-green-400/70 font-mono">Manage your decentralized expense groups</p>
              </div>
            </div>
            <Button onClick={handleCreateGroup} className="btn-matrix font-mono">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-green neon-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400/70 text-sm font-mono">Active Groups</p>
                    <p className="text-2xl font-bold neon-text font-mono">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : groups.length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-white neon-white-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400/70 text-sm font-mono">Total Balance</p>
                    <p className="text-2xl font-bold neon-white-text font-mono">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 
                        `$${groups.reduce((sum, group) => sum + Math.abs(parseFloat(group.yourBalance) || 0), 0).toFixed(2)}`
                      }
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-green neon-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400/70 text-sm font-mono">Gas Saved</p>
                    <p className="text-2xl font-bold neon-text font-mono">67%</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-green-400 text-sm font-mono">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  vs traditional methods
                </div>
              </CardContent>
            </Card>

            <Card className="glass-white neon-white-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400/70 text-sm font-mono">Settlements</p>
                    <p className="text-2xl font-bold neon-white-text font-mono">23</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-300 to-slate-200 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-slate-400 text-sm font-mono">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  This month
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <WalletCard />
            </div>
            <div className="lg:col-span-2">
              <Card className="glass-green neon-border h-full">
                <CardHeader>
                  <CardTitle className="neon-text flex items-center font-mono">
                    <Activity className="w-5 h-5 mr-2 text-green-400" />
                    Balance Flow
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BalanceFlow />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Groups Grid */}
          <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="glass-green neon-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="h-6 w-32 bg-green-500/20 rounded animate-pulse" />
                      <div className="h-5 w-16 bg-green-500/20 rounded animate-pulse" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-4 w-24 bg-green-500/20 rounded animate-pulse" />
                      <div className="h-4 w-16 bg-green-500/20 rounded animate-pulse" />
                    </div>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="w-8 h-8 rounded-full bg-green-500/20 animate-pulse" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : groups.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
                <p className="text-green-400/70 font-mono mb-4">No groups found</p>
                <div className="space-y-2">
                  <Button onClick={handleCreateGroup} className="btn-matrix font-mono">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Group
                  </Button>
                  <Button 
                    onClick={testGroupCreation} 
                    variant="outline"
                    className="w-full border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono bg-transparent"
                  >
                    Test Group Creation
                  </Button>
                  <Button 
                    onClick={testContracts} 
                    variant="outline"
                    className="w-full border-blue-500/50 text-blue-400 hover:bg-blue-500/10 font-mono bg-transparent"
                  >
                    Test Contract Connection
                  </Button>
                </div>
              </div>
            ) : (
              groups.map((group) => {
                const balance = parseFloat(group.yourBalance) || 0
                return (
                  <Card
                    key={group.id}
                    onClick={() => onGroupSelect(group.id.toString())}
                    className="glass-green neon-border card-hover cursor-pointer group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="neon-text font-mono">{group.name}</CardTitle>
                        <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-mono text-xs">
                          active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-green-400/70" />
                          <span className="text-sm text-green-400/70 font-mono">{group.members.length} members</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {balance > 0 ? (
                            <ArrowUpRight className="w-4 h-4 text-green-400" />
                          ) : (
                            <ArrowDownLeft className="w-4 h-4 text-red-400" />
                          )}
                          <span
                            className={`font-semibold font-mono ${
                              balance > 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            ${Math.abs(balance).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex -space-x-2">
                        {group.members.slice(0, 3).map((member, i) => (
                          <Avatar key={i} className="w-8 h-8 border-2 border-black bg-gradient-to-r from-slate-500 to-green-500">
                            <AvatarFallback className="text-black text-xs font-semibold">
                              {member.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {group.members.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-r from-green-700 to-green-600 flex items-center justify-center">
                            <span className="text-black text-xs font-semibold">+{group.members.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
          {showCreateGroup && (
          <CreateGroupModal
            onClose={() => setShowCreateGroup(false)}
            onGroupCreated={handleGroupCreated}
          />
        )}

          {/* Recent Activity */}
          <Card className="glass-green neon-border">
            <CardHeader>
              <CardTitle className="neon-text flex items-center font-mono">
                <Activity className="w-5 h-5 mr-2 text-green-400" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-2 h-2 rounded-full ${activity.type === "expense" ? "bg-green-400" : "bg-slate-400"}`} // Changed to slate
                      />
                      <div>
                        <p className="neon-text font-medium font-mono">{activity.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-green-400/70 font-mono">
                          <span>{activity.group}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                          <span>•</span>
                          <span className="text-green-300">{activity.hash}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`font-semibold font-mono ${activity.type === "expense" ? "text-green-400" : "text-slate-400"}`} // Changed to slate
                    >
                      {activity.type === "expense" ? "-" : "+"}${activity.amount.toFixed(2)}
                    </span>
                  </div>
                ))} */}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}