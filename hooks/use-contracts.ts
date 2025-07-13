import { useState, useEffect, useCallback, ReactNode,} from 'react'
import { ethers } from 'ethers'
import { useWallet } from '@/components/wallet-provider'
import { getContract, getSigner, BLOCKDAG_NETWORK } from '@/lib/contracts'

export interface Group {
  [x: string]: ReactNode
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
      const contract = getContract('core', signer)

      const tx = await contract.createGroup(name, members)
      await tx.wait()

      console.log('Group created successfully')
    } catch (error) {
      console.error('Error creating group:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

  const addExpense = useCallback(async (groupId: number, description: string, amount: string, token: string) => {
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
    setLoading(true);
    try {
      // Implement logic to fetch groups from the contract and update the state
      // Example:
      // const contract = await getContract('core');
      // const groupsData = await contract.getGroups(); // Replace with your contract method
      // setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      // Implement logic to fetch expenses from the contract and update the state
      // Example:
      // const signer = await getSigner();
      // const contract = getContract('core', signer);
      // const expensesData = await contract.getExpenses(); // Replace with your contract method
      // setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const settleDebt = useCallback(async (groupId: number, token: string, to: string, amount: string) => {
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

  return {
    loading,
    groups,
    expenses,
    isCorrectNetwork,
    createGroup,
    addExpense,
    settleDebt,
    getSplitTokenBalance,
    switchToBlockDAG,
    loadGroups,
    loadExpenses,
    fetchGroups,
    fetchExpenses
  }
}