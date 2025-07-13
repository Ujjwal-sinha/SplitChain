
"use client"

import { useWallet } from "@/components/wallet-provider"
import { useContracts } from "@/hooks/use-contracts"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, CheckCircle, Wifi } from "lucide-react"

export function NetworkStatus() {
  const { isConnected, chainId } = useWallet()
  const { isCorrectNetwork, switchToBlockDAG } = useContracts()

  if (!isConnected) {
    return null
  }

  if (isCorrectNetwork) {
    return (
      <Alert className="border-green-500/20 bg-green-500/10">
        <CheckCircle className="h-4 w-4 text-green-400" />
        <AlertDescription className="text-green-300">
          Connected to BlockDAG Testnet
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-orange-500/20 bg-orange-500/10">
      <AlertTriangle className="h-4 w-4 text-orange-400" />
      <AlertDescription className="text-orange-300 flex items-center justify-between">
        <span>Please switch to BlockDAG Testnet to use the application</span>
        <Button
          size="sm"
          variant="outline"
          onClick={switchToBlockDAG}
          className="ml-4 border-orange-500/50 text-orange-300 hover:bg-orange-500/20"
        >
          <Wifi className="w-4 h-4 mr-2" />
          Switch Network
        </Button>
      </AlertDescription>
    </Alert>
  )
}
