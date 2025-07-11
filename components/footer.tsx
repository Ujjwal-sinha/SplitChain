"use client"

import { Code } from "lucide-react"

interface FooterProps {
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
}

export function Footer({ onPageChange }: FooterProps) {
  return (
    <footer className="glass-green border-t border-green-500/20 p-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-8">
        {/* Logo and Brand Info */}
        <div className="flex flex-col items-center space-y-2 cursor-pointer" onClick={() => onPageChange("landing")}>
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center neon-glow">
            <Code className="w-7 h-7 text-black" />
          </div>
          <div>
            <span className="text-3xl font-bold neon-text font-mono">SplitChain</span>
            <div className="text-sm text-green-400/70 font-mono">Protocol v2.0</div>
          </div>
        </div>

        {/* Navigation and Legal Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full max-w-md">
          {/* Resources Column */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="text-lg font-semibold neon-text font-mono mb-2">Resources</h3>
            <a href="#" className="text-green-400/70 hover:text-green-400 font-mono text-sm">
              Docs
            </a>
            <a href="#" className="text-green-400/70 hover:text-green-400 font-mono text-sm">
              GitHub
            </a>
            <a href="#" className="text-green-400/70 hover:text-green-400 font-mono text-sm">
              Discord
            </a>
            <a href="#" className="text-green-400/70 hover:text-green-400 font-mono text-sm">
              Twitter
            </a>
          </div>

          {/* Legal Column */}
          <div className="flex flex-col items-center md:items-start space-y-3">
            <h3 className="text-lg font-semibold neon-text font-mono mb-2">Legal</h3>
            <a href="#" className="text-green-400/70 hover:text-green-400 font-mono text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-green-400/70 hover:text-green-400 font-mono text-sm">
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Copyright Info */}
        <div className="text-green-400/70 font-mono text-sm pt-4 border-t border-green-500/10 w-full max-w-md">
          © 2024 SplitChain Protocol. Decentralized & Open Source.
        </div>
      </div>
    </footer>
  )
}
