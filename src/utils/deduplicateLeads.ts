import { Lead } from '../types/lead';
import { extractInstagramHandle, cleanPhoneForWhatsApp } from './formatters';

/**
 * Normalizes a string for business name comparison:
 * lowercase, stripped punctuation, single spaces.
 */
export function normalizeBusinessName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Generates fingerprint keys for a lead to detect duplicates across different attributes:
 * - Normalized name + City
 * - Phone number
 * - Instagram handle
 * - Website domain
 */
export function getLeadFingerprints(lead: Partial<Lead>): string[] {
  const keys: string[] = [];
  const city = lead.location?.city ? lead.location.city.toLowerCase().trim() : '';

  if (lead.name) {
    const normName = normalizeBusinessName(lead.name);
    if (normName) {
      keys.push(`name_city:${normName}__${city}`);
      keys.push(`name_only:${normName}`);
    }
  }

  if (lead.phone) {
    const phone = cleanPhoneForWhatsApp(lead.phone);
    if (phone.length >= 8) {
      keys.push(`phone:${phone}`);
    }
  }

  const igHandle = lead.social?.instagram?.handle || extractInstagramHandle(lead.social?.instagram?.url);
  if (igHandle) {
    keys.push(`ig:${igHandle.toLowerCase()}`);
  }

  if (lead.website?.url) {
    try {
      const hostname = new URL(
        lead.website.url.startsWith('http') ? lead.website.url : `https://${lead.website.url}`
      ).hostname.replace(/^www\./, '').toLowerCase();
      if (hostname) {
        keys.push(`web:${hostname}`);
      }
    } catch {
      // Ignore invalid URLs
    }
  }

  return keys;
}

/**
 * Merges two lead records, preferring non-empty enriched values.
 */
export function mergeLeads(existing: Lead, incoming: Lead): Lead {
  return {
    ...existing,
    description: existing.description || incoming.description,
    phone: existing.phone || incoming.phone,
    email: existing.email || incoming.email,
    location: {
      ...existing.location,
      address: existing.location.address || incoming.location.address,
      formattedAddress: existing.location.formattedAddress || incoming.location.formattedAddress,
    },
    website: {
      hasWebsite: existing.website.hasWebsite || incoming.website.hasWebsite,
      url: existing.website.url || incoming.website.url,
      status: existing.website.status !== 'none' ? existing.website.status : incoming.website.status,
      checkedAt: existing.website.checkedAt || incoming.website.checkedAt,
    },
    social: {
      hasStrongSocialPresence: existing.social.hasStrongSocialPresence || incoming.social.hasStrongSocialPresence,
      instagram: {
        ...existing.social.instagram,
        ...incoming.social.instagram,
      },
      facebook: {
        ...existing.social.facebook,
        ...incoming.social.facebook,
      },
      linkedin: {
        ...existing.social.linkedin,
        ...incoming.social.linkedin,
      },
    },
    qualificationScore: Math.max(existing.qualificationScore, incoming.qualificationScore),
    qualificationReasons: Array.from(new Set([...existing.qualificationReasons, ...incoming.qualificationReasons])),
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Deduplicates an array of leads, merging duplicate entities.
 */
export function deduplicateLeads(leads: Lead[]): Lead[] {
  const seenFingerprints = new Map<string, Lead>();
  const result: Lead[] = [];

  for (const lead of leads) {
    const fingerprints = getLeadFingerprints(lead);
    let matchedLead: Lead | undefined;

    for (const key of fingerprints) {
      if (seenFingerprints.has(key)) {
        matchedLead = seenFingerprints.get(key);
        break;
      }
    }

    if (matchedLead) {
      const merged = mergeLeads(matchedLead, lead);
      // Update result array entry in place
      const idx = result.findIndex(r => r.id === matchedLead!.id);
      if (idx !== -1) {
        result[idx] = merged;
      }
      // Re-map fingerprints
      for (const k of getLeadFingerprints(merged)) {
        seenFingerprints.set(k, merged);
      }
    } else {
      result.push(lead);
      for (const k of fingerprints) {
        seenFingerprints.set(k, lead);
      }
    }
  }

  return result;
}
