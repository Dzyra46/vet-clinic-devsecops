import crypto from 'crypto';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Generate secure random token untuk session
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create session di database
 */
export async function createSession(userId: string, expiresInDays: number = 7) {
  const supabase = createAdminClient();
  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);

  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      token: token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create session:', error);
    throw new Error('Failed to create session');
  }

  return session;
}

/**
 * Validate session token
 */
export async function validateSession(token: string) {
  const supabase = createAdminClient();

  const { data: session, error } = await supabase
    .from('sessions')
    .select('*, users(*)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !session) {
    return null;
  }

  return session;
}

/**
 * Delete session (logout)
 */
export async function deleteSession(token: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('token', token);

  if (error) {
    console.error('Failed to delete session:', error);
    throw new Error('Failed to delete session');
  }

  return true;
}

/**
 * Delete all sessions untuk user (force logout all devices)
 */
export async function deleteAllUserSessions(userId: string) {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error('Failed to delete user sessions:', error);
    throw new Error('Failed to delete user sessions');
  }

  return true;
}

/**
 * Cleanup expired sessions (untuk cron job)
 */
export async function cleanupExpiredSessions() {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from('sessions')
    .delete()
    .lt('expires_at', new Date().toISOString());

  if (error) {
    console.error('Failed to cleanup expired sessions:', error);
    throw new Error('Failed to cleanup expired sessions');
  }

  return true;
}