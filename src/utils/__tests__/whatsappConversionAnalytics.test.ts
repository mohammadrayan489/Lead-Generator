import { describe, it, expect } from 'vitest';
import { calculateWhatsAppConversionAnalytics } from '../whatsappConversionAnalytics';
import { Lead } from '../../types/lead';

describe('whatsappConversionAnalytics', () => {
  const mockLeads: Lead[] = [
    {
      id: 'lead_1',
      name: 'Gulmarg Ski & Resort Club',
      category: 'Hospitality',
      location: { city: 'Gulmarg' },
      website: { hasWebsite: false, status: 'none' },
      social: { hasStrongSocialPresence: true },
      status: 'qualified',
      isStarred: true,
      hasBeenPitched: true,
      qualificationScore: 90,
      qualificationReasons: ['No website'],
      opportunity: { hasHighPotential: true, opportunityType: 'needs_website', summary: 'High potential' },
      pitches: [{ id: 'p1', message: 'Pitch 1', generatedAt: '2026-09-18T10:00:00Z' }],
      userId: 'user_1',
      createdAt: '2026-09-18T10:00:00Z',
      updatedAt: '2026-09-18T10:00:00Z',
    },
    {
      id: 'lead_2',
      name: 'Pashmina House Srinagar',
      category: 'Handicrafts',
      location: { city: 'Srinagar' },
      website: { hasWebsite: false, status: 'none' },
      social: { hasStrongSocialPresence: true },
      status: 'contacted',
      isStarred: true,
      hasBeenPitched: true,
      qualificationScore: 82,
      qualificationReasons: ['Active Instagram'],
      opportunity: { hasHighPotential: true, opportunityType: 'needs_website', summary: 'Export opportunity' },
      pitches: [{ id: 'p2', message: 'Pitch 2', generatedAt: '2026-09-19T10:00:00Z' }],
      userId: 'user_1',
      createdAt: '2026-09-19T10:00:00Z',
      updatedAt: '2026-09-19T10:00:00Z',
    },
  ];

  it('calculates weekly conversion data for default 8 weeks', () => {
    const analytics = calculateWhatsAppConversionAnalytics(mockLeads, 8);
    expect(analytics.weeklyTrend.length).toBe(8);
    expect(analytics.totalSent).toBeGreaterThan(0);
    expect(analytics.overallConversionRate).toBeGreaterThan(0);
    expect(analytics.overallResponseRate).toBeGreaterThan(0);
    expect(analytics.estimatedPipelineValueINR).toBeGreaterThan(0);
  });

  it('calculates for 4 and 12 week timeframes', () => {
    const analytics4 = calculateWhatsAppConversionAnalytics(mockLeads, 4);
    expect(analytics4.weeklyTrend.length).toBe(4);

    const analytics12 = calculateWhatsAppConversionAnalytics(mockLeads, 12);
    expect(analytics12.weeklyTrend.length).toBe(12);
  });

  it('calculates niche-specific stats and top converting niche', () => {
    const analytics = calculateWhatsAppConversionAnalytics(mockLeads, 8);
    expect(analytics.nicheStats.length).toBeGreaterThan(0);
    expect(analytics.topConvertingNiche).toBeDefined();
    expect(analytics.topConvertingNiche?.conversionRate).toBeGreaterThan(0);
  });

  it('handles empty lead list safely without errors', () => {
    const analytics = calculateWhatsAppConversionAnalytics([], 8);
    expect(analytics.weeklyTrend.length).toBe(8);
    expect(analytics.totalSent).toBeGreaterThan(0);
  });
});
