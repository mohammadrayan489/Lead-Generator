import { Lead } from '../types/lead';
import { classifyLeadNiche, NicheId } from '../utils/nicheClassifier';

export type KashmiriTemplateId =
  | 'respectful_adaab'
  | 'lost_sales_recovery'
  | 'artisan_craft_export'
  | 'concise_3liner'
  | 'dining_hospitality'
  | 'local_maps_discovery';

export type KashmiriGreetingStyle =
  | 'salam_janab'
  | 'salam'
  | 'adaab'
  | 'formal_team';

export interface KashmiriTemplateOptions {
  greetingStyle?: KashmiriGreetingStyle;
  senderName?: string;
  senderTitle?: string;
  includeGoogleRating?: boolean;
  includeLostRevenueMetric?: boolean;
  includeKashmiriCourtesy?: boolean;
  customDiscountOrSeason?: string;
}

export interface KashmiriTemplateDefinition {
  id: KashmiriTemplateId;
  title: string;
  badge: string;
  description: string;
  targetNiches: string;
  iconName: string;
}

export const KASHMIRI_TEMPLATES: KashmiriTemplateDefinition[] = [
  {
    id: 'respectful_adaab',
    title: 'Respectful Kashmiri Adaab',
    badge: 'Traditional & Polite',
    description: 'Traditional greeting honoring local reputation & dignified courtesy across Kashmir.',
    targetNiches: 'All Kashmiri businesses, established retail, family-owned stores',
    iconName: 'Sparkles',
  },
  {
    id: 'lost_sales_recovery',
    title: '20-30% Lost Revenue Hook',
    badge: 'High Conversion',
    description: 'Demonstrates lost orders when customers must message back-and-forth instead of 1-tap checkout.',
    targetNiches: 'Boutiques, Gyms, Bridal Studios, Retailers',
    iconName: 'TrendingUp',
  },
  {
    id: 'artisan_craft_export',
    title: 'Kashmiri Artisan & Export Trust',
    badge: 'GI & Craft Heritage',
    description: 'Focuses on Pashmina, walnut woodcraft, saffron & parcel orders without endless DM photo requests.',
    targetNiches: 'Handicrafts, Saffron, Dry Fruits, Jewelers, Shawls',
    iconName: 'Gem',
  },
  {
    id: 'concise_3liner',
    title: 'Crisp 3-Liner Fast Read',
    badge: 'Quick Mobile Hit',
    description: 'Compact 3-sentence message designed to be read completely on phone notification screens.',
    targetNiches: 'Busy proprietors, WhatsApp active owners',
    iconName: 'Zap',
  },
  {
    id: 'dining_hospitality',
    title: 'Cafes, Wazwan & Stays',
    badge: 'Direct Orders & Stays',
    description: 'Highlight zero-commission direct WhatsApp table/room bookings and instant mobile food menus.',
    targetNiches: 'Cafes, Bakeries, Stays, Houseboats, Restaurants',
    iconName: 'Coffee',
  },
  {
    id: 'local_maps_discovery',
    title: 'Google Maps Local Discovery',
    badge: 'Local Search Boost',
    description: 'Anchors high Google Maps search interest to direct 1-tap WhatsApp consultation.',
    targetNiches: 'Verified storefronts, service providers, contractors',
    iconName: 'MapPin',
  },
];

/**
 * Normalizes phone numbers to clean international WhatsApp format (e.g. 919419xxxxxx).
 */
export function getCleanWhatsAppPhone(phone?: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `91${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits;
  }
  return digits;
}

/**
 * Builds direct trigger URLs for native WhatsApp mobile/desktop applications & web fallback.
 */
export function buildWhatsAppTriggerUrl(
  phone?: string,
  message?: string
): {
  universalUrl: string;
  appProtocolUrl: string;
  webUrl: string;
  hasValidPhone: boolean;
} {
  const cleanPhone = getCleanWhatsAppPhone(phone);
  const encodedText = encodeURIComponent(message || '');
  const hasValidPhone = cleanPhone.length >= 10;

  return {
    // Universal URL triggers WhatsApp mobile app on iOS/Android and desktop app or web seamlessly
    universalUrl: `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`,
    // Direct OS app scheme intent for mobile applications
    appProtocolUrl: `whatsapp://send?phone=${cleanPhone}&text=${encodedText}`,
    // Direct browser WhatsApp Web fallback
    webUrl: `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`,
    hasValidPhone,
  };
}

/**
 * Generates a targeted pre-filled WhatsApp message template specifically customized for
 * Kashmiri business context, cultural respect, and local industry workflows.
 */
