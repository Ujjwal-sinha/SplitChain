"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Box } from "@react-three/drei"
import { CivicAuthButton } from "@/components/civic-auth-button"
import { AuthStatusSlider } from "@/components/auth-status-slider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Zap, Users, PieChart, Coins, Globe, Github, Twitter, BookOpen, ExternalLink, Code, Cpu, DollarSign, LayoutDashboard, Network, Receipt, TrendingUp, Loader2 } from "lucide-react"
import { CONTRACT_ADDRESSES } from "@/lib/contracts"
import type * as THREE from "three"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { MessageSquare, Lightbulb, CheckCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
          <meshStandardMaterial color="#ffffff" transparent opacity={0.3} /> {/* Changed to white */}
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
  onPageChange: (page: "landing" | "dashboard" | "group" | "analytics" | "settings") => void
}

export function LandingPage({ onPageChange }: LandingPageProps) {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [currentInfoIndex, setCurrentInfoIndex] = useState(0)

  const infoMessages = [
    "Web3-Native Expense Protocol",
    "Zero-Gas Layer 2 Transactions",
    "Cryptographically Secure Settlements",
    "Neural-Powered Split Optimization",
    "Built for DAOs and DeFi",
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInfoIndex((prevIndex) => (prevIndex + 1) % infoMessages.length)
    }, 5000) // Change message every 5 seconds
    return () => clearInterval(interval)
  }, [infoMessages.length])

  const features = [
    {
      icon: Shield,
      title: "Decentralized Groups",
      description: "Create trustless expense groups secured by blockchain smart contracts",
      color: "from-green-500 to-green-400",
    },
    {
      icon: Cpu,
      title: "AI-Powered Splitting",
      description: "Neural networks optimize expense distribution automatically",
      color: "from-slate-500 to-slate-400",
    },
    {
      icon: Network,
      title: "Zero Trust Protocol",
      description: "Cryptographically secured settlements with mathematical proof",
      color: "from-green-600 to-green-500",
    },
  ]

  const stats = [
    { label: "Total Volume", value: "$4.2M", icon: DollarSign, color: "from-green-500 to-green-400" },
    { label: "Active DAOs", value: "2,481", icon: Users, color: "from-slate-500 to-slate-400" },
    { label: "Smart Settlements", value: "12,932", icon: TrendingUp, color: "from-green-600 to-green-500" },
    { label: "Gas Optimized", value: "94%", icon: Zap, color: "from-slate-300 to-slate-200" },
  ]

  const howItWorksSteps = [
    {
      icon: Users,
      title: "Create a Group",
      description: "Start a new decentralized expense group with your friends or team.",
      color: "from-green-500 to-green-400",
    },
    {
      icon: Receipt,
      title: "Add Expenses",
      description: "Log expenses and let the smart contract handle the splitting.",
      color: "from-slate-500 to-slate-400",
    },
    {
      icon: DollarSign,
      title: "Settle Debts",
      description: "Easily settle balances on-chain with minimal gas fees.",
      color: "from-green-600 to-green-500",
    },
    {
      icon: CheckCircle,
      title: "Track Analytics",
      description: "Gain insights into your spending and group financial health.",
      color: "from-slate-300 to-slate-200",
    },
  ]

  const testimonials = [
    {
      name: "Alice Johnson",
      handle: "@web3alice",
      quote:
        "SplitChain has revolutionized how my DAO manages shared expenses. It's truly trustless and incredibly efficient!",
      avatarFallback: "AJ",
    },
    {
      name: "Bob Williams",
      handle: "@defi_bob",
      quote:
        "The gasless transactions on BlockDAG make SplitChain a game-changer for daily expense splitting. Highly recommend!",
      avatarFallback: "BW",
    },
    {
      name: "Charlie Brown",
      handle: "@nft_charlie",
      quote:
        "Finally, an expense app that understands Web3. The UI is sleek, and the smart contract integration is seamless.",
      avatarFallback: "CB",
    },
  ]

  const faqs = [
    {
      question: "What is SplitChain?",
      answer:
        "SplitChain is a decentralized expense sharing protocol built on the BlockDAG Network, enabling trustless, gasless, and instant expense management for Web3 communities.",
    },
    {
      question: "How does SplitChain ensure trustlessness?",
      answer:
        "All expense splitting and settlement logic is handled by audited smart contracts on the blockchain, removing the need for a central authority or trusting individual members.",
    },
    {
      question: "Is SplitChain truly gasless?",
      answer:
        "SplitChain leverages Layer 2 scaling solutions and optimized smart contracts on BlockDAG to minimize transaction costs, making them effectively gasless for most users.",
    },
    {
      question: "What wallets are supported?",
      answer:
        "SplitChain supports all EVM-compatible wallets, including MetaMask, Coinbase Wallet, Trust Wallet, Rabby, Brave Wallet, and more via WalletConnect.",
    },
    {
      question: "Can I use SplitChain for non-crypto expenses?",
      answer:
        "While SplitChain is built on Web3, you can use it to track any type of expense. Settlements are handled on-chain, but the expense tracking itself is flexible.",
    },
  ]

  // Remove handleSignIn since Civic manages its own auth flow

  return (
    <div className="min-h-screen matrix-bg relative overflow-hidden">
      <MatrixRain />
      {/* Removed <div className="digital-grid-overlay" /> */}
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} color="#00ff88" intensity={0.5} />
          <pointLight position={[-10, -10, -10]} color="#ffffff" intensity={0.3} /> {/* Changed to white */}
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

            </div>
          </div>
          <div className="text-green-300 font-mono text-lg animate-fade-in-out">{infoMessages[currentInfoIndex]}</div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-block px-4 py-2 rounded-full glass-green neon-border mb-6">
                <span className="text-green-400 font-mono text-sm">🚀 Now Live on BlockDAG Testnet</span>
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

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
              <CivicAuthButton
                size="lg"
                className="bg-green-500 text-black px-8 py-4 text-lg font-mono rounded-none border-0 shadow-lg shadow-green-500/25 hover:bg-green-600"
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

            {/* Auth Status Slider */}
            <div className="max-w-md mx-auto mb-16">
              <AuthStatusSlider />
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
                  <Globe className="w-5 h-5 text-slate-400" /> {/* Changed to slate */}
                  <span className="font-mono">EVM Compatible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="font-mono">Layer 2 Scaling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Network className="w-5 h-5 text-slate-400" /> {/* Changed to slate */}
                  <span className="font-mono">Cross-Chain Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Cpu className="w-5 h-5 text-green-400" />
                  <span className="font-mono">AI-Powered</span>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="max-w-7xl mx-auto text-center mb-20">
              <h2 className="text-3xl font-bold neon-text mb-12 font-mono">How It Works</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {howItWorksSteps.map((step, index) => (
                  <Card key={index} className="glass-green neon-border card-hover">
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-lg flex items-center justify-center mx-auto mb-6`}
                      >
                        <step.icon className="w-8 h-8 text-black" />
                      </div>
                      <h3 className="text-xl font-semibold neon-text mb-3 font-mono">{step.title}</h3>
                      <p className="text-green-400/80 text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Testimonials Section */}
            <div className="max-w-7xl mx-auto text-center mb-20">
              <h2 className="text-3xl font-bold neon-text mb-12 font-mono">What Our Users Say</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <Card key={index} className="glass-white neon-white-border card-hover">
                    <CardContent className="p-6 text-center">
                      <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 italic mb-6">"{testimonial.quote}"</p>
                      <div className="flex items-center justify-center space-x-3">
                        <Avatar className="w-12 h-12 bg-gradient-to-r from-slate-500 to-green-500">
                          <AvatarFallback className="text-black font-semibold">
                            {testimonial.avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold neon-white-text font-mono">{testimonial.name}</p>
                          <p className="text-sm text-slate-400/70 font-mono">{testimonial.handle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mb-20">
              <h2 className="text-3xl font-bold neon-text text-center mb-12 font-mono">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="glass-green neon-border mb-4 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left text-green-300 hover:text-green-200 font-mono text-lg py-4">
                      <Lightbulb className="w-5 h-5 mr-3 text-green-400" />
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-green-400/80 pb-4 font-mono">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Contract Addresses */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold neon-text mb-4 font-mono">Deployed Contracts</h2>
              <p className="text-green-400/80 font-mono">Live on BlockDAG Testnet</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {Object.entries(CONTRACT_ADDRESSES).map(([name, address]) => (
                <Card key={name} className="glass-green border-green-500/30">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-green-300 font-mono capitalize text-sm">
                      {name === 'multiToken' ? 'Multi Token' : name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <code className="text-xs text-green-400/80 break-all">
                        {address.slice(0, 10)}...{address.slice(-8)}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-400 hover:text-green-300 p-1"
                        onClick={() => window.open(`https://bdagscan.com/address/${address}`, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold neon-text mb-4 font-mono">Ready to Split Smart?</h2>
            <p className="text-green-400/80 mb-8 font-mono">Join the future of expense sharing on the blockchain</p>
            <CivicAuthButton 
              size="lg" 
              className="bg-green-500 text-black px-8 py-4 text-lg font-mono rounded-none border-0 shadow-lg shadow-green-500/25 hover:bg-green-600 mr-4" 
            />
            <Button
              variant="outline"
              size="lg"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Documentation
            </Button>
          </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="glass-green border-t border-green-500/20 p-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-green-400/70 font-mono text-sm">
              © 2025 SplitChain Protocol. Decentralized & Open Source.
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