import { describe, it, expect } from 'vitest';
import { normalizeJKCity, generateDiverseLeadCandidates } from '../leadGeneratorPool';
import { LeadPipelineService } from '../leadPipelineService';

describe('Jammu & Kashmir Lead Specialization', () => {
  describe('normalizeJKCity', () => {
    it('accurately normalizes recognizable J&K districts and towns', () => {
      expect(normalizeJKCity('Srinagar')).toBe('Srinagar');
      expect(normalizeJKCity('in Jammu')).toBe('Jammu');
      expect(normalizeJKCity('Anantnag')).toBe('Anantnag');
      expect(normalizeJKCity('Baramulla')).toBe('Baramulla');
      expect(normalizeJKCity('Pampore saffron market')).toBe('Pampore');
      expect(normalizeJKCity('Pulwama')).toBe('Pulwama');
      expect(normalizeJKCity('Gulmarg ski resorts')).toBe('Gulmarg');
      expect(normalizeJKCity('Pahalgam hotels')).toBe('Pahalgam');
      expect(normalizeJKCity('Sopore')).toBe('Sopore');
      expect(normalizeJKCity('Budgam')).toBe('Budgam');
      expect(normalizeJKCity('Udhampur')).toBe('Udhampur');
      expect(normalizeJKCity('Kathua')).toBe('Kathua');
    });

    it('defaults unspecified or non-J&K locations safely to Srinagar', () => {
      expect(normalizeJKCity('')).toBe('Srinagar');
      expect(normalizeJKCity(undefined)).toBe('Srinagar');
      expect(normalizeJKCity('Mumbai')).toBe('Srinagar');
      expect(normalizeJKCity('Delhi')).toBe('Srinagar');
      expect(normalizeJKCity('Texas')).toBe('Srinagar');
    });
  });

  describe('generateDiverseLeadCandidates for J&K', () => {
    it('generates leads strictly with J&K cities, addresses, and phone numbers', () => {
      const candidates = generateDiverseLeadCandidates(
        {
          originalQuery: 'Find bridal boutiques in Srinagar without website',
          businessCategory: 'Bridal & Fashion',
          targetLocation: 'Srinagar',
          targetCount: 10,
          filters: { noWebsite: true, strongSocialPresence: true },
        },
        10
      );

      expect(candidates.length).toBe(10);
      for (const candidate of candidates) {
        expect(['Srinagar', 'Jammu', 'Anantnag', 'Pampore', 'Pulwama', 'Baramulla']).toContain(candidate.city);
        expect(candidate.phone).toMatch(/^\+91/);
        expect(candidate.instagramHandle).toBeTruthy();
        expect(candidate.hasWebsite).toBe(false);
      }
    });

    it('generates genuine J&K handicrafts and walnut woodcraft leads', () => {
      const candidates = generateDiverseLeadCandidates(
        {
          originalQuery: 'Find 8 walnut wood carving artisans in Downtown Srinagar',
          businessCategory: 'Handicrafts & Walnut Wood',
          targetLocation: 'Srinagar',
          targetCount: 8,
          filters: { noWebsite: true, strongSocialPresence: true },
        },
        8
      );

      expect(candidates.length).toBe(8);
      const names = candidates.map((c) => c.name);
      // Ensures authentic Kashmiri artisan entities are represented
      expect(names.some((n) => /wood|artisan|carv|craft|chinar|noor|guild/i.test(n))).toBe(true);
    });

    it('generates genuine J&K cafes and dining leads', () => {
      const candidates = generateDiverseLeadCandidates(
        {
          originalQuery: 'Find cafes in Srinagar and Jammu with active Instagram and no menu',
          businessCategory: 'Cafes & Dining',
          targetLocation: 'Srinagar',
          targetCount: 6,
          filters: { noWebsite: true, strongSocialPresence: true },
        },
        6
      );

      expect(candidates.length).toBe(6);
      for (const candidate of candidates) {
        expect(['Srinagar', 'Jammu']).toContain(candidate.city);
      }
    });
  });

  describe('LeadPipelineService query intent parser for J&K', () => {
    const pipeline = new LeadPipelineService();

    it('anchors query targets to Jammu & Kashmir even for free-form queries', async () => {
      const intentSrinagar = await pipeline.parseQueryIntent('Find 20 fashion boutiques in Srinagar without website');
      expect(intentSrinagar.targetLocation).toContain('Jammu & Kashmir');
      expect(intentSrinagar.targetLocation).toContain('Srinagar');

      const intentJammu = await pipeline.parseQueryIntent('Find 30 jewellery shops in Jammu with Instagram');
      expect(intentJammu.targetLocation).toContain('Jammu & Kashmir');
      expect(intentJammu.targetLocation).toContain('Jammu');

      const intentGeneric = await pipeline.parseQueryIntent('Find 15 cafes with active social media');
      expect(intentGeneric.targetLocation).toContain('Jammu & Kashmir');
    });
  });
});
