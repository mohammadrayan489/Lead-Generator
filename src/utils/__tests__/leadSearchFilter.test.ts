import { describe, it, expect } from 'vitest';
import { filterLeadsBySearch } from '../leadSearchFilter';
import { Lead } from '../../types/lead';

describe('filterLeadsBySearch', () => {
  const mockLeads: Lead[] = [
    {
      id: 'lead-1',
      name: 'Dal Lake Crafts & Emporium',
      category: 'Handicrafts & Souvenirs',
      location: { city: 'Srinagar', state: 'J&K', country: 'India' },
      website: { hasWebsite: false, status: 'none' },
      social: {
        hasStrongSocialPresence: true,
        instagram: { handle: 'dallakecrafts', followersCount: 15400 },
      },
      phone: '+91 99060 11223',
      status: 'discovered',
      qualificationScore: 85,
      qualificationReasons: ['No website', 'Strong Instagram engagement'],
      opportunity: {
        hasHighPotential: true,
        opportunityType: 'needs_website',
        summary: 'High potential for online catalog',
      },
      pitches: [],
      notes: 'Spoke with founder Farooq about walnut wood carving exports.',
      userId: 'test_user',
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T00:00:00Z',
    },
    {
      id: 'lead-2',
      name: 'Poshkaar Couture',
      category: 'Fashion & Handcrafted Couture',
      location: { city: 'Srinagar', state: 'J&K', country: 'India' },
      website: { hasWebsite: false, status: 'none' },
      social: {
        hasStrongSocialPresence: true,
        instagram: { handle: 'poshkaarkashmir', followersCount: 45000 },
      },
      phone: '+91 94190 18273',
      status: 'qualified',
      qualificationScore: 92,
      qualificationReasons: ['45k followers', 'No ecommerce store'],
      opportunity: {
        hasHighPotential: true,
        opportunityType: 'needs_website',
        summary: 'Bespoke velvet and tilla couture ready for Shopify store',
      },
      pitches: [],
      notes: 'Interested in digital WhatsApp catalog.',
      userId: 'test_user',
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T00:00:00Z',
    },
    {
      id: 'lead-3',
      name: 'Himalayan Roast Cafe',
      category: 'Specialty Coffee',
      location: { city: 'Leh', state: 'Ladakh', country: 'India' },
      website: { hasWebsite: true, status: 'active', url: 'https://himalayanroast.in' },
      social: {
        hasStrongSocialPresence: false,
      },
      phone: '+91 98110 33445',
      status: 'new',
      qualificationScore: 45,
      qualificationReasons: [],
      opportunity: {
        hasHighPotential: false,
        opportunityType: 'general',
        summary: 'Already has functional website',
      },
      pitches: [],
      userId: 'test_user',
      createdAt: '2026-09-19T00:00:00Z',
      updatedAt: '2026-09-19T00:00:00Z',
    },
  ];

  it('returns all leads when search query is empty or whitespace', () => {
    expect(filterLeadsBySearch(mockLeads, '')).toHaveLength(3);
    expect(filterLeadsBySearch(mockLeads, '   ')).toHaveLength(3);
  });

  it('filters leads in real-time by business name case-insensitively', () => {
    const results = filterLeadsBySearch(mockLeads, 'poshkaar');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Poshkaar Couture');
  });

  it('filters leads by partial name substring', () => {
    const results = filterLeadsBySearch(mockLeads, 'Emporium');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Dal Lake Crafts & Emporium');
  });

  it('filters leads when company name is provided in an explicit company/companyName property', () => {
    const customLeads = [
      ...mockLeads,
      {
        ...mockLeads[0],
        id: 'lead-4',
        name: 'Tariq Ahmad',
        companyName: 'Chinar Woodcrafts Ltd',
      } as any,
    ];
    const results = filterLeadsBySearch(customLeads, 'Chinar');
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('lead-4');
  });

  it('returns empty array when search query matches no lead name or details', () => {
    const results = filterLeadsBySearch(mockLeads, 'non-existent-company-xyz');
    expect(results).toHaveLength(0);
  });

  it('matches city, category, or notes if query is broader', () => {
    const srinagarLeads = filterLeadsBySearch(mockLeads, 'Srinagar');
    expect(srinagarLeads).toHaveLength(2);

    const coffeeLeads = filterLeadsBySearch(mockLeads, 'Coffee');
    expect(coffeeLeads).toHaveLength(1);
    expect(coffeeLeads[0].name).toBe('Himalayan Roast Cafe');
  });
});