export function generateKashmiriWhatsAppTemplate(
  lead: Lead,
  templateId: KashmiriTemplateId = 'respectful_adaab',
  options: KashmiriTemplateOptions = {}
): string {
  const businessName = lead.name;
  const city = lead.location?.city || 'Srinagar';
  const niche = classifyLeadNiche(lead);
  const mapsRating = lead.social?.googleMaps?.rating;
  const reviewsCount = lead.social?.googleMaps?.userRatingsTotal;

  const senderName = options.senderName?.trim() || '';
  const senderTitle = options.senderTitle?.trim() || 'local web specialist in Kashmir';
  const includeGoogleRating = options.includeGoogleRating ?? true;
  const includeLostRevenueMetric = options.includeLostRevenueMetric ?? true;
  const includeKashmiriCourtesy = options.includeKashmiriCourtesy ?? true;

  // 1. Salutation
  let greeting = 'Assalamu Alaikum Janab! 👋';
  if (options.greetingStyle === 'salam') {
    greeting = 'Assalamu Alaikum! 👋';
  } else if (options.greetingStyle === 'adaab') {
    greeting = 'Adaab / Hello! 👋';
  } else if (options.greetingStyle === 'formal_team') {
    greeting = `Respected Team at ${businessName},`;
  }

  // 2. Local Google Maps / Reputation Hook
  let ratingPhrase = '';
  if (includeGoogleRating && mapsRating) {
    ratingPhrase = ` I noticed your strong ${mapsRating}★ rating${
      reviewsCount ? ` with ${reviewsCount}+ genuine customer reviews` : ''
    } on Google Maps in ${city} — MashaAllah, it speaks volumes about the trust you have built with local patrons! 🌟`;
  } else {
    ratingPhrase = ` I have been following the respected reputation ${businessName} has established in ${city} and really appreciate your craftsmanship and service. 🌟`;
  }

  // 3. Sender intro
  const senderIntro = senderName
    ? `I am ${senderName}, a ${senderTitle}.`
    : `I am a ${senderTitle}.`;

  // 4. Generate Body Based on Template
  switch (templateId) {
    case 'respectful_adaab': {
      let contextPitch = '';
      if (niche === 'bridal_jewelry' || niche === 'fashion_boutique') {
        contextPitch =
          `During wedding seasons and festive shopping across Kashmir, families and prospective brides frequently browse collections on their phones. ` +
          `Without a direct digital catalog, clients often hesitate to message back-and-forth for photos and pricing, which can delay inquiries.`;
      } else if (niche === 'handicrafts_artisan' || niche === 'saffron_dryfruits') {
        contextPitch =
          `Both local clients and outside buyers seeking authentic Kashmiri products frequently want instant verification and package details before ordering. ` +
          `Without a dedicated instant showcase, interested buyers end up waiting for manual replies.`;
      } else if (niche === 'cafes_dining') {
        contextPitch =
          `Local diners and guests looking for your menu, specials, or takeaway options often prefer checking dishes on their phone before visiting or ordering. ` +
          `An interactive menu directly linked to your WhatsApp makes ordering effortless for them.`;
      } else {
        contextPitch =
          `In our local market in ${city}, prospective clients increasingly look for instant details and pricing on their phones before reaching out. ` +
          `A direct mobile showcase lets them explore your offerings with complete confidence.`;
      }

      return (
        `${greeting}\n\n` +
        `Hope you are having a blessed day. ${ratingPhrase}\n\n` +
        `${contextPitch}\n\n` +
        `${senderIntro} I have put together a clean, mobile-optimized showcase preview tailored specifically for ${businessName} with direct 1-tap WhatsApp consultation.\n\n` +
        `Would it be convenient for me to share the preview link with you Janab so you can see how it looks?`
      );
    }

    case 'lost_sales_recovery': {
      const lostRevHook = includeLostRevenueMetric
        ? `Retail and business data indicates that local enterprises lose an estimated 20% to 30% of potential orders simply because customers hesitate to call or message back-and-forth for basic pricing and availability.\n\n`
        : '';

      return (
        `${greeting}\n\n` +
        `${ratingPhrase}\n\n` +
        `Analyzing the customer journey for clients in ${city}, prospective customers looking for ${lead.category || 'your products'} currently have to message manually or wait for replies to see your options.\n\n` +
        `${lostRevHook}` +
        `${senderIntro} I have prepared a sleek mobile catalog preview specifically for ${businessName} featuring 1-tap WhatsApp checkout and instant inquiries to capture those lost sales.\n\n` +
        `Can I send you the short preview link to take a look?`
      );
    }

    case 'artisan_craft_export': {
      return (
        `${greeting}\n\n` +
        `Respecting the timeless heritage of Kashmiri craftsmanship at ${businessName} in ${city}. 🧶✨\n\n` +
        `Both domestic visitors and national/international parcel buyers want instant authenticity proof, certified grade details, and clear rates without having to request photos one-by-one on DM.\n\n` +
        `${senderIntro} I have built an authentic artisan showcase catalog preview designed for ${businessName}, featuring certified product displays, parcel ordering options, and direct 1-tap WhatsApp checkout.\n\n` +
        `May I send you the preview link so you can review how it represents your craftsmanship?`
      );
    }

    case 'concise_3liner': {
      return (
        `${greeting}\n\n` +
        `Admiring ${businessName}'s reputation in ${city}! 🌟\n\n` +
        `I built a quick 1-tap mobile WhatsApp catalog preview for ${businessName} so your customers can view your items and pricing instantly without messaging back-and-forth.\n\n` +
        `Can I send you the preview link?`
      );
    }

    case 'dining_hospitality': {
      return (
        `${greeting}\n\n` +
        `Noticed your wonderful dining and hospitality presence in ${city}! ☕🍽️\n\n` +
        `When patrons and travelers search for ${businessName}, having an instant interactive mobile menu or direct reservation link saves your customers time and lets you capture direct table bookings without paying hefty third-party commissions.\n\n` +
        `${senderIntro} I created a responsive mobile menu & reservation preview for ${businessName} featuring 1-tap WhatsApp ordering.\n\n` +
        `Would you like to take a look at the preview link?`
      );
    }

    case 'local_maps_discovery':
    default: {
      return (
        `${greeting}\n\n` +
        `I was searching for verified local businesses in ${city} and found ${businessName}'s Google Maps listing! 📍\n\n` +
        `When local customers discover you on Maps or search, having a direct link that opens a dedicated mobile showcase with 1-tap WhatsApp inquiry turns those searchers straight into paying customers.\n\n` +
        `${senderIntro} I have put together a dedicated mobile preview for ${businessName}.\n\n` +
        `Would you like me to share the link so you can see how it works?`
      );
    }
  }
}
