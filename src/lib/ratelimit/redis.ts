/**
 * Redis-based rate limiter for production
 * Use this when deploying to multiple server instances
 * 
 * Install: npm install ioredis
 */

import Redis from 'ioredis';
import { NextRequest } from 'next/server';

let redis: Redis | null = null;

// Initialize Redis only in production
if (process.env.NODE_ENV === 'production' && process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
}

export async function checkRateLimitRedis(
  request: NextRequest,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  // Fallback to in-memory if Redis not available
  if (!redis) {
    const { checkRateLimit } = await import('./ratelimiter');
    return checkRateLimit(request, limit, windowMs);
  }
  
  const forwarded = request.headers.get('x-forwarded-for');
  const clientIP = forwarded 
    ? forwarded.split(',')[0].trim() 
    : (request.headers.get('x-real-ip') || request.ip || '127.0.0.1');
  const key = `ratelimit:${clientIP}`;
  const now = Date.now();
  const resetTime = now + windowMs;
  
  // Use Redis INCR with expiry
  const count = await redis.incr(key);
  
  if (count === 1) {
    // First request, set expiry
    await redis.pexpire(key, windowMs);
  }
  
  const remaining = Math.max(0, limit - count);
  const allowed = count <= limit;
  
  return { allowed, remaining, resetTime };
}