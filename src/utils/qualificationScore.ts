import {
  Lead,
  QueryIntent,
  SalesOpportunity,
  OpportunityType,
  DevilsAdvocateAnalysis,
  StrictSocialAudit,
} from '../types/lead';
import { performStrictSocialAudit } from './strictSocialScorer';

export interface QualificationResult {
  score: number;
  reasons: string[];
  opportunity: SalesOpportunity;
  isQualified: boolean;
  devilsAdvocate: DevilsAdvocateAnalysis;
  strictSocialAudit: StrictSocialAudit;
}

/**
 * Computes a strict, realistic 0-100 qualification score graded like a "strict teacher / devil's advocate".
 * Evaluates actual verified social media activity (LinkedIn, Twitter, YouTube, Instagram)
 * rather than mere link presence, testing genuine audience demand and business viability.
 */
export function calculateLeadQualification(
  lead: Partial<Lead>,
  intent?: QueryIntent
): QualificationResult {
  // Baseline starts at a conservative 44 (strict grading baseline)
  let score = 44;
  const reasons: string[] = [];
  const redFlags: string[] = [];

  const hasWebsite = lead.website?.hasWebsite ?? false;
  const websiteStatus = lead.website?.status ?? (hasWebsite ? 'active' : 'none');
  const hasPhone = Boolean(lead.phone && lead.phone.replace(/\D/g, '').length >= 8);
  const city = lead.location?.city || 'Local Market';

  // -------------------------------------------------------------
  // 1. Strict Social Media Activity Algorithm Validation (0-100)
  // Validates Instagram, LinkedIn, Twitter/X, and YouTube based on real activity
  // -------------------------------------------------------------
  const strictSocialAudit = performStrictSocialAudit(lead);
  const { instagram, linkedin, twitter, youtube } = strictSocialAudit.platforms;

  // Evaluate Instagram Verified Activity
  if (instagram.activityLevel === 'verified_active') {
    score += 16;
    reasons.push(`Instagram: Verified Active (${(instagram.metrics?.followersOrSubscribers || 0).toLocaleString()} followers) with proven customer engagement.`);
  } else if (instagram.activityLevel === 'moderate_activity') {
    score += 12;
    reasons.push(`Instagram: Moderate Activity (${(instagram.metrics?.followersOrSubscribers || 0).toLocaleString()} followers) with regular community inquiries.`);
  } else if (instagram.activityLevel === 'low_activity') {
    score += 4;
    reasons.push(`Instagram: Low Reach (${(instagram.metrics?.followersOrSubscribers || 0).toLocaleString()} followers); nascent audience footprint.`);
    redFlags.push('Limited audience traction indicates marketing budget and immediate web traffic will be constrained.');
  } else if (instagram.activityLevel === 'dormant_ghost') {
    score -= 8;
    reasons.push('Instagram: Dormant / Ghost handle with negligible follower traction or customer activity.');
    redFlags.push('Abandoned social profile damages prospective customer trust.');
  } else {
    // Unverified / Absent
    score -= 16;
    reasons.push('Instagram: Absent (Zero verifiable Instagram profile found; missing primary valley B2C channel).');
    redFlags.push('Total absence of Instagram profile; owner relies 100% on traditional walk-in trade.');
  }

  // Evaluate LinkedIn Verified Activity
  if (linkedin.activityLevel === 'verified_active') {
    score += 4;
    reasons.push('LinkedIn: Verified Active company profile in corporate B2B registry.');
  } else if (linkedin.activityLevel === 'moderate_activity') {
    score += 2;
    reasons.push('LinkedIn: Directory listing verified.');
  } else if (linkedin.activityLevel === 'dormant_ghost') {
    score -= 2;
    reFlagsPush(redFlags, 'LinkedIn registry entry appears abandoned or misconfigured.');
  } else {
    reasons.push('LinkedIn: Absent (Operates purely in traditional retail/artisan trade without B2B directory registry).');
  }

  // Evaluate Twitter / X Verified Activity
  if (twitter.activityLevel === 'verified_active') {
    score += 3;
    reasons.push(`X (Twitter): Verified Active (${(twitter.metrics?.followersOrSubscribers || 0).toLocaleString()} followers) with public feed.`);
  } else if (twitter.activityLevel === 'moderate_activity') {
    score += 1;
    reasons.push('X (Twitter): Active profile verified.');
  } else if (twitter.activityLevel === 'dormant_ghost') {
    score -= 2;
    reFlagsPush(redFlags, 'X (Twitter) handle exists but has 0 recent posts or active followers.');
  } else {
    reasons.push('X (Twitter): Absent (Directs customer conversations strictly to WhatsApp & Instagram).');
  }

  // Evaluate YouTube Verified Activity
  if (youtube.activityLevel === 'verified_active') {
    score += 6;
    reasons.push(`YouTube: Verified Active channel (${(youtube.metrics?.followersOrSubscribers || 0).toLocaleString()} subs) with product/craft showcase demos.`);
  } else if (youtube.activityLevel === 'moderate_activity') {
    score += 3;
    reasons.push('YouTube: Brand video channel verified.');
  } else if (youtube.activityLevel === 'dormant_ghost') {
    score -= 2;
    reFlagsPush(redFlags, 'YouTube link is inactive or lacks authentic brand video uploads.');
  } else {
    reasons.push('YouTube: Absent (No dedicated video channel registered for craft or product showcases).');
  }

  // Add overall social activity metric to qualification reasons
  reasons.push(`Critical Social Activity: ${strictSocialAudit.overallActivityScore}/100 (Grade ${strictSocialAudit.activityGrade})`);

  // Append any social activity deal breakers identified by the algorithm
  if (strictSocialAudit.dealBreakers.length > 0) {
    strictSocialAudit.dealBreakers.forEach((db) => reFlagsPush(redFlags, db));
  }

  // -------------------------------------------------------------
  // 2. Strict Website Audit
  // -------------------------------------------------------------
  if (!hasWebsite || websiteStatus === 'none') {
    score += 18;
    reasons.push('High Web Need: Zero official website creates ordering and catalog friction in DMs.');
  } else if (websiteStatus === 'broken' || websiteStatus === 'unreachable') {
    score += 14;
    reasons.push('Urgent Tech Debt: Existing website link is dead or misconfigured; immediate repair needed.');
    reFlagsPush(redFlags, 'Past failed website experience may make owner skeptical of new web developers.');
  } else {
    // Has working website: Heavy strict penalty because selling a replacement is tough
    score -= 22;
    reasons.push('Existing Digital Infrastructure: Business already maintains an active domain.');
    reFlagsPush(redFlags, 'Low urgency for a new website; high objection rate against redesign costs.');
  }

  // -------------------------------------------------------------
  // 3. Contact Channel & Sales Accessibility
  // -------------------------------------------------------------
  if (hasPhone) {
    score += 10;
    reasons.push('Direct Sales Channel: Direct phone/WhatsApp number available for outreach.');
  } else {
    score -= 14;
    reasons.push('Contact Impediment: Missing verified direct mobile number.');
    reFlagsPush(redFlags, 'Outbound gatekeepers or absent contact details will increase sales friction.');
  }

  // -------------------------------------------------------------
  // 4. Physical Commercial Footprint (Google Maps / Address)
  // -------------------------------------------------------------
  const hasMapsListing = lead.social?.googleMaps?.hasListing ?? Boolean(lead.location?.address);
  if (hasMapsListing) {
    score += 4;
  } else {
    score -= 3;
    reFlagsPush(redFlags, 'No physical location mapped on Google Maps; may operate as informal home business.');
  }

  // -------------------------------------------------------------
  // 5. Search Intent Alignment
  // -------------------------------------------------------------
  if (intent) {
    if (intent.filters.noWebsite && (!hasWebsite || websiteStatus === 'none')) {
      score += 4;
    }
    if (intent.filters.strongSocialPresence && (strictSocialAudit.overallActivityScore >= 45 || instagram.activityLevel === 'verified_active')) {
      score += 4;
    }
  }

  // -------------------------------------------------------------
  // 6. Strict Teacher Grading Ceiling
  // Never give 100 points! Cold prospects always possess execution friction.
  // -------------------------------------------------------------
  score = Math.min(88, Math.max(20, score));

  // Determine Opportunity Type
  let opportunityType: OpportunityType = 'general';
  let summary = 'Standard digital presence upgrade';
  let recommendedOffer = 'Catalog digitization and automated WhatsApp lead intake';

  const igFollowers = instagram.metrics?.followersOrSubscribers || 0;

  if (!hasWebsite && (instagram.activityLevel === 'verified_active' || igFollowers >= 2500)) {
    opportunityType = 'needs_website';
    summary = `Active audience (${igFollowers.toLocaleString()} followers) taking orders manually via DM with no checkout website.`;
    recommendedOffer = 'Offer a high-converting mobile catalog / storefront to eliminate manual DM pricing chats.';
  } else if (!hasWebsite && hasPhone) {
    opportunityType = 'needs_website';
    summary = 'Established local brick-and-mortar operation without an indexed digital storefront.';
    recommendedOffer = 'Offer local Google Business optimization paired with a fast mobile landing page.';
  } else if (
    hasWebsite &&
    (instagram.activityLevel === 'verified_active' ||
      strictSocialAudit.overallActivityScore >= 35 ||
      Boolean(lead.social?.hasStrongSocialPresence) ||
      igFollowers >= 5000)
  ) {
    opportunityType = 'ecommerce_expansion';
    summary = 'Established digital brand ready for automated checkout funnels and payment integration.';
    recommendedOffer = 'Offer WhatsApp marketing automation and checkout conversion optimization.';
  } else {
    opportunityType = 'social_growth';
    summary = 'Existing web presence with underutilized social acquisition channels.';
    recommendedOffer = 'Offer targeted social content packages and local customer acquisition.';
  }

  // Qualification threshold (Strict teacher passing mark is 52)
  const isQualified = score >= 52;

  // -------------------------------------------------------------
  // Devil's Advocate Deep Critique & Anticipated Objections
  // -------------------------------------------------------------
  let toughCriticism = `Prospect in ${city} shows commercial viability, but lacks digital infrastructure. Owner will be skeptical of recurring software costs and prefers familiar manual operations.`;
  let expectedObjection = `“Hamara kaam WhatsApp aur dukaan se theek chal raha hai. Website banwake extra jhanjhat kyu paalein?”`;
  let rebuttalStrategy = `Demonstrate how a quick mobile catalog saves 3+ hours daily answering the exact same "price please" DMs, while capturing out-of-station and NRI buyers who want to order instantly without waiting.`;
  const riskLevel: 'low' | 'medium' | 'high' = score >= 75 ? 'low' : score >= 55 ? 'medium' : 'high';

  if (redFlags.length === 0) {
    redFlags.push('Owner may require hand-holding to update products and inventory regularly.');
  }

  if (score >= 78) {
    toughCriticism = `Strong prospect with proven commercial demand. However, expect resistance on maintenance fees; pitch immediate order-automation ROI rather than technical buzzwords.`;
  } else if (score < 55) {
    toughCriticism = `High-friction prospect with minimal digital literacy or small audience. Requires educational selling; risk of budget pushback is high.`;
    expectedObjection = `“Online se hume koi order nahi aate, hamari customer walking hai.”`;
    rebuttalStrategy = `Offer a low-barrier, one-time setup showing their physical shop on Google Maps & WhatsApp catalog before pitching full eCommerce.`;
  }

  // Add Devil's Advocate warning to reasons list
  reasons.push(`Devil's Advocate Risk: ${redFlags[0]}`);

  return {
    score,
    reasons,
    opportunity: {
      hasHighPotential: score >= 72,
      opportunityType,
      summary,
      recommendedOffer,
    },
    isQualified,
    devilsAdvocate: {
      toughCriticism,
      redFlags,
      expectedObjection,
      rebuttalStrategy,
      riskLevel,
    },
    strictSocialAudit,
  };
}

function reFlagsPush(target: string[], item: string) {
  if (!target.includes(item)) {
    target.push(item);
  }
}
