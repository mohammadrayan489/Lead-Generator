import React, { useState, useMemo, useEffect } from 'react';
import {
  MessageCircle,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Gem,
  TrendingUp,
  Zap,
  Coffee,
  MapPin,
  Sliders,
  Phone,
  Info,
} from 'lucide-react';
import { Lead } from '../types/lead';
import {
  KashmiriTemplateId,
  KashmiriGreetingStyle,
  KashmiriTemplateOptions,
  KASHMIRI_TEMPLATES,
  generateKashmiriWhatsAppTemplate,
  buildWhatsAppTriggerUrl,
} from '../services/kashmiriWhatsAppTemplates';
import { classifyLeadNiche, NICHE_DEFINITIONS } from '../utils/nicheClassifier';

interface KashmiriWhatsAppStudioProps {
  lead: Lead;
  onPitchTriggered: (updatedLead: Lead, message: string, templateId: KashmiriTemplateId) => void;
  className?: string;
  compactMode?: boolean;
}

export const KashmiriWhatsAppStudio: React.FC<KashmiriWhatsAppStudioProps> = ({
  lead,
  onPitchTriggered,
  className = '',
  compactMode = false,
}) => {
  const niche = classifyLeadNiche(lead);
  const nicheDef = NICHE_DEFINITIONS[niche];

  // Default template selection based on lead characteristics
  const defaultTemplateId = useMemo<KashmiriTemplateId>(() => {
    if (niche === 'handicrafts_artisan' || niche === 'saffron_dryfruits') {
      return 'artisan_craft_export';
    }
    if (niche === 'cafes_dining' || niche === 'hospitality_tourism') {
      return 'dining_hospitality';
    }
    return 'respectful_adaab';
  }, [niche]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<KashmiriTemplateId>(defaultTemplateId);
  const [greetingStyle, setGreetingStyle] = useState<KashmiriGreetingStyle>('salam_janab');
  const [senderName, setSenderName] = useState<string>('');
  const [senderTitle, setSenderTitle] = useState<string>('local web specialist in Kashmir');
  const [includeGoogleRating, setIncludeGoogleRating] = useState<boolean>(true);
  const [includeLostRevenueMetric, setIncludeLostRevenueMetric] = useState<boolean>(true);
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  // Editable message buffer
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isManuallyEdited, setIsManuallyEdited] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [launchedNotice, setLaunchedNotice] = useState<boolean>(false);

  // Generate initial or updated template
  const templateOptions: KashmiriTemplateOptions = useMemo(
    () => ({
      greetingStyle,
      senderName,
      senderTitle,
      includeGoogleRating,
      includeLostRevenueMetric,
      includeKashmiriCourtesy: true,
    }),
    [greetingStyle, senderName, senderTitle, includeGoogleRating, includeLostRevenueMetric]
  );

  // Synchronize generated message when parameters change (unless manually typed by user)
  useEffect(() => {
    if (!isManuallyEdited) {
      const generated = generateKashmiriWhatsAppTemplate(lead, selectedTemplateId, templateOptions);
      setCustomMessage(generated);
    }
  }, [lead, selectedTemplateId, templateOptions, isManuallyEdited]);

  const handleSelectTemplate = (templateId: KashmiriTemplateId) => {
    setSelectedTemplateId(templateId);
    setIsManuallyEdited(false);
    const generated = generateKashmiriWhatsAppTemplate(lead, templateId, templateOptions);
    setCustomMessage(generated);
  };

  const handleResetToTemplate = () => {
    setIsManuallyEdited(false);
    const generated = generateKashmiriWhatsAppTemplate(lead, selectedTemplateId, templateOptions);
    setCustomMessage(generated);
  };

  const handleCopy = async () => {
    if (!customMessage) return;
    try {
      await navigator.clipboard.writeText(customMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);

      // Also record pitch action on copy
      const updatedLead: Lead = {
        ...lead,
        hasBeenPitched: true,
        isStarred: true,
        pitchedAt: lead.pitchedAt || new Date().toISOString(),
        status: lead.status === 'new' || lead.status === 'discovered' ? 'contacted' : lead.status,
      };
      onPitchTriggered(updatedLead, customMessage, selectedTemplateId);
    } catch {
      // Fallback
    }
  };

  // Direct WhatsApp Trigger
  const triggerUrls = useMemo(() => {
    return buildWhatsAppTriggerUrl(lead.phone, customMessage);
  }, [lead.phone, customMessage]);

  const handleTriggerWhatsApp = () => {
    if (!triggerUrls.hasValidPhone) {
      alert('This business lead does not have a valid telephone number for WhatsApp.');
      return;
    }

    // Launch WhatsApp via universal link
    window.open(triggerUrls.universalUrl, '_blank', 'noopener,noreferrer');

    // Notify user & mark lead as pitched
    setLaunchedNotice(true);
    setTimeout(() => setLaunchedNotice(false), 4000);

    const updatedLead: Lead = {
      ...lead,
      hasBeenPitched: true,
      isStarred: true,
      pitchedAt: new Date().toISOString(),
      status: lead.status === 'new' || lead.status === 'discovered' ? 'contacted' : lead.status,
      pitches: [
        ...(lead.pitches || []),
        {
          id: `pitch_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          message: customMessage,
          recipientPhone: lead.phone,
          generatedAt: new Date().toISOString(),
        },
      ],
    };

    onPitchTriggered(updatedLead, customMessage, selectedTemplateId);
  };

  const getTemplateIcon = (id: KashmiriTemplateId) => {
    switch (id) {
      case 'respectful_adaab':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'lost_sales_recovery':
        return <TrendingUp className="w-3.5 h-3.5" />;
      case 'artisan_craft_export':
        return <Gem className="w-3.5 h-3.5" />;
      case 'concise_3liner':
        return <Zap className="w-3.5 h-3.5" />;
      case 'dining_hospitality':
        return <Coffee className="w-3.5 h-3.5" />;
      case 'local_maps_discovery':
      default:
        return <MapPin className="w-3.5 h-3.5" />;
    }
  };

  const isPitched = Boolean(lead.isStarred || lead.hasBeenPitched || lead.status === 'contacted');

  return (
    <div
      id={`whatsapp-studio-${lead.id}`}
      className={`border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/25 dark:bg-emerald-950/20 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 transition-all ${className}`}
    >
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-emerald-100 dark:border-emerald-900/60">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Kashmiri WhatsApp Pitch Studio</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Pre-Filled & 1-Tap Trigger
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Culturally tailored outreach for {lead.name} ({lead.location.city || 'Kashmir'})
          </p>
        </div>

        {/* Lead Phone Badge & Pitch Status */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 font-mono text-xs font-bold shadow-2xs">
            <Phone className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{lead.phone || 'No phone'}</span>
          </div>

          {isPitched && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-700/80 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
              <span>Pitched ★</span>
            </span>
          )}
        </div>
      </div>

      {/* Template Selection Tabs */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <span>Select Kashmiri Context Template:</span>
          </span>
          <button
            type="button"
            onClick={() => setShowCustomizer((prev) => !prev)}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 hover:text-emerald-800 dark:hover:text-emerald-200 bg-white/80 dark:bg-slate-900/80 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-md transition-colors cursor-pointer"
          >
            <Sliders className="w-3 h-3" />
            <span>{showCustomizer ? 'Hide Options' : 'Customize Tone & Greeting'}</span>
            {showCustomizer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          {KASHMIRI_TEMPLATES.map((tmpl) => {
            const isSelected = selectedTemplateId === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleSelectTemplate(tmpl.id)}
                className={`p-2 sm:p-2.5 rounded-xl text-left border transition-all cursor-pointer select-none relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-400/30'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold truncate ${
                        isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {getTemplateIcon(tmpl.id)}
                      <span className="truncate">{tmpl.title}</span>
                    </span>
                  </div>
                  <p
                    className={`text-[10px] line-clamp-2 leading-tight ${
                      isSelected ? 'text-emerald-100' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tmpl.description}
                  </p>
                </div>
                <div className="mt-1.5">
                  <span
                    className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full inline-block truncate ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {tmpl.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expandable Customization Options */}
      {showCustomizer && (
        <div className="mt-3 p-3 bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/60 rounded-xl space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Greeting Style */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Greeting & Etiquette:
              </label>
              <select
                value={greetingStyle}
                onChange={(e) => {
                  setGreetingStyle(e.target.value as KashmiriGreetingStyle);
                  setIsManuallyEdited(false);
                }}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-emerald-500"
              >
                <option value="salam_janab">Assalamu Alaikum Janab! (Kashmiri Courteous)</option>
                <option value="salam">Assalamu Alaikum! (Warm)</option>
                <option value="adaab">Adaab / Hello! (Polite)</option>
                <option value="formal_team">Respected Team (Formal Corporate)</option>
              </select>
            </div>

            {/* Sender Persona Title */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Your Self-Introduction:
              </label>
              <input
                type="text"
                value={senderTitle}
                onChange={(e) => {
                  setSenderTitle(e.target.value);
                  setIsManuallyEdited(false);
                }}
                placeholder="e.g. local web specialist in Kashmir"
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-200 focus:outline-emerald-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={includeGoogleRating}
                onChange={(e) => {
                  setIncludeGoogleRating(e.target.checked);
                  setIsManuallyEdited(false);
                }}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Include Google Maps rating hook ({lead.social?.googleMaps?.rating ? `${lead.social.googleMaps.rating}★` : 'local presence'})</span>
            </label>

            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-300 select-none">
              <input
                type="checkbox"
                checked={includeLostRevenueMetric}
                onChange={(e) => {
                  setIncludeLostRevenueMetric(e.target.checked);
                  setIsManuallyEdited(false);
                }}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Include 20-30% lost sales recovery data</span>
            </label>
          </div>
        </div>
      )}

      {/* Editable Live Message Box */}
      <div className="mt-3.5">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pre-filled Message (Ready to Send):
            </span>
            {isManuallyEdited && (
              <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-800 font-medium">
                Custom Edited
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isManuallyEdited && (
              <button
                type="button"
                onClick={handleResetToTemplate}
                className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                title="Reset to generated template"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={compactMode ? 6 : 8}
            value={customMessage}
            onChange={(e) => {
              setCustomMessage(e.target.value);
              setIsManuallyEdited(true);
            }}
            className="w-full bg-white dark:bg-slate-900 border border-emerald-200/90 dark:border-emerald-800/80 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-100 font-sans leading-relaxed focus:outline-emerald-500 focus:ring-2 focus:ring-emerald-400/20 resize-y"
            placeholder="Kashmiri outreach message..."
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-1 px-1">
          <span>
            {customMessage.length} characters • ~{Math.round(customMessage.length / 5)} words
          </span>
          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
            Kashmir Context: {lead.location.city || 'Srinagar'} • {nicheDef.label}
          </span>
        </div>
      </div>

      {/* Confirmation notification banner after launching */}
      {launchedNotice && (
        <div className="mt-3 p-2.5 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700 rounded-xl flex items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-1.5 font-medium">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>WhatsApp app triggered! Lead automatically marked as Pitched ★</span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
            Recorded in Pipeline
          </span>
        </div>
      )}

      {/* Main Action Buttons: Trigger WhatsApp Directly */}
      <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Info className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Clicking launches WhatsApp app directly with this pre-filled message</span>
        </div>

        <div className="flex items-center gap-2">
          {/* WhatsApp Web Fallback button */}
          <a
            href={triggerUrls.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              const updatedLead: Lead = {
                ...lead,
                hasBeenPitched: true,
                isStarred: true,
                pitchedAt: new Date().toISOString(),
                status: lead.status === 'new' || lead.status === 'discovered' ? 'contacted' : lead.status,
              };
              onPitchTriggered(updatedLead, customMessage, selectedTemplateId);
            }}
            className="hidden md:inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
            title="Open in WhatsApp Web in a new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>WhatsApp Web</span>
          </a>

          {/* Primary Trigger WhatsApp App Button */}
          <button
            type="button"
            id={`trigger-whatsapp-btn-${lead.id}`}
            onClick={handleTriggerWhatsApp}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 cursor-pointer select-none"
            title="Launch WhatsApp application directly on your phone or desktop with pre-filled text"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Trigger WhatsApp App</span>
            <span className="text-[10px] bg-emerald-700/80 px-1.5 py-0.5 rounded font-mono font-normal">
              1-Tap
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
