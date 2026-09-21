import { describe, it, expect } from 'vitest';
import { generateWhatsAppPitch } from '../pitchService';
import {
  generateKashmiriWhatsAppTemplate,
  buildWhatsAppTriggerUrl,
  getCleanWhatsAppPhone,
  KASHMIRI_TEMPLATES,
} from '../kashmiriWhatsAppTemplates';
import { Lead } from '../../types/lead';

describe('Kashmiri WhatsApp Templates & Pitch Service', () => {
  const baseLead: Lead = {
    id: 'lead_test_1',
    name: 'Srinagar Silks & Pashmina',
    category: 'Bridal & Fashion Boutique',
    location: { city: 'Srinagar', state: 'Jammu and Kashmir' },
    website: { hasWebsite: false, status: 'none' },
    social: {
      hasStrongSocialPresence: true,
      instagram: { handle: 'srinagarsilks' },
      googleMaps: {
        hasListing: true,
        rating: 4.8,
        userRatingsTotal: 124,
        verifiedOnMaps: true,
      },
    },
    phone: '+91 9419012345',
    status: 'qualified',
    qualificationScore: 85,
    qualificationReasons: ['No website detected'],
    opportunity: {
      hasHighPotential: true,
      opportunityType: 'needs_website',
      summary: 'Needs mobile catalog for direct orders',
    },
    pitches: [],
    userId: 'user_test',
    createdAt: '2026-09-19T00:00:00Z',
    updatedAt: '2026-09-19T00:00:00Z',
  };

  it('generates a personalized Kashmiri WhatsApp pitch addressing the business and location', () => {
    const pitch = generateWhatsAppPitch(baseLead);
    expect(pitch.message).toContain('Srinagar Silks & Pashmina');
    expect(pitch.message).toContain('Srinagar');
    expect(pitch.message).toContain('Assalamu Alaikum');
    expect(pitch.recipientPhone).toBe('+91 9419012345');
    expect(pitch.message.toLowerCase()).not.toContain('instagram');
  });

  it('generates respectful Kashmiri Adaab template with Google Maps trust hook', () => {
    const message = generateKashmiriWhatsAppTemplate(baseLead, 'respectful_adaab', {
      greetingStyle: 'salam_janab',
      includeGoogleRating: true,
    });
    expect(message).toContain('Assalamu Alaikum Janab');
    expect(message).toContain('4.8★ rating');
    expect(message).toContain('Srinagar Silks & Pashmina');
    expect(message).toContain('preview link');
  });

  it('generates 20-30% lost sales recovery template', () => {
    const message = generateKashmiriWhatsAppTemplate(baseLead, 'lost_sales_recovery');
    expect(message).toContain('20% to 30%');
    expect(message).toContain('Srinagar Silks & Pashmina');
    expect(message).toContain('preview link');
  });

  it('generates Kashmiri artisan & craft export trust template', () => {
    const message = generateKashmiriWhatsAppTemplate(baseLead, 'artisan_craft_export');
    expect(message).toContain('Kashmiri craftsmanship');
    expect(message).toContain('authenticity');
    expect(message).toContain('preview link');
  });

  it('generates crisp 3-liner fast read template', () => {
    const message = generateKashmiriWhatsAppTemplate(baseLead, 'concise_3liner');
    expect(message).toContain('Assalamu Alaikum');
    expect(message).toContain('Srinagar Silks & Pashmina');
    expect(message.split('\n\n').length).toBeLessThanOrEqual(4);
  });

  it('generates dining & hospitality template for Kashmiri food and stays', () => {
    const cafeLead: Lead = {
      ...baseLead,
      name: 'Chai Jaai Tea Room',
      category: 'Cafe & Tea Room',
    };
    const message = generateKashmiriWhatsAppTemplate(cafeLead, 'dining_hospitality');
    expect(message).toContain('Chai Jaai Tea Room');
    expect(message).toContain('menu');
  });

  it('builds direct WhatsApp trigger URLs for mobile and web with clean phone numbers', () => {
    const pitchText = 'Assalamu Alaikum Janab!';
    const { universalUrl, appProtocolUrl, webUrl, hasValidPhone } = buildWhatsAppTriggerUrl(
      baseLead.phone,
      pitchText
    );

    expect(hasValidPhone).toBe(true);
    expect(universalUrl).toContain('https://api.whatsapp.com/send?phone=919419012345');
    expect(universalUrl).toContain(encodeURIComponent(pitchText));
    expect(appProtocolUrl).toContain('whatsapp://send?phone=919419012345');
    expect(webUrl).toContain('https://web.whatsapp.com/send?phone=919419012345');
  });

  it('normalizes 10-digit Indian/Kashmiri phone numbers correctly', () => {
    expect(getCleanWhatsAppPhone('9419012345')).toBe('919419012345');
    expect(getCleanWhatsAppPhone('+91 94190 12345')).toBe('919419012345');
    expect(getCleanWhatsAppPhone('0194 2456789')).toBe('01942456789');
  });

  it('provides comprehensive list of Kashmiri templates', () => {
    expect(KASHMIRI_TEMPLATES.length).toBeGreaterThanOrEqual(6);
    const ids = KASHMIRI_TEMPLATES.map((t) => t.id);
    expect(ids).toContain('respectful_adaab');
    expect(ids).toContain('lost_sales_recovery');
    expect(ids).toContain('artisan_craft_export');
    expect(ids).toContain('concise_3liner');
    expect(ids).toContain('dining_hospitality');
    expect(ids).toContain('local_maps_discovery');
  });
});
