import React from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { StatusBadge } from './StatusBadge';
import {
  Globe,
  Instagram,
  MessageCircle,
  MapPin,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { buildWhatsAppLink, normalizeWebsiteUrl } from '../utils/formatters';

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onSelectLead: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onStatusChange, onSelectLead }) => {
  const primaryPitch = lead.pitches?.[0]?.message;
  const whatsappUrl = buildWhatsAppLink(lead.phone, primaryPitch);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all flex flex-col justify-between h-full">
      <div>
        {/* Top bar: Category, Status, Score */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {lead.category || 'Business'}
            </span>
            <StatusBadge status={lead.status} />
          </div>

          <div
            className={`px-2 py-0.5 rounded-full border text-xs font-bold ${getScoreColor(
              lead.qualificationScore
            )}`}
            title={`Qualification Score: ${lead.qualificationScore}/100`}
          >
            {lead.qualificationScore} pts
          </div>
        </div>

        {/* Business Name and Location */}
        <h3
          onClick={() => onSelectLead(lead)}
          className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
        >
          {lead.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">
            {lead.location.address || lead.location.city}
            {lead.location.state ? `, ${lead.location.state}` : ''}
          </span>
        </div>

        {/* Sales Opportunity Summary */}
        <div className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
            <span>Opportunity:</span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-2">
            {lead.opportunity?.summary || 'Standard business sales opportunity.'}
          </p>
        </div>

        {/* Digital Footprint badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          {/* Website indicator */}
          {lead.website?.hasWebsite && lead.website.url ? (
            <a
              href={normalizeWebsiteUrl(lead.website.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate max-w-[110px]">Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-md font-medium">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              No Website
            </span>
          )}

          {/* Instagram indicator */}
          {lead.social?.instagram?.handle ? (
            <a
              href={`https://instagram.com/${lead.social.instagram.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 rounded-md transition-colors font-medium"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600" />
              <span>@{lead.social.instagram.handle}</span>
            </a>
          ) : lead.social?.hasStrongSocialPresence ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 text-pink-700 rounded-md font-medium">
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              Active Social
            </span>
          ) : null}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
          className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
        >
          <option value="discovered">Discovered</option>
          <option value="verified">Verified</option>
          <option value="qualified">Qualified</option>
          <option value="contacted">Contacted</option>
          <option value="unqualified">Unqualified</option>
        </select>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onSelectLead(lead)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Details
          </button>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              title="Open WhatsApp with personalized pitch"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Pitch</span>
            </a>
          ) : (
            <button
              type="button"
              onClick={() => onSelectLead(lead)}
              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>View Pitch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
