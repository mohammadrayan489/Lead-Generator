import { describe, it, expect } from 'vitest';
import { ORDERED_PIPELINE_STATUSES, PIPELINE_STATUS_CONFIG } from '../../components/StatusSelector';
import { STAGE_DEFINITIONS, getLeadOutreachStage } from '../nicheClassifier';
import { Lead } from '../../types/lead';

describe('Lead Status Tracker & Pipeline Integration', () => {
  it('correctly orders pipeline statuses including new, contacted, interested, qualified, lost', () => {
    expect(ORDERED_PIPELINE_STATUSES).toEqual([
      'new',
      'contacted',
      'interested',
      'qualified',
      'lost',
      'discovered',
      'unqualified',
    ]);
  });

  it('defines distinct metadata for interested status', () => {
    const interestedConfig = PIPELINE_STATUS_CONFIG.interested;
    expect(interestedConfig).toBeDefined();
    expect(interestedConfig.label).toBe('Interested');
    expect(interestedConfig.bg).toContain('emerald');
    expect(interestedConfig.dot).toContain('emerald');
  });

  it('maps lead status to appropriate outreach stage', () => {
    const mockLead: Lead = {
      id: 'lead-test-1',
      userId: 'demo_workspace_user',
      name: 'Pashmina Crafts Srinagar',
      category: 'Handicrafts',
      phone: '+919419012345',
      status: 'interested',
      location: { city: 'Srinagar' },
      website: { hasWebsite: false, status: 'none' },
      social: { hasStrongSocialPresence: false },
      qualificationScore: 80,
      qualificationReasons: ['Prominent local craftsman'],
      opportunity: { hasHighPotential: true, opportunityType: 'needs_website', summary: 'Catalog required' },
      pitches: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(getLeadOutreachStage(mockLead)).toBe('interested');
    expect(STAGE_DEFINITIONS.interested.badgeLabel).toBe('Interested');

    // Contacted status
    mockLead.status = 'contacted';
    expect(getLeadOutreachStage(mockLead)).toBe('contacted');

    // New status
    mockLead.status = 'new';
    expect(getLeadOutreachStage(mockLead)).toBe('new');
  });
});
