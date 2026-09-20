import { Lead, WhatsAppPitch } from '../types/lead';
import { classifyLeadNiche } from '../utils/nicheClassifier';

/**
 * Generates a high-converting, personalized WhatsApp pitch for a business lead.
 * STRICT DIRECTIVE:
 * 1. NEVER say "I came across your business on Instagram" or mention discovering them via Instagram.
 * 2. Highlight their authentic local reputation using their Google Maps rating and reviews.
 * 3. Clearly point out the core business problem tailored to their exact niche (Gyms, Bridal Jewelry, Cafes, etc.):
 *    Without a direct instant ordering link/catalog, they lose an estimated 20% to 30% of sales/inquiries.
 * 4. Offer a custom mobile catalog/preview with direct WhatsApp booking to recover those lost sales.
 */
export function generateWhatsAppPitch(lead: Lead): WhatsAppPitch {
  const firstNameOrBiz = lead.name.split(' ')[0] || lead.name;
  const city = lead.location?.city || 'local area';
  const niche = classifyLeadNiche(lead);

  const mapsRating = lead.social?.googleMaps?.rating;
  const reviewsCount = lead.social?.googleMaps?.userRatingsTotal;

  // Build trust hook using Google Maps rating or local presence (NO Instagram discovery mention)
  let reputationHook = '';
  if (mapsRating) {
    reputationHook = `I was checking your business on Google Maps and noticed your strong ${mapsRating}★ rating${
      reviewsCount ? ` with ${reviewsCount}+ customer reviews` : ''
    } in ${city} — it clearly shows people really trust and love your work! 🌟`;
  } else if (lead.social?.googleMaps?.hasListing) {
    reputationHook = `I noticed your verified storefront on Google Maps in ${city} — you have built a solid local customer reputation! 🌟`;
  } else {
    reputationHook = `I have been researching top established ${lead.category || 'local'} businesses in ${city} and really admire the reputation ${lead.name} has built! 🌟`;
  }

  let problemAndSolution = '';

  switch (niche) {
    case 'gyms':
      problemAndSolution =
        `However, analyzing how prospective members currently discover fitness clubs in ${city}, people looking for membership plans, personal training packages, and day passes have no instant link to view pricing or book a trial workout.\n\n` +
        `Fitness industry data shows gyms lose an estimated 20% to 30% of prospective member signups simply because people hesitate to call or message back-and-forth for basic fee details, and end up visiting gyms that offer instant 1-tap WhatsApp trial booking.\n\n` +
        `I am a local web specialist, and I have put together a mobile membership & trial booking showcase preview specifically for ${lead.name} featuring direct 1-tap WhatsApp trial passes to help you capture those lost memberships.`;
      break;

    case 'bridal_jewelry':
      problemAndSolution =
        `However, looking at the customer journey for bridal jewelry and wedding trousseau shopping in ${city}, prospective brides and families searching for your sets and couture have no direct digital showcase to browse your collection or book a private bridal consultation.\n\n` +
        `High-ticket bridal retail studies show studios lose an estimated 20% to 30% of serious buyers because customers hesitate to DM back-and-forth for photos and pricing, and instead book consultations with studios having an instant digital bridal catalog.\n\n` +
        `I am a local web specialist, and I have put together a private bridal showcase catalog preview for ${lead.name} featuring 1-tap WhatsApp appointment booking to help you capture those high-ticket sales.`;
      break;

    case 'cafes_dining':
      problemAndSolution =
        `However, looking closely at how diners discover cafes and eateries in ${city}, customers searching for your menu, daily specials, or takeaway options have no official interactive digital menu with 1-tap ordering.\n\n` +
        `Hospitality data shows cafes lose an estimated 20% to 30% of pickup orders and table reservations simply because hungry guests cannot instantly browse food items on their phone and order straight into WhatsApp.\n\n` +
        `I am a local digital specialist, and I have designed an interactive mobile food menu and reservation preview specifically for ${lead.name} with direct 1-tap WhatsApp ordering to recover those lost orders.`;
      break;

    case 'handicrafts_artisan':
      problemAndSolution =
        `However, looking at how national and international buyers discover authentic Kashmiri artisans, interested clients who want pure Pashmina, walnut woodcraft, or papier-mâché have no certified instant catalog link with pricing.\n\n` +
        `Data shows craft businesses lose 20% to 30% of high-intent buyers because shoppers hesitate to DM back-and-forth for photos and authenticity proof, and buy from online sellers with instant catalogs.\n\n` +
        `I am a local web specialist, and I have built an authentic artisan showcase preview for ${lead.name} featuring certified craft verification and 1-tap WhatsApp ordering to capture those lost sales.`;
      break;

    case 'saffron_dryfruits':
      problemAndSolution =
        `However, looking closely at your current buyer flow, high-intent customers wanting certified Grade-1 Mongra saffron, Mamra almonds, and walnuts have no instant parcel-ordering link to view bundle pricing and lab certifications.\n\n` +
        `Studies show dry fruit merchants lose 20% to 30% of parcel orders when customers must ask back-and-forth for weight options and rates instead of picking a package through an instant link.\n\n` +
        `I have created a custom parcel-ordering mobile catalog preview for ${lead.name} with direct 1-tap WhatsApp checkout to help you recover that lost 20-30% revenue.`;
      break;

    case 'hospitality_tourism':
      problemAndSolution =
        `However, analyzing direct bookings, prospective travelers looking to stay at your property in ${city} have no direct 1-tap booking portal, forcing them to pay high 18-25% OTA commission fees or drop off.\n\n` +
        `Hospitality data shows independent boutique stays lose 20% to 30% of direct guests who cannot immediately check room photos, amenities, and room availability on WhatsApp.\n\n` +
        `I have prepared a zero-commission direct reservation showcase preview for ${lead.name} to capture direct bookings right in your WhatsApp chat.`;
      break;

    case 'fashion_boutique':
    default:
      problemAndSolution =
        `However, looking closely at your current customer journey, interested buyers who find you have no official website or instant catalog link to see your full collection and pricing.\n\n` +
        `Data shows that local businesses lose an estimated 20% to 30% of sales simply because prospective buyers hesitate to message back-and-forth for basic prices and availability, and end up ordering from competitors with instant checkout.\n\n` +
        `I am a local web specialist, and I have already put together a sleek mobile store preview for ${lead.name} featuring direct 1-tap WhatsApp checkout to help you recover that lost 20-30% revenue.`;
      break;
  }

  const message =
    `Hello ${firstNameOrBiz}! 👋\n\n` +
    `${reputationHook}\n\n` +
    `${problemAndSolution}\n\n` +
    `Can I send you the preview link so you can see how it works for ${lead.name}?`;

  return {
    id: `pitch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    message,
    recipientPhone: lead.phone,
    generatedAt: new Date().toISOString(),
  };
}

