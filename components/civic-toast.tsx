"use client"

import { useEffect, useState } from 'react'
import { CheckCircle, LogOut, X } from 'lucide-react'

interface CivicToastProps {
  message: string
  type: 'login' | 'logout'
  isVisible: boolean
  onClose: () => void
}

export function CivicToast({ message, type, isVisible, onClose }: CivicToastProps) {
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    console.log("Toast visibility changed:", { isVisible, message, type })
    
    if (isVisible) {
      setShouldRender(true)
      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        console.log("Auto-closing toast")
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      // Delay unmounting for exit animation
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, message, type])

  if (!shouldRender) return null

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="glass-green neon-border rounded-lg p-4 min-w-[300px] shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {type === 'login' ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <LogOut className="h-5 w-5 text-green-400" />
            )}
            <span className="text-green-300 font-mono text-sm">{message}</span>
          </div>
          <button
            onClick={onClose}
            className="text-green-400/70 hover:text-green-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}