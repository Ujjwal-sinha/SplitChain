interface Window {
  ethereum?: {
    isMetaMask?: boolean
    isCoinbaseWallet?: boolean
    isTrust?: boolean
    isTrustWallet?: boolean
    isRabby?: boolean
    isExodus?: boolean
    isBraveWallet?: boolean
    selectedProvider?: any
    providers?: any[]
    request: (args: { method: string; params?: any[] }) => Promise<any>
    on: (event: string, callback: (data: any) => void) => void
    removeListener: (event: string, callback: (data: any) => void) => void
  }
}
