"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { UserButton, useUser, SignInButton } from "@civic/auth-web3/react"
import { Wallet } from "lucide-react"

interface CivicAuthButtonProps {
  onConnect?: () => void
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function CivicAuthButton({
  onConnect,
  className,
  variant = "default",
  size = "default",
}: CivicAuthButtonProps) {
  const { user } = useUser()

  const handleSignIn = useCallback(() => {
    console.log("Starting sign-in process")
    onConnect?.()
  }, [onConnect])

  if (user) {
    return <UserButton />
  }

  return (
    <SignInButton
      className={`${
        variant === "default"
          ? "bg-gradient-to-r from-slate-600 to-green-600 hover:from-slate-700 hover:to-green-700 text-white border-0 shadow-lg shadow-slate-500/25"
          : ""
      } ${className}`}
    />
  )
}
