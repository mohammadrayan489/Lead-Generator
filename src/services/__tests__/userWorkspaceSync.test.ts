import { describe, it, expect, beforeEach } from 'vitest';
import { leadService } from '../leadService';
import { Lead } from '../../types/lead';

describe('userWorkspaceSync and Supabase lead isolation', () => {
  beforeEach(async () => {
    // Clear storage before tests
    await leadService.deleteAllLeads('test_user_alpha', true);
  });

  it('correctly associates generated leads with active user and clears by user or all', async () => {
    const userA = 'user_alpha_' + Date.now();
    const userB = 'user_beta_' + Date.now();

    const sampleLeadA: Lead = {
      id: `lead_a_${Date.now()}`,
      userId: userA,
      name: 'Alpha Kashmiri Shawls',
      category: 'Handicrafts',
      location: { city: 'Srinagar', state: 'Jammu & Kashmir', country: 'India' },
      phone: '+91 9419011111',
      website: { hasWebsite: false, status: 'none' },
      social: { hasStrongSocialPresence: true },
      status: 'qualified',
      qualificationScore: 90,
      qualificationReasons: ['No website', 'High engagement'],
      opportunity: {
        hasHighPotential: true,
        opportunityType: 'needs_website',
        summary: 'No website present',
      },
      pitches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sampleLeadB: Lead = {
      id: `lead_b_${Date.now()}`,
      userId: userB,
      name: 'Beta Valley Dry Fruits',
      category: 'Dry Fruits',
      location: { city: 'Jammu', state: 'Jammu & Kashmir', country: 'India' },
      phone: '+91 9419022222',
      website: { hasWebsite: false, status: 'none' },
      social: { hasStrongSocialPresence: true },
      status: 'qualified',
      qualificationScore: 85,
      qualificationReasons: ['No online catalog'],
      opportunity: {
        hasHighPotential: true,
        opportunityType: 'needs_website',
        summary: 'Expanding market',
      },
      pitches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save leads for both users
    await leadService.batchSaveLeads([sampleLeadA, sampleLeadB]);

    // Fetch leads for userA
    const leadsA = await leadService.getAllLeads(userA);
    expect(leadsA.some((l) => l.name === 'Alpha Kashmiri Shawls')).toBe(true);

    // Fetch leads for userB
    const leadsB = await leadService.getAllLeads(userB);
    expect(leadsB.some((l) => l.name === 'Beta Valley Dry Fruits')).toBe(true);

    // Clear userA leads
    await leadService.deleteAllLeads(userA, false);
    const leadsAfterClearA = await leadService.getAllLeads(userA);
    expect(leadsAfterClearA.length).toBe(0);

    // userB leads should still be intact
    const leadsAfterClearB = await leadService.getAllLeads(userB);
    expect(leadsAfterClearB.some((l) => l.name === 'Beta Valley Dry Fruits')).toBe(true);

    // Now purge all
    await leadService.deleteAllLeads(undefined, true);
    const leadsAfterPurgeB = await leadService.getAllLeads(userB);
    expect(leadsAfterPurgeB.length).toBe(0);
  });
});
