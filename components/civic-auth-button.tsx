"use client"

import { UserButton, useUser, SignInButton } from "@civic/auth-web3/react"

interface CivicAuthButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function CivicAuthButton({
  className,
  variant = "default",
  size = "default",
}: CivicAuthButtonProps) {
  const { user } = useUser()

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
