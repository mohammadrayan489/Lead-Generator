import { Lead } from '../types/lead';

/**
 * Filters a list of leads by name or company name in real-time.
 * Also checks location, business category, social handles, and notes.
 */
export function filterLeadsBySearch(leads: Lead[], searchFilter: string): Lead[] {
  if (!searchFilter || !searchFilter.trim()) {
    return leads;
  }

  const query = searchFilter.trim().toLowerCase();

  return leads.filter((lead) => {
    // Check business/company name
    const matchesName = lead.name ? lead.name.toLowerCase().includes(query) : false;

    // Check optional explicit company/companyName fields if present
    const companyField = (lead as any).companyName || (lead as any).company;
    const matchesCompany = companyField ? String(companyField).toLowerCase().includes(query) : false;

    // Additional matching attributes for comprehensive search
    const matchesCity = lead.location?.city ? lead.location.city.toLowerCase().includes(query) : false;
    const matchesCategory = lead.category ? lead.category.toLowerCase().includes(query) : false;
    const matchesInstagram = lead.social?.instagram?.handle
      ? lead.social.instagram.handle.toLowerCase().includes(query)
      : false;
    const matchesNotes = lead.notes ? lead.notes.toLowerCase().includes(query) : false;

    return (
      matchesName ||
      matchesCompany ||
      matchesCity ||
      matchesCategory ||
      matchesInstagram ||
      matchesNotes
    );
  });
}
