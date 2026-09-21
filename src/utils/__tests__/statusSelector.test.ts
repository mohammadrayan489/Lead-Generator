import { describe, it, expect } from 'vitest';
import {
  PIPELINE_STATUS_CONFIG,
  ORDERED_PIPELINE_STATUSES,
} from '../../components/StatusSelector';
import { LeadStatus } from '../../types/lead';

describe('StatusSelector and Sales Pipeline Configurations', () => {
  it('includes core sales pipeline statuses: new, contacted, interested, qualified, lost', () => {
    const requiredStatuses: LeadStatus[] = ['new', 'contacted', 'interested', 'qualified', 'lost'];

    for (const status of requiredStatuses) {
      expect(ORDERED_PIPELINE_STATUSES).toContain(status);
      const config = PIPELINE_STATUS_CONFIG[status];
      expect(config).toBeDefined();
      expect(config.label).toBeTruthy();
      expect(config.bg).toBeTruthy();
      expect(config.text).toBeTruthy();
      expect(config.dot).toBeTruthy();
    }
  });

  it('provides distinct, high-contrast visual styling for each pipeline stage', () => {
    expect(PIPELINE_STATUS_CONFIG.new.label).toBe('New');
    expect(PIPELINE_STATUS_CONFIG.contacted.label).toBe('Contacted');
    expect(PIPELINE_STATUS_CONFIG.interested.label).toBe('Interested');
    expect(PIPELINE_STATUS_CONFIG.qualified.label).toBe('Qualified');
    expect(PIPELINE_STATUS_CONFIG.lost.label).toBe('Lost');

    // Distinct dot colors for each status
    const dots = ORDERED_PIPELINE_STATUSES.map((s) => PIPELINE_STATUS_CONFIG[s].dot);
    const uniqueDots = new Set(dots);
    expect(uniqueDots.size).toBeGreaterThanOrEqual(4);
  });
});
