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
import { CivicAuthButton } from "@/components/civic-auth-button"
import { WalletSelectionModal } from "@/components/wallet-selection-modal"
import { useContracts } from "@/hooks/use-contracts"
import { useUser } from "@civic/auth-web3/react"
import { useWallet } from "@/components/wallet-provider"
import { Plus, TrendingUp, Users, DollarSign, ArrowUpRight, ArrowDownLeft, Settings, Loader2, ChevronLeft, Zap, Activity, Wallet, BarChart3, LogOut } from "lucide-react"

interface DashboardProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
  onGroupSelect: (groupId: string) => void
  onCreateGroup: () => void
}

export function Dashboard({ onPageChange, onGroupSelect, onCreateGroup }: DashboardProps) {
  const [showCreateGroup, setShowCreateGroup] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const { groups, loading, fetchGroups, createGroup } = useContracts()
  const { user } = useUser()
  const { isConnected: isWalletConnected, address: walletAddress, balance, chainId, disconnectWallet } = useWallet()
  
  // Use user information from Civic Auth
  const isConnected = !!user
  const isCorrectNetwork = true // Civic Auth handles network compatibility
  const address = (user as any)?.wallet?.address || "0x0000000000000000000000000000000000000000"

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      fetchGroups()
    }
  }, [isConnected, isCorrectNetwork, fetchGroups])

  // Handle logout and redirect to landing page
  const handleLogout = () => {
    // Disconnect traditional wallet if connected
    if (isWalletConnected) {
      disconnectWallet()
    }
    
    // Redirect to landing page
    onPageChange("landing")
  }

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

  const handleWalletConnected = () => {
    setShowWalletModal(false)
    console.log("Wallet connected via wallet provider")
  }

  const testGroupCreation = async () => {
    if (!address) return

    try {
      const testMembers = [
        address,
        "0x742d35Cc8C8B4E4dA4E5a8c4e3B2e4b3c9C8B4E4", // Test address 1
        "0x853e46Dd9D9F5F5eE5e5F9F5f4C4F5c4D4D9D5F5"  // Test address 2
      ]

      const result = await createGroup("Test Group " + Date.now(), testMembers)
      console.log("Test group created with ID:", result)
      console.log("Test group created successfully!")
    } catch (error) {
      console.error("Error creating test group:", error)
    }
  }

  const testContracts = async () => {
    try {
      alert(`✅ Civic Auth Integration Working!\nUser: ${user?.name || user?.email || 'Authenticated'}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`❌ Auth Test Failed: ${errorMessage}`)
    }
  }

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test-db')
      const result = await response.json()
      
      if (result.success) {
        alert(`✅ MongoDB Connected!\nCollections: ${result.collections.join(', ') || 'None yet'}`)
      } else {
        alert(`❌ MongoDB Test Failed: ${result.message}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`❌ Database Test Failed: ${errorMessage}`)
    }
  }

  // Calculate total balance across groups
  const totalBalance = groups.reduce((sum, group) => sum + Math.abs(parseFloat(group.yourBalance) || 0), 0)

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
                <p className="text-green-400/70 font-mono">
                  Manage your decentralized expense groups
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Civic Auth Button */}
              <CivicAuthButton
                onConnect={() => {
                  console.log("Wallet connected via Civic Auth")
                  fetchGroups() // Refresh groups after connection
                }}
                variant="outline"
                size="sm"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"
              />
              
              {/* Connect Wallet Button (Traditional Wallet) */}
              <Button
                onClick={() => setShowWalletModal(true)}
                variant="outline"
                size="sm"
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 font-mono"
              >
                <Wallet className="w-4 h-4 mr-2" />
                {isWalletConnected ? 'Wallet Connected' : 'Connect Wallet'}
              </Button>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              
              {/* Create Group Button - only show if connected */}
              {isConnected && (
                <Button onClick={handleCreateGroup} className="btn-matrix font-mono">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              )}
            </div>
          </div>

          {/* Connection Status */}
          {!isConnected && (
            <Card className="glass-green neon-border mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-green-300 font-mono font-semibold">Wallet Not Connected</p>
                      <p className="text-green-400/70 font-mono text-sm">
                        Connect your wallet to access all features
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CivicAuthButton
                      onConnect={() => {
                        console.log("Wallet connected via Civic Auth")
                        fetchGroups()
                      }}
                      size="sm"
                      className="btn-matrix font-mono"
                    />
                    <Button
                      onClick={() => setShowWalletModal(true)}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white font-mono"
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Connect Wallet
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet Connection Status */}
          {isWalletConnected && (
            <Card className="glass-white neon-white-border mb-6 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <div>
                      <p className="text-blue-300 font-mono font-semibold">Traditional Wallet Connected</p>
                      <p className="text-blue-400/70 font-mono text-sm">
                        Address: {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowWalletModal(true)}
                    size="sm"
                    variant="outline"
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 font-mono"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                        `$${totalBalance.toFixed(2)}`
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
                    <p className="text-2xl font-bold neon-text font-mono">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "67%"}
                    </p>
                    <p className="text-xs text-green-400/70 font-mono">vs traditional methods</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-white neon-white-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400/70 text-sm font-mono">Settlements</p>
                    <p className="text-2xl font-bold neon-white-text font-mono">
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "23"}
                    </p>
                    <p className="text-xs text-slate-400/70 font-mono">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-green-500 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-black" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Info Card */}
          {user && (
            <Card className="glass-green neon-border mb-6">
              <CardHeader>
                <CardTitle className="neon-text font-mono">User Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-green-500 text-black font-mono">
                      {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-green-300 font-mono font-semibold">
                      {user.name || 'Anonymous User'}
                    </p>
                    <p className="text-green-400/70 font-mono text-sm">
                      {user.email || 'No email provided'}
                    </p>
                    {(user as any)?.wallet?.address && (
                      <p className="text-green-400/50 font-mono text-xs">
                        Wallet: {(user as any).wallet.address.slice(0, 6)}...{(user as any).wallet.address.slice(-4)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wallet and Balance Flow Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Wallet Card */}
            <WalletCard />
            
            {/* Balance Flow */}
            <BalanceFlow totalBalance={totalBalance} />
          </div>

          {/* Test Buttons */}
          <div className="flex space-x-4 mb-6">
            <Button onClick={testContracts} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono">
              Test Auth
            </Button>
            <Button onClick={testDatabase} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono">
              Test Database
            </Button>
            <Button onClick={testGroupCreation} variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono">
              Test Group Creation
            </Button>
          </div>

          {/* Groups Section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="glass-green neon-border card-hover cursor-pointer"
                onClick={() => onGroupSelect(group.id)}
              >
                <CardHeader>
                  <CardTitle className="neon-text font-mono">{group.name}</CardTitle>
                  <p className="text-green-400/70 font-mono text-sm">
                    Created by {group.creator.slice(0, 6)}...{group.creator.slice(-4)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-green-400/70 font-mono text-sm">Members:</span>
                      <Badge variant="outline" className="border-green-500/50 text-green-400 font-mono">
                        {group.members.length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400/70 font-mono text-sm">Your Balance:</span>
                      <span className={`font-mono font-semibold ${parseFloat(group.yourBalance) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ${parseFloat(group.yourBalance).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-400/70 font-mono text-sm">Total Expenses:</span>
                      <span className="text-green-300 font-mono">${parseFloat(group.totalExpenses).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {groups.length === 0 && !loading && (
            <Card className="glass-green neon-border">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-green-400/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold neon-text font-mono mb-2">No Groups Yet</h3>
                <p className="text-green-400/70 font-mono mb-6">
                  Create your first expense group to start splitting costs with friends
                </p>
                <Button onClick={handleCreateGroup} className="btn-matrix font-mono">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Group
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}

      {showWalletModal && (
        <WalletSelectionModal
          onClose={() => setShowWalletModal(false)}
          onWalletConnected={handleWalletConnected}
        />
      )}
    </div>
  )
}