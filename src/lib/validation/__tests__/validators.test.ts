import {
  validateEmail,
  validateName,
  validateAge,
  validateWeight,
  validateTextField,
  validateUUID,
  validateEnum,
} from '../validators';

describe('Input Validators - Comprehensive Security Testing', () => {
  
  // ============= EMAIL VALIDATION TESTS =============
  describe('validateEmail', () => {
    // HAPPY PATH - Valid cases
    test('should accept valid email format', () => {
      const result = validateEmail('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should accept email with subdomain', () => {
      const result = validateEmail('user.name@mail.example.co.uk');
      expect(result.isValid).toBe(true);
    });

    test('should accept email with numbers', () => {
      const result = validateEmail('user123@example123.com');
      expect(result.isValid).toBe(true);
    });

    // BOUNDARY CASES - Invalid cases
    test('should reject empty email', () => {
      const result = validateEmail('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });

    test('should reject email without @', () => {
      const result = validateEmail('userexample.com');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    test('should reject email without domain', () => {
      const result = validateEmail('user@');
      expect(result.isValid).toBe(false);
    });

    test('should reject email without local part', () => {
      const result = validateEmail('@example.com');
      expect(result.isValid).toBe(false);
    });

    test('should reject email with spaces', () => {
      const result = validateEmail('user @example.com');
      expect(result.isValid).toBe(false);
    });

    // SECURITY CASES - Injection attempts
    test('should reject email longer than 254 characters', () => {
      const longEmail = 'a'.repeat(255) + '@example.com';
      const result = validateEmail(longEmail);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too long');
    });

    test('should reject SQL injection attempt in email', () => {
      const result = validateEmail("admin'--@example.com");
      expect(result.isValid).toBe(false);
    });

    test('should reject XSS attempt in email', () => {
      const result = validateEmail('<script>alert(1)</script>@example.com');
      expect(result.isValid).toBe(false);
    });

    test('should reject command injection attempt', () => {
      const result = validateEmail('user`;rm -rf /;@example.com');
      expect(result.isValid).toBe(false);
    });

    test('should reject LDAP injection attempt', () => {
      const result = validateEmail('*@example.com');
      expect(result.isValid).toBe(false);
    });
  });

  // ============= NAME VALIDATION TESTS =============
  describe('validateName', () => {
    // HAPPY PATH
    test('should accept valid name', () => {
      const result = validateName('John Doe');
      expect(result.isValid).toBe(true);
    });

    test('should accept name with hyphen', () => {
      const result = validateName('Mary-Jane Watson');
      expect(result.isValid).toBe(true);
    });

    test('should accept name with apostrophe', () => {
      const result = validateName("O'Brien");
      expect(result.isValid).toBe(true);
    });

    test('should accept name with numbers', () => {
      const result = validateName('Agent 007');
      expect(result.isValid).toBe(true);
    });

    // BOUNDARY CASES
    test('should reject name shorter than 3 characters', () => {
      const result = validateName('Jo');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 3');
    });

    test('should reject name longer than 100 characters', () => {
      const result = validateName('A'.repeat(101));
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not exceed 100');
    });

    test('should reject empty name', () => {
      const result = validateName('');
      expect(result.isValid).toBe(false);
    });

    // SECURITY CASES
    test('should reject name with SQL injection attempt', () => {
      const result = validateName("Robert'; DROP TABLE users;--");
      expect(result.isValid).toBe(false);
    });

    test('should reject name with HTML/XSS tags', () => {
      const result = validateName('<img src=x onerror=alert(1)>');
      expect(result.isValid).toBe(false);
    });

    test('should reject name with HTML escape sequences', () => {
      const result = validateName('&lt;script&gt;');
      expect(result.isValid).toBe(false);
    });

    test('should reject name with null byte injection', () => {
      const result = validateName('Test\0Name');
      expect(result.isValid).toBe(false);
    });

    test('should reject name with path traversal attempt', () => {
      const result = validateName('../../../etc/passwd');
      expect(result.isValid).toBe(false);
    });
  });

  // ============= AGE VALIDATION TESTS =============
  describe('validateAge', () => {
    // HAPPY PATH
    test('should accept valid age 0', () => {
      const result = validateAge(0);
      expect(result.isValid).toBe(true);
    });

    test('should accept valid age 50', () => {
      const result = validateAge(50);
      expect(result.isValid).toBe(true);
    });

    test('should accept valid age 100', () => {
      const result = validateAge(100);
      expect(result.isValid).toBe(true);
    });

    // BOUNDARY CASES
    test('should reject negative age', () => {
      const result = validateAge(-1);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('between 0 and 100');
    });

    test('should reject age over 100', () => {
      const result = validateAge(101);
      expect(result.isValid).toBe(false);
    });

    test('should reject float age', () => {
      const result = validateAge(25.5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('integer');
    });

    test('should reject null age', () => {
      const result = validateAge(null as any);
      expect(result.isValid).toBe(false);
    });

    test('should reject undefined age', () => {
      const result = validateAge(undefined as any);
      expect(result.isValid).toBe(false);
    });

    // SECURITY CASES
    test('should reject extremely large number', () => {
      const result = validateAge(999999999);
      expect(result.isValid).toBe(false);
    });

    test('should reject NaN', () => {
      const result = validateAge(NaN);
      expect(result.isValid).toBe(false);
    });
  });

  // ============= WEIGHT VALIDATION TESTS =============
  describe('validateWeight', () => {
    // HAPPY PATH
    test('should accept valid weight 32.5', () => {
      const result = validateWeight(32.5);
      expect(result.isValid).toBe(true);
    });

    test('should accept weight 0.1', () => {
      const result = validateWeight(0.1);
      expect(result.isValid).toBe(true);
    });

    // BOUNDARY CASES
    test('should reject negative weight', () => {
      const result = validateWeight(-5);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('positive');
    });

    test('should reject zero weight', () => {
      const result = validateWeight(0);
      expect(result.isValid).toBe(false);
    });

    test('should reject weight over 500kg', () => {
      const result = validateWeight(501);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    test('should reject non-numeric weight', () => {
      const result = validateWeight('50' as any);
      expect(result.isValid).toBe(false);
    });

    test('should reject infinity', () => {
      const result = validateWeight(Infinity);
      expect(result.isValid).toBe(false);
    });

    test('should reject NaN', () => {
      const result = validateWeight(NaN);
      expect(result.isValid).toBe(false);
    });
  });

  // ============= UUID VALIDATION TESTS =============
  describe('validateUUID', () => {
    // HAPPY PATH
    test('should accept valid UUID', () => {
      const result = validateUUID('550e8400-e29b-41d4-a716-446655440000');
      expect(result.isValid).toBe(true);
    });

    test('should accept UUID with uppercase', () => {
      const result = validateUUID('550E8400-E29B-41D4-A716-446655440000');
      expect(result.isValid).toBe(true);
    });

    // BOUNDARY CASES
    test('should reject invalid UUID format', () => {
      const result = validateUUID('not-a-uuid');
      expect(result.isValid).toBe(false);
    });

    test('should reject empty UUID', () => {
      const result = validateUUID('');
      expect(result.isValid).toBe(false);
    });

    test('should reject UUID with wrong number of segments', () => {
      const result = validateUUID('550e8400-e29b-41d4-a716');
      expect(result.isValid).toBe(false);
    });

    test('should reject UUID with invalid characters', () => {
      const result = validateUUID('550e8400-e29b-41d4-a716-44665544000g');
      expect(result.isValid).toBe(false);
    });

    // SECURITY CASES
    test('should reject SQL injection in UUID', () => {
      const result = validateUUID("550e8400-e29b-41d4-a716-446655440000' OR '1'='1");
      expect(result.isValid).toBe(false);
    });
  });

  // ============= ENUM VALIDATION TESTS =============
  describe('validateEnum', () => {
    // HAPPY PATH
    test('should accept valid enum value', () => {
      const result = validateEnum('admin', ['admin', 'doctor', 'pet-owner']);
      expect(result.isValid).toBe(true);
    });

    test('should accept multiple valid enums', () => {
      ['admin', 'doctor', 'pet-owner'].forEach(role => {
        const result = validateEnum(role, ['admin', 'doctor', 'pet-owner']);
        expect(result.isValid).toBe(true);
      });
    });

    // BOUNDARY CASES
    test('should reject invalid enum value', () => {
      const result = validateEnum('superadmin', ['admin', 'doctor', 'pet-owner']);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be one of');
    });

    test('should reject empty enum value', () => {
      const result = validateEnum('', ['admin', 'doctor']);
      expect(result.isValid).toBe(false);
    });

    test('should be case-sensitive', () => {
      const result = validateEnum('ADMIN', ['admin', 'doctor']);
      expect(result.isValid).toBe(false);
    });

    // SECURITY CASES
    test('should reject SQL injection in enum', () => {
      const result = validateEnum("admin' OR '1'='1", ['admin', 'doctor']);
      expect(result.isValid).toBe(false);
    });

    test('should reject XSS attempt in enum', () => {
      const result = validateEnum('<script>alert(1)</script>', ['admin', 'doctor']);
      expect(result.isValid).toBe(false);
    });
  });

  // ============= TEXT FIELD VALIDATION TESTS =============
  describe('validateTextField', () => {
    // HAPPY PATH
    test('should accept valid text field', () => {
      const result = validateTextField('Valid text', 'Test field');
      expect(result.isValid).toBe(true);
    });

    test('should accept text with custom min/max', () => {
      const result = validateTextField('hello world', 'Description', 5, 20);
      expect(result.isValid).toBe(true);
    });

    // BOUNDARY CASES
    test('should reject text shorter than minLength', () => {
      const result = validateTextField('ab', 'Test', 3, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 3');
    });

    test('should reject text longer than maxLength', () => {
      const result = validateTextField('a'.repeat(101), 'Test', 3, 100);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not exceed 100');
    });

    test('should reject empty text field', () => {
      const result = validateTextField('', 'Test');
      expect(result.isValid).toBe(false);
    });

    // SECURITY CASES
    test('should reject SQL injection in text field', () => {
      const result = validateTextField("'; DROP TABLE users;--", 'Description', 1, 500);
      expect(result.isValid).toBe(false);
    });

    test('should reject XSS in text field', () => {
      const result = validateTextField('<img src=x onerror="alert(1)">', 'Description', 1, 500);
      expect(result.isValid).toBe(false);
    });
  });

});