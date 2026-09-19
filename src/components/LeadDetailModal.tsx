import React, { useState } from 'react';
import { Lead } from '../types/lead';
import { StatusBadge } from './StatusBadge';
import {
  X,
  Globe,
  Instagram,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  Copy,
  Check,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { buildWhatsAppLink, normalizeWebsiteUrl } from '../utils/formatters';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Lead['status']) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onStatusChange,
}) => {
  const [copied, setCopied] = useState(false);

  if (!lead) return null;

  const pitch = lead.pitches?.[0]?.message || 'No pitch generated yet.';
  const whatsappUrl = buildWhatsAppLink(lead.phone, pitch);

  const handleCopyPitch = () => {
    if (pitch) {
      navigator.clipboard.writeText(pitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {lead.category}
              </span>
              <StatusBadge status={lead.status} />
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                Score: {lead.qualificationScore}/100
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {lead.location.formattedAddress || lead.location.address || lead.location.city}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Sales Opportunity Insight */}
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-900 mb-1">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Sales Opportunity: {lead.opportunity.opportunityType.replace('_', ' ').toUpperCase()}</span>
            </div>
            <p className="text-xs text-indigo-950 font-normal leading-relaxed mb-3">
              {lead.opportunity.summary}
            </p>
            {lead.opportunity.recommendedOffer && (
              <div className="bg-white/80 rounded-lg p-2.5 border border-indigo-100/80 text-xs text-indigo-900">
                <span className="font-semibold">Recommended Offer: </span>
                {lead.opportunity.recommendedOffer}
              </div>
            )}
          </div>

          {/* Qualification Reasons */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2.5">
              Qualification Signals
            </h4>
            <ul className="space-y-1.5">
              {lead.qualificationReasons.map((reason, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Presence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Website
              </span>
              {lead.website.hasWebsite && lead.website.url ? (
                <a
                  href={normalizeWebsiteUrl(lead.website.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-indigo-600 hover:underline flex items-center gap-1.5 truncate"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate">{lead.website.url}</span>
                </a>
              ) : (
                <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                  No Website Found
                </span>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Social Profile
              </span>
              {lead.social.instagram?.handle ? (
                <a
                  href={`https://instagram.com/${lead.social.instagram.handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-pink-600 hover:underline flex items-center gap-1.5 truncate"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>@{lead.social.instagram.handle}</span>
                  {lead.social.instagram.followersCount ? (
                    <span className="text-slate-400 text-[11px]">
                      ({lead.social.instagram.followersCount.toLocaleString()} followers)
                    </span>
                  ) : null}
                </a>
              ) : (
                <span className="text-xs text-slate-500">Not connected</span>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Direct Phone
              </span>
              {lead.phone ? (
                <span className="text-xs font-medium text-slate-800 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {lead.phone}
                </span>
              ) : (
                <span className="text-xs text-slate-500">Unavailable</span>
              )}
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-1">
                Status Pipeline
              </span>
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
                className="text-xs bg-white border border-slate-300 text-slate-800 font-medium rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="discovered">Discovered</option>
                <option value="verified">Verified</option>
                <option value="qualified">Qualified</option>
                <option value="contacted">Contacted</option>
                <option value="unqualified">Unqualified</option>
              </select>
            </div>
          </div>

          {/* Personalized WhatsApp Pitch Section */}
          <div className="border border-emerald-200 bg-emerald-50/30 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Personalized WhatsApp Pitch</span>
              </div>
              <button
                type="button"
                onClick={handleCopyPitch}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-md transition-colors shadow-xs"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-white border border-emerald-100 rounded-lg p-3 text-xs text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
              {pitch}
            </div>

            {whatsappUrl && (
              <div className="mt-3 flex justify-end">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Launch WhatsApp Chat</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between rounded-b-2xl">
          <span className="text-xs text-slate-400">
            Source: {lead.sourceQuery || 'Natural language search'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
