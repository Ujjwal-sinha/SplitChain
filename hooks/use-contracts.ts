

import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '@/components/wallet-provider'
import { getContract, getSigner, BLOCKDAG_NETWORK } from '@/lib/contracts'

export interface Group {
  id: number
  name: string
  creator: string
  members: string[]
  totalExpenses: string
  yourBalance: string
}

export interface Expense {
  id: string
  groupId: number
  payer: string
  amount: string
  token: string
  description: string
  timestamp: number
}

export function useContracts() {
  const { isConnected, address, chainId } = useWallet()
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  // Check if connected to BlockDAG network
  const isCorrectNetwork = chainId === BLOCKDAG_NETWORK.chainId

  const createGroup = useCallback(async (name: string, members: string[]) => {
    if (!isConnected || !address) throw new Error('Wallet not connected')
    if (!isCorrectNetwork) throw new Error('Please switch to BlockDAG network')

    setLoading(true)
    try {
      const signer = await getSigner()
      const coreContract = getContract('core', signer)
      
      const tx = await coreContract.createGroup(name, members)
      await tx.wait()
      
      // Refresh groups after creation
      await loadGroups()
      
      return tx.hash
    } catch (error) {
      console.error('Error creating group:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

  const addExpense = useCallback(async (
    groupId: number,
    amount: string,
    token: string,
    description: string
  ) => {
    if (!isConnected || !address) throw new Error('Wallet not connected')
    if (!isCorrectNetwork) throw new Error('Please switch to BlockDAG network')

    setLoading(true)
    try {
      const signer = await getSigner()
      const coreContract = getContract('core', signer)
      
      const amountWei = ethers.parseEther(amount)
      const isNativeToken = token === ethers.ZeroAddress
      
      const tx = await coreContract.addExpense(
        groupId,
        amountWei,
        token,
        description,
        { value: isNativeToken ? amountWei : 0 }
      )
      await tx.wait()
      
      // Refresh expenses after adding
      await loadExpenses()
      
      return tx.hash
    } catch (error) {
      console.error('Error adding expense:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

  const settleDebt = useCallback(async (
    groupId: number,
    token: string,
    to: string,
    amount: string
  ) => {
    if (!isConnected || !address) throw new Error('Wallet not connected')
    if (!isCorrectNetwork) throw new Error('Please switch to BlockDAG network')

    setLoading(true)
    try {
      const signer = await getSigner()
      const coreContract = getContract('core', signer)
      
      const amountWei = ethers.parseEther(amount)
      const isNativeToken = token === ethers.ZeroAddress
      
      const tx = await coreContract.settleDebt(
        groupId,
        token,
        to,
        amountWei,
        { value: isNativeToken ? amountWei : 0 }
      )
      await tx.wait()
      
      return tx.hash
    } catch (error) {
      console.error('Error settling debt:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

  const loadGroups = useCallback(async () => {
    // This is a placeholder - you'll need to implement group loading
    // based on events or additional contract methods
    setGroups([])
  }, [])

  const loadExpenses = useCallback(async () => {
    // This is a placeholder - you'll need to implement expense loading
    // based on events or additional contract methods
    setExpenses([])
  }, [])

  const switchToBlockDAG = useCallback(async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${BLOCKDAG_NETWORK.chainId.toString(16)}` }],
        })
      } catch (error: any) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${BLOCKDAG_NETWORK.chainId.toString(16)}`,
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
  }, [])

  useEffect(() => {
    if (isConnected && isCorrectNetwork) {
      loadGroups()
      loadExpenses()
    }
  }, [isConnected, isCorrectNetwork, loadGroups, loadExpenses])

  return {
    loading,
    groups,
    expenses,
    isCorrectNetwork,
    createGroup,
    addExpense,
    settleDebt,
    switchToBlockDAG,
    loadGroups,
    loadExpenses
  }
}
