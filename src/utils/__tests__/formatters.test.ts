import { describe, it, expect } from 'vitest';
import {
  cleanPhoneForWhatsApp,
  buildWhatsAppLink,
  extractInstagramHandle,
  normalizeWebsiteUrl,
  formatLeadDate,
} from '../formatters';

describe('formatters utility', () => {
  describe('cleanPhoneForWhatsApp', () => {
    it('strips spaces, hyphens, and parentheses', () => {
      expect(cleanPhoneForWhatsApp('+1 (555) 123-4567')).toBe('15551234567');
      expect(cleanPhoneForWhatsApp('91-98765-43210')).toBe('919876543210');
    });

    it('returns empty string for undefined or empty input', () => {
      expect(cleanPhoneForWhatsApp()).toBe('');
      expect(cleanPhoneForWhatsApp('')).toBe('');
    });
  });

  describe('buildWhatsAppLink', () => {
    it('creates a wa.me link with phone and encoded message', () => {
      const link = buildWhatsAppLink('+91 98765 43210', 'Hello there! Let us talk.');
      expect(link).toBe('https://wa.me/919876543210?text=Hello%20there!%20Let%20us%20talk.');
    });

    it('creates a wa.me link without message query if no text provided', () => {
      const link = buildWhatsAppLink('+1 234 567 8900');
      expect(link).toBe('https://wa.me/12345678900');
    });

    it('returns empty string if phone number is missing', () => {
      expect(buildWhatsAppLink(undefined, 'Test')).toBe('');
    });
  });

  describe('extractInstagramHandle', () => {
    it('cleans @ prefix from handles', () => {
      expect(extractInstagramHandle('@kashmir_threads')).toBe('kashmir_threads');
    });

    it('extracts handle from full Instagram URL', () => {
      expect(extractInstagramHandle('https://www.instagram.com/srinagar_couture/')).toBe(
        'srinagar_couture'
      );
      expect(extractInstagramHandle('instagram.com/boutique_style')).toBe('boutique_style');
    });

    it('handles empty input gracefully', () => {
      expect(extractInstagramHandle('')).toBe('');
      expect(extractInstagramHandle(undefined)).toBe('');
    });
  });

  describe('normalizeWebsiteUrl', () => {
    it('adds https:// if missing', () => {
      expect(normalizeWebsiteUrl('example.com')).toBe('https://example.com');
      expect(normalizeWebsiteUrl('www.mybusiness.org')).toBe('https://www.mybusiness.org');
    });

    it('preserves existing https:// and http://', () => {
      expect(normalizeWebsiteUrl('http://example.com')).toBe('http://example.com');
      expect(normalizeWebsiteUrl('https://secure.example.com')).toBe('https://secure.example.com');
    });

    it('returns empty string for empty input', () => {
      expect(normalizeWebsiteUrl('')).toBe('');
      expect(normalizeWebsiteUrl(undefined)).toBe('');
    });
  });

  describe('formatLeadDate', () => {
    it('formats valid ISO date strings', () => {
      const formatted = formatLeadDate('2026-09-19T00:00:00Z');
      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('returns fallback for empty or invalid date', () => {
      expect(formatLeadDate(undefined)).toBe('Just now');
      expect(formatLeadDate('not-a-date')).toBe('Recently');
    });
  });
});
