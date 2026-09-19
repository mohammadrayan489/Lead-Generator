import { describe, it, expect } from 'vitest';
import { calculateLeadsStatusSummary } from '../statusBreakdown';
import { Lead } from '../../types/lead';

const createMockLead = (id: string, status: any): Lead => ({
  id,
  userId: 'demo_workspace_user',
  name: `Business ${id}`,
  category: 'Fashion Boutique',
  phone: `+91987654321${id}`,
  location: { address: 'Residency Road', city: 'Srinagar', state: 'J&K' },
  website: { hasWebsite: false, status: 'none' },
  social: { hasStrongSocialPresence: true },
  qualificationScore: 85,
  qualificationReasons: ['High sales potential'],
  status,
  opportunity: { hasHighPotential: true, opportunityType: 'needs_website', summary: 'No website' },
  pitches: [],
  createdAt: '2026-03-01T00:00:00Z',
  updatedAt: '2026-03-01T00:00:00Z',
});

describe('calculateLeadsStatusSummary', () => {
  it('correctly calculates total leads count and 0 counts for empty leads', () => {
    const summary = calculateLeadsStatusSummary([]);
    expect(summary.totalLeads).toBe(0);
    expect(summary.breakdown.length).toBeGreaterThan(0);
    summary.breakdown.forEach((item) => {
      expect(item.count).toBe(0);
      expect(item.percentage).toBe(0);
    });
  });

  it('accurately counts leads and calculates percentages for each status', () => {
    const leads: Lead[] = [
      createMockLead('1', 'new'),
      createMockLead('2', 'new'),
      createMockLead('3', 'contacted'),
      createMockLead('4', 'qualified'),
    ];

    const summary = calculateLeadsStatusSummary(leads);
    expect(summary.totalLeads).toBe(4);

    const newItem = summary.breakdown.find((b) => b.status === 'new');
    expect(newItem?.count).toBe(2);
    expect(newItem?.percentage).toBe(50);

    const contactedItem = summary.breakdown.find((b) => b.status === 'contacted');
    expect(contactedItem?.count).toBe(1);
    expect(contactedItem?.percentage).toBe(25);

    const qualifiedItem = summary.breakdown.find((b) => b.status === 'qualified');
    expect(qualifiedItem?.count).toBe(1);
    expect(qualifiedItem?.percentage).toBe(25);

    const lostItem = summary.breakdown.find((b) => b.status === 'lost');
    expect(lostItem?.count).toBe(0);
    expect(lostItem?.percentage).toBe(0);
  });

  it('includes styling metadata such as dotColor and label for each status', () => {
    const leads: Lead[] = [createMockLead('1', 'new')];
    const summary = calculateLeadsStatusSummary(leads);

    const newItem = summary.breakdown.find((b) => b.status === 'new');
    expect(newItem?.label).toBe('New');
    expect(newItem?.dotColor).toBe('bg-blue-500');
    expect(newItem?.textColor).toContain('text-blue-700');
  });
});
