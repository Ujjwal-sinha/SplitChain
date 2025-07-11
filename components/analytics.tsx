"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/sidebar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { TrendingUp, Users, DollarSign, Clock } from "lucide-react"

interface AnalyticsProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics") => void
}

const expenseData = [
  { month: "Jan", amount: 450 },
  { month: "Feb", amount: 320 },
  { month: "Mar", amount: 680 },
  { month: "Apr", amount: 520 },
  { month: "May", amount: 890 },
  { month: "Jun", amount: 750 },
]

const groupData = [
  { name: "Weekend Trip", value: 35, color: "#00ff88" }, // Green
  { name: "Office Lunch", value: 25, color: "#00e676" }, // Lighter Green
  { name: "Apartment Bills", value: 20, color: "#00b359" }, // Darker Green
  { name: "Birthday Party", value: 20, color: "#00803d" }, // Even Darker Green
]

const settlementData = [
  { month: "Jan", settled: 85, pending: 15 },
  { month: "Feb", settled: 92, pending: 8 },
  { month: "Mar", settled: 78, pending: 22 },
  { month: "Apr", settled: 95, pending: 5 },
  { month: "May", settled: 88, pending: 12 },
  { month: "Jun", settled: 91, pending: 9 },
]

export function Analytics({ onPageChange }: AnalyticsProps) {
  return (
    <div className="flex min-h-screen matrix-bg">
      <Sidebar onPageChange={onPageChange} currentPage="analytics" />
      {/* Removed <div className="digital-grid-overlay" /> */}
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold neon-text font-mono mb-2">Analytics</h1>
              <p className="text-green-400/70 font-mono">Insights into your spending patterns and group dynamics</p>
            </div>
            <Button
              onClick={() => onPageChange("dashboard")}
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono bg-transparent neon-border"
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="glass-green neon-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400/70 text-sm font-mono">Total Expenses</p>
                    <p className="text-2xl font-bold neon-text font-mono">$3,612</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-green-400 text-sm font-mono">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12% from last month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-blue neon-border card-hover">
              {" "}
              {/* Changed to glass-blue */}
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400/70 text-sm font-mono">Active Groups</p> {/* Changed text color */}
                    <p className="text-2xl font-bold neon-blue-text font-mono">4</p> {/* Changed text color */}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-300 rounded-lg flex items-center justify-center">
                    {" "}
                    {/* Changed gradient */}
                    <Users className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-blue-400 text-sm font-mono">
                  {" "}
                  {/* Changed text color */}
                  <TrendingUp className="w-4 h-4 mr-1" />2 new this month
                </div>
              </CardContent>
            </Card>

            <Card className="glass-green neon-border card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-400/70 text-sm font-mono">Settlement Rate</p>
                    <p className="text-2xl font-bold neon-text font-mono">91%</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-green-400 text-sm font-mono">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +3% improvement
                </div>
              </CardContent>
            </Card>

            <Card className="glass-blue neon-border card-hover">
              {" "}
              {/* Changed to glass-blue */}
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-400/70 text-sm font-mono">Avg. Settlement Time</p>{" "}
                    {/* Changed text color */}
                    <p className="text-2xl font-bold neon-blue-text font-mono">2.3d</p> {/* Changed text color */}
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-300 to-blue-200 rounded-lg flex items-center justify-center">
                    {" "}
                    {/* Changed gradient */}
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                </div>
                <div className="flex items-center mt-2 text-blue-400 text-sm font-mono">
                  {" "}
                  {/* Changed text color */}
                  <TrendingUp className="w-4 h-4 mr-1" />
                  -0.5d faster
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="glass-green neon-border">
              <CardHeader>
                <CardTitle className="neon-text font-mono">Monthly Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#003300" />
                    <XAxis dataKey="month" stroke="#00ff88" />
                    <YAxis stroke="#00ff88" />
                    <Bar dataKey="amount" fill="url(#greenGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00ff88" />
                        <stop offset="100%" stopColor="#00b359" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="glass-blue neon-border">
              {" "}
              {/* Changed to glass-blue */}
              <CardHeader>
                <CardTitle className="neon-blue-text font-mono">Expenses by Group</CardTitle>{" "}
                {/* Changed to neon-blue-text */}
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={groupData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {groupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {groupData.map((group, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: group.color }} />
                      <span className="text-sm text-blue-300 font-mono">{group.name}</span> {/* Changed to blue */}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settlement Trends */}
          <Card className="glass-green neon-border">
            <CardHeader>
              <CardTitle className="neon-text font-mono">Settlement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={settlementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#003300" />
                  <XAxis dataKey="month" stroke="#00ff88" />
                  <YAxis stroke="#00ff88" />
                  <Line
                    type="monotone"
                    dataKey="settled"
                    stroke="#00ff88"
                    strokeWidth={3}
                    dot={{ fill: "#00ff88", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="pending"
                    stroke="#ffcc00"
                    strokeWidth={3}
                    dot={{ fill: "#ffcc00", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-green-300 font-mono">Settled (%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-green-300 font-mono">Pending (%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
