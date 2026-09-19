/**
 * Formats a phone number for international WhatsApp messaging.
 * Strips spaces, dashes, parentheses, leading plus.
 */
export function cleanPhoneForWhatsApp(phone?: string): string {
  if (!phone) return '';
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  return digits;
}

/**
 * Builds a direct WhatsApp web/app link with prefilled text message.
 */
export function buildWhatsAppLink(phone?: string, text?: string): string {
  const cleanPhone = cleanPhoneForWhatsApp(phone);
  if (!cleanPhone) return '';
  const encodedText = text ? encodeURIComponent(text) : '';
  return `https://wa.me/${cleanPhone}${encodedText ? `?text=${encodedText}` : ''}`;
}

/**
 * Normalizes an Instagram username from handles (@handle) or URLs (https://instagram.com/handle).
 * Strips query parameters, trailing slashes, leading '@', and invalid characters.
 */
export function extractInstagramHandle(input?: string): string {
  if (!input) return '';
  let cleaned = input.trim();
  // Strip URL query parameters and hashes first (e.g. ?igsh=... or /?hl=en)
  cleaned = cleaned.split('?')[0].split('#')[0];
  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');

  // Match instagram.com/<username> or instagr.am/<username>
  const urlMatch = cleaned.match(/(?:https?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9._]+)/i);
  if (urlMatch && urlMatch[1]) {
    return urlMatch[1].replace(/^@+/, '').replace(/\.+$/, '');
  }

  // If user provided @username, strip leading @
  cleaned = cleaned.replace(/^@+/, '');

  // Keep only valid Instagram username characters (a-z, 0-9, ., _)
  cleaned = cleaned.replace(/[^a-zA-Z0-9._]/g, '');

  // Instagram handles cannot end with a period
  cleaned = cleaned.replace(/\.+$/, '');

  return cleaned;
}

/**
 * Builds a direct Instagram profile URL from a username or handle.
 */
export function buildInstagramProfileUrl(input?: string): string {
  const handle = extractInstagramHandle(input);
  if (!handle) return '';
  return `https://instagram.com/${handle}`;
}


/**
 * Formats a website URL by trimming and adding https:// if missing.
 */
export function normalizeWebsiteUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Formats a date string into readable relative or concise format.
 */
export function formatLeadDate(isoString?: string): string {
  if (!isoString) return 'Just now';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return 'Recently';
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return 'Recently';
  }
}

/**
 * Normalizes a string for business name comparison:
 * lowercase, stripped punctuation, single spaces.
 */
export function normalizeBusinessName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

