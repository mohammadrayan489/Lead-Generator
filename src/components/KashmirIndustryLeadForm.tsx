import React, { useState, useId } from 'react';
import {
  Sparkles,
  Loader2,
  Building2,
  MapPin,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Globe,
  Instagram,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Tag,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import {
  KASHMIR_REGIONAL_HUBS,
  KASHMIR_INDUSTRY_PRESETS,
  buildKashmirIndustryQuery,
  IndustryFormParams,
  IndustryPreset,
} from '../utils/industryPromptBuilder';

interface KashmirIndustryLeadFormProps {
  onGenerate: (query: string, rawParams?: IndustryFormParams) => Promise<void> | void;
  isLoading: boolean;
  activeLeadCount?: number;
}

export const KashmirIndustryLeadForm: React.FC<KashmirIndustryLeadFormProps> = ({
  onGenerate,
  isLoading,
  activeLeadCount = 0,
}) => {
  const formId = useId();

  // Form State
  const [industryDescription, setIndustryDescription] = useState<string>(
    'Pashmina shawls, Kani weavers, and handmade walnut woodcraft artisans'
  );
  const [kashmirHub, setKashmirHub] = useState<string>('srinagar');
  const [targetCount, setTargetCount] = useState<number>(20);
  const [noWebsiteOnly, setNoWebsiteOnly] = useState<boolean>(true);
  const [activeSocialOnly, setActiveSocialOnly] = useState<boolean>(true);
  const [verifiedWhatsAppOnly, setVerifiedWhatsAppOnly] = useState<boolean>(true);
  const [valueProposition, setValueProposition] = useState<string>(
    'Direct B2B WhatsApp Sales Catalog & Global Buyer Inquiries'
  );
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pashmina_handicrafts');
  const [lastGeneratedSummary, setLastGeneratedSummary] = useState<{
    industry: string;
    hub: string;
    count: number;
  } | null>(null);

  // Compute live synthesized query preview
  const currentParams: IndustryFormParams = {
    industryDescription,
    kashmirHub,
    targetCount,
    noWebsiteOnly,
    activeSocialOnly,
    verifiedWhatsAppOnly,
    valueProposition,
  };

  const synthesizedQuery = buildKashmirIndustryQuery(currentParams);

  const handleSelectPreset = (preset: IndustryPreset) => {
    setSelectedPresetId(preset.id);
    setIndustryDescription(preset.industryDescription);
    setKashmirHub(preset.kashmirHub);
    setTargetCount(preset.suggestedCount);
    setValueProposition(preset.valueProposition);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!industryDescription.trim() || isLoading) return;

    const selectedHub = KASHMIR_REGIONAL_HUBS.find((h) => h.id === kashmirHub);
    setLastGeneratedSummary({
      industry: industryDescription.trim().slice(0, 40) + (industryDescription.length > 40 ? '...' : ''),
      hub: selectedHub ? selectedHub.name.split('(')[0].trim() : 'Kashmir Valley',
      count: targetCount,
    });

    await onGenerate(synthesizedQuery, currentParams);
  };

  const handleReset = () => {
    const defaultPreset = KASHMIR_INDUSTRY_PRESETS[0];
    handleSelectPreset(defaultPreset);
  };

  const countOptions = [10, 15, 20, 25, 35, 50];

  return (
    <div
      id="kashmir-industry-lead-generator-form"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-4 sm:p-6 transition-colors relative overflow-hidden"
    >
      {/* Decorative top ambient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              AI Industry Lead Generator
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
              Kashmir Valley Only
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            Describe a Target Industry in Kashmir
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Describe your target niche or choose an artisan preset. Gemini AI scans authentic Kashmir markets to discover and verify local leads.
          </p>
        </div>

        {/* Quick presets inspiration dropdown / pill list */}
        <div className="flex items-center gap-1.5 self-start sm:self-center">
          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
            title="Reset form to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Quick Industry Presets Carousel */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            Popular Kashmir Industry Verticals:
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">
            Click to auto-fill industry profile
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {KASHMIR_INDUSTRY_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                disabled={isLoading}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all text-left flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <span>{preset.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-indigo-500 text-indigo-50'
                      : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {preset.suggestedCount} leads
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Industry Description Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label
              htmlFor={`${formId}-industry-desc`}
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
            >
              <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Target Industry / Business Vertical Description:
            </label>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {industryDescription.length} characters
            </span>
          </div>

          <div className="relative">
            <textarea
              id={`${formId}-industry-desc`}
              value={industryDescription}
              onChange={(e) => {
                setIndustryDescription(e.target.value);
                setSelectedPresetId('');
              }}
              rows={3}
              disabled={isLoading}
              placeholder="Describe the businesses you are targeting in Kashmir (e.g., Traditional saffron growers, bridal boutiques in Lal Chowk, artisanal bakery cafes, walnut woodcarving workshops)..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/60 transition-all resize-y"
            />
          </div>
        </div>

        {/* Region & Count Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          {/* Kashmir Regional Hub Dropdown */}
          <div className="md:col-span-7">
            <label
              htmlFor={`${formId}-kashmir-hub`}
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              Target Kashmir Commercial Hub:
            </label>
            <div className="relative">
              <select
                id={`${formId}-kashmir-hub`}
                value={kashmirHub}
                onChange={(e) => setKashmirHub(e.target.value)}
                disabled={isLoading}
                className="w-full text-xs sm:text-sm py-2.5 pl-3 pr-9 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950/60 transition-all appearance-none cursor-pointer"
              >
                {KASHMIR_REGIONAL_HUBS.map((hub) => (
                  <option key={hub.id} value={hub.id}>
                    {hub.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
            {/* Display active hub tag */}
            {(() => {
              const activeHub = KASHMIR_REGIONAL_HUBS.find((h) => h.id === kashmirHub);
              return activeHub ? (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
                  <span className="font-medium text-slate-600 dark:text-slate-300">Hub Markets:</span>{' '}
                  {activeHub.tagline}
                </p>
              ) : null;
            })()}
          </div>

          {/* Lead Volume Count */}
          <div className="md:col-span-5">
            <label
              htmlFor={`${formId}-target-count`}
              className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                Leads Quantity:
              </span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {targetCount} Businesses
              </span>
            </label>

            <div className="flex items-center gap-1.5">
              {countOptions.map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setTargetCount(cnt)}
                  disabled={isLoading}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    targetCount === cnt
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {cnt}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Guaranteed unique, non-repeating Kashmir records
            </p>
          </div>
        </div>

        {/* Lead Profile Criteria (Checkboxes) */}
        <div className="bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 sm:p-3.5">
          <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Lead Qualification & Outreach Filters:
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              Tailors sales pitch & qualification score
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Filter 1: No Website */}
            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <input
                type="checkbox"
                checked={noWebsiteOnly}
                onChange={(e) => setNoWebsiteOnly(e.target.checked)}
                disabled={isLoading}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="text-xs leading-tight">
                <span className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                  No Official Website
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Target businesses needing a website or store
                </span>
              </div>
            </label>

            {/* Filter 2: Active Instagram */}
            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <input
                type="checkbox"
                checked={activeSocialOnly}
                onChange={(e) => setActiveSocialOnly(e.target.checked)}
                disabled={isLoading}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="text-xs leading-tight">
                <span className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <Instagram className="w-3.5 h-3.5 text-pink-500" />
                  Active Instagram
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Businesses with proven social traction
                </span>
              </div>
            </label>

            {/* Filter 3: Direct WhatsApp Phone */}
            <label className="flex items-start gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <input
                type="checkbox"
                checked={verifiedWhatsAppOnly}
                onChange={(e) => setVerifiedWhatsAppOnly(e.target.checked)}
                disabled={isLoading}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="text-xs leading-tight">
                <span className="font-medium text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  Direct WhatsApp Phone
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  Strictly local +91 Kashmir phone numbers
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Collapsible Advanced Pitch & Angle Customization */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <span>{showAdvanced ? 'Hide' : 'Customize'} Sales Pitch & Offer Angle</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showAdvanced && (
            <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 space-y-2.5 animate-in fade-in duration-200">
              <label
                htmlFor={`${formId}-value-prop`}
                className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Value Proposition / Tailored Outreach Focus:
              </label>
              <input
                id={`${formId}-value-prop`}
                type="text"
                value={valueProposition}
                onChange={(e) => setValueProposition(e.target.value)}
                disabled={isLoading}
                placeholder="e.g. WhatsApp Catalog & Direct Orders, Modern Portfolio Website, Local SEO..."
                className="w-full text-xs sm:text-sm py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-950"
              />
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="text-slate-400 font-medium">Suggestions:</span>
                {[
                  'WhatsApp Sales Catalog & Ordering',
                  'Modern E-Commerce Website',
                  'Instagram Growth & Content Marketing',
                  'Google Maps & Local SEO Ranking',
                ].map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => setValueProposition(sug)}
                    className="px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live AI Synthesized Query Preview */}
        <div className="rounded-xl p-3 bg-slate-100/70 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              AI Search Formulation Preview
            </span>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
              Gemini Prompt
            </span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 italic font-mono text-[11px] line-clamp-2">
            "{synthesizedQuery}"
          </p>
        </div>

        {/* Submit Button & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Workspace currently holds{' '}
              <strong className="text-slate-800 dark:text-slate-200 font-semibold">{activeLeadCount}</strong> Kashmir
              leads
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !industryDescription.trim()}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-600 text-white font-medium text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:cursor-not-allowed hover:shadow-indigo-600/20 active:scale-[0.99]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating Kashmir Leads...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Generate {targetCount} Business Leads</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Post-generation quick jump notification */}
      {lastGeneratedSummary && !isLoading && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 animate-in fade-in">
          <div className="flex items-center gap-2 truncate">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span className="truncate">
              Generated <strong>{lastGeneratedSummary.count} leads</strong> for "
              {lastGeneratedSummary.industry}" in {lastGeneratedSummary.hub}.
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              const leadsSection = document.getElementById('leads-section');
              leadsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium shrink-0 ml-2 cursor-pointer inline-flex items-center gap-1"
          >
            <span>View Leads Below</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
