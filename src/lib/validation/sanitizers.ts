/**
 * Sanitize string input - remove potentially dangerous characters
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .slice(0, 1000) // limit length
    .replace(/[<>\"']/g, ''); // remove HTML special chars
}

/**
 * Sanitize email - lowercase and trim
 */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254);
}

/**
 * Sanitize name - remove extra spaces
 */
export function sanitizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').slice(0, 100);
}