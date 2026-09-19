import { describe, it, expect, beforeEach } from 'vitest';
import { leadService } from '../leadService';
import { Lead } from '../../types/lead';

describe('leadService.deleteAllLeads', () => {
  const sampleLead: Lead = {
    id: 'test_lead_clear_1',
    name: 'Dal Lake Crafts',
    category: 'Handicrafts',
    location: { city: 'Srinagar' },
    website: { hasWebsite: false, status: 'none' },
    social: { hasStrongSocialPresence: true, instagram: { handle: 'dallakecrafts' } },
    phone: '+91 9900112233',
    status: 'new',
    qualificationScore: 80,
    qualificationReasons: ['No website'],
    opportunity: {
      hasHighPotential: true,
      opportunityType: 'needs_website',
      summary: 'High potential for online catalog',
    },
    pitches: [],
    userId: 'clear_test_user',
    createdAt: '2026-09-19T00:00:00Z',
    updatedAt: '2026-09-19T00:00:00Z',
  };

  it('successfully creates leads and clears all leads for a given user', async () => {
    // Save sample lead
    await leadService.batchSaveLeads([sampleLead]);

    // Verify lead is present
    const initialLeads = await leadService.getAllLeads('clear_test_user');
    expect(initialLeads.some((l) => l.id === sampleLead.id)).toBe(true);

    // Perform clear all
    await leadService.deleteAllLeads('clear_test_user');

    // Verify lead list is now empty for this user
    const clearedLeads = await leadService.getAllLeads('clear_test_user');
    expect(clearedLeads.filter((l) => l.userId === 'clear_test_user').length).toBe(0);
  });
});
