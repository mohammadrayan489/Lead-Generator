import { describe, it, expect } from 'vitest';
import {
  buildKashmirIndustryQuery,
  KASHMIR_REGIONAL_HUBS,
  KASHMIR_INDUSTRY_PRESETS,
  IndustryFormParams,
} from '../industryPromptBuilder';

describe('industryPromptBuilder', () => {
  it('builds a concise query with defaults', () => {
    const params: IndustryFormParams = {
      industryDescription: 'saffron and walnut growers',
      kashmirHub: 'pampore_pulwama',
      targetCount: 20,
      noWebsiteOnly: true,
      activeSocialOnly: true,
      verifiedWhatsAppOnly: true,
      valueProposition: 'WhatsApp Catalog Outreach',
    };

    const query = buildKashmirIndustryQuery(params);
    expect(query).toContain('Find 20 saffron and walnut growers');
    expect(query).toContain('Pampore & Pulwama');
    expect(query).toContain('with no official website');
    expect(query).toContain('with active Instagram social presence');
    expect(query).toContain('direct WhatsApp phone contact');
    expect(query).toContain('WhatsApp Catalog Outreach');
  });

  it('clamps lead count between 1 and 100', () => {
    const queryTooHigh = buildKashmirIndustryQuery({
      industryDescription: 'gyms',
      kashmirHub: 'srinagar',
      targetCount: 500,
      noWebsiteOnly: false,
      activeSocialOnly: false,
      verifiedWhatsAppOnly: false,
    });
    expect(queryTooHigh).toContain('Find 100 gyms');

    const queryTooLow = buildKashmirIndustryQuery({
      industryDescription: 'gyms',
      kashmirHub: 'srinagar',
      targetCount: -5,
      noWebsiteOnly: false,
      activeSocialOnly: false,
      verifiedWhatsAppOnly: false,
    });
    expect(queryTooLow).toContain('Find 1 gyms');
  });

  it('handles All Kashmir commercial hubs gracefully', () => {
    const query = buildKashmirIndustryQuery({
      industryDescription: 'boutique houseboats',
      kashmirHub: 'all_kashmir',
      targetCount: 15,
      noWebsiteOnly: false,
      activeSocialOnly: false,
      verifiedWhatsAppOnly: true,
    });
    expect(query).toContain('Srinagar and Kashmir Valley');
    expect(query).toContain('direct WhatsApp phone contact');
  });

  it('has comprehensive regional hubs and industry presets', () => {
    expect(KASHMIR_REGIONAL_HUBS.length).toBeGreaterThanOrEqual(10);
    expect(KASHMIR_INDUSTRY_PRESETS.length).toBeGreaterThanOrEqual(8);
  });
});
