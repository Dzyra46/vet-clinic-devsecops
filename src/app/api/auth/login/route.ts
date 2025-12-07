import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';
import { createAdminClient } from '@/lib/supabase/server';
import { validateEmail } from '@/lib/validation/validators';
import { checkRateLimit, rateLimitResponse, RATE_LIMITS } from '@/lib/ratelimit/ratelimiter';

export async function POST(request: NextRequest) {
  try {
    // 1. Check rate limit (5 attempts per 15 minutes)
    const { allowed, remaining, resetTime } = checkRateLimit(
      request,
      RATE_LIMITS.AUTH_LOGIN.limit,
      RATE_LIMITS.AUTH_LOGIN.windowMs
    );

    if (!allowed) {
      const response = rateLimitResponse(resetTime, remaining);
      
      // Log rate limit exceeded attempt
      const supabase = createAdminClient();
      await supabase.from('audit_logs').insert({
        user_id: null,
        user_name: 'Unknown',
        user_role: 'unknown',
        action: 'login',
        resource: 'auth',
        details: `Rate limit exceeded for login attempt`,
        status: 'failed',
      });

      return NextResponse.json(
        response.body,
        {
          status: response.statusCode,
          headers: response.headers,
        }
      );
    }

    // 2. Parse request body
    const body = await request.json();
    const { email, password } = body;

    // 3. Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // 4. Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    console.log('Login attempt:', { email });

    // 5. Attempt login via service
    const { user, session } = await AuthService.login(email, password);

    console.log('Login successful:', user.email);

    // 6. Log successful login to audit trail
    const supabase = createAdminClient();
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      user_name: user.name,
      user_role: user.role,
      action: 'login',
      resource: 'auth',
      details: `User logged in: ${user.email}`,
      status: 'success',
    });

    // 7. Return session response with cookie
    return AuthService.createSessionResponse(user, session);

  } catch (error) {
    console.error('Login error:', error);

    // Log failed login attempt
    try {
      const body = await request.json();
      const supabase = createAdminClient();
      
      await supabase.from('audit_logs').insert({
        user_id: null,
        user_name: body.email || 'unknown',
        user_role: 'unknown',
        action: 'login',
        resource: 'auth',
        details: `Failed login attempt: ${body.email}`,
        status: 'failed',
      });
    } catch (auditError) {
      console.error('Failed to log audit:', auditError);
    }

    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    );
  }
}