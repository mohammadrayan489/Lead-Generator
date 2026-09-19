import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { StatusBadge } from './StatusBadge';
import { StatusSelector } from './StatusSelector';
import {
  Globe,
  Instagram,
  MessageCircle,
  MapPin,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Trash2,
  FileText,
  Calendar,
  Edit3,
  Check,
  X,
  Clock,
} from 'lucide-react';
import {
  buildWhatsAppLink,
  normalizeWebsiteUrl,
  buildInstagramProfileUrl,
  extractInstagramHandle,
} from '../utils/formatters';

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (id: string, status: LeadStatus) => void;
  onSelectLead: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
  onUpdateLead?: (id: string, updates: Partial<Lead>) => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onStatusChange,
  onSelectLead,
  onDeleteLead,
  onUpdateLead,
  isSelected,
  onToggleSelect,
}) => {
  const primaryPitch = lead.pitches?.[0]?.message;
  const whatsappUrl = buildWhatsAppLink(lead.phone, primaryPitch);

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteText, setNoteText] = useState(lead.notes || '');
  const [followUpDate, setFollowUpDate] = useState(lead.followUpDate || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setNoteText(lead.notes || '');
    setFollowUpDate(lead.followUpDate || '');
  }, [lead.notes, lead.followUpDate]);

  const handleSaveNotes = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    onUpdateLead?.(lead.id, {
      notes: noteText.trim() || undefined,
      followUpDate: followUpDate.trim() || undefined,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditingNotes(false);
    }, 600);
  };

  const handleClearNotes = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Clear notes and reminder for this lead?')) {
      setNoteText('');
      setFollowUpDate('');
      onUpdateLead?.(lead.id, {
        notes: undefined,
        followUpDate: undefined,
      });
      setIsEditingNotes(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/70';
    if (score >= 50) return 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800/70';
    return 'text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 border rounded-xl p-5 transition-all flex flex-col justify-between h-full relative group ${
        isSelected
          ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900 shadow-sm bg-indigo-50/20 dark:bg-indigo-950/20'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm'
      }`}
    >
      <div>
        {/* Top bar: Checkbox, Category, Status, Score, Delete */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {onToggleSelect && (
              <input
                type="checkbox"
                checked={Boolean(isSelected)}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleSelect(lead.id);
                }}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700 cursor-pointer transition-colors"
                title="Select lead"
              />
            )}
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lead.category || 'Business'}
            </span>
            <StatusSelector
              currentStatus={lead.status}
              onStatusChange={(newStatus) => onStatusChange(lead.id, newStatus)}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <div
              className={`px-2 py-0.5 rounded-full border text-xs font-bold ${getScoreColor(
                lead.qualificationScore
              )}`}
              title={`Qualification Score: ${lead.qualificationScore}/100`}
            >
              {lead.qualificationScore} pts
            </div>

            {onDeleteLead && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteLead(lead);
                }}
                className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-md transition-colors opacity-70 group-hover:opacity-100 cursor-pointer"
                title="Delete this lead"
                aria-label={`Delete ${lead.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Business Name and Location */}
        <h3
          onClick={() => onSelectLead(lead)}
          className="text-base font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer line-clamp-1"
        >
          {lead.name}
        </h3>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">
          <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
          <span className="truncate">
            {lead.location.address || lead.location.city}
            {lead.location.state ? `, ${lead.location.state}` : ''}
          </span>
        </div>

        {/* Sales Opportunity Summary */}
        <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-lg p-2.5 mb-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Opportunity:</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
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
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span className="truncate max-w-[110px]">Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 rounded-md font-medium">
              <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              No Website
            </span>
          )}

          {/* Instagram indicator */}
          {lead.social?.instagram?.handle ? (
            <a
              href={buildInstagramProfileUrl(lead.social.instagram.handle)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/50 border border-pink-200 dark:border-pink-800/80 text-pink-700 dark:text-pink-300 rounded-md transition-colors font-medium"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
              <span>@{extractInstagramHandle(lead.social.instagram.handle)}</span>
            </a>
          ) : lead.social?.hasStrongSocialPresence ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 rounded-md font-medium border border-pink-200/50 dark:border-pink-800/50">
              <Instagram className="w-3.5 h-3.5 text-pink-500 dark:text-pink-400" />
              Active Social
            </span>
          ) : null}
        </div>

        {/* Editable Conversation Notes & Follow-up Reminders */}
        {isEditingNotes ? (
          <div
            className="mb-4 bg-slate-50 dark:bg-slate-800/90 border border-indigo-200 dark:border-indigo-800 rounded-lg p-3 shadow-xs space-y-2.5 animate-in fade-in duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300">
                <FileText className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Notes & Reminders
              </span>
              <button
                type="button"
                onClick={() => setIsEditingNotes(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 rounded cursor-pointer"
                title="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Spoke to owner; interested in website catalog. Follow up Friday..."
              className="w-full text-xs p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none h-18 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              autoFocus
            />

            {/* Follow-up reminder date */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="shrink-0 font-medium">Follow-up:</span>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Quick reminder presets */}
            <div className="flex flex-wrap gap-1">
              {[
                '📞 Called: Follow up soon',
                '💬 Sent Instagram DM',
                '⭐ Interested in website',
                '📅 Meeting planned',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() =>
                    setNoteText((prev) => (prev.trim() ? `${prev}\n${preset}` : preset))
                  }
                  className="text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              {lead.notes || lead.followUpDate ? (
                <button
                  type="button"
                  onClick={handleClearNotes}
                  className="text-[11px] text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium cursor-pointer"
                >
                  Clear Note
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsEditingNotes(false)}
                  className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="text-[11px] font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save Note</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : lead.notes || lead.followUpDate ? (
          <div
            className="mb-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-lg p-2.5 text-xs text-amber-950 dark:text-amber-200 group/note cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditingNotes(true);
            }}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 text-[11px]">
                <FileText className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                Notes & Reminders
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingNotes(true);
                }}
                className="text-[10px] text-amber-800 dark:text-amber-400 hover:text-amber-950 dark:hover:text-amber-200 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                title="Edit notes"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>

            {lead.followUpDate && (
              <div className="flex items-center gap-1 text-[11px] font-medium text-amber-800 dark:text-amber-400 mb-1">
                <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Follow-up: {lead.followUpDate}</span>
              </div>
            )}

            {lead.notes && (
              <p className="text-xs text-amber-900/90 dark:text-amber-200/90 line-clamp-3 whitespace-pre-wrap leading-relaxed">
                {lead.notes}
              </p>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditingNotes(true);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 px-2 py-1 rounded-md transition-colors border border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 w-full justify-center cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Add conversation note / reminder</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value as LeadStatus)}
          className="text-xs bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
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
            className="text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              className="inline-flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <span>View Pitch</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
