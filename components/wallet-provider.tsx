"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface WalletContextType {
  isConnected: boolean
  address: string | null
  chainId: number | null
  balance: string | null
  ensName: string | null
  isCorrectNetwork: boolean
  connectWallet: (walletType: string) => Promise<void>
  disconnectWallet: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

// BlockDAG Network configuration
const BLOCKDAG_NETWORK = {
  chainId: 60808,
  name: "BlockDAG Testnet",
  nativeCurrency: {
    name: "BlockDAG",
    symbol: "BDAG",
    decimals: 18,
  },
  rpcUrl: "https://rpc.primordial.bdagscan.com",
  blockExplorerUrl: "https://bdagscan.com",
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [ensName, setEnsName] = useState<string | null>(null)

  // Check if connected to BlockDAG network
  const isCorrectNetwork = chainId === BLOCKDAG_NETWORK.chainId

  // Check if wallet is already connected on page load
  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          setAddress(accounts[0])
          setIsConnected(true)
          await updateWalletInfo(accounts[0])
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }
  }

  const updateWalletInfo = async (walletAddress: string) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        // Get chain ID
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        setChainId(Number.parseInt(chainId, 16))

        // Get balance
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [walletAddress, "latest"],
        })
        const balanceInEth = (Number.parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4)
        setBalance(balanceInEth)

        // Try to get ENS name (simplified - in production use a proper ENS resolver)
        // For demo purposes, we'll simulate some ENS names
        const mockEnsNames: { [key: string]: string } = {
          "0x1234567890123456789012345678901234567890": "alice.eth",
          "0x2345678901234567890123456789012345678901": "bob.eth",
        }
        setEnsName(mockEnsNames[walletAddress.toLowerCase()] || null)
      } catch (error) {
        console.error("Error updating wallet info:", error)
      }
    }
  }

  const connectWallet = async (walletType: string) => {
    try {
      let provider

      // Check if ethereum is available
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("No wallet extension found. Please install MetaMask or another Web3 wallet.")
      }

      const ethereum = window.ethereum

      // Handle multiple providers
      if (ethereum.providers && Array.isArray(ethereum.providers)) {
        switch (walletType) {
          case "metamask":
            provider = ethereum.providers.find((p: any) => p.isMetaMask)
            if (!provider) {
              window.open("https://metamask.io/download/", "_blank")
              throw new Error("MetaMask not found")
            }
            break

          case "coinbase":
            provider = ethereum.providers.find((p: any) => p.isCoinbaseWallet)
            if (!provider) {
              window.open("https://www.coinbase.com/wallet", "_blank")
              throw new Error("Coinbase Wallet not found")
            }
            break

          case "trust":
            provider = ethereum.providers.find((p: any) => p.isTrust || p.isTrustWallet)
            if (!provider) {
              window.open("https://trustwallet.com/", "_blank")
              throw new Error("Trust Wallet not found")
            }
            break

          case "rabby":
            provider = ethereum.providers.find((p: any) => p.isRabby)
            if (!provider) {
              window.open("https://rabby.io/", "_blank")
              throw new Error("Rabby Wallet not found")
            }
            break

          case "brave":
            provider = ethereum.providers.find((p: any) => p.isBraveWallet)
            if (!provider) {
              window.open("https://brave.com/wallet/", "_blank")
              throw new Error("Brave Wallet not found")
            }
            break

          case "walletconnect":
            throw new Error("WalletConnect integration coming soon")

          default:
            provider = ethereum.providers[0] // Use first available provider
        }
      } else {
        // Single provider
        switch (walletType) {
          case "metamask":
            if (ethereum.isMetaMask) {
              provider = ethereum
            } else {
              window.open("https://metamask.io/download/", "_blank")
              throw new Error("MetaMask not found")
            }
            break

          case "coinbase":
            if (ethereum.isCoinbaseWallet) {
              provider = ethereum
            } else {
              window.open("https://www.coinbase.com/wallet", "_blank")
              throw new Error("Coinbase Wallet not found")
            }
            break

          case "trust":
            if (ethereum.isTrust || ethereum.isTrustWallet) {
              provider = ethereum
            } else {
              window.open("https://trustwallet.com/", "_blank")
              throw new Error("Trust Wallet not found")
            }
            break

          case "rabby":
            if (ethereum.isRabby) {
              provider = ethereum
            } else {
              window.open("https://rabby.io/", "_blank")
              throw new Error("Rabby Wallet not found")
            }
            break

          case "brave":
            if (ethereum.isBraveWallet) {
              provider = ethereum
            } else {
              window.open("https://brave.com/wallet/", "_blank")
              throw new Error("Brave Wallet not found")
            }
            break

          case "walletconnect":
            throw new Error("WalletConnect integration coming soon")

          default:
            provider = ethereum // Use available provider
        }
      }

      if (!provider) {
        throw new Error(`${walletType} wallet not found`)
      }

      const accounts = await provider.request({ method: "eth_requestAccounts" })
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setIsConnected(true)
        await updateWalletInfo(accounts[0])

        // Listen for account changes
        provider.on("accountsChanged", (accounts: string[]) => {
          if (accounts.length > 0) {
            setAddress(accounts[0])
            updateWalletInfo(accounts[0])
          } else {
            disconnectWallet()
          }
        })

        // Listen for chain changes
        provider.on("chainChanged", (chainId: string) => {
          setChainId(Number.parseInt(chainId, 16))
        })
      }
    } catch (error: any) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress(null)
    setChainId(null)
    setBalance(null)
    setEnsName(null)
  }

  const switchNetwork = async (targetChainId: number) => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${targetChainId.toString(16)}` }],
        })
      } catch (error: any) {
        // If the chain hasn't been added to MetaMask, add it
        if (error.code === 4902) {
          // Add BlockDAG Testnet
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${targetChainId.toString(16)}`,
                chainName: BLOCKDAG_NETWORK.name,
                nativeCurrency: BLOCKDAG_NETWORK.nativeCurrency,
                rpcUrls: [BLOCKDAG_NETWORK.rpcUrl],
                blockExplorerUrls: [BLOCKDAG_NETWORK.blockExplorerUrl],
              },
            ],
          })
        }
        throw error
      }
    }
  }

  const value = {
    isConnected,
    address,
    chainId,
    balance,
    ensName,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}
