import { Lead } from '../types/lead';
import {
  Dumbbell,
  Gem,
  Coffee,
  ShoppingBag,
  Palette,
  Apple,
  Hotel,
  Building2,
  HardHat,
  LucideIcon,
  Sparkles,
  MessageCircle,
  Star,
  CheckCircle2,
  Flame,
} from 'lucide-react';

export type NicheId =
  | 'gyms'
  | 'bridal_jewelry'
  | 'cafes_dining'
  | 'contractors'
  | 'fashion_boutique'
  | 'handicrafts_artisan'
  | 'saffron_dryfruits'
  | 'hospitality_tourism'
  | 'other';

export type LeadOutreachStage = 'new' | 'pitched' | 'contacted' | 'interested' | 'qualified';

export interface NicheDefinition {
  id: NicheId;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  accentColor: string;
  description: string;
  pitchTip: string;
}

export const NICHE_DEFINITIONS: Record<NicheId, NicheDefinition> = {
  gyms: {
    id: 'gyms',
    label: 'Gyms & Fitness Centers',
    shortLabel: 'Gyms & Fitness',
    icon: Dumbbell,
    badgeBg: 'bg-amber-50 dark:bg-amber-950/60',
    badgeText: 'text-amber-800 dark:text-amber-300',
    badgeBorder: 'border-amber-200 dark:border-amber-800/80',
    accentColor: 'amber',
    description: 'Fitness clubs, crossfit boxes, personal training studios, and bodybuilding gyms',
    pitchTip: 'Pitch online membership packages, trainer schedules, and 1-tap WhatsApp free trial bookings.',
  },
  bridal_jewelry: {
    id: 'bridal_jewelry',
    label: 'Bridal Couture & Jewelry',
    shortLabel: 'Bridal & Jewelry',
    icon: Gem,
    badgeBg: 'bg-rose-50 dark:bg-rose-950/60',
    badgeText: 'text-rose-800 dark:text-rose-300',
    badgeBorder: 'border-rose-200 dark:border-rose-800/80',
    accentColor: 'rose',
    description: 'Bridal lehengas, Tilla wedding suits, gold & polki jewelry ateliers, and trousseau lounges',
    pitchTip: 'Pitch private VIP bridal consultation booking and digital high-resolution bridal jewelry showcase catalogs.',
  },
  cafes_dining: {
    id: 'cafes_dining',
    label: 'Cafes & Dining',
    shortLabel: 'Cafes & Bakeries',
    icon: Coffee,
    badgeBg: 'bg-orange-50 dark:bg-orange-950/60',
    badgeText: 'text-orange-800 dark:text-orange-300',
    badgeBorder: 'border-orange-200 dark:border-orange-800/80',
    accentColor: 'orange',
    description: 'Specialty coffee houses, bakeries, tea salons, wazwan restaurants, and rooftop lounges',
    pitchTip: 'Pitch digital interactive food menus, daily special showcases, and direct 1-tap WhatsApp takeaway ordering.',
  },
  contractors: {
    id: 'contractors',
    label: 'Contractors & Construction',
    shortLabel: 'Contractors',
    icon: HardHat,
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-200',
    badgeBorder: 'border-slate-300 dark:border-slate-700',
    accentColor: 'slate',
    description: 'Civil contractors, interior architects, electrical/HVAC engineers, and construction builders',
    pitchTip: 'Pitch project portfolio showcase, client testimonial gallery, and 1-tap WhatsApp quotation inquiries to win tenders.',
  },
  fashion_boutique: {
    id: 'fashion_boutique',
    label: 'Fashion & Boutiques',
    shortLabel: 'Fashion & Pret',
    icon: ShoppingBag,
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    badgeText: 'text-indigo-800 dark:text-indigo-300',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800/80',
    accentColor: 'indigo',
    description: 'Designer pherans, velvet suits, contemporary pret boutiques, and ethnic wear houses',
    pitchTip: 'Pitch instant mobile clothing catalogs with size guides and direct WhatsApp checkout to stop DM drop-offs.',
  },
  handicrafts_artisan: {
    id: 'handicrafts_artisan',
    label: 'Handicrafts & Artisans',
    shortLabel: 'Handicrafts & Shawls',
    icon: Palette,
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    badgeText: 'text-emerald-800 dark:text-emerald-300',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800/80',
    accentColor: 'emerald',
    description: 'Walnut wood carving, pure Pashmina & Kani shawls, papier-mâché, silk carpets, and copperware',
    pitchTip: 'Pitch authentic craft verification, GI-tag storytelling, and global tourist WhatsApp ordering.',
  },
  saffron_dryfruits: {
    id: 'saffron_dryfruits',
    label: 'Saffron & Dry Fruits',
    shortLabel: 'Saffron & Dry Fruits',
    icon: Apple,
    badgeBg: 'bg-red-50 dark:bg-red-950/60',
    badgeText: 'text-red-800 dark:text-red-300',
    badgeBorder: 'border-red-200 dark:border-red-800/80',
    accentColor: 'red',
    description: 'Grade-1 Pampore Mongra saffron, Mamra almonds, Kagzi walnuts, and Himalayan shilajit',
    pitchTip: 'Pitch certificate verification and instant parcel order bundles with direct WhatsApp payment confirmation.',
  },
  hospitality_tourism: {
    id: 'hospitality_tourism',
    label: 'Hotels & Houseboats',
    shortLabel: 'Hospitality & Stays',
    icon: Hotel,
    badgeBg: 'bg-sky-50 dark:bg-sky-950/60',
    badgeText: 'text-sky-800 dark:text-sky-300',
    badgeBorder: 'border-sky-200 dark:border-sky-800/80',
    accentColor: 'sky',
    description: 'Luxury Dal/Nigeen cedar houseboats, Gulmarg ski chalets, Pahalgam riverside cottages',
    pitchTip: 'Pitch direct commission-free WhatsApp room bookings and curated itinerary package showcases.',
  },
  other: {
    id: 'other',
    label: 'Other Local Businesses',
    shortLabel: 'Other Services',
    icon: Building2,
    badgeBg: 'bg-slate-100 dark:bg-slate-800',
    badgeText: 'text-slate-800 dark:text-slate-300',
    badgeBorder: 'border-slate-200 dark:border-slate-700',
    accentColor: 'slate',
    description: 'Commercial service providers, local shops, and verified regional storefronts',
    pitchTip: 'Pitch local customer trust building and 1-tap WhatsApp inquiry capture.',
  },
};

