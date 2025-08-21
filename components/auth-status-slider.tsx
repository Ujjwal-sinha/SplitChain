"use client"

import { useState, useEffect } from "react"
import { useUser } from "@civic/auth-web3/react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { 
  Loader2, 
  Wallet, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Clock
} from "lucide-react"

interface AuthStatusSliderProps {
  className?: string
}

export function AuthStatusSlider({ className }: AuthStatusSliderProps) {
  const { user, isLoading, error } = useUser()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [statusMessage, setStatusMessage] = useState("Ready to sign in")

  const steps = [
    { name: "Initializing", message: "Preparing authentication..." },
    { name: "Connecting", message: "Connecting to wallet..." },
    { name: "Verifying", message: "Verifying identity..." },
    { name: "Creating Session", message: "Creating secure session..." },
    { name: "Complete", message: "Successfully authenticated!" }
  ]

  useEffect(() => {
    if (isLoading) {
      // Simulate progress during loading
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev < 100) {
            const newProgress = prev + 20
            const stepIndex = Math.floor(newProgress / 20)
            setCurrentStep(stepIndex)
            setStatusMessage(steps[stepIndex]?.message || "Processing...")
            return newProgress
          }
          return prev
        })
      }, 1000)

      return () => clearInterval(interval)
    }

    if (user) {
      setProgress(100)
      setCurrentStep(4)
      setStatusMessage("Successfully authenticated!")
    }

    if (error) {
      setStatusMessage("Authentication failed. Please try again.")
    }

    // Reset to initial state when user logs out
    if (!user && !isLoading && !error) {
      setProgress(0)
      setCurrentStep(0)
      setStatusMessage("Ready to sign in")
    }
  }, [isLoading, user, error])

  const getStatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5 text-red-400" />
    if (user) return <CheckCircle className="w-5 h-5 text-green-400" />
    if (isLoading) return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
    return <Clock className="w-5 h-5 text-slate-400" />
  }

  const getStatusColor = () => {
    if (error) return "text-red-400"
    if (user) return "text-green-400"
    if (isLoading) return "text-blue-400"
    return "text-slate-400"
  }

  const getProgressColor = () => {
    if (error) return "bg-red-500"
    if (user) return "bg-green-500"
    if (isLoading) return "bg-blue-500"
    return "bg-slate-500"
  }

  return (
    <Card className={`bg-gradient-to-r from-slate-500/10 to-blue-500/10 border-slate-500/20 ${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Status Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className={`text-sm font-medium ${getStatusColor()}`}>
                {user ? "Authenticated" : isLoading ? "Signing In..." : "Ready"}
              </span>
            </div>
            <span className="text-xs text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <Progress 
              value={progress} 
              className="h-2"
              style={{
                '--progress-color': error ? '#ef4444' : user ? '#22c55e' : isLoading ? '#3b82f6' : '#64748b'
              } as React.CSSProperties}
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Start</span>
              <span>{steps[currentStep]?.name || "Processing"}</span>
              <span>Complete</span>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center">
            <p className="text-sm text-slate-300">
              {statusMessage}
            </p>
            {user && (
              <p className="text-xs text-slate-400 mt-1">
                Connected as: {(user.walletAddress as string)?.slice(0, 10)}...{(user.walletAddress as string)?.slice(-8)}
              </p>
            )}
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  index <= currentStep ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mb-1 ${
                  index < currentStep ? 'bg-green-400' :
                  index === currentStep ? 'bg-blue-400' :
                  'bg-slate-400'
                }`} />
                <span className="text-xs text-slate-400">{step.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
