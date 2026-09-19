import { describe, it, expect } from 'vitest';
import {
  normalizeBusinessName,
  getLeadFingerprints,
  mergeLeads,
  deduplicateLeads,
  filterOutExistingLeads,
} from '../deduplicateLeads';
import { Lead } from '../../types/lead';

const mockLead = (overrides: Partial<Lead>): Lead => ({
  id: 'lead_1',
  name: 'Kashmir Silks',
  category: 'Fashion',
  location: { city: 'Srinagar' },
  website: { hasWebsite: false, status: 'none' },
  social: { hasStrongSocialPresence: true },
  status: 'discovered',
  qualificationScore: 70,
  qualificationReasons: ['No website'],
  opportunity: {
    hasHighPotential: true,
    opportunityType: 'needs_website',
    summary: 'Needs website',
  },
  pitches: [],
  userId: 'user_1',
  createdAt: '2026-09-19T00:00:00Z',
  updatedAt: '2026-09-19T00:00:00Z',
  ...overrides,
});

describe('deduplicateLeads utility', () => {
  describe('normalizeBusinessName', () => {
    it('lowercases and removes special characters and extra spaces', () => {
      expect(normalizeBusinessName('Kashmir  Silks & Co.')).toBe('kashmir silks co');
      expect(normalizeBusinessName('THE FASHION HUB!!!')).toBe('the fashion hub');
    });
  });

  describe('getLeadFingerprints', () => {
    it('generates fingerprints for name, city, phone, and instagram', () => {
      const lead = mockLead({
        name: 'Dal Lake Crafts',
        location: { city: 'Srinagar' },
        phone: '+91 9876543210',
        social: {
          hasStrongSocialPresence: true,
          instagram: { handle: 'dallakecrafts' },
        },
      });

      const fingerprints = getLeadFingerprints(lead);
      expect(fingerprints).toContain('name_city:dal lake crafts__srinagar');
      expect(fingerprints).toContain('phone:919876543210');
      expect(fingerprints).toContain('ig:dallakecrafts');
    });
  });

  describe('mergeLeads', () => {
    it('combines missing attributes from incoming lead', () => {
      const leadA = mockLead({
        id: 'lead_a',
        name: 'Chinar Wear',
        phone: '+91 99999 11111',
        email: undefined,
      });

      const leadB = mockLead({
        id: 'lead_b',
        name: 'Chinar Wear',
        phone: undefined,
        email: 'info@chinarwear.com',
        description: 'Traditional woolens',
      });

      const merged = mergeLeads(leadA, leadB);
      expect(merged.id).toBe('lead_a');
      expect(merged.phone).toBe('+91 99999 11111');
      expect(merged.email).toBe('info@chinarwear.com');
      expect(merged.description).toBe('Traditional woolens');
    });
  });

  describe('deduplicateLeads', () => {
    it('removes duplicate leads with identical business names and cities', () => {
      const lead1 = mockLead({ id: '1', name: 'Zabarwan Trends', location: { city: 'Srinagar' } });
      const lead2 = mockLead({ id: '2', name: 'Zabarwan Trends', location: { city: 'Srinagar' } });
      const lead3 = mockLead({ id: '3', name: 'Different Boutique', location: { city: 'Srinagar' } });

      const unique = deduplicateLeads([lead1, lead2, lead3]);
      expect(unique.length).toBe(2);
      expect(unique.map((l) => l.name)).toEqual(['Zabarwan Trends', 'Different Boutique']);
    });

    it('identifies duplicate leads matching the same Instagram handle', () => {
      const lead1 = mockLead({
        id: '1',
        name: 'Kashmir Loom Studio',
        social: { hasStrongSocialPresence: true, instagram: { handle: 'kashmirloom' } },
      });
      const lead2 = mockLead({
        id: '2',
        name: 'The Kashmir Loom',
        social: { hasStrongSocialPresence: true, instagram: { handle: 'kashmirloom' } },
      });

      const unique = deduplicateLeads([lead1, lead2]);
      expect(unique.length).toBe(1);
    });
  });

  describe('filterOutExistingLeads', () => {
    it('filters out candidates matching existing database leads by name or handle', () => {
      const existing = [
        mockLead({ id: 'ex1', name: 'Poshkaar Kashmir', social: { hasStrongSocialPresence: true, instagram: { handle: 'poshkaarkashmir' } } }),
        mockLead({ id: 'ex2', name: 'Zari Poshak Handcrafted Tilla', phone: '+919797089123' }),
      ];

      const candidates = [
        mockLead({ id: 'c1', name: 'Poshkaar Kashmir', social: { hasStrongSocialPresence: true, instagram: { handle: 'poshkaarkashmir' } } }),
        mockLead({ id: 'c2', name: 'Brand New Kashmir Boutique', social: { hasStrongSocialPresence: true, instagram: { handle: 'newboutique' } } }),
        mockLead({ id: 'c3', name: 'Another Shop', phone: '+919797089123' }),
        mockLead({ id: 'c4', name: 'Unique Kashmiri Atelier', social: { hasStrongSocialPresence: true, instagram: { handle: 'uniqueatelier' } } }),
      ];

      const filtered = filterOutExistingLeads(candidates, existing);
      expect(filtered.length).toBe(2);
      expect(filtered.map((l) => l.name)).toEqual([
        'Brand New Kashmir Boutique',
        'Unique Kashmiri Atelier',
      ]);
    });
  });
});
