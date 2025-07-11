"use client"

import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users, BarChart3, Settings, Code, LogOut } from "lucide-react"

interface SidebarProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
  currentPage: string
}

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, page: "dashboard" as const },
  { name: "Groups", icon: Users, page: "group" as const },
  { name: "Analytics", icon: BarChart3, page: "analytics" as const },
  { name: "Settings", icon: Settings, page: "settings" as const },
]

export function Sidebar({ onPageChange, currentPage }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-full w-64 glass-green border-r border-green-500/20 z-50">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-green-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center neon-glow">
              <Code className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-bold neon-text font-mono">SplitChain</span>
              <div className="text-xs text-green-400/70 font-mono">Protocol v2.0</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.name}
              variant="ghost"
              onClick={() => onPageChange(item.page)}
              className={`w-full justify-start text-left font-mono hover:bg-green-500/10 hover:border-green-500/30 border border-transparent ${
                currentPage === item.page
                  ? "bg-green-500/20 text-green-300 border-green-500/40 neon-glow"
                  : "text-green-400/70 hover:text-green-300"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Button>
          ))}
        </nav>

        {/* Network Status */}
        <div className="p-4 border-t border-green-500/20">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse-green" />
            <span className="text-sm text-green-400 font-mono">BlockDAG Network</span>
          </div>
          <Button
            variant="ghost"
            onClick={() => onPageChange("landing")}
            className="w-full justify-start text-green-400/70 hover:text-red-400 hover:bg-red-500/10 font-mono"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Disconnect
          </Button>
        </div>
      </div>
    </div>
  )
}
