"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card"
import { Sidebar } from "@/components/sidebar" // Corrected import path for Sidebar
import { User, Shield, Bell, Code, Zap, Globe, Lock, Eye, EyeOff, Copy, ExternalLink } from "lucide-react" // Corrected import for Lucide icons

interface SettingsProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
}

export function Settings({ onPageChange }: SettingsProps) {
  const [notifications, setNotifications] = useState({
    expenses: true,
    settlements: true,
    groupInvites: true,
    security: true,
  })

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    showBalance: true,
    allowInvites: true,
  })

  const [showPrivateKey, setShowPrivateKey] = useState(false)

  return (
    <div className="flex min-h-screen matrix-bg">
      <Sidebar onPageChange={onPageChange} currentPage="settings" />
      <main className="flex-1 p-6 ml-64">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold neon-text font-mono mb-2">Settings</h1>
            <p className="text-green-400/70 font-mono">Configure your SplitChain experience</p>
          </div>

          {/* Profile Settings */}
          <Card className="glass-green neon-border">
            <CardHeader>
              <CardTitle className="neon-text font-mono flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="displayName" className="text-green-400 font-mono">
                    Display Name
                  </label>
                  <Input
                    id="displayName"
                    placeholder="Enter your display name..."
                    defaultValue="crypto_user.eth"
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-green-400 font-mono">
                    Email (Optional)
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email..."
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="text-green-400 font-mono">
                  Bio
                </label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself..."
                  defaultValue="DeFi enthusiast and Web3 builder"
                  className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg glass-green border border-green-500/20">
                <div>
                  <p className="font-semibold neon-text font-mono">ENS Name</p>
                  <p className="text-sm text-green-400/70 font-mono">crypto_user.eth</p>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-green-500/30 font-mono">Verified</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Wallet & Security */}
          <Card className="glass-white neon-white-border">
            {/* Changed to glass-white and neon-white-border */}
            <CardHeader>
              <CardTitle className="neon-white-text font-mono flex items-center">
                {/* Changed to neon-white-text */}
                <Shield className="w-5 h-5 mr-2 text-slate-400" /> {/* Changed to slate */}
                Wallet & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 rounded-lg glass-white border border-slate-500/20">
                {/* Changed to glass-white */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold neon-white-text font-mono">Connected Wallet</p>{" "}
                    {/* Changed to neon-white-text */}
                    <p className="text-sm text-slate-400/70 font-mono">0x1234...5678</p> {/* Changed to slate */}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400/70 hover:text-slate-400">
                      {/* Changed to slate */}
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400/70 hover:text-slate-400">
                      {/* Changed to slate */}
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm text-slate-400 font-mono">Connected to BlockDAG Network</span>{" "}
                  {/* Changed to slate */}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold neon-white-text font-mono">Two-Factor Authentication</p>{" "}
                    {/* Changed to neon-white-text */}
                    <p className="text-sm text-slate-400/70 font-mono">Add an extra layer of security</p>{" "}
                    {/* Changed to slate */}
                  </div>
                  <Button
                    variant="outline"
                    className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono bg-transparent" /* Changed to slate */
                  >
                    Enable 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold neon-white-text font-mono">Hardware Wallet</p>{" "}
                    {/* Changed to neon-white-text */}
                    <p className="text-sm text-slate-400/70 font-mono">
                      Connect a hardware wallet for enhanced security
                    </p>{" "}
                    {/* Changed to slate */}
                  </div>
                  <Button
                    variant="outline"
                    className="border-slate-500/50 text-slate-400 hover:bg-slate-500/10 font-mono bg-transparent" /* Changed to slate */
                  >
                    Connect
                  </Button>
                </div>

                <div className="p-4 rounded-lg glass-white border border-slate-500/20">
                  {/* Changed to glass-white */}
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold neon-white-text font-mono">Private Key</p>{" "}
                    {/* Changed to neon-white-text */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      className="text-slate-400/70 hover:text-slate-400" /* Changed to slate */
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-sm text-slate-400/70 font-mono">
                    {/* Changed to slate */}
                    {showPrivateKey ? "0x1234567890abcdef..." : "••••••••••••••••••••••••••••••••"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glass-green neon-border">
            <CardHeader>
              <CardTitle className="neon-text font-mono flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold neon-text font-mono">New Expenses</p>
                  <p className="text-sm text-green-400/70">Get notified when new expenses are added</p>
                </div>
                <Switch
                  checked={notifications.expenses}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, expenses: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold neon-text font-mono">Settlements</p>
                  <p className="text-sm text-green-400/70">Get notified about settlement requests</p>
                </div>
                <Switch
                  checked={notifications.settlements}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, settlements: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold neon-text font-mono">Group Invites</p>
                  <p className="text-sm text-green-400/70">Get notified when invited to groups</p>
                </div>
                <Switch
                  checked={notifications.groupInvites}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, groupInvites: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold neon-text font-mono">Security Alerts</p>
                  <p className="text-sm text-green-400/70">Get notified about security events</p>
                </div>
                <Switch
                  checked={notifications.security}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, security: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card className="glass-white neon-white-border">
            {/* Changed to glass-white and neon-white-border */}
            <CardHeader>
              <CardTitle className="neon-white-text font-mono flex items-center">
                {/* Changed to neon-white-text */}
                <Lock className="w-5 h-5 mr-2 text-slate-400" /> {/* Changed to slate */}
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold neon-white-text font-mono">Public Profile</p>{" "}
                  {/* Changed to neon-white-text */}
                  <p className="text-sm text-slate-400/70 font-mono">Make your profile visible to other users</p>{" "}
                  {/* Changed to slate */}
                </div>
                <Switch
                  checked={privacy.publicProfile}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, publicProfile: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold neon-white-text font-mono">Show Balance</p>{" "}
                  {/* Changed to neon-white-text */}
                  <p className="text-sm text-slate-400/70 font-mono">Display your balance in group views</p>{" "}
                  {/* Changed to slate */}
                </div>
                <Switch
                  checked={privacy.showBalance}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, showBalance: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold neon-white-text font-mono">Allow Group Invites</p>{" "}
                  {/* Changed to neon-white-text */}
                  <p className="text-sm text-slate-400/70 font-mono">Allow others to invite you to groups</p>{" "}
                  {/* Changed to slate */}
                </div>
                <Switch
                  checked={privacy.allowInvites}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, allowInvites: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card className="glass-green neon-border">
            <CardHeader>
              <CardTitle className="neon-text font-mono flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="gasPrice" className="text-green-400 font-mono">
                    Default Gas Price (Gwei)
                  </label>
                  <Input
                    id="gasPrice"
                    type="number"
                    placeholder="20"
                    defaultValue="15"
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="slippage" className="text-green-400 font-mono">
                    Slippage Tolerance (%)
                  </label>
                  <Input
                    id="slippage"
                    type="number"
                    placeholder="0.5"
                    defaultValue="0.5"
                    className="bg-black/50 border-green-500/30 text-green-400 placeholder:text-green-400/50 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 rounded-lg glass-green border border-green-500/20">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="font-semibold neon-text font-mono">Gas Optimization</span>
                </div>
                <p className="text-sm text-green-400/70 mb-3">Automatically optimize gas usage for transactions</p>
                <Switch defaultChecked />
              </div>

              <div className="p-4 rounded-lg glass-white border border-slate-500/20">
                {/* Changed to glass-white */}
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="w-5 h-5 text-slate-400" /> {/* Changed to slate */}
                  <span className="font-semibold neon-white-text font-mono">Multi-Chain Support</span>{" "}
                  {/* Changed to neon-white-text */}
                </div>
                <p className="text-sm text-slate-400/70 mb-3">Enable cross-chain functionality (Beta)</p>{" "}
                {/* Changed to slate */}
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="btn-matrix font-mono px-8">Save Settings</Button>
          </div>
        </div>
      </main>
    </div>
  )
}
