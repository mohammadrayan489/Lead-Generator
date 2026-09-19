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
 */
export function extractInstagramHandle(input?: string): string {
  if (!input) return '';
  let cleaned = input.trim();
  // Remove trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  // Match instagram.com/handle
  const match = cleaned.match(/(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9._]+)/i);
  if (match && match[1]) {
    return match[1].replace('@', '');
  }
  return cleaned.replace('@', '');
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
