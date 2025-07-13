"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CardTitle } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Card } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { useContracts } from "@/hooks/use-contracts"
import { useWallet } from "@/components/wallet-provider"
import { Users, ArrowUpRight, ArrowDownLeft, Receipt, DollarSign, Plus, Check, History, Loader2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface GroupViewProps {
  groupId: string
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
}

// Real contract data will be loaded via useContracts hook

export function GroupView({ groupId, onPageChange }: GroupViewProps) {
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    splitType: "equal",
  })
  const { groups, expenses, addExpense, fetchGroups, fetchExpenses, loading } = useContracts()
  const { address } = useWallet()

  const groupData = groups.find(g => g.id.toString() === groupId)

  useEffect(() => {
    if (groupId) {
      fetchGroups()
      fetchExpenses()
    }
  }, [groupId, fetchGroups, fetchExpenses])

  const handleAddExpense = async () => {
    if (newExpense.description && newExpense.amount && groupData) {
      try {
        await addExpense(
          parseInt(groupId),
          newExpense.description,
          newExpense.amount,
          "0x0000000000000000000000000000000000000000" // ETH address
        )
        setNewExpense({ description: "", amount: "", splitType: "equal" })
        fetchExpenses() // Refresh expenses
      } catch (error) {
        console.error("Error adding expense:", error)
      }
    }
  }

  if (!groupData) {
    return (
      <div className="flex min-h-screen matrix-bg">
        <Sidebar onPageChange={onPageChange} currentPage="group" />
        <main className="flex-1 p-6 ml-64">
          <div className="max-w-7xl mx-auto flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-green-400 mx-auto mb-4" />
              <p className="text-green-400/70 font-mono">Loading group data...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const groupExpenses = expenses.filter(e => e.groupId.toString() === groupId)

  return (
    <div className="flex min-h-screen matrix-bg">
      {" "}
      {/* Changed background */}
      {/* Removed <div className="digital-grid-overlay" /> */}
      <Sidebar onPageChange={onPageChange} currentPage="group" />
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold neon-text font-mono mb-2">{groupData.name}</h1>
              <div className="flex items-center space-x-4 text-green-400/70 font-mono">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {groupData.members.length} members
                </div>
                <Badge variant="secondary" className="bg-slate-500/20 text-slate-300 border-slate-500/30 font-mono">
                  Active
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => onPageChange("dashboard")}
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono bg-transparent neon-border" /* Themed button */
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Balance Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            {groupData.members.map((memberAddress, index) => {
              const balance = parseFloat(groupData.yourBalance) || 0
              const isCurrentUser = memberAddress === address
              return (
                <Card key={memberAddress} className="glass-green neon-border card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-10 h-10 bg-gradient-to-r from-slate-500 to-green-500">
                        <AvatarFallback className="text-black font-semibold">
                          {memberAddress.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold neon-text font-mono">
                          {isCurrentUser ? "You" : `${memberAddress.slice(0, 6)}...${memberAddress.slice(-4)}`}
                        </p>
                        <p className="text-xs text-green-400/70 font-mono">{memberAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-400/70 font-mono">Balance</span>
                      <div className="flex items-center">
                        {isCurrentUser ? (
                          <>
                            {balance > 0 ? (
                              <ArrowUpRight className="w-4 h-4 mr-1" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4 mr-1" />
                            )}
                            <span
                              className={`font-semibold font-mono ${balance > 0 ? "text-green-400" : "text-red-400"}`}
                            >
                              ${Math.abs(balance).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-slate-400/70 font-mono text-sm">-</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="expenses" className="space-y-6">
            <TabsList className="glass-green neon-border">
              {" "}
              {/* Themed tabs list */}
              <TabsTrigger
                value="expenses"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-black font-mono"
              >
                {" "}
                {/* Themed active state */}
                <Receipt className="w-4 h-4 mr-2" />
                Add Expense
              </TabsTrigger>
              <TabsTrigger
                value="ledger"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-black font-mono"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Debt Ledger
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-black font-mono"
              >
                <History className="w-4 h-4 mr-2" />
                Group History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expenses">
              <Card className="glass-green neon-border">
                {" "}
                {/* Themed card */}
                <CardHeader>
                  <CardTitle className="neon-text font-mono">Add New Expense</CardTitle> {/* Themed text */}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="description" className="text-green-400 font-mono">
                        {" "}
                        {/* Themed text */}
                        Description
                      </Label>
                      <Input
                        id="description"
                        placeholder="What was this expense for?"
                        value={newExpense.description}
                        onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                        className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono" /* Themed input */
                      />
                    </div>
                    <div>
                      <Label htmlFor="amount" className="text-green-400 font-mono">
                        {" "}
                        {/* Themed text */}
                        Amount ($)
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono" /* Themed input */
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-green-400 font-mono mb-3 block">Split Method</Label> {/* Themed text */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={newExpense.splitType === "equal" ? "default" : "outline"}
                        onClick={() => setNewExpense({ ...newExpense, splitType: "equal" })}
                        className={
                          newExpense.splitType === "equal"
                            ? "bg-green-600 text-black font-mono" /* Themed button */
                            : "border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono bg-transparent" /* Themed button */
                        }
                      >
                        Equal Split
                      </Button>
                      <Button
                        variant={newExpense.splitType === "percentage" ? "default" : "outline"}
                        onClick={() => setNewExpense({ ...newExpense, splitType: "percentage" })}
                        className={
                          newExpense.splitType === "percentage"
                            ? "bg-slate-600 text-black font-mono" /* Changed to slate */
                            : "border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono bg-transparent" /* Changed to slate */
                        }
                      >
                        Percentage
                      </Button>
                      <Button
                        variant={newExpense.splitType === "custom" ? "default" : "outline"}
                        onClick={() => setNewExpense({ ...newExpense, splitType: "custom" })}
                        className={
                          newExpense.splitType === "custom"
                            ? "bg-green-600 text-black font-mono" /* Themed button */
                            : "border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono bg-transparent" /* Themed button */
                        }
                      >
                        Custom
                      </Button>
                    </div>
                  </div>

                  <Button onClick={handleAddExpense} className="btn-matrix w-full font-mono" /* Themed button */>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ledger">
              <Card className="glass-green neon-border">
                {" "}
                {/* Themed card */}
                <CardHeader>
                  <CardTitle className="neon-text font-mono">Debt Ledger</CardTitle> {/* Themed text */}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {groupData.members
                      .filter((memberAddress) => {
                        // For now, show all members since we don't have individual balances
                        return true
                      })
                      .map((memberAddress, index) => (
                        <div
                          key={memberAddress}
                          className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20" /* Themed card */
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 bg-gradient-to-r from-slate-500 to-green-500">
                              {" "}
                              {/* Mixed gradient */}
                              <AvatarFallback className="text-black font-semibold">
                                {memberAddress.slice(2, 4).toUpperCase()}
                              </AvatarFallback>{" "}
                              {/* Icon color */}
                            </Avatar>
                            <div>
                              <p className="font-semibold neon-text font-mono">
                                {memberAddress === address ? "You" : `${memberAddress.slice(0, 6)}...${memberAddress.slice(-4)}`}
                              </p> {/* Themed text */}
                              <p className="text-sm text-green-400/70 font-mono">
                                Calculating balance...
                              </p>{" "}
                              {/* Themed text */}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg font-mono text-green-400">
                              $0.00
                            </span>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-black font-mono">
                              {" "}
                              {/* Themed button */}
                              Settle
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="glass-green neon-border">
                <CardHeader>
                  <CardTitle className="neon-text font-mono">Expense History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-green-400" />
                      </div>
                    ) : groupExpenses.length === 0 ? (
                      <div className="text-center py-8">
                        <Receipt className="w-12 h-12 text-green-400/50 mx-auto mb-4" />
                        <p className="text-green-400/70 font-mono">No expenses yet</p>
                      </div>
                    ) : (
                      groupExpenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20"
                        >
                          <div className="w-3 h-3 rounded-full bg-yellow-400" />
                          <div className="flex-1 ml-4">
                            <p className="font-semibold neon-text font-mono">{expense.description}</p>
                            <p className="text-sm text-green-400/70 font-mono">
                              Paid by {expense.payer === address ? "You" : `${expense.payer.slice(0, 6)}...${expense.payer.slice(-4)}`} • 
                              {new Date(expense.timestamp * 1000).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-semibold neon-text font-mono">
                              ${parseFloat(expense.amount).toFixed(2)}
                            </span>
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 font-mono">
                              Pending
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
