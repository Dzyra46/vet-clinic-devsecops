import { NextResponse } from 'next/server';
import { users, type User, type UserPublic } from '../models/User';

export class AuthService {
  // Find user by email
  static findByEmail(email: string): User | undefined {
    return users.find(u => u.email === email);
  }

  // Validate credentials
  static async validateCredentials(email: string, password: string): Promise<UserPublic | null> {
    const user = this.findByEmail(email);
    
    if (!user || user.password !== password) {
      return null;
    }

    // Return public user data (without password)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  // Create session response
  static createSessionResponse(user: UserPublic) {
    const response = NextResponse.json({ user });

    response.cookies.set({
      name: 'user',
      value: JSON.stringify(user),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  }

  // Clear session
  static clearSession() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('user');
    return response;
  }

  // Get user from request (for future middleware)
  static getUserFromCookie(cookieValue: string | undefined): UserPublic | null {
    if (!cookieValue) return null;
    
    try {
      return JSON.parse(cookieValue);
    } catch {
      return null;
    }
  }
}
