import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';
import { createAdminClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/ratelimit/ratelimiter';

export async function POST(request: NextRequest) {
  try {
    // 1. Check rate limit (10 requests per minute)
    const { allowed, remaining, resetTime } = checkRateLimit(
      request,
      RATE_LIMITS.AUTH_LOGOUT.limit,
      RATE_LIMITS.AUTH_LOGOUT.windowMs
    );

    if (!allowed) {
      const response = rateLimitResponse(resetTime, remaining);
      return NextResponse.json(
        response.body,
        {
          status: response.statusCode,
          headers: response.headers,
        }
      );
    }

    // 2. Get session token from cookie
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'No active session' },
        { status: 401 }
      );
    }

    // 3. Validate session and get user
    const user = await AuthService.validateSession(sessionToken);

    // 4. Delete session from database
    await AuthService.logout(sessionToken);

    // 5. Log logout to audit trail (if user found)
    if (user) {
      const supabase = createAdminClient();
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        user_name: user.name,
        user_role: user.role,
        action: 'logout',
        resource: 'auth',
        details: `User logged out: ${user.email}`,
        status: 'success',
      });
    }

    // 6. Clear session cookie and return response
    return AuthService.clearSessionResponse();

  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear cookie even if error occurs
    return AuthService.clearSessionResponse();
  }
}