/**
 * Sanitizes image URLs to ensure they're properly formatted
 */
export function sanitizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  
  // Fix common malformed URL patterns
  let sanitized = url.trim();
  
  // Fix https:https:// pattern
  sanitized = sanitized.replace(/^https:https:\/\//, 'https://');
  sanitized = sanitized.replace(/https:\/\/https:\/\//g, 'https://');
  
  // Ensure it starts with https://
  if (!sanitized.startsWith('http')) {
    if (sanitized.startsWith('//')) {
      sanitized = 'https:' + sanitized;
    } else {
      sanitized = 'https://' + sanitized;
    }
  }
  
  // Remove any triple slashes
  sanitized = sanitized.replace(/https:\/\/\//g, 'https://');
  
  return sanitized;
}

/**
 * Checks if the current month is December
 */
export function isDecember(): boolean {
  const now = new Date();
  return now.getMonth() === 11; // December is month 11 (0-indexed)
}

