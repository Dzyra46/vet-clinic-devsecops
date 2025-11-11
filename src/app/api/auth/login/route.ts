import { NextResponse } from 'next/server';
import { AuthService } from '@/server/services/authService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt:', { email });

    // Validate credentials using AuthService
    const user = await AuthService.validateCredentials(email, password);

    if (!user) {
      console.log('Login failed: Invalid credentials');
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create session response
    console.log('Login successful:', user.email);
    return AuthService.createSessionResponse(user);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}