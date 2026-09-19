import { Lead, WhatsAppPitch } from '../types/lead';

/**
 * Generates a high-converting, personalized WhatsApp pitch for a business lead.
 */
export function generateWhatsAppPitch(lead: Lead): WhatsAppPitch {
  const firstNameOrBiz = lead.name.split(' ')[0] || lead.name;
  const igHandle = lead.social.instagram?.handle;
  const city = lead.location.city;
  const opportunity = lead.opportunity.opportunityType;

  let message = '';

  switch (opportunity) {
    case 'needs_website':
      message = `Hi ${firstNameOrBiz}! 👋 I came across your business${
        igHandle ? ` on Instagram (@${igHandle})` : ''
      } in ${city} and really loved your collection/work! 🌟\n\n` +
      `I noticed you don't have a direct website or ordering link set up yet for customers. Many businesses in ${city} lose 30-40% of interested buyers because there's no quick way to view products and order 24/7.\n\n` +
      `We build clean, mobile-first websites connected directly to WhatsApp checkout in just 3 days. Would you be open to a quick 2-minute video preview of what a store for ${lead.name} would look like?`;
      break;

    case 'social_growth':
      message = `Hi team ${firstNameOrBiz}! 👋 Found your website while looking for top ${lead.category} services in ${city}.\n\n` +
      `Your website looks great, but I noticed your Instagram presence is relatively quiet right now. We help ${lead.category} businesses generate 5-10 qualified inbound inquiries every week through targeted local reels and community outreach.\n\n` +
      `Are you currently taking on new clients this month?`;
      break;

    case 'ecommerce_expansion':
      message = `Hello ${firstNameOrBiz}! 👋 Hope you're having a productive week.\n\n` +
      `I've been following your updates on Instagram${igHandle ? ` (@${igHandle})` : ''} and love the strong engagement you have in ${city}!\n\n` +
      `Since you already have a solid audience and website, we can help you plug in automated WhatsApp catalog orders & customer retargeting to boost repeat purchases by 25%.\n\n` +
      `Would you like me to share a 1-page breakdown of how other ${lead.category} brands are running this?`;
      break;

    default:
      message = `Hi ${firstNameOrBiz}! 👋 I came across ${lead.name} in ${city} and was really impressed by what you're doing.\n\n` +
      `We specialize in helping local businesses in ${city} streamline client inquiries and scale their sales.\n\n` +
      `Would you have 5 minutes this week for a brief chat to see if we can bring you more high-intent customers?`;
      break;
  }

  return {
    id: `pitch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    message,
    recipientPhone: lead.phone,
    generatedAt: new Date().toISOString(),
  };
}
