"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import { useUser } from "@civic/auth-web3/react"
import { ChevronLeft, TrendingUp, TrendingDown, DollarSign, Users, Activity, BarChart3, PieChart, LineChart } from "lucide-react"

interface AnalyticsProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
}

export function Analytics({ onPageChange }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "1y">("30d")
  const { user } = useUser()

  // Use Civic Auth user information
  const address = (user as any)?.wallet?.address || ""
  const balance = "0.00" // Placeholder for now
  const ensName = user?.name || ""

  // Mock data for analytics
  const analyticsData = {
    totalExpenses: 1250.75,
    totalSettlements: 890.50,
    activeGroups: 3,
    totalMembers: 12,
    expenseTrend: [
      { date: "2024-01", amount: 150 },
      { date: "2024-02", amount: 200 },
      { date: "2024-03", amount: 180 },
      { date: "2024-04", amount: 220 },
      { date: "2024-05", amount: 250 },
      { date: "2024-06", amount: 300 },
    ],
    categoryBreakdown: [
      { category: "Food & Dining", amount: 450, percentage: 36 },
      { category: "Transportation", amount: 300, percentage: 24 },
      { category: "Entertainment", amount: 250, percentage: 20 },
      { category: "Utilities", amount: 150, percentage: 12 },
      { category: "Other", amount: 100, percentage: 8 },
    ],
    recentActivity: [
      { type: "expense", description: "Lunch at Chipotle", amount: 25.50, group: "Work Team", time: "2 hours ago" },
      { type: "settlement", description: "Paid back Sarah", amount: 15.00, group: "Roommates", time: "1 day ago" },
      { type: "expense", description: "Uber ride", amount: 18.75, group: "Weekend Trip", time: "2 days ago" },
    ]
  }

  return (
    <div className="flex min-h-screen matrix-bg">
      <Sidebar onPageChange={onPageChange} currentPage="analytics" />
      <main className="flex-1 p-6 ml-64 animate-in fade-in-0 zoom-in-95 duration-500">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange("dashboard")}
                className="text-slate-400 hover:text-white mr-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold neon-text font-mono mb-2">Analytics</h1>
                <p className="text-green-400/70 font-mono">Track your expense patterns and insights</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {(["7d", "30d", "90d", "1y"] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className={timeRange === range ? "btn-matrix font-mono" : "border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"}
                >
                  {range}
                </Button>
              ))}
            </div>
          </div>

          {/* User Info */}
          {user && (
            <Card className="glass-green neon-border mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-300 font-mono font-semibold">
                      {ensName || 'Anonymous User'}
                    </p>
                    <p className="text-green-400/70 font-mono text-sm">
                      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No wallet connected'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-300 font-mono font-semibold">${balance}</p>
                    <p className="text-green-400/70 font-mono text-sm">Balance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card className="glass-green neon-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400/70 text-sm font-mono">Total Expenses</p>
                    <p className="text-2xl font-bold neon-text font-mono">${analyticsData.totalExpenses}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-green-400 text-sm font-mono">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% vs last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-white neon-white-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400/70 text-sm font-mono">Settlements</p>
                    <p className="text-2xl font-bold neon-white-text font-mono">${analyticsData.totalSettlements}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Activity className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-slate-400 text-sm font-mono">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  -5.2% vs last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-green neon-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400/70 text-sm font-mono">Active Groups</p>
                    <p className="text-2xl font-bold neon-text font-mono">{analyticsData.activeGroups}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-green-400 text-sm font-mono">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +1 new this month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-white neon-white-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400/70 text-sm font-mono">Total Members</p>
                    <p className="text-2xl font-bold neon-white-text font-mono">{analyticsData.totalMembers}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-slate-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-slate-400 text-sm font-mono">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3 new members
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Expense Trend Chart */}
            <Card className="glass-green neon-border">
              <CardHeader>
                <CardTitle className="neon-text flex items-center font-mono">
                  <LineChart className="w-5 h-5 mr-2 text-green-400" />
                  Expense Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {analyticsData.expenseTrend.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t"
                        style={{ height: `${(item.amount / 300) * 200}px` }}
                      />
                      <p className="text-green-400/70 font-mono text-xs mt-2">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="glass-white neon-white-border">
              <CardHeader>
                <CardTitle className="neon-white-text flex items-center font-mono">
                  <PieChart className="w-5 h-5 mr-2 text-slate-400" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.categoryBreakdown.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                          }}
                        />
                        <span className="text-slate-300 font-mono text-sm">{category.category}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-300 font-mono font-semibold">${category.amount}</p>
                        <p className="text-slate-400/70 font-mono text-xs">{category.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
                {analyticsData.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20 hover:bg-green-500/10 hover:border-green-500/40 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-2 h-2 rounded-full ${activity.type === "expense" ? "bg-green-400" : "bg-slate-400"}`}
                      />
                      <div>
                        <p className="neon-text font-medium font-mono">{activity.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-green-400/70 font-mono">
                          <span>{activity.group}</span>
                          <span>•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                    <span
                      className={`font-semibold font-mono ${activity.type === "expense" ? "text-green-400" : "text-slate-400"}`}
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
