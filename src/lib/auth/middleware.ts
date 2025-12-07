import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'doctor' | 'pet-owner';
    user_id?: string; // Added: Doctor ID from doctors table (only for doctor role)
  };
}

/**
 * Middleware untuk validate session dan attach user ke request
 * Usage di API route:
 * const { user } = await withAuth(request);
 */
export async function withAuth(request: NextRequest) {
  try {
    // 1. Get session token dari cookie
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return {
        error: 'Not authenticated',
        status: 401,
      };
    }

    // 2. Validate session
    const user = await AuthService.validateSession(sessionToken);

    if (!user) {
      return {
        error: 'Invalid or expired session',
        status: 401,
      };
    }

    return {
      user,
      error: null,
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return {
      error: 'Authentication failed',
      status: 500,
    };
  }
}

/**
 * Middleware untuk check specific role
 * Usage: const { authorized } = await requireRole(request, 'admin');
 */
export async function requireRole(
  request: NextRequest,
  requiredRole: string | string[]
) {
  const { user, error, status } = await withAuth(request);

  if (error) {
    return {
      authorized: false,
      error,
      status,
    };
  }

  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];

  if (!roles.includes(user!.role)) {
    return {
      authorized: false,
      error: 'Insufficient permissions',
      status: 403,
    };
  }

  return {
    authorized: true,
    user,
    error: null,
  };
}

/**
 * Helper untuk create error response
 */
export function authError(message: string, status: number = 401) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

/**
 * Helper untuk create success response
 */
export function authSuccess(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}