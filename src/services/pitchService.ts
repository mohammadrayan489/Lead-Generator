import { Lead, WhatsAppPitch } from '../types/lead';
import { classifyLeadNiche } from '../utils/nicheClassifier';
import {
  KashmiriTemplateId,
  KashmiriTemplateOptions,
  generateKashmiriWhatsAppTemplate,
  buildWhatsAppTriggerUrl,
  getCleanWhatsAppPhone,
  KASHMIRI_TEMPLATES,
} from './kashmiriWhatsAppTemplates';

export type {
  KashmiriTemplateId,
  KashmiriTemplateOptions,
};
export {
  generateKashmiriWhatsAppTemplate,
  buildWhatsAppTriggerUrl,
  getCleanWhatsAppPhone,
  KASHMIRI_TEMPLATES,
};

/**
 * Generates a high-converting, personalized WhatsApp pitch for a business lead,
 * customized for the Kashmiri business context.
 */
export function generateWhatsAppPitch(
  lead: Lead,
  templateId: KashmiriTemplateId = 'respectful_adaab',
  options?: KashmiriTemplateOptions
): WhatsAppPitch {
  const message = generateKashmiriWhatsAppTemplate(lead, templateId, options);

  return {
    id: `pitch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    message,
    recipientPhone: lead.phone,
    generatedAt: new Date().toISOString(),
  };
}


