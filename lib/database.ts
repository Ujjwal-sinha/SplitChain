import { MongoClient, Db } from 'mongodb'

// Global variables to persist connection (important for hot reloads in dev)
let client: MongoClient
let db: Db

export async function connectToDatabase() {
  if (!client) {
    const uri = process.env.DATABASE_URL || process.env.MONGODB_URI
    if (!uri) {
      throw new Error('DATABASE_URL or MONGODB_URI environment variable is not set')
    }

    console.log('Connecting to MongoDB with URI:', uri.replace(/\/\/.*:.*@/, '//***:***@'))

    client = new MongoClient(uri, {
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
      retryWrites: true,
      w: 'majority',
      tls: true, // Enforce secure connection
      ssl: true,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
    })

    await client.connect()

    // Test the connection
    await client.db('admin').command({ ping: 1 })
    console.log('MongoDB connection successful!')

    db = client.db() // Default database from URI
  }

  return { client, db }
}

export async function initializeDatabase() {
  try {
    const { db } = await connectToDatabase()

    if (!db) throw new Error('Database connection failed')

    // Create indexes
    await db.collection('groups').createIndex({ creator: 1 })
    await db.collection('groups').createIndex({ members: 1 })
    await db.collection('expenses').createIndex({ group_id: 1 })
    await db.collection('balances').createIndex(
      { group_id: 1, user_address: 1 },
      { unique: true }
    )

    console.log('MongoDB initialized successfully')
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

export async function createGroup(
  name: string,
  creator: string,
  members: string[],
  txHash?: string
) {
  const { db } = await connectToDatabase()

  const groupData = {
    name,
    creator,
    members,
    created_at: new Date(),
    tx_hash: txHash,
  }

  const result = await db.collection('groups').insertOne(groupData)

  // Initialize balances for all members
  const balances = members.map(member => ({
    group_id: result.insertedId,
    user_address: member,
    balance: '0',
  }))

  await db.collection('balances').insertMany(balances)

  return {
    id: result.insertedId,
    ...groupData,
  }
}

export async function getGroupsByUser(userAddress: string) {
  const { db } = await connectToDatabase()

  const groups = await db
    .collection('groups')
    .find({
      $or: [{ creator: userAddress }, { members: userAddress }],
    })
    .sort({ created_at: -1 })
    .toArray()

  return groups.map(group => ({
    id: group._id,
    name: group.name,
    creator: group.creator,
    members: group.members,
    created_at: group.created_at,
    tx_hash: group.tx_hash,
  }))
}

export async function getGroupById(groupId: string) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require('mongodb')

  const group = await db.collection('groups').findOne({ _id: new ObjectId(groupId) })
  if (!group) return null

  return {
    id: group._id,
    name: group.name,
    creator: group.creator,
    members: group.members,
    created_at: group.created_at,
    tx_hash: group.tx_hash,
  }
}

export async function addExpense(
  groupId: string,
  payer: string,
  amount: string,
  token: string,
  description: string,
  txHash?: string
) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require('mongodb')

  const expenseData = {
    group_id: new ObjectId(groupId),
    payer,
    amount,
    token,
    description,
    timestamp: new Date(),
    tx_hash: txHash,
  }

  const result = await db.collection('expenses').insertOne(expenseData)

  return {
    id: result.insertedId,
    ...expenseData,
  }
}

export async function getExpenses() {
  const { db } = await connectToDatabase()

  const expenses = await db
    .collection('expenses')
    .find()
    .sort({ timestamp: -1 })
    .toArray()

  return expenses.map(expense => ({
    id: expense._id,
    group_id: expense.group_id,
    payer: expense.payer,
    amount: expense.amount,
    token: expense.token,
    description: expense.description,
    timestamp: expense.timestamp,
    tx_hash: expense.tx_hash,
  }))
}

export async function getExpensesByGroup(groupId: string) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require('mongodb')

  const expenses = await db
    .collection('expenses')
    .find({ group_id: new ObjectId(groupId) })
    .sort({ timestamp: -1 })
    .toArray()

  return expenses.map(expense => ({
    id: expense._id,
    group_id: expense.group_id,
    payer: expense.payer,
    amount: expense.amount,
    token: expense.token,
    description: expense.description,
    timestamp: expense.timestamp,
    tx_hash: expense.tx_hash,
  }))
}

export async function updateBalance(groupId: string, userAddress: string, balance: string) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require('mongodb')

  await db.collection('balances').updateOne(
    { group_id: new ObjectId(groupId), user_address: userAddress },
    { $set: { balance } },
    { upsert: true }
  )
}

export async function getBalancesByGroup(groupId: string) {
  const { db } = await connectToDatabase()
  const { ObjectId } = require('mongodb')

  const balances = await db.collection('balances')
    .find({ group_id: new ObjectId(groupId) })
    .toArray()

  return balances.map(balance => ({
    id: balance._id,
    group_id: balance.group_id,
    user_address: balance.user_address,
    balance: balance.balance,
  }))
}

export async function testMongoConnection() {
  try {
    const { db } = await connectToDatabase()

    const collections = await db.listCollections().toArray()
    console.log('Available collections:', collections.map(c => c.name))

    const testResult = await db.collection('test').insertOne({
      test: true,
      timestamp: new Date(),
    })

    await db.collection('test').deleteOne({ _id: testResult.insertedId })

    return {
      success: true,
      message: 'MongoDB connection test successful',
      collections: collections.map(c => c.name),
    }
  } catch (error) {
    console.error('MongoDB connection test failed:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred',
      collections: [],
    }
  }
}
