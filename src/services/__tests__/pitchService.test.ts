import { describe, it, expect } from 'vitest';
import { generateWhatsAppPitch } from '../pitchService';
import { Lead } from '../../types/lead';

describe('pitchService', () => {
  const baseLead: Lead = {
    id: 'lead_test_1',
    name: 'Srinagar Silks',
    category: 'Fashion',
    location: { city: 'Srinagar' },
    website: { hasWebsite: false, status: 'none' },
    social: {
      hasStrongSocialPresence: true,
      instagram: { handle: 'srinagarsilks' },
    },
    phone: '+91 9876543210',
    status: 'qualified',
    qualificationScore: 85,
    qualificationReasons: ['No website detected'],
    opportunity: {
      hasHighPotential: true,
      opportunityType: 'needs_website',
      summary: 'Needs website for direct orders',
    },
    pitches: [],
    userId: 'user_test',
    createdAt: '2026-09-19T00:00:00Z',
    updatedAt: '2026-09-19T00:00:00Z',
  };

  it('generates a personalized WhatsApp pitch addressing the business and location', () => {
    const pitch = generateWhatsAppPitch(baseLead);
    expect(pitch.message).toContain('Srinagar Silks');
    expect(pitch.message).toContain('Srinagar');
    expect(pitch.message).toContain('@srinagarsilks');
    expect(pitch.message).toContain('website');
    expect(pitch.message).toContain('I am a new freelancer');
    expect(pitch.message).toContain('Can I send you the preview?');
    expect(pitch.message.toLowerCase()).not.toContain('video');
    expect(pitch.recipientPhone).toBe('+91 9876543210');
  });

  it('tailors messaging when opportunity is social_growth', () => {
    const lead: Lead = {
      ...baseLead,
      opportunity: {
        hasHighPotential: true,
        opportunityType: 'social_growth',
        summary: 'Website exists, needs social expansion',
      },
    };

    const pitch = generateWhatsAppPitch(lead);
    expect(pitch.message).toContain('Instagram');
    expect(pitch.message).toContain('I am a new freelancer');
    expect(pitch.message).toContain('Can I send you the preview?');
    expect(pitch.message.toLowerCase()).not.toContain('video');
  });

  it('tailors messaging when opportunity is ecommerce_expansion', () => {
    const lead: Lead = {
      ...baseLead,
      opportunity: {
        hasHighPotential: true,
        opportunityType: 'ecommerce_expansion',
        summary: 'Website exists, needs WhatsApp store upgrade',
      },
    };

    const pitch = generateWhatsAppPitch(lead);
    expect(pitch.message).toContain('I am a new freelancer');
    expect(pitch.message).toContain('Can I send you the preview?');
    expect(pitch.message.toLowerCase()).not.toContain('video');
  });

  it('tailors messaging for default opportunity', () => {
    const lead: Lead = {
      ...baseLead,
      opportunity: {
        hasHighPotential: false,
        opportunityType: 'general' as any,
        summary: 'General outreach',
      },
    };

    const pitch = generateWhatsAppPitch(lead);
    expect(pitch.message).toContain('I am a new freelancer');
    expect(pitch.message).toContain('Can I send you the preview?');
    expect(pitch.message.toLowerCase()).not.toContain('video');
  });
});