export const ALL_NICHES: NicheId[] = [
  'gyms',
  'bridal_jewelry',
  'cafes_dining',
  'fashion_boutique',
  'handicrafts_artisan',
  'saffron_dryfruits',
  'hospitality_tourism',
  'other',
];

/**
 * Accurately classifies a lead into a targeted business niche.
 */
export function classifyLeadNiche(lead: Lead): NicheId {
  const text = `${lead.category || ''} ${lead.name || ''} ${lead.description || ''}`.toLowerCase();

  // 1. Gyms & Fitness
  if (
    /gym|fitness|crossfit|workout|muscle|bodybuild|calisthenic|trainer|aerobics|weight train|powerlift/i.test(
      text
    )
  ) {
    return 'gyms';
  }

  // 2. Bridal & Jewelry
  if (
    /jewel|gold|polki|kundan|diamond|silver|trousseau|lehenga|bridal|wedding wear|poshak|zari/i.test(
      text
    )
  ) {
    return 'bridal_jewelry';
  }

  // 3. Cafes & Dining
  if (
    /cafe|coffee|tea room|bakery|bake|patisserie|dining|roastery|wazwan|bistro|grill|restaurant|tea salon/i.test(
      text
    )
  ) {
    return 'cafes_dining';
  }

  // 4. Contractors & Construction
  if (
    /contractor|construction|builder|interior|decorator|architect|civil|plumb|electr|carpenter|paint|renovat|hvac|fabricat|building material|infrastructure/i.test(
      text
    )
  ) {
    return 'contractors';
  }

  // 5. Saffron & Dry Fruits
  if (
    /saffron|zaffran|dry fruit|walnut|almond|shilajit|honey|orchard|mamra|mongra/i.test(text)
  ) {
    return 'saffron_dryfruits';
  }

  // 5. Hospitality & Tourism
  if (/hotel|resort|houseboat|chalet|stay|lodge|cottage|tourism|retreat/i.test(text)) {
    return 'hospitality_tourism';
  }

  // 6. Handicrafts & Artisans
  if (
    /handicraft|woodcraft|woodcarv|walnut wood|paper mache|papiermache|carpet|rug|copper|traam|kani shawl|craft guild|khatamband/i.test(
      text
    )
  ) {
    return 'handicrafts_artisan';
  }

  // 7. Fashion & Boutiques
  if (
    /fashion|boutique|couture|pret|pheran|velvet|suit|apparel|dress|textile|wardrobe|shawl|stole|embroidery|tilla/i.test(
      text
    )
  ) {
    return 'fashion_boutique';
  }

  return 'other';
}

