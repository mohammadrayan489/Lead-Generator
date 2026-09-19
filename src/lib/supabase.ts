import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead } from '../types/lead';

export const LEADS_TABLE = 'leads';

// In-memory singletons to prevent multiple client instances
let cachedServerClient: SupabaseClient | null = null;
let cachedBrowserClient: SupabaseClient | null = null;

/**
 * SQL Schema for Supabase PostgreSQL database
 */
export const SUPABASE_SCHEMA_SQL = `
-- Create leads table in Supabase
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT NOT NULL,
  category TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  address TEXT,
  phone TEXT,
  website_url TEXT,
  has_website BOOLEAN DEFAULT FALSE,
  website_status TEXT,
  has_strong_social BOOLEAN DEFAULT FALSE,
  instagram_handle TEXT,
  instagram_followers INTEGER,
  instagram_high_engagement BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'discovered',
  qualification_score INTEGER DEFAULT 0,
  qualification_reasons JSONB DEFAULT '[]'::jsonb,
  opportunity_type TEXT,
  opportunity_summary TEXT,
  opportunity_high_potential BOOLEAN DEFAULT FALSE,
  pitches JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  follow_up_date TEXT,
  source_query TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user queries and status filtering
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_city ON public.leads(city);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
`;

/**
 * Returns credentials from server environment or client-side meta env
 */
export function getSupabaseCredentials(): { url: string | null; key: string | null } {
  let url: string | null = null;
  let key: string | null = null;

  if (typeof process !== 'undefined' && process.env) {
    url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || null;
    key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || null;
  }

  if ((!url || !key) && typeof import.meta !== 'undefined' && import.meta.env) {
    url = url || import.meta.env.VITE_SUPABASE_URL || null;
    key = key || import.meta.env.VITE_SUPABASE_ANON_KEY || null;
  }

  return { url, key };
}

/**
 * Checks whether Supabase credentials are configured
 */
export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}

/**
 * Obtains or creates a Supabase Client instance (Server or Client)
 */
export function getSupabaseClient(): SupabaseClient | null {
  const { url, key } = getSupabaseCredentials();
  if (!url || !key || !url.startsWith('http')) {
    return null;
  }

  if (typeof window === 'undefined') {
    if (!cachedServerClient) {
      cachedServerClient = createClient(url, key, {
        auth: { persistSession: false },
      });
    }
    return cachedServerClient;
  }

  if (!cachedBrowserClient) {
    cachedBrowserClient = createClient(url, key, {
      auth: { persistSession: true },
    });
  }
  return cachedBrowserClient;
}

/**
 * Converts a domain Lead object into a Supabase database row
 */
export function leadToSupabaseRow(lead: Lead): Record<string, any> {
  return {
    id: lead.id,
    user_id: lead.userId || null,
    name: lead.name,
    category: lead.category || null,
    city: lead.location?.city || null,
    state: lead.location?.state || null,
    country: lead.location?.country || null,
    address: lead.location?.address || null,
    phone: lead.phone || null,
    website_url: lead.website?.url || null,
    has_website: lead.website?.hasWebsite ?? false,
    website_status: lead.website?.status || null,
    has_strong_social: lead.social?.hasStrongSocialPresence ?? false,
    instagram_handle: lead.social?.instagram?.handle || null,
    instagram_followers: lead.social?.instagram?.followersCount || null,
    instagram_high_engagement: lead.social?.instagram?.hasHighEngagement ?? false,
    status: lead.status || 'discovered',
    qualification_score: lead.qualificationScore || 0,
    qualification_reasons: lead.qualificationReasons || [],
    opportunity_type: lead.opportunity?.opportunityType || null,
    opportunity_summary: lead.opportunity?.summary || null,
    opportunity_high_potential: lead.opportunity?.hasHighPotential ?? false,
    pitches: lead.pitches || [],
    notes: lead.notes || null,
    follow_up_date: lead.followUpDate || null,
    source_query: lead.sourceQuery || null,
    created_at: lead.createdAt || new Date().toISOString(),
    updated_at: lead.updatedAt || new Date().toISOString(),
  };
}

/**
 * Converts a Supabase database row back into a full domain Lead object
 */
export function supabaseRowToLead(row: any): Lead {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    name: row.name,
    category: row.category || 'Business',
    location: {
      city: row.city || 'Srinagar',
      state: row.state || 'Jammu & Kashmir',
      country: row.country || 'India',
      address: row.address || undefined,
    },
    website: {
      hasWebsite: Boolean(row.has_website),
      status: row.website_status || (row.has_website ? 'active' : 'none'),
      url: row.website_url || undefined,
    },
    social: {
      hasStrongSocialPresence: Boolean(row.has_strong_social),
      instagram: row.instagram_handle
        ? {
            handle: row.instagram_handle,
            followersCount: row.instagram_followers || undefined,
            hasHighEngagement: Boolean(row.instagram_high_engagement),
          }
        : undefined,
    },
    phone: row.phone || '',
    status: row.status || 'discovered',
    qualificationScore: row.qualification_score ?? 50,
    qualificationReasons: Array.isArray(row.qualification_reasons)
      ? row.qualification_reasons
      : [],
    opportunity: {
      hasHighPotential: Boolean(row.opportunity_high_potential),
      opportunityType: row.opportunity_type || 'needs_website',
      summary: row.opportunity_summary || '',
    },
    pitches: Array.isArray(row.pitches) ? row.pitches : [],
    notes: row.notes || undefined,
    follow_up_date: row.follow_up_date || undefined,
    followUpDate: row.follow_up_date || undefined,
    sourceQuery: row.source_query || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}
