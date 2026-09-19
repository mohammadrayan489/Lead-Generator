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
  linkedin?: {
    profileUrl?: string;
  };
  hasStrongSocialPresence: boolean;
}

export interface WebsiteInfo {
  url?: string;
  hasWebsite: boolean;
  status: WebsiteStatus;
  checkedAt?: string;
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
  qualificationScore: number; // 0 to 100
  qualificationReasons: string[];
  opportunity: SalesOpportunity;
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
  intent?: QueryIntent;
  error?: string;
}