/**
 * Determines the outreach stage of a lead.
 * - 'pitched': Starred or marked as already pitched via WhatsApp
 * - 'contacted': Marked contacted but not starred
 * - 'qualified': Converted / Qualified
 * - 'new': Fresh / Discovered / Verified / New lead waiting to be pitched
 */
export function getLeadOutreachStage(lead: Lead): LeadOutreachStage {
  if (lead.status === 'interested') {
    return 'interested';
  }
  if (lead.status === 'qualified') {
    return 'qualified';
  }
  if (lead.isStarred || lead.hasBeenPitched || lead.pitchedAt) {
    return 'pitched';
  }
  if (lead.status === 'contacted') {
    return 'contacted';
  }
  return 'new';
}

export interface StageDefinition {
  id: LeadOutreachStage;
  label: string;
  badgeLabel: string;
  icon: LucideIcon;
  colorClasses: {
    bg: string;
    text: string;
    border: string;
    pill: string;
  };
  description: string;
}

export const STAGE_DEFINITIONS: Record<LeadOutreachStage, StageDefinition> = {
  new: {
    id: 'new',
    label: 'New & Uncontacted Leads',
    badgeLabel: 'New Lead',
    icon: Sparkles,
    colorClasses: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800/80',
      pill: 'bg-blue-600 text-white',
    },
    description: 'Fresh, qualified leads ready for first WhatsApp outreach',
  },
  pitched: {
    id: 'pitched',
    label: 'Pitched on WhatsApp ★',
    badgeLabel: 'Pitched ★',
    icon: Star,
    colorClasses: {
      bg: 'bg-amber-50 dark:bg-amber-950/50',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800/80',
      pill: 'bg-amber-500 text-white',
    },
    description: 'Clients that received your custom WhatsApp pitch and catalog preview',
  },
  contacted: {
    id: 'contacted',
    label: 'Contacted & In Discussion',
    badgeLabel: 'Contacted',
    icon: MessageCircle,
    colorClasses: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/50',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800/80',
      pill: 'bg-indigo-600 text-white',
    },
    description: 'In active communication with follow-up conversations',
  },
  interested: {
    id: 'interested',
    label: 'Interested & Warm Leads',
    badgeLabel: 'Interested',
    icon: Flame,
    colorClasses: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/50',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800/80',
      pill: 'bg-emerald-600 text-white',
    },
    description: 'Clients who showed positive interest, requested quotes or digital catalogs',
  },
  qualified: {
    id: 'qualified',
    label: 'Qualified / Won',
    badgeLabel: 'Qualified',
    icon: CheckCircle2,
    colorClasses: {
      bg: 'bg-teal-50 dark:bg-teal-950/50',
      text: 'text-teal-700 dark:text-teal-300',
      border: 'border-teal-200 dark:border-teal-800/80',
      pill: 'bg-teal-600 text-white',
    },
    description: 'Verified clients interested in digital catalog deployment',
  },
};
