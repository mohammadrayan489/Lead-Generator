import { Lead, QueryIntent, SalesOpportunity, OpportunityType } from '../types/lead';

export interface QualificationResult {
  score: number;
  reasons: string[];
  opportunity: SalesOpportunity;
  isQualified: boolean;
}

/**
 * Computes a 0-100 qualification score and determines the sales opportunity for a business.
 */
export function calculateLeadQualification(
  lead: Partial<Lead>,
  intent?: QueryIntent
): QualificationResult {
  let score = 0;
  const reasons: string[] = [];

  const hasWebsite = lead.website?.hasWebsite ?? false;
  const websiteStatus = lead.website?.status ?? (hasWebsite ? 'active' : 'none');
  const hasStrongSocial = lead.social?.hasStrongSocialPresence ?? false;
  const igFollowers = lead.social?.instagram?.followersCount ?? 0;
  const hasPhone = Boolean(lead.phone && lead.phone.replace(/\D/g, '').length >= 8);

  // Core Factor 1: Website absence or vulnerability
  if (!hasWebsite || websiteStatus === 'none') {
    score += 40;
    reasons.push('No website detected: High demand for web development & online store');
  } else if (websiteStatus === 'broken' || websiteStatus === 'unreachable') {
    score += 35;
    reasons.push('Website is broken or offline: Urgent technical upgrade required');
  } else {
    // Has working website
    score += 10;
    reasons.push('Existing digital presence established');
  }

  // Core Factor 2: Social Media Strength
  if (hasStrongSocial || igFollowers >= 1000) {
    score += 30;
    reasons.push(`Strong social engagement (${igFollowers > 0 ? `${igFollowers.toLocaleString()} followers` : 'active audience'}): Validated market demand`);
  } else if (lead.social?.instagram?.handle) {
    score += 15;
    reasons.push('Active social profile identified');
  }

  // Core Factor 3: Direct Sales Channel (Phone / WhatsApp availability)
  if (hasPhone) {
    score += 20;
    reasons.push('Verified direct contact number for instant WhatsApp outreach');
  }

  // Core Factor 4: Intent Alignment Bonus
  if (intent) {
    if (intent.filters.noWebsite && (!hasWebsite || websiteStatus === 'none')) {
      score += 10;
      reasons.push('Exact match for "no website" search constraint');
    }
    if (intent.filters.strongSocialPresence && hasStrongSocial) {
      score += 10;
      reasons.push('Exact match for "strong social presence" filter');
    }
  }

  // Cap score at 100
  score = Math.min(100, Math.max(0, score));

  // Determine Primary Opportunity
  let opportunityType: OpportunityType = 'general';
  let summary = 'Standard business opportunity';
  let recommendedOffer = 'Digital audit and growth consultation';

  if (!hasWebsite && (hasStrongSocial || igFollowers > 500)) {
    opportunityType = 'needs_website';
    summary = 'Active social audience without a direct booking or sales website.';
    recommendedOffer = 'Offer a high-converting mobile storefront / portfolio to turn Instagram followers into direct buyers.';
  } else if (!hasWebsite && hasPhone) {
    opportunityType = 'needs_website';
    summary = 'Local commercial operation relying exclusively on phone/walk-ins.';
    recommendedOffer = 'Offer a local Google Business profile setup and fast landing page.';
  } else if (hasWebsite && hasStrongSocial) {
    opportunityType = 'ecommerce_expansion';
    summary = 'Established digital brand ready for automated checkout and sales funnels.';
    recommendedOffer = 'Offer WhatsApp marketing automation and conversion optimization.';
  } else if (!hasStrongSocial && hasWebsite) {
    opportunityType = 'social_growth';
    summary = 'Functional website but minimal social traction.';
    recommendedOffer = 'Offer social media management and lead acquisition campaigns.';
  }

  const isQualified = score >= 50;

  return {
    score,
    reasons,
    opportunity: {
      hasHighPotential: score >= 70,
      opportunityType,
      summary,
      recommendedOffer,
    },
    isQualified,
  };
}
