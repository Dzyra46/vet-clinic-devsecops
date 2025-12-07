import { NextResponse } from 'next/server';
import { hashPassword, verifyPassword, validatePasswordStrength } from '@/lib/auth/password';

export async function GET() {
  const testPassword = 'Test123!@#';

  // 1. Test validation
  const validation = validatePasswordStrength(testPassword);
  
  // 2. Test hashing
  const hash = await hashPassword(testPassword);
  
  // 3. Test verification
  const isCorrect = await verifyPassword(testPassword, hash);
  const isWrong = await verifyPassword('wrongpassword', hash);

  return NextResponse.json({
    password: testPassword,
    validation,
    hash,
    verification: {
      correctPassword: isCorrect,  // Should be true
      wrongPassword: isWrong,      // Should be false
    }
  });
}