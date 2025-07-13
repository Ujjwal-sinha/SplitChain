
import { NextResponse } from 'next/server'
import { testMongoConnection } from '@/lib/database'

export async function GET() {
  try {
    const result = await testMongoConnection()
    
    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 500 })
  }
}
