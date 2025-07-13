import type { MetaMaskInpageProvider } from "@metamask/providers"

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider & {
      providers?: MetaMaskInpageProvider[]
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      isTrust?: boolean
      isTrustWallet?: boolean
      isRabby?: boolean
      isBraveWallet?: boolean
    }
  }
}
