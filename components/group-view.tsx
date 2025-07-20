"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useContracts } from "@/hooks/use-contracts"
import { useWallet } from "@/components/wallet-provider"
import { Users, ArrowUpRight, ArrowDownLeft, Receipt, DollarSign, Plus, History, Loader2 } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { AddExpenseModal } from "./add-expense-modal"

interface GroupViewProps {
  groupId: string
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
}

export function GroupView({ groupId, onPageChange }: GroupViewProps) {
  const [isAddExpenseModalOpen, setAddExpenseModalOpen] = useState(false)
  const { groups, expenses, fetchGroups, fetchExpenses, loading } = useContracts()
  const { address } = useWallet()

  const groupData = groups.find(g => g.id.toString() === groupId)

  useEffect(() => {
    if (groupId) {
      fetchGroups()
      fetchExpenses()
    }
  }, [groupId, fetchGroups, fetchExpenses])

  const totalExpenses = expenses
    .filter(e => e.groupId.toString() === groupId)
    .reduce((total, expense) => total + parseFloat(expense.amount), 0)

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

  return (
    <>
      <div className="flex min-h-screen matrix-bg">
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
                    Total Expenses: {totalExpenses.toFixed(2)} ST
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={() => setAddExpenseModalOpen(true)} className="btn-matrix font-mono">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </Button>
                <Button
                  onClick={() => onPageChange("dashboard")}
                  variant="outline"
                  className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono bg-transparent neon-border"
                >
                  Back to Dashboard
                </Button>
              </div>
            </div>

            {/* Balance Overview */}
            <div className="grid md:grid-cols-4 gap-4">
              {groupData.members.map(memberAddress => {
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
                                className={`font-semibold font-mono ${
                                  balance > 0 ? "text-green-400" : "text-red-400"
                                }`}
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
            <Tabs defaultValue="ledger" className="space-y-6">
              <TabsList className="glass-green neon-border">
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

              <TabsContent value="ledger">
                <Card className="glass-green neon-border">
                  <CardHeader>
                    <CardTitle className="neon-text font-mono">Debt Ledger</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {groupData.members.map(memberAddress => (
                        <div
                          key={memberAddress}
                          className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 bg-gradient-to-r from-slate-500 to-green-500">
                              <AvatarFallback className="text-black font-semibold">
                                {memberAddress.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold neon-text font-mono">
                                {memberAddress === address
                                  ? "You"
                                  : `${memberAddress.slice(0, 6)}...${memberAddress.slice(-4)}`}
                              </p>
                              <p className="text-sm text-green-400/70 font-mono">Calculating balance...</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-lg font-mono text-green-400">$0.00</span>
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-black font-mono">
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
                      ) : expenses.filter(e => e.groupId.toString() === groupId).length === 0 ? (
                        <div className="text-center py-8">
                          <Receipt className="w-12 h-12 text-green-400/50 mx-auto mb-4" />
                          <p className="text-green-400/70 font-mono">No expenses yet</p>
                        </div>
                      ) : (
                        expenses
                          .filter(e => e.groupId.toString() === groupId)
                          .map(expense => (
                            <div
                              key={expense.id}
                              className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20"
                            >
                              <div className="w-3 h-3 rounded-full bg-yellow-400" />
                              <div className="flex-1 ml-4">
                                <p className="font-semibold neon-text font-mono">{expense.description}</p>
                                <p className="text-sm text-green-400/70 font-mono">
                                  Paid by{" "}
                                  {expense.payer === address
                                    ? "You"
                                    : `${expense.payer.slice(0, 6)}...${expense.payer.slice(-4)}`}{" "}
                                  • {new Date(expense.timestamp * 1000).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className="font-semibold neon-text font-mono">
                                  {parseFloat(expense.amount).toFixed(2)} ST
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
      <AddExpenseModal
        isOpen={isAddExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        groupId={groupId}
      />
    </>
  )
}
