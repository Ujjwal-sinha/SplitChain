"use client"

import { useState } from "react"
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
import { Users } from "lucide-react"
import { ArrowUpRight } from "lucide-react"
import { ArrowDownLeft } from "lucide-react"
import { Receipt } from "lucide-react"
import { DollarSign } from "lucide-react"
import { Plus } from "lucide-react"
import { Check } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { History } from "lucide-react" // Import History icon

interface GroupViewProps {
  groupId: string
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics") => void
}

const mockGroupData = {
  id: "1",
  name: "Weekend Trip",
  members: [
    { id: "1", name: "You", address: "0x1234...5678", balance: -45.5, avatar: "Y" },
    { id: "2", name: "Alice", address: "0x2345...6789", balance: 23.75, avatar: "A" },
    { id: "3", name: "Bob", address: "0x3456...7890", balance: 15.25, avatar: "B" },
    { id: "4", name: "Carol", address: "0x4567...8901", balance: 6.5, avatar: "C" },
  ],
  expenses: [
    {
      id: "1",
      description: "Dinner at Sushi Place",
      amount: 89.5,
      paidBy: "Alice",
      date: "2024-01-15",
      settled: false,
    },
    { id: "2", description: "Hotel Room", amount: 240.0, paidBy: "You", date: "2024-01-14", settled: true },
    { id: "3", description: "Uber rides", amount: 45.75, paidBy: "Bob", date: "2024-01-14", settled: false },
  ],
}

export function GroupView({ groupId, onPageChange }: GroupViewProps) {
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    splitType: "equal",
  })

  const handleAddExpense = () => {
    // Handle expense addition logic
    console.log("Adding expense:", newExpense)
    setNewExpense({ description: "", amount: "", splitType: "equal" })
  }

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
              <h1 className="text-3xl font-bold neon-text font-mono mb-2">{mockGroupData.name}</h1> {/* Themed text */}
              <div className="flex items-center space-x-4 text-green-400/70 font-mono">
                {" "}
                {/* Themed text */}
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {mockGroupData.members.length} members
                </div>
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30 font-mono">
                  {" "}
                  {/* Changed to blue */}
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
            {mockGroupData.members.map((member) => (
              <Card key={member.id} className="glass-green neon-border card-hover">
                {" "}
                {/* Themed card */}
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500">
                      {" "}
                      {/* Mixed gradient */}
                      <AvatarFallback className="text-black font-semibold">{member.avatar}</AvatarFallback>{" "}
                      {/* Icon color */}
                    </Avatar>
                    <div>
                      <p className="font-semibold neon-text font-mono">{member.name}</p> {/* Themed text */}
                      <p className="text-xs text-green-400/70 font-mono">{member.address}</p> {/* Themed text */}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-400/70 font-mono">Balance</span> {/* Themed text */}
                    <div className="flex items-center">
                      {member.balance > 0 ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4 mr-1" />
                      )}
                      <span
                        className={`font-semibold font-mono ${member.balance > 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {" "}
                        {/* Themed text */}${Math.abs(member.balance).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
                            ? "bg-blue-600 text-black font-mono" /* Changed to blue */
                            : "border-blue-500/50 text-blue-400 hover:bg-blue-500/10 font-mono bg-transparent" /* Changed to blue */
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
                    {mockGroupData.members
                      .filter((m) => m.balance !== 0)
                      .map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20" /* Themed card */
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500">
                              {" "}
                              {/* Mixed gradient */}
                              <AvatarFallback className="text-black font-semibold">{member.avatar}</AvatarFallback>{" "}
                              {/* Icon color */}
                            </Avatar>
                            <div>
                              <p className="font-semibold neon-text font-mono">{member.name}</p> {/* Themed text */}
                              <p className="text-sm text-green-400/70 font-mono">
                                {member.balance > 0 ? "Gets back" : "Owes"}
                              </p>{" "}
                              {/* Themed text */}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span
                              className={`font-bold text-lg font-mono ${member.balance > 0 ? "text-green-400" : "text-red-400"}`} /* Themed text */
                            >
                              ${Math.abs(member.balance).toFixed(2)}
                            </span>
                            {member.balance < 0 && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-black font-mono">
                                {" "}
                                {/* Themed button */}
                                Settle
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card className="glass-green neon-border">
                {" "}
                {/* Themed card */}
                <CardHeader>
                  <CardTitle className="neon-text font-mono">Expense History</CardTitle> {/* Themed text */}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockGroupData.expenses.map((expense) => (
                      <div
                        key={expense.id}
                        className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20" /* Themed card */
                      >
                        <div className={`w-3 h-3 rounded-full ${expense.settled ? "bg-green-400" : "bg-yellow-400"}`} />
                        <div>
                          <p className="font-semibold neon-text font-mono">{expense.description}</p> {/* Themed text */}
                          <p className="text-sm text-green-400/70 font-mono">
                            {" "}
                            {/* Themed text */}
                            Paid by {expense.paidBy} • {expense.date}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold neon-text font-mono">${expense.amount.toFixed(2)}</span>{" "}
                          {/* Themed text */}
                          {expense.settled ? (
                            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-mono">
                              {" "}
                              {/* Themed badge */}
                              <Check className="w-3 h-3 mr-1" />
                              Settled
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 font-mono">
                              Pending
                            </Badge> /* Themed badge */
                          )}
                        </div>
                      </div>
                    ))}
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
