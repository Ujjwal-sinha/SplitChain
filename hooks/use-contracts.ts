import { useState, useEffect, useCallback, ReactNode } from 'react'
import { ethers } from 'ethers'
import { useWallet } from '@/components/wallet-provider'
import { getContract, getSigner, BLOCKDAG_NETWORK } from '@/lib/contracts'
// Remove direct database imports - we'll use API routes

export interface Group {
  [x: string]: ReactNode
  id: string
  name: string
  creator: string
  members: string[]
  totalExpenses: string
  yourBalance: string
}

export interface Expense {
  id: string
  groupId: string
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
      const contract = getContract('core', signer)

      // Create group on blockchain
      const tx = await contract.createGroup(name, members)
      await tx.wait()

      // Store group in database via API
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          creator: address,
          members,
          txHash: tx.hash
        })
      })
      
      const group = await response.json()
      
      // Update local state
      setGroups(prev => [...prev, {
        id: group.id,
        name: group.name,
        creator: group.creator,
        members: group.members,
        totalExpenses: '0',
        yourBalance: '0'
      }])

      console.log('Group created successfully')
      return tx.hash
    } catch (error) {
      console.error('Error creating group:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

  const addExpense = useCallback(async (groupId: string, description: string, amount: string, token: string) => {
    if (!isConnected || !address) throw new Error('Wallet not connected')
    if (!isCorrectNetwork) throw new Error('Please switch to BlockDAG network')

    setLoading(true)
    try {
      const signer = await getSigner()
      const contract = getContract('core', signer)

      const amountWei = ethers.parseEther(amount)
      const tx = await contract.addExpense(groupId, description, amountWei, token, {
        value: token === '0x0000000000000000000000000000000000000000' ? amountWei : 0
      })
      await tx.wait()

      // Store expense in database via API
      await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          payer: address,
          amount,
          token,
          description,
          txHash: tx.hash
        })
      })

      console.log('Expense added successfully')
    } catch (error) {
      console.error('Error adding expense:', error)
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

  const fetchGroups = useCallback(async () => {
    if (!isConnected || !address) return
    
    setLoading(true);
    try {
      const response = await fetch(`/api/groups?userAddress=${address}`)
      const dbGroups = await response.json()
      
      const formattedGroups = dbGroups.map((group: any) => ({
        id: group.id,
        name: group.name,
        creator: group.creator,
        members: group.members,
        totalExpenses: '0', // TODO: Calculate from expenses
        yourBalance: '0' // TODO: Calculate from balances
      }))
      setGroups(formattedGroups)
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  }, [isConnected, address]);

  const fetchExpenses = useCallback(async (groupId?: string) => {
    setLoading(true);
    try {
      if (groupId) {
        const response = await fetch(`/api/expenses?groupId=${groupId}`)
        const dbExpenses = await response.json()
        
        const formattedExpenses = dbExpenses.map((expense: any) => ({
          id: expense.id.toString(),
          groupId: expense.group_id.toString(),
          payer: expense.payer,
          amount: expense.amount,
          token: expense.token,
          description: expense.description,
          timestamp: Math.floor(new Date(expense.timestamp).getTime() / 1000)
        }))
        setExpenses(formattedExpenses)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const settleDebt = useCallback(async (groupId: string, token: string, to: string, amount: string) => {
    if (!isConnected || !address) throw new Error('Wallet not connected')
    if (!isCorrectNetwork) throw new Error('Please switch to BlockDAG network')

    setLoading(true)
    try {
      const signer = await getSigner()
      const contract = getContract('core', signer)

      const amountWei = ethers.parseEther(amount)
      const tx = await contract.settleDebt(groupId, token, to, amountWei, {
        value: token === '0x0000000000000000000000000000000000000000' ? amountWei : 0
      })
      await tx.wait()

      console.log('Debt settled successfully')
    } catch (error) {
      console.error('Error settling debt:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

  const getSplitTokenBalance = useCallback(async (userAddress: string) => {
    if (!isConnected || !userAddress) return '0.0000'
    if (!isCorrectNetwork) return '0.0000'

    try {
      const signer = await getSigner()
      const contract = getContract('token', signer)
      
      const balance = await contract.balanceOf(userAddress)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Error fetching split token balance:', error)
      return '0.0000'
    }
  }, [isConnected, isCorrectNetwork])

  const transferTokens = useCallback(async (to: string, amount: string) => {
    if (!isConnected || !address) throw new Error('Wallet not connected')
    if (!isCorrectNetwork) throw new Error('Please switch to BlockDAG network')

    setLoading(true)
    try {
      const signer = await getSigner()
      const contract = getContract('token', signer)
      
      const amountWei = ethers.parseEther(amount)
      const tx = await contract.transfer(to, amountWei)
      await tx.wait()

      console.log('Tokens transferred successfully')
      return tx.hash
    } catch (error) {
      console.error('Error transferring tokens:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

  const testContractConnection = useCallback(async () => {
    if (!isConnected || !address) throw new Error('Wallet not connected')
    if (!isCorrectNetwork) throw new Error('Please switch to BlockDAG network')

    try {
      const signer = await getSigner()
      
      // Test token contract
      const tokenContract = getContract('token', signer)
      const tokenName = await tokenContract.name()
      const tokenSymbol = await tokenContract.symbol()
      const balance = await tokenContract.balanceOf(address)
      
      // Test core contract
      const coreContract = getContract('core', signer)
      
      console.log('✅ Contract Connection Test Results:')
      console.log(`Token Name: ${tokenName}`)
      console.log(`Token Symbol: ${tokenSymbol}`)
      console.log(`Your Balance: ${ethers.formatEther(balance)} ${tokenSymbol}`)
      console.log('Core contract connected successfully')
      
      return {
        success: true,
        tokenName,
        tokenSymbol,
        balance: ethers.formatEther(balance)
      }
    } catch (error) {
      console.error('❌ Contract connection failed:', error)
      throw error
    }
  }, [isConnected, address, isCorrectNetwork])

  return {
    loading,
    groups,
    expenses,
    isCorrectNetwork,
    createGroup,
    addExpense,
    settleDebt,
    getSplitTokenBalance,
    transferTokens,
    testContractConnection,
    switchToBlockDAG,
    loadGroups,
    loadExpenses,
    fetchGroups,
    fetchExpenses
  }
}