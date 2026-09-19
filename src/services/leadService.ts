import {
  getSupabaseClient,
  LEADS_TABLE,
  leadToSupabaseRow,
  supabaseRowToLead,
  isSupabaseConfigured,
  getSupabaseCredentials,
} from '../lib/supabase';
import { Lead } from '../types/lead';

const LOCAL_STORAGE_KEY = 'lead_generator_leads_cache';

// In-memory cache fallback for SSR and test run environments
let inMemoryLeads: Lead[] = [];

// Helper to access fallback local storage
function getLocalLeads(): Lead[] {
  if (typeof window === 'undefined') return inMemoryLeads;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : inMemoryLeads;
  } catch {
    return inMemoryLeads;
  }
}

function saveLocalLeads(leads: Lead[]): void {
  inMemoryLeads = leads;
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // Ignore quota or serialization errors
  }
}

export const leadService = {
  /**
   * Returns metadata about the current Supabase database controller.
   */
  getDatabaseInfo() {
    const { url } = getSupabaseCredentials();
    return {
      provider: 'supabase' as const,
      isConfigured: isSupabaseConfigured(),
      endpoint: url || 'pending configuration',
    };
  },

  /**
   * Retrieves all leads for a specific user from Supabase, syncing with local cache.
   */
  async getAllLeads(userId: string): Promise<Lead[]> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        let query = supabase
          .from(LEADS_TABLE)
          .select('*')
          .order('created_at', { ascending: false });

        if (userId) {
          query = query.eq('user_id', userId);
        }

        const { data, error } = await query;

        if (!error && data && Array.isArray(data)) {
          const remoteLeads: Lead[] = data.map(supabaseRowToLead);
          if (remoteLeads.length > 0) {
            saveLocalLeads(remoteLeads);
            return remoteLeads;
          }
        } else if (error) {
          console.warn('Supabase fetch notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local workspace cache:', err);
      }
    }

    // Local workspace cache fallback
    const local = getLocalLeads().filter((l) => !userId || l.userId === userId || !l.userId);
    return local;
  },

  /**
   * Adds a single structured lead to Supabase and local cache.
   */
  async addLead(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...lead,
      id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const row = leadToSupabaseRow(newLead);
        const { error } = await supabase.from(LEADS_TABLE).insert(row);
        if (error) {
          console.warn('Supabase insert notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase insert fallback to local storage:', err);
      }
    }

    // Save to local cache
    const current = getLocalLeads();
    saveLocalLeads([newLead, ...current]);

    return newLead;
  },

  /**
   * Batch stores leads into Supabase database controller and local cache.
   */
  async batchSaveLeads(leads: Lead[]): Promise<Lead[]> {
    const supabase = getSupabaseClient();

    if (supabase && leads.length > 0) {
      try {
        const rows = leads.map(leadToSupabaseRow);
        const { error } = await supabase
          .from(LEADS_TABLE)
          .upsert(rows, { onConflict: 'id' });

        if (error) {
          console.warn('Supabase batch upsert notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase batch save fallback:', err);
      }
    }

    const current = getLocalLeads();
    const existingIds = new Set(current.map((l) => l.id));
    const merged = [...leads.filter((l) => !existingIds.has(l.id)), ...current];
    saveLocalLeads(merged);

    return leads;
  },

  /**
   * Updates an existing lead in Supabase and local cache.
   */
  async updateLead(id: string, updates: Partial<Lead>): Promise<void> {
    const now = new Date().toISOString();
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const current = getLocalLeads().find((l) => l.id === id);
        const fullLead: Lead = current
          ? { ...current, ...updates, updatedAt: now }
          : ({ id, ...updates, updatedAt: now } as Lead);

        const row = leadToSupabaseRow(fullLead);
        const { error } = await supabase.from(LEADS_TABLE).update(row).eq('id', id);
        if (error) {
          console.warn('Supabase update notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase updateLead fallback:', err);
      }
    }

    // Update local cache
    const current = getLocalLeads();
    const updated = current.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: now } : l));
    saveLocalLeads(updated);
  },

  /**
   * Deletes a lead from Supabase and local cache.
   */
  async deleteLead(id: string): Promise<void> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { error } = await supabase.from(LEADS_TABLE).delete().eq('id', id);
        if (error) {
          console.warn('Supabase delete notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase deleteLead fallback:', err);
      }
    }

    // Update local cache
    const current = getLocalLeads();
    saveLocalLeads(current.filter((l) => l.id !== id));
  },

  /**
   * Deletes a batch of leads by IDs from Supabase and local cache.
   */
  async batchDeleteLeads(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) return;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.from(LEADS_TABLE).delete().in('id', ids);
        if (error) {
          console.warn('Supabase batch delete notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase batchDeleteLeads fallback:', err);
      }
    }

    // Update local cache
    const current = getLocalLeads();
    const idSet = new Set(ids);
    saveLocalLeads(current.filter((l) => !idSet.has(l.id)));
  },

  /**
   * Deletes all leads (optionally scoped to userId) from Supabase and local cache.
   */
  async deleteAllLeads(userId?: string): Promise<void> {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        let query = supabase.from(LEADS_TABLE).delete();
        if (userId) {
          query = query.eq('user_id', userId);
        } else {
          // Supabase requires a filter for deletes; neq id to impossible dummy
          query = query.neq('id', '__dummy_all__');
        }
        const { error } = await query;
        if (error) {
          console.warn('Supabase deleteAllLeads notice:', error.message);
        }
      } catch (err) {
        console.warn('Supabase deleteAllLeads fallback:', err);
      }
    }

    // Update local cache
    if (userId) {
      const current = getLocalLeads();
      saveLocalLeads(current.filter((l) => l.userId !== userId));
    } else {
      saveLocalLeads([]);
    }
  },
};
