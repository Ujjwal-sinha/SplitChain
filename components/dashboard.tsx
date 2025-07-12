"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { WalletCard } from "@/components/wallet-card"
import { BalanceFlow } from "@/components/balance-flow"
import { Plus, Activity, ArrowUpRight, ArrowDownLeft, Zap, Users, DollarSign } from "lucide-react"

interface DashboardProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
  onGroupSelect: (groupId: string) => void
  onCreateGroup: () => void
}

const mockGroups = [
  {
    id: "1",
    name: "Crypto Meetup",
    members: 8,
    balance: -125.5,
    color: "from-green-500 to-green-400",
    status: "active",
  },
  {
    id: "2",
    name: "DeFi Research",
    members: 12,
    balance: 89.25,
    color: "from-slate-500 to-slate-400", // Changed to slate
    status: "active",
  },
  {
    id: "3",
    name: "Web3 Hackathon",
    members: 6,
    balance: -67.75,
    color: "from-green-600 to-green-500",
    status: "settling",
  },
  {
    id: "4",
    name: "DAO Expenses",
    members: 15,
    balance: 234.0,
    color: "from-slate-300 to-slate-200", // Changed to slate
    status: "active",
  },
]

const recentActivity = [
  {
    id: "1",
    type: "expense",
    description: "Gas fees for smart contract deployment",
    amount: 45.5,
    group: "DeFi Research",
    time: "2 hours ago",
    hash: "0x1234...5678",
  },
  {
    id: "2",
    type: "settlement",
    description: "Settled with alice.eth",
    amount: 125.0,
    group: "Crypto Meetup",
    time: "5 hours ago",
    hash: "0x2345...6789",
  },
  {
    id: "3",
    type: "expense",
    description: "Conference tickets",
    amount: 89.25,
    group: "Web3 Hackathon",
    time: "1 day ago",
    hash: "0x3456...7890",
  },
]

export function Dashboard({ onPageChange, onGroupSelect, onCreateGroup }: DashboardProps) {
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("all")

  return (
    <div className="flex min-h-screen matrix-bg">
      <Sidebar onPageChange={onPageChange} currentPage="dashboard" />
      {/* Removed <div className="digital-grid-overlay" /> */}
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold neon-text font-mono mb-2">Dashboard</h1>
              <p className="text-green-400/70 font-mono">Manage your decentralized expense groups</p>
            </div>
            <Button onClick={onCreateGroup} className="btn-matrix font-mono">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid lg:grid-cols-4 gap-6">
            <Card className="glass-green neon-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400/70 text-sm font-mono">Total Balance</p>
                    <p className="text-2xl font-bold neon-text font-mono">$1,247.50</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-green-400 text-sm font-mono">
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                  +12.5% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-white neon-white-border card-hover">
              {" "}
              {/* Changed to glass-white */}
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400/70 text-sm font-mono">Active Groups</p> {/* Changed text color */}
                    <p className="text-2xl font-bold neon-white-text font-mono">4</p> {/* Changed text color */}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-400 to-slate-300 rounded-lg flex items-center justify-center">
                    {" "}
                    {/* Changed gradient */}
                    <Users className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-slate-400 text-sm font-mono">
                  {" "}
                  {/* Changed text color */}
                  <ArrowUpRight className="w-4 h-4 mr-1" />2 new this week
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
              {" "}
              {/* Changed to glass-white */}
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400/70 text-sm font-mono">Settlements</p> {/* Changed text color */}
                    <p className="text-2xl font-bold neon-white-text font-mono">23</p> {/* Changed text color */}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-300 to-slate-200 rounded-lg flex items-center justify-center">
                    {" "}
                    {/* Changed gradient */}
                    <Activity className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-slate-400 text-sm font-mono">
                  {" "}
                  {/* Changed text color */}
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
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold neon-text font-mono">Your Groups</h2>
              <div className="flex space-x-2">
                <Button
                  variant={selectedGroupFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGroupFilter("all")}
                  className={
                    selectedGroupFilter === "all"
                      ? "bg-green-500 text-black font-mono"
                      : "border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono bg-transparent"
                  }
                >
                  All
                </Button>
                <Button
                  variant={selectedGroupFilter === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGroupFilter("active")}
                  className={
                    selectedGroupFilter === "active"
                      ? "bg-slate-500 text-black font-mono" // Changed to slate
                      : "border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono bg-transparent" // Changed to slate
                  }
                >
                  Active
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockGroups.map((group) => (
                <Card
                  key={group.id}
                  className="glass-green neon-border card-hover cursor-pointer"
                  onClick={() => onGroupSelect(group.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${group.color}`} />
                      <Badge
                        variant="secondary"
                        className={`font-mono text-xs ${
                          group.status === "active"
                            ? "bg-green-500/20 text-green-300 border-green-500/30"
                            : group.status === "settling"
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                              : "bg-gray-500/20 text-gray-300 border-gray-500/30"
                        }`}
                      >
                        {group.members} members
                      </Badge>
                    </div>
                    <h3 className="font-semibold neon-text mb-2 font-mono group-hover:text-green-300 transition-colors">
                      {group.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-400/70 font-mono">Your balance</span>
                      <div className="flex items-center">
                        {group.balance > 0 ? (
                          <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-red-400 mr-1" />
                        )}
                        <span
                          className={`font-semibold font-mono ${group.balance > 0 ? "text-green-400" : "text-red-400"}`}
                        >
                          ${Math.abs(group.balance).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

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
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20 hover:border-green-500/40 transition-colors"
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
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
