import { AuthService } from '../authService';
import * as passwordUtils from '@/lib/auth/password';

// Mock Supabase
jest.mock('@/lib/supabase/server');
jest.mock('@/lib/auth/password', () => ({
  ...jest.requireActual('@/lib/auth/password'), // Pertahankan fungsi asli
  verifyPassword: jest.fn(() => Promise.resolve(true)), // Palsukan 'verifyPassword'
}));

// Data palsu untuk dikembalikan oleh mock
const mockUser = {
  id: 'user-uuid-123',
  name: 'Dr. Ahmad',
  email: 'dr.ahmad@vetclinic.com',
  role: 'doctor',
  password_hash: 'hashed_password_abc',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// Buat mock untuk Supabase client yang bisa di-chain
const mockSupabase: any = {
  from: jest.fn(() => mockSupabase),
  select: jest.fn(() => mockSupabase),
  insert: jest.fn(() => mockSupabase),
  eq: jest.fn(() => mockSupabase),
  gt: jest.fn(() => mockSupabase),
  single: jest.fn(() => Promise.resolve({ data: mockUser, error: null })),
  delete: jest.fn(() => mockSupabase),
  update: jest.fn(() => mockSupabase),
  // Tambahkan fungsi lain jika Anda menggunakannya (mis: .delete(), .update())
};

// Beri tahu Jest untuk MENGGANTI implementasi asli dengan MOCK kita
// Pastikan path '@/lib/supabase/server' ini benar menunjuk ke file
// tempat Anda mengekspor 'createAdminClient'
jest.mock('@/lib/supabase/server', () => ({
  createAdminClient: () => mockSupabase, // Kembalikan mock kita saat dipanggil
}));

// (PENTING) Reset mock sebelum setiap tes
beforeEach(() => {
  jest.clearAllMocks(); // Hapus histori panggilan sebelumnya

  // Set ulang implementasi default
  mockSupabase.from.mockReturnValue(mockSupabase);
  mockSupabase.select.mockReturnValue(mockSupabase);
  mockSupabase.eq.mockReturnValue(mockSupabase);
  mockSupabase.insert.mockReturnValue(mockSupabase);
  mockSupabase.single.mockReturnValue(Promise.resolve({ data: mockUser, error: null }));
});

describe('AuthService - Complete Authentication Flow', () => {
  
  // ============= REGISTRATION TESTS =============
  describe('Registration', () => {
    test('should register user with valid data', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'dr.ahmad@vetclinic.com',
        password: 'SecurePass123!',
        role: 'doctor',
      } as const;

      // 1. Panggilan .single() pertama (cek existingUser) -> kembalikan null
      mockSupabase.single.mockReturnValueOnce(Promise.resolve({ data: null, error: null }));
      // 2. Panggilan .insert() kedua (membuat user) -> kembalikan user baru
      mockSupabase.single.mockReturnValueOnce(Promise.resolve({ data: mockUser, error: null }));
      
      const user = await AuthService.register(userData);
      
      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
      expect(user.id).toBeDefined();
    });

    test('should reject registration with invalid email', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'invalid-email',
        password: 'SecurePass123!',
        role: 'doctor',
      } as const;
      
      await expect(AuthService.register(userData)).rejects.toThrow();
    });

    test('should reject registration with weak password', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'dr.ahmad@vetclinic.com',
        password: 'weak',
        role: 'doctor',
      } as const;
      
      await expect(AuthService.register(userData)).rejects.toThrow();
    });

    test('should reject registration with invalid role', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'dr.ahmad@vetclinic.com',
        password: 'SecurePass123!',
        role: 'superadmin',
      } as const;
      
      await expect(AuthService.register(userData as any)).rejects.toThrow();
    });

    test('should reject duplicate email registration', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'existing@vetclinic.com',
        password: 'SecurePass123!',
        role: 'doctor',
      } as const;

      mockSupabase.single.mockReturnValueOnce(Promise.resolve({ data: mockUser, error: null }));
      
      // First registration should work
      // Second should fail
      await expect(AuthService.register(userData)).rejects.toThrow('Email already registered');
    });

    test('should hash password before storing', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'dr.ahmad2@vetclinic.com',
        password: 'SecurePass123!',
        role: 'doctor',
      } as const;

      // --- TAMBAHKAN INI ---
      // 1. Override 'single' untuk cek email -> kembalikan null (user belum ada)
      mockSupabase.single.mockReturnValueOnce(Promise.resolve({ data: null, error: null }));
      // 2. Override 'insert' (atau 'single' setelah insert) -> kembalikan user baru
      // Asumsikan 'register' Anda mengembalikan user yang baru dibuat
      // Ganti 'mockUser' dengan data yang relevan jika perlu
      mockSupabase.insert.mockReturnValue(mockSupabase); // Jika Anda chain .insert().single()
      mockSupabase.single.mockReturnValueOnce(Promise.resolve({ data: { ...mockUser, email: userData.email }, error: null }));
      
      const user = await AuthService.register(userData);
      
      // Password should not be stored in user object
      expect(user).not.toHaveProperty('password');
      expect(user).not.toHaveProperty('password_hash');
    });

    test('should create user with timestamps', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'dr.ahmad3@vetclinic.com',
        password: 'SecurePass123!',
        role: 'doctor',
      } as const;
      
      const user = await AuthService.register(userData);
      
      expect(user.created_at).toBeDefined();
      expect(user.updated_at).toBeDefined();
    });
  });

  // ============= LOGIN TESTS =============
  describe('Login', () => {
    test('should login with correct credentials', async () => {

      // 1. Simulasikan 'verifyPassword' mengembalikan true
      (passwordUtils.verifyPassword as jest.Mock).mockReturnValueOnce(Promise.resolve(true));
      // 2. Simulasikan 'supabase.single' mengembalikan user
      mockSupabase.single.mockReturnValueOnce(Promise.resolve({ data: mockUser, error: null }));

      const result = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('session');
      expect(result.user.email).toBe('dr.ahmad@vetclinic.com');
    });

    test('should reject login with wrong password', async () => {

        // Override mock verifyPassword untuk mengembalikan false
        (passwordUtils.verifyPassword as jest.Mock).mockReturnValueOnce(Promise.resolve(false));
        await expect(
            AuthService.login('dr.ahmad@vetclinic.com', 'WrongPassword123!')
        ).rejects.toThrow();
    });

    test('should reject login with non-existent user', async () => {

        // Override mock Supabase.single untuk mengembalikan "tidak ditemukan"
    mockSupabase.single.mockReturnValueOnce(Promise.resolve({ data: null, error: null }));
      await expect(
        AuthService.login('nonexistent@vetclinic.com', 'Password123!')
      ).rejects.toThrow();
    });

    test('should reject login with invalid email format', async () => {
      await expect(
        AuthService.login('invalid-email', 'Password123!')
      ).rejects.toThrow();
    });

    test('should create session on successful login', async () => {
      const result = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      expect(result.session).toBeDefined();
      expect(result.session.token).toBeDefined();
      expect(result.session.expires_at).toBeDefined();
    });

    test('should include user data in login response', async () => {
      const result = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      expect(result.user.id).toBeDefined();
      expect(result.user.name).toBeDefined();
      expect(result.user.email).toBeDefined();
      expect(result.user.role).toBeDefined();
    });

    test('should not return password in login response', async () => {
      const result = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      expect(result.user).not.toHaveProperty('password');
      expect(result.user).not.toHaveProperty('password_hash');
    });

    test('should set session expiration', async () => {
      const result = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      const expiresAt = new Date(result.session.expires_at);
      const now = new Date();
      
      expect(expiresAt.getTime()).toBeGreaterThan(now.getTime());
    });
  });

  // ============= SESSION VALIDATION TESTS =============
  describe('Session Validation', () => {
    test('should validate valid session token', async () => {
      const login = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      const user = await AuthService.validateSession(login.session.token);
      
      expect(user).toBeTruthy();
      if (user) {
        expect(user.email).toBe('dr.ahmad@vetclinic.com');
      }
    });

    test('should reject invalid session token', async () => {
      const user = await AuthService.validateSession('invalid-token');
      
      expect(user).toBeNull();
    });

    test('should reject expired session', async () => {
      // This would require mocking expired sessions
      // Assumed implementation creates expired session
      const expiredToken = 'expired-token';
      const user = await AuthService.validateSession(expiredToken);
      
      expect(user).toBeNull();
    });

    test('should reject malformed token', async () => {
      const malformedTokens = [
        '',
        null,
        undefined,
        'not-a-valid-token-format',
        123, // wrong type
      ];
      
      for (const token of malformedTokens) {
        const user = await AuthService.validateSession(token as any);
        expect(user).toBeNull();
      }
    });

    test('should return user data from valid session', async () => {
      const login = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      const user = await AuthService.validateSession(login.session.token);
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
    });
  });

  // ============= LOGOUT TESTS =============
  describe('Logout', () => {
    test('should logout user and invalidate session', async () => {
      const login = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      await AuthService.logout(login.session.token);
      
      // After logout, token should be invalid
      const user = await AuthService.validateSession(login.session.token);
      expect(user).toBeNull();
    });

    test('should handle logout with invalid token', async () => {
      // Should not throw error
      await expect(
        AuthService.logout('invalid-token')
      ).resolves.not.toThrow();
    });

    test('should clear session from database', async () => {
      const login = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      await AuthService.logout(login.session.token);
      
      // Verify session is deleted
      const session = await AuthService.validateSession(login.session.token);
      expect(session).toBeNull();
    });

    test('should allow repeated logout', async () => {
      const login = await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      await AuthService.logout(login.session.token);
      
      // Second logout should not throw
      await expect(
        AuthService.logout(login.session.token)
      ).resolves.not.toThrow();
    });
  });

  // ============= PASSWORD SECURITY TESTS =============
  describe('Password Security', () => {
    test('should hash password with bcrypt', async () => {
      const userData = {
        name: 'Dr. Test',
        email: 'dr.test@vetclinic.com',
        password: 'TestPassword123!',
        role: 'doctor',
      } as const;
      
      const user = await AuthService.register(userData);
      
      // Should successfully authenticate with same password
      const login = await AuthService.login(userData.email, userData.password);
      expect(login.user.email).toBe(userData.email);
    });

    test('should produce different hashes for same password', async () => {
      // Two users with same password should have different hashes
      const user1Data = {
        name: 'User 1',
        email: 'user1@vetclinic.com',
        password: 'SamePassword123!',
        role: 'doctor',
      } as const;
      
      const user2Data = {
        name: 'User 2',
        email: 'user2@vetclinic.com',
        password: 'SamePassword123!',
        role: 'doctor',
      } as const;
      
      await AuthService.register(user1Data);
      await AuthService.register(user2Data);
      
      // Both should be able to login
      const login1 = await AuthService.login(user1Data.email, user1Data.password);
      const login2 = await AuthService.login(user2Data.email, user2Data.password);
      
      expect(login1.user.id).not.toBe(login2.user.id);
    });

    test('should not store raw password', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'dr.ahmad.secure@vetclinic.com',
        password: 'SecurePass123!',
        role: 'doctor',
      } as const;
      
      const user = await AuthService.register(userData);
      
      // Password should never be in response
      expect(JSON.stringify(user)).not.toContain(userData.password);
    });

    test('should not log password', async () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      await AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!');
      
      // Verify password not logged
      const logs = consoleSpy.mock.calls.map(call => 
        JSON.stringify(call)
      ).join(' ');
      
      expect(logs).not.toContain('SecurePass123!');
      
      consoleSpy.mockRestore();
    });

    test('should require strong password on registration', async () => {
      const weakPasswords = [
        'weak',          // Too short
        'noupppercase1!', // No uppercase
        'NOLOWERCASE1!', // No lowercase
        'NoNumber!',     // No number
        'NoSpecial123',  // No special char
      ];
      
      for (const password of weakPasswords) {
        const userData = {
          name: 'Test User',
          email: `user${Math.random()}@vetclinic.com`,
          password,
          role: 'doctor',
        } as const;
        
        await expect(
          AuthService.register(userData)
        ).rejects.toThrow();
      }
    });
  });

  // ============= EDGE CASES =============
  describe('Edge Cases', () => {
    test('should handle concurrent login requests', async () => {
      const promises = [];
      for (let i = 0; i < 5; i++) {
        promises.push(
          AuthService.login('dr.ahmad@vetclinic.com', 'SecurePass123!')
        );
      }
      
      const results = await Promise.all(promises);
      
      results.forEach(result => {
        expect(result.user).toBeDefined();
        expect(result.session).toBeDefined();
      });
    });

    test('should handle case-insensitive email', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: 'dr.ahmad.ci@vetclinic.com',
        password: 'SecurePass123!',
        role: 'doctor',
      } as const;
      
      await AuthService.register(userData);
      
      // Login with different case
      const result = await AuthService.login(
        userData.email.toUpperCase(),
        userData.password
      );
      
      expect(result.user.email).toBe(userData.email);
    });

    test('should trim whitespace from email', async () => {
      const userData = {
        name: 'Dr. Ahmad',
        email: '  dr.ahmad.trim@vetclinic.com  ',
        password: 'SecurePass123!',
        role: 'doctor',
      } as const;
      
      const user = await AuthService.register(userData);
      
      expect(user.email).not.toContain('  ');
    });
  });

});