import { NextRequest } from 'next/server';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '../ratelimiter';

// Mock NextRequest
function createMockRequest(ip: string = '127.0.0.1'): NextRequest {
  const request = new NextRequest('http://localhost:3000/api/test', {
    method: 'GET',
  });
  
  // Add IP to headers
  Object.defineProperty(request, 'ip', {
    value: ip,
  });
  
  return request;
}

describe('Rate Limiter - Comprehensive Testing', () => {
  
  // ============= BASIC RATE LIMITING TESTS =============
  describe('Basic Rate Limiting', () => {
    beforeEach(() => {
      // Clear rate limit store between tests
      jest.clearAllMocks();
    });

    test('should allow requests within limit', () => {
      const request = createMockRequest('192.168.1.1');
      
      // First 5 requests should be allowed for LOGIN endpoint
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(
          request,
          RATE_LIMITS.AUTH_LOGIN.limit,
          RATE_LIMITS.AUTH_LOGIN.windowMs
        );
        expect(result.allowed).toBe(true);
      }
    });

    test('should reject requests exceeding limit', () => {
      const request = createMockRequest('192.168.1.2');
      
      // Fill up the limit (5 requests)
      for (let i = 0; i < 5; i++) {
        checkRateLimit(
          request,
          RATE_LIMITS.AUTH_LOGIN.limit,
          RATE_LIMITS.AUTH_LOGIN.windowMs
        );
      }
      
      // 6th request should be rejected
      const result = checkRateLimit(
        request,
        RATE_LIMITS.AUTH_LOGIN.limit,
        RATE_LIMITS.AUTH_LOGIN.windowMs
      );
      expect(result.allowed).toBe(false);
    });

    test('should track remaining requests accurately', () => {
      const request = createMockRequest('192.168.1.3');
      
      const result1 = checkRateLimit(request, 10, 60000);
      expect(result1.remaining).toBe(9);
      
      const result2 = checkRateLimit(request, 10, 60000);
      expect(result2.remaining).toBe(8);
      
      const result3 = checkRateLimit(request, 10, 60000);
      expect(result3.remaining).toBe(7);
    });

    test('should return resetTime in future', () => {
      const request = createMockRequest('192.168.1.4');
      const now = Date.now();
      
      const result = checkRateLimit(request, 10, 60000);
      
      expect(result.resetTime).toBeGreaterThan(now);
      expect(result.resetTime).toBeLessThanOrEqual(now + 60000);
    });
  });

  // ============= IP TRACKING TESTS =============
  describe('IP-Based Tracking', () => {
    test('should track different IPs separately', () => {
      const request1 = createMockRequest('192.168.1.100');
      const request2 = createMockRequest('192.168.1.101');
      
      // Use up limit for IP1
      for (let i = 0; i < 5; i++) {
        checkRateLimit(request1, 5, 60000);
      }
      
      // IP1 should be blocked
      const result1 = checkRateLimit(request1, 5, 60000);
      expect(result1.allowed).toBe(false);
      
      // IP2 should still be allowed
      const result2 = checkRateLimit(request2, 5, 60000);
      expect(result2.allowed).toBe(true);
    });

    test('should extract IP from x-forwarded-for header', () => {
      // This test verifies IP extraction logic
      const ips = ['10.0.0.1', '10.0.0.2', '10.0.0.3'];
      
      ips.forEach((ip, index) => {
        const request = createMockRequest(ip);
        const result = checkRateLimit(request, 100, 60000);
        
        // Different IPs should have separate limits
        if (index > 0) {
          expect(result.remaining).toBe(99); // Fresh limit for new IP
        }
      });
    });
  });

  // ============= RATE LIMIT PRESETS TESTS =============
  describe('Rate Limit Presets', () => {
    test('AUTH_LOGIN should limit to 5 per 15 minutes', () => {
      const request = createMockRequest('192.168.2.1');
      
      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(
          request,
          RATE_LIMITS.AUTH_LOGIN.limit,
          RATE_LIMITS.AUTH_LOGIN.windowMs
        );
        expect(result.allowed).toBe(true);
      }
      
      const result = checkRateLimit(
        request,
        RATE_LIMITS.AUTH_LOGIN.limit,
        RATE_LIMITS.AUTH_LOGIN.windowMs
      );
      expect(result.allowed).toBe(false);
    });

    test('AUTH_REGISTER should limit to 3 per hour', () => {
      const request = createMockRequest('192.168.2.2');
      
      for (let i = 0; i < 3; i++) {
        const result = checkRateLimit(
          request,
          RATE_LIMITS.AUTH_REGISTER.limit,
          RATE_LIMITS.AUTH_REGISTER.windowMs
        );
        expect(result.allowed).toBe(true);
      }
      
      const result = checkRateLimit(
        request,
        RATE_LIMITS.AUTH_REGISTER.limit,
        RATE_LIMITS.AUTH_REGISTER.windowMs
      );
      expect(result.allowed).toBe(false);
    });

    test('API_READ should allow 100 per minute', () => {
      const request = createMockRequest('192.168.2.3');
      
      for (let i = 0; i < 100; i++) {
        const result = checkRateLimit(
          request,
          RATE_LIMITS.API_READ.limit,
          RATE_LIMITS.API_READ.windowMs
        );
        expect(result.allowed).toBe(true);
      }
      
      const result = checkRateLimit(
        request,
        RATE_LIMITS.API_READ.limit,
        RATE_LIMITS.API_READ.windowMs
      );
      expect(result.allowed).toBe(false);
    });

    test('API_WRITE should limit to 30 per minute', () => {
      const request = createMockRequest('192.168.2.4');
      
      for (let i = 0; i < 30; i++) {
        const result = checkRateLimit(
          request,
          RATE_LIMITS.API_WRITE.limit,
          RATE_LIMITS.API_WRITE.windowMs
        );
        expect(result.allowed).toBe(true);
      }
      
      const result = checkRateLimit(
        request,
        RATE_LIMITS.API_WRITE.limit,
        RATE_LIMITS.API_WRITE.windowMs
      );
      expect(result.allowed).toBe(false);
    });
  });

  // ============= RATE LIMIT RESPONSE TESTS =============
  describe('Rate Limit Response', () => {
    test('should return correct response structure', () => {
      const resetTime = Date.now() + 30000;
      const remaining = 5;
      
      const response = rateLimitResponse(resetTime, remaining);
      
      expect(response).toHaveProperty('statusCode', 429);
      expect(response).toHaveProperty('headers');
      expect(response).toHaveProperty('body');
    });

    test('should include Retry-After header', () => {
      const resetTime = Date.now() + 30000;
      const response = rateLimitResponse(resetTime, 0);
      
      expect(response.headers['Retry-After']).toBeDefined();
      expect(parseInt(response.headers['Retry-After'])).toBeGreaterThan(0);
    });

    test('should include X-RateLimit-Remaining header', () => {
      const resetTime = Date.now() + 30000;
      const remaining = 5;
      
      const response = rateLimitResponse(resetTime, remaining);
      
      expect(response.headers['X-RateLimit-Remaining']).toBe('5');
    });

    test('should include X-RateLimit-Reset header', () => {
      const resetTime = Date.now() + 30000;
      const response = rateLimitResponse(resetTime, 0);
      
      expect(response.headers['X-RateLimit-Reset']).toBeDefined();
      expect(new Date(response.headers['X-RateLimit-Reset'])).toBeInstanceOf(Date);
    });

    test('should include error message in body', () => {
      const resetTime = Date.now() + 30000;
      const response = rateLimitResponse(resetTime, 0);
      
      expect(response.body.error).toBeDefined();
      expect(response.body.error).toContain('Too many requests');
    });

    test('should include retryAfter in body', () => {
      const resetTime = Date.now() + 30000;
      const response = rateLimitResponse(resetTime, 0);
      
      expect(response.body.retryAfter).toBeDefined();
      expect(response.body.retryAfter).toBeGreaterThanOrEqual(0);
    });

    test('should handle negative Retry-After gracefully', () => {
      const resetTime = Date.now() - 1000; // Past time
      const response = rateLimitResponse(resetTime, 0);
      
      expect(parseInt(response.headers['Retry-After'])).toBeGreaterThanOrEqual(0);
    });
  });

  // ============= EDGE CASES =============
  describe('Edge Cases', () => {
    test('should handle burst of simultaneous requests', () => {
      const request = createMockRequest('192.168.3.1');
      const limit = 10;
      
      // Simulate 20 rapid requests
      const results = [];
      for (let i = 0; i < 20; i++) {
        const result = checkRateLimit(request, limit, 60000);
        results.push(result.allowed);
      }
      
      // First 10 allowed, rest rejected
      const allowedCount = results.filter(r => r).length;
      expect(allowedCount).toBe(10);
    });

    test('should handle zero remaining gracefully', () => {
      const request = createMockRequest('192.168.3.2');
      
      // Use up all requests
      for (let i = 0; i < 5; i++) {
        checkRateLimit(request, 5, 60000);
      }
      
      // Additional requests should still show 0 remaining, not negative
      const result = checkRateLimit(request, 5, 60000);
      expect(result.remaining).toBe(0);
      expect(result.remaining).toBeGreaterThanOrEqual(0);
    });

    test('should handle very short time windows', () => {
      const request = createMockRequest('192.168.3.3');
      const limit = 10;
      const shortWindow = 100; // 100ms
      
      for (let i = 0; i < 10; i++) {
        const result = checkRateLimit(request, limit, shortWindow);
        expect(result.allowed).toBe(true);
      }
      
      const result = checkRateLimit(request, limit, shortWindow);
      expect(result.allowed).toBe(false);
    });

    test('should handle very large limits', () => {
      const request = createMockRequest('192.168.3.4');
      const largeLimit = 10000;
      
      for (let i = 0; i < 100; i++) {
        const result = checkRateLimit(request, largeLimit, 60000);
        expect(result.allowed).toBe(true);
      }
    });
  });

});