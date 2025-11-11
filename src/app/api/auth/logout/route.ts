import { AuthService } from '@/server/services/authService';

export async function POST() {
  return AuthService.clearSession();
}