export type LeadStatus =
  | 'new'
  | 'discovered'
  | 'enriching'
  | 'verified'
  | 'qualified'
  | 'contacted'
  | 'lost'
  | 'unqualified';

export type WebsiteStatus = 'active' | 'broken' | 'none' | 'unreachable';

export type OpportunityType =
  | 'needs_website'
  | 'social_growth'
  | 'ecommerce_expansion'
  | 'digital_ads'
  | 'general';

export interface GoogleMapsResearch {
  hasListing: boolean;
  placeUrl?: string;
  rating?: number;
  userRatingsTotal?: number;
  verifiedOnMaps: boolean;
  addressOnMaps?: string;
  phoneOnMaps?: string;
  websiteFieldOnMaps?: string;
  statusSummary?: string;
}

export interface LinkedInResearch {
  hasPage: boolean;
  companyHandle?: string;
  profileUrl?: string;
  statusSummary?: string;
}

export interface TwitterResearch {
  hasAccount: boolean;
  handle?: string;
  url?: string;
  followersCount?: number;
  statusSummary?: string;
}

export interface YouTubeResearch {
  hasChannel: boolean;
  channelName?: string;
  channelUrl?: string;
  subscribersCount?: number;
  statusSummary?: string;
}

export interface SocialPresence {
  instagram?: {
    handle?: string;
    url?: string;
    followersCount?: number;
    postsCount?: number;
    isVerified?: boolean;
    hasHighEngagement?: boolean;
  };
  facebook?: {
    pageUrl?: string;
    followersCount?: number;
  };
  linkedin?: LinkedInResearch;
  twitter?: TwitterResearch;
  youtube?: YouTubeResearch;
  googleMaps?: GoogleMapsResearch;
  hasStrongSocialPresence: boolean;
}

export interface WebsiteInfo {
  url?: string;
  hasWebsite: boolean;
  status: WebsiteStatus;
  checkedAt?: string;
  auditNotes?: string;
}

export interface SalesOpportunity {
  hasHighPotential: boolean;
  opportunityType: OpportunityType;
  summary: string;
  recommendedOffer?: string;
}

export interface WhatsAppPitch {
  id: string;
  message: string;
  recipientPhone?: string;
  generatedAt: string;
}

export type PlatformActivityLevel =
  | 'verified_active'
  | 'moderate_activity'
  | 'low_activity'
  | 'dormant_ghost'
  | 'unverified_absent';

export interface PlatformActivityValidation {
  platform: 'instagram' | 'linkedin' | 'twitter' | 'youtube';
  hasPresence: boolean;
  isVerified: boolean;
  activityLevel: PlatformActivityLevel;
  activityScore: number; // 0-100 for this platform
  activitySignals: string[];
  inactivityPenalties: string[];
  metrics?: {
    followersOrSubscribers?: number;
    hasEngagement?: boolean;
    hasCommercialIntent?: boolean;
    verifiedHandleOrUrl?: string;
  };
}

export interface StrictSocialAudit {
  overallActivityScore: number; // 0-100 critical rating based on real activity
  activityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  platforms: {
    instagram: PlatformActivityValidation;
    linkedin: PlatformActivityValidation;
    twitter: PlatformActivityValidation;
    youtube: PlatformActivityValidation;
  };
  criticalSummary: string;
  dealBreakers: string[];
}

export interface DevilsAdvocateAnalysis {
  toughCriticism: string;
  redFlags: string[];
  expectedObjection: string;
  rebuttalStrategy: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface Lead {
  id: string;
  name: string;
  category: string;
  description?: string;
  location: {
    city: string;
    state?: string;
    country?: string;
    address?: string;
    formattedAddress?: string;
  };
  phone?: string;
  email?: string;
  website: WebsiteInfo;
  social: SocialPresence;
  status: LeadStatus;
  isStarred?: boolean;
  hasBeenPitched?: boolean;
  pitchedAt?: string;
  qualificationScore: number; // 0 to 100
  qualificationReasons: string[];
  opportunity: SalesOpportunity;
  devilsAdvocate?: DevilsAdvocateAnalysis;
  strictSocialAudit?: StrictSocialAudit;
  pitches: WhatsAppPitch[];
  notes?: string;
  followUpDate?: string;
  sourceQuery?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueryIntent {
  originalQuery: string;
  businessCategory: string;
  targetLocation: string;
  targetCount: number;
  filters: {
    noWebsite: boolean;
    strongSocialPresence: boolean;
    preferredPlatform?: string;
  };
  excludeNames?: string[];
  excludeHandles?: string[];
  generationSeed?: number;
}

export type PipelineStage =
  | 'idle'
  | 'understanding'
  | 'searching'
  | 'discovering'
  | 'verifying'
  | 'social_check'
  | 'website_check'
  | 'deduplicating'
  | 'qualifying'
  | 'completed'
  | 'error';

export interface PipelineProgressState {
  stage: PipelineStage;
  currentStep: number;
  totalSteps: number;
  message: string;
  discoveredCount: number;
  qualifiedCount: number;
  targetTotal?: number;
  currentLeadName?: string;
  activePlatform?: 'google_maps' | 'linkedin' | 'twitter' | 'youtube' | 'instagram' | 'website_audit';
  intent?: QueryIntent;
  error?: string;
}

export type OnLeadDiscoveredCallback = (
  lead: Lead,
  currentIndex: number,
  totalExpected: number
) => void;
