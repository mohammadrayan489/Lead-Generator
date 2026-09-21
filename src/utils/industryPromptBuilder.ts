export interface IndustryFormParams {
  industryDescription: string;
  kashmirHub: string;
  targetCount: number;
  noWebsiteOnly: boolean;
  activeSocialOnly: boolean;
  verifiedWhatsAppOnly: boolean;
  valueProposition?: string;
  notes?: string;
}

export interface KashmirRegionalHub {
  id: string;
  name: string;
  tagline: string;
  prominentMarkets: string[];
}

export const KASHMIR_REGIONAL_HUBS: KashmirRegionalHub[] = [
  {
    id: 'all_kashmir',
    name: 'All Kashmir Commercial Hubs',
    tagline: 'Valley-wide discovery across all primary commercial centers',
    prominentMarkets: ['Srinagar', 'Pampore', 'Anantnag', 'Baramulla', 'Budgam'],
  },
  {
    id: 'srinagar',
    name: 'Srinagar (Commercial Capital)',
    tagline: 'Lal Chowk, Rajbagh, Polo View, Downtown/Shehr-e-Khas, Karan Nagar',
    prominentMarkets: ['Lal Chowk', 'Rajbagh', 'Polo View', 'Downtown', 'Karan Nagar', 'Parraypora'],
  },
  {
    id: 'pampore_pulwama',
    name: 'Pampore & Pulwama (Saffron & Almond Corridor)',
    tagline: 'World-renowned saffron trade, dry fruit processing & almond orchards',
    prominentMarkets: ['Pampore Saffron Town', 'Pulwama Main Market', 'Lassipora Industrial Estate'],
  },
  {
    id: 'anantnag',
    name: 'Anantnag & South Kashmir',
    tagline: 'Southern commercial trading hub, textiles, timber & tourism junction',
    prominentMarkets: ['KP Road', 'Mehandi Kadal', 'Reshi Bazar', 'Bijbehara'],
  },
  {
    id: 'baramulla_sopore',
    name: 'Baramulla & Sopore (North Kashmir Trade)',
    tagline: 'Asia\'s second largest Apple Mandi, cross-border trade & retail hubs',
    prominentMarkets: ['Sopore Fruit Mandi', 'Baramulla Old Town', 'Tehsil Road'],
  },
  {
    id: 'budgam',
    name: 'Budgam (Artisan & Weaving Belt)',
    tagline: 'Kani shawl weavers, papier-mâché cooperatives & brick kilns',
    prominentMarkets: ['Charar-i-Sharief', 'Magam', 'Budgam Town', 'Beerwah'],
  },
  {
    id: 'gulmarg_tangmarg',
    name: 'Gulmarg & Tangmarg (Ski & Luxury Hospitality)',
    tagline: 'Alpine ski resorts, luxury winter lodges, golf clubs & guide services',
    prominentMarkets: ['Gulmarg Meadow', 'Tangmarg Market', 'Gondola Base'],
  },
  {
    id: 'pahalgam',
    name: 'Pahalgam & Lidder Valley (Eco-Tourism & Resorts)',
    tagline: 'Riverside hotels, trekking outfitters, pony leagues & Kashmiri dining',
    prominentMarkets: ['Pahalgam Main Market', 'Aru Road', 'Laripora', 'Baisaran Road'],
  },
  {
    id: 'ganderbal_kangan',
    name: 'Ganderbal & Kangan (Sindh Valley & Trout)',
    tagline: 'Freshwater trout fisheries, mountain adventure bases & stone crafts',
    prominentMarkets: ['Beehama', 'Duderhama', 'Kangan Market', 'Sonamarg Axis'],
  },
  {
    id: 'bandipora_kupwara',
    name: 'Bandipora & Kupwara (Border Crafts & Wular Fisheries)',
    tagline: 'Wular lake lotus/singhara trade, willow wickerwork & walnut produce',
    prominentMarkets: ['Bandipora Main Market', 'Kupwara Town', 'Handwara'],
  },
  {
    id: 'shopian_kulgam',
    name: 'Shopian & Kulgam (Apple Belt & Agri-Logistics)',
    tagline: 'High-density apple orchards, cold storage CA chambers & agri-logistics',
    prominentMarkets: ['Shopian Gol Chakkar', 'Kulgam Chawalgam', 'Batapora'],
  },
];

export interface IndustryPreset {
  id: string;
  title: string;
  industryDescription: string;
  kashmirHub: string;
  suggestedCount: number;
  valueProposition: string;
  badge: string;
}

