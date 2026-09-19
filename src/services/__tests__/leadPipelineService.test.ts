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

    const results = await leadPipeline.runPipeline(
      'Find 10 craft stores in Srinagar',
      'test_user'
    );

    expect(results.length).toBeGreaterThanOrEqual(1);
    const found = results.find((r) => r.name === 'Kashmiri Pashmina Emporium');
    expect(found).toBeDefined();
    expect(found?.status).toBe('qualified');
    expect(found?.pitches.length).toBeGreaterThan(0);
  });
});
