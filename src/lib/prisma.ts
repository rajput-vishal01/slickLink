import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


//<---Ignore---> (ai-generated)
// Keep-alive function with random queries
async function keepDatabaseAlive() {
  try {
    // Array of different lightweight queries to randomize
    const queries = [
      () => prisma.$queryRaw`SELECT 1`,
      () => prisma.user.count(),
      () => prisma.url.count(),
      () => prisma.$queryRaw`SELECT NOW()`,
      () => prisma.user.findFirst({ select: { id: true } }),
      () => prisma.url.findFirst({ select: { id: true } })
    ]
    
    // Pick a random query
    const randomQuery = queries[Math.floor(Math.random() * queries.length)]
    await randomQuery()
    
    console.log(`[${new Date().toISOString()}] Database pinged successfully`)
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Database ping failed:`, error)
  }
}

// Function to schedule next ping with random interval
function scheduleNextPing() {
  // Random interval between 8-15 minutes (480000-900000 ms)
  const minInterval = 8 * 60 * 1000  // 8 minutes
  const maxInterval = 15 * 60 * 1000 // 15 minutes
  const randomInterval = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval
  
  setTimeout(async () => {
    await keepDatabaseAlive()
    scheduleNextPing() // Schedule the next ping
  }, randomInterval)
  
  console.log(`[${new Date().toISOString()}] Next database ping scheduled in ${Math.round(randomInterval / 1000 / 60)} minutes`)
}

// Global flag to ensure keep-alive only starts once
const globalForKeepAlive = globalThis as unknown as {
  keepAliveStarted: boolean | undefined
}

// Export function to manually start keep-alive
export function startDatabaseKeepAlive() {
  if (globalForKeepAlive.keepAliveStarted) {
    console.log('Database keep-alive already running')
    return
  }
  
  globalForKeepAlive.keepAliveStarted = true
  console.log(`[${new Date().toISOString()}] Database keep-alive started`)
  
  // Initial ping after 30 seconds
  setTimeout(async () => {
    await keepDatabaseAlive()
    scheduleNextPing()
  }, 30000)
}

// Auto-start in production or when explicitly enabled
if (process.env.NODE_ENV === 'production' || process.env.ENABLE_DB_KEEPALIVE === 'true') {
  startDatabaseKeepAlive()
}