export const KASHMIR_INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    id: 'pashmina_handicrafts',
    title: 'Pashmina & Artisans',
    industryDescription: 'Hand-knotted Kashmiri pashmina shawls, Kani weaving ateliers, walnut wood carving and papier-mâché master craftsmen',
    kashmirHub: 'srinagar',
    suggestedCount: 25,
    valueProposition: 'Global Direct-to-Consumer e-Commerce & Luxury WhatsApp Catalog',
    badge: 'Artisan Heritage',
  },
  {
    id: 'saffron_dryfruits',
    title: 'Saffron & Dry Fruits',
    industryDescription: 'GI-tagged Kashmiri saffron growers, walnut kernels, mamra almonds and organic dried fruit exporters',
    kashmirHub: 'pampore_pulwama',
    suggestedCount: 30,
    valueProposition: 'Authenticity Verification & B2B WhatsApp Bulk Ordering Funnel',
    badge: 'Agri-Export',
  },
  {
    id: 'bridal_couture',
    title: 'Bridal Couture & Jewelry',
    industryDescription: 'High-end Kashmiri bridal couture designers, Tilla embroidery lounges, gold ateliers and wedding trousseau studios',
    kashmirHub: 'srinagar',
    suggestedCount: 35,
    valueProposition: 'Digital Wedding Lookbook & Private WhatsApp Bridal Consultations',
    badge: 'High-Ticket Retail',
  },
  {
    id: 'cafes_specialty_dining',
    title: 'Cafes & Artisan Bakeries',
    industryDescription: 'Boutique third-wave cafes, specialty coffee roasters, French-Kashmiri fusion bakeries and scenic dining lounges',
    kashmirHub: 'srinagar',
    suggestedCount: 20,
    valueProposition: 'WhatsApp Table Reservation & Dynamic Digital Menu',
    badge: 'Hospitality',
  },
  {
    id: 'houseboats_tourism',
    title: 'Houseboats & Boutique Stays',
    industryDescription: 'Heritage carved cedar houseboats on Nigeen and Dal Lake, boutique alpine cottages and experiential Kashmir travel outfitters',
    kashmirHub: 'all_kashmir',
    suggestedCount: 25,
    valueProposition: 'Direct Booking Engine & Zero-OTA Commission WhatsApp Inquiries',
    badge: 'Travel & Stays',
  },
  {
    id: 'gyms_fitness_crossfit',
    title: 'Gyms & CrossFit Studios',
    industryDescription: 'Modern fitness centers, unisex bodybuilding gyms, CrossFit boxes and strength academies across Kashmir',
    kashmirHub: 'srinagar',
    suggestedCount: 30,
    valueProposition: 'Automated Membership Renewal & WhatsApp Trial Pass Booking',
    badge: 'Health & Wellness',
  },
  {
    id: 'contractors_interiors',
    title: 'Contractors & Interiors',
    industryDescription: 'Building contractors, modular kitchen designers, architectural interior decorators and HVAC insulation experts in Kashmir',
    kashmirHub: 'srinagar',
    suggestedCount: 25,
    valueProposition: 'High-Value Project Lead Generation & WhatsApp Quote Estimator',
    badge: 'Construction & Trade',
  },
  {
    id: 'apple_cold_storage',
    title: 'Apple Orchards & Cold Chains',
    industryDescription: 'Controlled Atmosphere (CA) cold storage facilities, apple grading and packing houses, and fruit logistics cooperatives',
    kashmirHub: 'shopian_kulgam',
    suggestedCount: 20,
    valueProposition: 'Pan-India Buyer WhatsApp Broadcast & Real-Time Stock Inquiry',
    badge: 'Agri-Logistics',
  },
];

/**
 * Synthesizes a natural-language search query strictly tailored for Kashmir from the form parameters.
 */
export function buildKashmirIndustryQuery(params: IndustryFormParams): string {
  const count = Math.min(100, Math.max(1, params.targetCount || 15));
  const desc = (params.industryDescription || 'local businesses').trim();

  // Find hub name
  const hubObj = KASHMIR_REGIONAL_HUBS.find((h) => h.id === params.kashmirHub);
  const locationText = hubObj && hubObj.id !== 'all_kashmir'
    ? `${hubObj.name}, Kashmir`
    : 'Srinagar and Kashmir Valley';

  const criteriaParts: string[] = [];

  if (params.noWebsiteOnly) {
    criteriaParts.push('with no official website');
  }

  if (params.activeSocialOnly) {
    criteriaParts.push('with active Instagram social presence');
  }

  if (params.verifiedWhatsAppOnly) {
    criteriaParts.push('direct WhatsApp phone contact');
  }

  let query = `Find ${count} ${desc} in ${locationText}`;

  if (criteriaParts.length > 0) {
    query += ` ${criteriaParts.join(' and ')}`;
  }

  if (params.valueProposition && params.valueProposition.trim()) {
    query += ` for ${params.valueProposition.trim()}`;
  }

  return query;
}
