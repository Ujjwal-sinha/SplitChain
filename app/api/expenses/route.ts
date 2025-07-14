import { NextRequest, NextResponse } from 'next/server'
import { getExpensesByGroup, addExpense, initializeDatabase } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase()

    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    
    if (!groupId) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 })
    }

    const expenses = await getExpensesByGroup(groupId)
    return NextResponse.json(expenses)
  } catch (error) {
    console.error('Error fetching expenses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await initializeDatabase()

    const { groupId, payer, amount, token, description, txHash } = await request.json()
    
    if (!groupId || !payer || !amount || !token || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const expense = await addExpense(groupId, payer, amount, token, description, txHash)
    return NextResponse.json(expense)
  } catch (error) {
    console.error('Error adding expense:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
