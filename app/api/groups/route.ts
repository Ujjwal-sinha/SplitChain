import { NextRequest, NextResponse } from 'next/server'
import { getGroupsByUser, createGroup, initializeDatabase } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    await initializeDatabase()

    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get('userAddress')

    if (!userAddress) {
      return NextResponse.json({ error: 'User address is required' }, { status: 400 })
    }

    const groups = await getGroupsByUser(userAddress)
    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, creator, members, txHash } = await request.json()

    if (!name || !creator || !members) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const group = await createGroup(name, creator, members, txHash)
    return NextResponse.json(group)
  } catch (error) {
    console.error('Error creating group:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}