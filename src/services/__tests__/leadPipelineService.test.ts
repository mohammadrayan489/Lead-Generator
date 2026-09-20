import { describe, it, expect } from 'vitest';
import {
  leadPipeline,
  providerRegistry,
  SearchSourceProvider,
} from '../leadPipelineService';
import { QueryIntent, Lead } from '../../types/lead';

describe('leadPipelineService', () => {
  it('parses natural language query via heuristic fallback when API is offline', async () => {
    const query =
      'Find 50 fashion businesses in Srinagar with strong Instagram presence and no website';
    const intent = await leadPipeline.parseQueryIntent(query);

    expect(intent.targetCount).toBe(50);
    expect(intent.targetLocation).toContain('Srinagar');
    expect(intent.filters.noWebsite).toBe(true);
    expect(intent.filters.strongSocialPresence).toBe(true);
  });

  it('supports pluggable SearchSourceProvider registration', async () => {
    const mockProvider: SearchSourceProvider = {
      name: 'test_places_provider',
      async search(intent: QueryIntent): Promise<Partial<Lead>[]> {
        return [
          {
            name: 'Kashmiri Pashmina Emporium',
            category: intent.businessCategory,
            location: { city: intent.targetLocation },
            phone: '+91 9988776655',
            website: { hasWebsite: false, status: 'none' },
            social: {
              hasStrongSocialPresence: true,
              instagram: { handle: 'kashmirpashmina' },
            },
          },
        ];
      },
    };

    providerRegistry.register(mockProvider);
    expect(providerRegistry.get('test_places_provider')).toBeDefined();

    const testUser = `test_user_provider_${Date.now()}`;
    const results = await leadPipeline.runPipeline(
      'Find 10 craft stores in Srinagar',
      testUser
    );

    expect(results.length).toBeGreaterThanOrEqual(1);
    const found = results.find((r) => r.name === 'Kashmiri Pashmina Emporium');
    expect(found).toBeDefined();
    expect(found?.status).toBe('qualified');
    expect(found?.pitches.length).toBeGreaterThan(0);

    providerRegistry.unregister('test_places_provider');
  });

  it('generates different leads across consecutive runs and excludes already generated leads', async () => {
    const testUser = `user_diversity_${Date.now()}`;
    const batch1 = await leadPipeline.runPipeline(
      'Find 5 fashion boutiques in Srinagar',
      testUser
    );
    expect(batch1.length).toBeGreaterThanOrEqual(5);

    const batch2 = await leadPipeline.runPipeline(
      'Find 5 fashion boutiques in Srinagar',
      testUser
    );
    expect(batch2.length).toBeGreaterThanOrEqual(5);

    // Verify that batch2 leads are different and not identical to batch1 leads
    const batch1Names = new Set(batch1.map((l) => l.name.toLowerCase().trim()));
    const duplicatesInBatch2 = batch2.filter((l) =>
      batch1Names.has(l.name.toLowerCase().trim())
    );

    expect(duplicatesInBatch2.length).toBe(0);
  });
});
