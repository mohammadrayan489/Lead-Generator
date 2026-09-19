import { describe, it, expect } from 'vitest';
import { Lead } from '../../types/lead';

describe('Lead notes & follow-up filtering', () => {
  const mockLeads: Lead[] = [
    {
      id: '1',
      name: 'Artisan Bakery',
      category: 'Bakery',
      location: { city: 'Mumbai' },
      website: { hasWebsite: false, status: 'none' },
      social: { hasStrongSocialPresence: true },
      status: 'discovered',
      qualificationScore: 85,
      qualificationReasons: ['No website detected'],
      opportunity: {
        hasHighPotential: true,
        opportunityType: 'needs_website',
        summary: 'Needs catalog site',
      },
      pitches: [],
      notes: 'Spoke with founder Raj. Follow up Tuesday afternoon regarding custom bakery menu catalog.',
      followUpDate: '2026-09-22',
      userId: 'test-user',
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T00:00:00Z',
    },
    {
      id: '2',
      name: 'Bloom Floral Boutique',
      category: 'Florist',
      location: { city: 'Delhi' },
      website: { hasWebsite: true, status: 'active', url: 'bloomflowers.com' },
      social: { hasStrongSocialPresence: false },
      status: 'contacted',
      qualificationScore: 40,
      qualificationReasons: [],
      opportunity: {
        hasHighPotential: false,
        opportunityType: 'general',
        summary: 'Digital presence update',
      },
      pitches: [],
      userId: 'test-user',
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T00:00:00Z',
    },
  ];

  it('filters leads by conversation details in notes', () => {
    const query = 'bakery menu';
    const matches = mockLeads.filter((lead) =>
      lead.notes?.toLowerCase().includes(query.toLowerCase())
    );
    expect(matches).toHaveLength(1);
    expect(matches[0].name).toBe('Artisan Bakery');
  });

  it('filters leads by follow-up reminder keywords in notes', () => {
    const query = 'raj';
    const matches = mockLeads.filter((lead) =>
      lead.notes?.toLowerCase().includes(query.toLowerCase())
    );
    expect(matches).toHaveLength(1);
    expect(matches[0].id).toBe('1');
  });

  it('returns empty array when query does not match any notes', () => {
    const query = 'nonexistent conversation notes';
    const matches = mockLeads.filter((lead) =>
      lead.notes?.toLowerCase().includes(query.toLowerCase())
    );
    expect(matches).toHaveLength(0);
  });
});
