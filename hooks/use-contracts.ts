import { useState, useEffect, useCallback, ReactNode } from 'react'
import { ethers } from 'ethers'
import { useUser } from '@civic/auth-web3/react'
import { getContract, getSigner, BLOCKDAG_NETWORK } from '@/lib/contracts'

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
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [groups, setGroups] = useState<Group[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  // Use Civic Auth user information
  const isConnected = !!user
  const address = (user as any)?.wallet?.address || ""
  const chainId = 1043 // BlockDAG network chain ID
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

  const addExpense = useCallback(async (groupId: string, amount: string, token: string, description: string) => {
    if (!isConnected || !address) throw new Error('Wallet not connected')
    if (!isCorrectNetwork) throw new Error('Please switch to BlockDAG network')

    setLoading(true)
    try {
      const signer = await getSigner()
      const contract = getContract('core', signer)

      const amountWei = ethers.parseEther(amount)
      const tx = await contract.addExpense(groupId, amountWei, token, description, {
        value: token === '0x0000000000000000000000000000000000000000' ? amountWei : 0
      })
      await tx.wait()

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
      return tx.hash
    } catch (error) {
      console.error('Error adding expense:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

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
      return tx.hash
    } catch (error) {
      console.error('Error settling debt:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [isConnected, address, isCorrectNetwork])

  const fetchGroups = useCallback(async () => {
    if (!isConnected) return

    setLoading(true)
    try {
      const response = await fetch('/api/groups')
      const data = await response.json()
      
      if (data.success) {
        setGroups(data.groups)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }, [isConnected])

  const fetchExpenses = useCallback(async (groupId: string) => {
    if (!isConnected) return

    setLoading(true)
    try {
      const response = await fetch(`/api/expenses?groupId=${groupId}`)
      const data = await response.json()
      
      if (data.success) {
        setExpenses(data.expenses)
      }
    } catch (error) {
      console.error('Error fetching expenses:', error)
    } finally {
      setLoading(false)
    }
  }, [isConnected])

  return {
    groups,
    expenses,
    loading,
    isConnected,
    isCorrectNetwork,
    createGroup,
    addExpense,
    settleDebt,
    fetchGroups,
    fetchExpenses
  }
}
