"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Box } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import {
  Users,
  Receipt,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Code,
  Lock,
  Cpu,
  Network,
  DollarSign,
  LayoutDashboard,
} from "lucide-react"
import type * as THREE from "three"

function MatrixSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.5}>
      <MeshDistortMaterial
        color="#00ff88"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.8}
      />
    </Sphere>
  )
}

function FloatingCubes() {
  const cubesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (cubesRef.current) {
      cubesRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={cubesRef}>
      {Array.from({ length: 20 }).map((_, i) => (
        <Box
          key={i}
          position={[(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10]}
          scale={0.1}
        >
          <meshStandardMaterial color="#3b82f6" transparent opacity={0.3} /> {/* Changed to blue */}
        </Box>
      ))}
    </group>
  )
}

function MatrixRain() {
  const characters = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="matrix-rain"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          {characters.charAt(Math.floor(Math.random() * characters.length))}
        </div>
      ))}
    </div>
  )
}

interface LandingPageProps {
  onWalletConnect: () => void
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
}

export function LandingPage({ onWalletConnect, onPageChange }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const features = [
    {
      icon: Users,
      title: "Decentralized Groups",
      description: "Create trustless expense groups with smart contract automation",
      color: "from-green-500 to-green-400",
    },
    {
      icon: Receipt,
      title: "Smart Expenses",
      description: "AI-powered expense splitting with automatic calculations",
      color: "from-blue-500 to-blue-400", // Changed to blue
    },
    {
      icon: Lock,
      title: "Zero Trust",
      description: "Blockchain-secured settlements with cryptographic proof",
      color: "from-green-600 to-green-500",
    },
  ]

  const stats = [
    { label: "Total Volume", value: "$2.4M", icon: DollarSign, color: "from-green-500 to-green-400" }, // Added color
    { label: "Active Groups", value: "1,247", icon: Users, color: "from-blue-500 to-blue-400" }, // Added color, changed to blue
    { label: "Settlements", value: "8,932", icon: TrendingUp, color: "from-green-600 to-green-500" }, // Added color
    { label: "Gas Saved", value: "67%", icon: Zap, color: "from-blue-300 to-blue-200" }, // Added color, changed to blue
  ]

  return (
    <div className="min-h-screen matrix-bg relative overflow-hidden">
      <MatrixRain />
      {/* Removed <div className="digital-grid-overlay" /> */}
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} color="#00ff88" intensity={0.5} />
          <pointLight position={[-10, -10, -10]} color="#3b82f6" intensity={0.3} /> {/* Changed to blue */}
          <MatrixSphere />
          <FloatingCubes />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      {/* Content */}
      <div className="relative z-20 flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-6 flex justify-between items-center glass-green border-b border-green-500/20">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onPageChange("landing")}>
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-400 rounded-lg flex items-center justify-center neon-glow">
              <Code className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-2xl font-bold neon-text font-mono">SplitChain</span>
              <div className="text-xs text-green-400/70 font-mono">v2.0.1-beta</div>
            </div>
          </div>
          <ConnectWalletButton
            onConnect={onWalletConnect}
            variant="outline"
            className="neon-border bg-transparent hover:bg-green-500/10 text-green-400"
          />
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-block px-4 py-2 rounded-full glass-green neon-border mb-6">
                <span className="text-green-400 font-mono text-sm">🚀 Now Live on BlockDAG Mainnet</span>
              </div>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold mb-8 font-mono">
              <span className="neon-text">Split</span>
              <span className="text-green-300">Chain</span>
            </h1>

            <p className="text-xl md:text-2xl text-green-300 mb-4 max-w-4xl mx-auto font-mono">
              Next-Gen Decentralized Expense Sharing Protocol
            </p>

            <p className="text-lg text-green-400/80 mb-12 max-w-3xl mx-auto">
              Trustless • Gasless • Instant • Built for the future of Web3 finance
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <ConnectWalletButton
                onConnect={onWalletConnect}
                size="lg"
                className="btn-matrix px-8 py-4 text-lg font-mono"
              />
              <Button
                variant="outline"
                size="lg"
                onClick={() => onPageChange("dashboard")}
                className="border-green-500/50 text-green-400 hover:bg-green-500/10 px-8 py-4 text-lg font-mono bg-transparent neon-border"
              >
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-green neon-border card-hover">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-6`}
                    >
                      {" "}
                      {/* Updated to use stat.color */}
                      <stat.icon className="w-8 h-8 text-black" />
                    </div>
                    <div className="text-2xl font-bold neon-text font-mono">{stat.value}</div>
                    <div className="text-sm text-green-400/70 font-mono">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="glass-green neon-border card-hover cursor-pointer"
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-6 ${hoveredFeature === index ? "neon-glow" : ""} transition-all duration-300`}
                    >
                      <feature.icon className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-xl font-semibold neon-text mb-3 font-mono">{feature.title}</h3>
                    <p className="text-green-400/80">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tech Stack */}
            <div className="glass-green neon-border rounded-2xl p-8 mb-20">
              <h3 className="text-2xl font-bold neon-text mb-6 font-mono">Powered by Cutting-Edge Tech</h3>
              <div className="flex flex-wrap justify-center items-center gap-8 text-green-400/70">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="font-mono">BlockDAG Network</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-blue-400" /> {/* Changed to blue */}
                  <span className="font-mono">EVM Compatible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="font-mono">Layer 2 Scaling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Network className="w-5 h-5 text-blue-400" /> {/* Changed to blue */}
                  <span className="font-mono">Cross-Chain Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-green-400" />
                  <span className="font-mono">AI-Powered</span>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="glass-green neon-border rounded-2xl p-12 text-center">
              <h2 className="text-3xl font-bold neon-text mb-4 font-mono">Ready to Split the Future?</h2>
              <p className="text-green-400/80 mb-8 text-lg">
                Join thousands of users already using SplitChain for trustless expense management
              </p>
              <ConnectWalletButton
                onConnect={onWalletConnect}
                size="lg"
                className="btn-matrix px-12 py-4 text-xl font-mono"
              />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="glass-green border-t border-green-500/20 p-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-green-400/70 font-mono text-sm">
              © 2024 SplitChain Protocol. Decentralized & Open Source.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
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
          </div>
        </footer>
      </div>
    </div>
  )
}
