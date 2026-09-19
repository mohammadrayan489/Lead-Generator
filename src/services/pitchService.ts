import { Lead, WhatsAppPitch } from '../types/lead';

/**
 * Generates a high-converting, personalized WhatsApp pitch for a business lead.
 * Positioned from an independent new freelancer, offering a custom design preview.
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
      } in ${city} and really loved your collection and work! 🌟\n\n` +
      `I am a new freelancer helping local businesses establish clean, mobile-friendly online stores with direct WhatsApp ordering. I noticed you don't have a direct website link for customers yet.\n\n` +
      `I've prepared a modern store concept designed specifically for ${lead.name}. Can I send you the preview?`;
      break;

    case 'social_growth':
      message = `Hi ${firstNameOrBiz}! 👋 Found your business while looking for top ${lead.category} brands in ${city}.\n\n` +
      `I am a new freelancer helping local brands grow their Instagram & social presence to attract consistent customer inquiries through engaging content.\n\n` +
      `I put together a tailored growth plan and content concept for ${lead.name}. Can I send you the preview?`;
      break;

    case 'ecommerce_expansion':
      message = `Hello ${firstNameOrBiz}! 👋 Hope you're having a productive week.\n\n` +
      `I've been following your updates on Instagram${igHandle ? ` (@${igHandle})` : ''} and love the strong engagement you have in ${city}!\n\n` +
      `I am a new freelancer helping businesses integrate WhatsApp catalog ordering and automated customer follow-ups to boost repeat sales.\n\n` +
      `I've built a quick mockup showing how this could work for ${lead.name}. Can I send you the preview?`;
      break;

    default:
      message = `Hi ${firstNameOrBiz}! 👋 I came across ${lead.name} in ${city} and was really impressed by what you're doing.\n\n` +
      `I am a new freelancer helping local businesses in ${city} modernize their online presence and increase sales through direct WhatsApp orders.\n\n` +
      `I've prepared a custom design mockup for your business. Can I send you the preview?`;
      break;
  }

  return {
    id: `pitch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    message,
    recipientPhone: lead.phone,
    generatedAt: new Date().toISOString(),
  };
}
