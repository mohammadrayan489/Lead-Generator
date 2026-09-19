import { describe, it, expect } from 'vitest';
import { calculateLeadQualification } from '../qualificationScore';
import { Lead, QueryIntent } from '../../types/lead';

describe('qualificationScore utility', () => {
  it('awards high score for business with no website and active Instagram', () => {
    const lead: Partial<Lead> = {
      name: 'Valley Couture',
      website: { hasWebsite: false, status: 'none' },
      social: {
        hasStrongSocialPresence: true,
        instagram: { handle: 'valleycouture', followersCount: 5200 },
      },
      phone: '+91 9876543210',
    };

    const intent: QueryIntent = {
      originalQuery: 'Find fashion in Srinagar with no website and strong Instagram',
      businessCategory: 'Fashion',
      targetLocation: 'Srinagar',
      targetCount: 50,
      filters: { noWebsite: true, strongSocialPresence: true },
    };

    const result = calculateLeadQualification(lead, intent);
    // Score should be high (40 for no website + 30 for social + 20 for phone + intent bonuses capped at 100)
    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.isQualified).toBe(true);
    expect(result.opportunity.opportunityType).toBe('needs_website');
    expect(result.opportunity.hasHighPotential).toBe(true);
  });

  it('classifies business with website but low social traction as social_growth', () => {
    const lead: Partial<Lead> = {
      name: 'Heritage Shawls Store',
      website: { hasWebsite: true, url: 'https://heritageshawls.com', status: 'active' },
      social: { hasStrongSocialPresence: false },
    };

    const result = calculateLeadQualification(lead);
    expect(result.opportunity.opportunityType).toBe('social_growth');
  });

  it('classifies business with both website and strong social as ecommerce_expansion', () => {
    const lead: Partial<Lead> = {
      name: 'Global Wool Exports',
      website: { hasWebsite: true, url: 'https://globalwools.com', status: 'active' },
      social: {
        hasStrongSocialPresence: true,
        instagram: { followersCount: 15000 },
      },
      phone: '+91 99999 88888',
    };

    const result = calculateLeadQualification(lead);
    expect(result.opportunity.opportunityType).toBe('ecommerce_expansion');
  });

  it('keeps score strictly bounded between 0 and 100', () => {
    const minLead: Partial<Lead> = {};
    const maxLead: Partial<Lead> = {
      website: { hasWebsite: false, status: 'none' },
      social: { hasStrongSocialPresence: true, instagram: { followersCount: 100000 } },
      phone: '+91 1234567890',
    };
    const intent: QueryIntent = {
      originalQuery: 'Test query',
      businessCategory: 'Test',
      targetLocation: 'City',
      targetCount: 10,
      filters: { noWebsite: true, strongSocialPresence: true },
    };

    const minResult = calculateLeadQualification(minLead);
    const maxResult = calculateLeadQualification(maxLead, intent);

    expect(minResult.score).toBeGreaterThanOrEqual(0);
    expect(maxResult.score).toBeLessThanOrEqual(100);
  });
});
