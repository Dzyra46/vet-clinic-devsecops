import { NextResponse } from 'next/server';
import { getRateLimiterStats } from '@/lib/ratelimit/ratelimiter';

export async function GET() {
  const rateLimiterStats = getRateLimiterStats();
  
  // Determine health status
  const isHealthy = rateLimiterStats.totalEntries < 8000; // Warning threshold
  
  return NextResponse.json({
    status: isHealthy ? 'healthy' : 'warning',
    timestamp: new Date().toISOString(),
    services: {
      rateLimiter: {
        status: isHealthy ? 'ok' : 'high_memory',
        ...rateLimiterStats,
      },
    },
  }, {
    status: isHealthy ? 200 : 503,
  });
}