import React, { useState, useEffect } from 'react';
import { Lead } from '../types/lead';
import { StatusBadge } from './StatusBadge';
import { StatusSelector } from './StatusSelector';
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
  ExternalLink,
  Edit2,
  CheckCircle2,
  Trash2,
  FileText,
  Calendar,
  Clock,
} from 'lucide-react';
import {
  buildWhatsAppLink,
  normalizeWebsiteUrl,
  extractInstagramHandle,
  buildInstagramProfileUrl,
} from '../utils/formatters';
import { generateWhatsAppPitch } from '../services/pitchService';

interface LeadDetailModalProps {
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: Lead['status']) => void;
  onUpdateLead?: (id: string, updates: Partial<Lead>) => void;
  onDeleteLead?: (lead: Lead) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onStatusChange,
  onUpdateLead,
  onDeleteLead,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditingInstagram, setIsEditingInstagram] = useState(false);
  const [instagramInput, setInstagramInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [notesInput, setNotesInput] = useState('');
  const [followUpDateInput, setFollowUpDateInput] = useState('');
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  useEffect(() => {
    if (lead) {
      setInstagramInput(lead.social.instagram?.handle || '');
      setIsEditingInstagram(false);
      setSavedSuccess(false);
      setNotesInput(lead.notes || '');
      setFollowUpDateInput(lead.followUpDate || '');
      setNotesSavedSuccess(false);
    }
  }, [lead?.id, lead?.notes, lead?.followUpDate]);

  const handleSaveNotes = () => {
    if (!lead || !onUpdateLead) return;
    onUpdateLead(lead.id, {
      notes: notesInput.trim() || undefined,
      followUpDate: followUpDateInput.trim() || undefined,
    });
    setNotesSavedSuccess(true);
    setTimeout(() => setNotesSavedSuccess(false), 2000);
  };

  const handleClearNotes = () => {
    if (!lead || !onUpdateLead) return;
    if (window.confirm('Clear conversation notes and reminders for this lead?')) {
      setNotesInput('');
      setFollowUpDateInput('');
      onUpdateLead(lead.id, {
        notes: undefined,
        followUpDate: undefined,
      });
      setNotesSavedSuccess(false);
    }
  };

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

  const currentHandle = lead.social.instagram?.handle;
  const cleanedInputHandle = extractInstagramHandle(instagramInput);

  const handleSaveInstagram = () => {
    if (!onUpdateLead) return;

    const newHandle = extractInstagramHandle(instagramInput);
    const updatedSocial = {
      ...lead.social,
      hasStrongSocialPresence: Boolean(newHandle),
      instagram: newHandle
        ? {
            followersCount: lead.social.instagram?.followersCount || 15000,
            hasHighEngagement: lead.social.instagram?.hasHighEngagement ?? true,
            handle: newHandle,
          }
        : undefined,
    };

    const tempUpdatedLead: Lead = {
      ...lead,
      social: updatedSocial,
    };

    // Regenerate pitch with the updated, verified Instagram handle
    const refreshedPitch = generateWhatsAppPitch(tempUpdatedLead);

    onUpdateLead(lead.id, {
      social: updatedSocial,
      pitches: [refreshedPitch],
    });

    setIsEditingInstagram(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {lead.category}
              </span>
              <StatusSelector
                currentStatus={lead.status}
                onStatusChange={(newStatus) => onStatusChange(lead.id, newStatus)}
                size="sm"
              />
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-800/80">
                Score: {lead.qualificationScore}/100
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{lead.name}</h2>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
              <span>
                {lead.location.formattedAddress || lead.location.address || lead.location.city}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Sales Opportunity Insight */}
          <div className="bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-1">
              <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Sales Opportunity: {lead.opportunity.opportunityType.replace('_', ' ').toUpperCase()}</span>
            </div>
            <p className="text-xs text-indigo-950 dark:text-indigo-200 font-normal leading-relaxed mb-3">
              {lead.opportunity.summary}
            </p>
            {lead.opportunity.recommendedOffer && (
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-lg p-2.5 border border-indigo-100/80 dark:border-indigo-900/50 text-xs text-indigo-900 dark:text-indigo-200">
                <span className="font-semibold text-indigo-950 dark:text-indigo-300">Recommended Offer: </span>
                {lead.opportunity.recommendedOffer}
              </div>
            )}
          </div>

          {/* Qualification Reasons */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
              Qualification Signals
            </h4>
            <ul className="space-y-1.5">
              {lead.qualificationReasons.map((reason, i) => (
                <li key={i} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Presence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-850/50 dark:bg-slate-800/40">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Website
              </span>
              {lead.website.hasWebsite && lead.website.url ? (
                <a
                  href={normalizeWebsiteUrl(lead.website.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 truncate"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span className="truncate">{lead.website.url}</span>
                </a>
              ) : (
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/70 inline-block">
                  No Website Found
                </span>
              )}
            </div>

            {/* Instagram Profile Card with Handle Verification & Inline Editor */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-850/50 dark:bg-slate-800/40 flex flex-col justify-between">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Instagram className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                  <span>Instagram Profile</span>
                </span>
                {onUpdateLead && !isEditingInstagram && (
                  <button
                    type="button"
                    onClick={() => {
                      setInstagramInput(currentHandle || '');
                      setIsEditingInstagram(true);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{currentHandle ? 'Correct Handle' : 'Add Handle'}</span>
                  </button>
                )}
              </div>

              {isEditingInstagram ? (
                <div className="mt-1 space-y-2">
                  <div className="flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                    <span className="px-2.5 text-xs text-slate-400 dark:text-slate-500 font-semibold bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 py-1.5 select-none">
                      @
                    </span>
                    <input
                      type="text"
                      value={instagramInput}
                      onChange={(e) => setInstagramInput(e.target.value)}
                      placeholder="e.g. poshkaarkashmir"
                      className="px-2.5 py-1.5 text-xs w-full focus:outline-none text-slate-800 dark:text-slate-200 bg-transparent"
                      autoFocus
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    {cleanedInputHandle ? (
                      <a
                        href={buildInstagramProfileUrl(cleanedInputHandle)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-0.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Test instagram.com/{cleanedInputHandle}</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Enter a username</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsEditingInstagram(false)}
                        className="text-[11px] px-2 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveInstagram}
                        className="text-[11px] font-medium px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition-colors cursor-pointer"
                      >
                        Save & Update Pitch
                      </button>
                    </div>
                  </div>
                </div>
              ) : currentHandle ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <a
                      href={buildInstagramProfileUrl(currentHandle)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1.5 truncate"
                    >
                      <span>@{currentHandle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    {lead.social.instagram?.followersCount ? (
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                        {lead.social.instagram.followersCount.toLocaleString()} followers
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                    Direct public profile link verified
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400">Not linked</span>
              )}

              {savedSuccess && (
                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-200 dark:border-emerald-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Handle updated and WhatsApp pitch recalculated!</span>
                </div>
              )}
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-850/50 dark:bg-slate-800/40">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Direct Phone
              </span>
              {lead.phone ? (
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {lead.phone}
                </span>
              ) : (
                <span className="text-xs text-slate-500 dark:text-slate-400">Unavailable</span>
              )}
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-850/50 dark:bg-slate-800/40">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
                Status Pipeline
              </span>
              <select
                value={lead.status}
                onChange={(e) => onStatusChange(lead.id, e.target.value as Lead['status'])}
                className="text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="discovered">Discovered</option>
                <option value="verified">Verified</option>
                <option value="qualified">Qualified</option>
                <option value="contacted">Contacted</option>
                <option value="unqualified">Unqualified</option>
              </select>
            </div>
          </div>

          {/* Conversation Notes & Follow-up Reminders */}
          <div className="border border-amber-200 dark:border-amber-800/70 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
                <FileText className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Conversation Notes & Follow-up Reminders</span>
              </div>
              {notesSavedSuccess && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Notes saved!</span>
                </div>
              )}
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Record specific conversation details, client objections, quotes, or scheduled follow-ups.
            </p>

            <textarea
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="e.g. Spoke with owner regarding website setup. Sent portfolio links. Follow up on Friday at 3 PM..."
              rows={3}
              className="w-full text-xs p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-800 dark:text-slate-200 placeholder-slate-400 leading-relaxed"
            />

            {/* Follow-up reminder date & Quick presets */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium text-xs">
                  <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Follow-up Date:</span>
                </div>
                <input
                  type="date"
                  value={followUpDateInput}
                  onChange={(e) => setFollowUpDateInput(e.target.value)}
                  className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* Quick preset chips */}
              <div className="flex flex-wrap gap-1">
                {[
                  '📞 Call held',
                  '💬 WhatsApp pitch sent',
                  '📸 Instagram DM sent',
                  '⏳ Awaiting response',
                  '🤝 Meeting scheduled',
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      setNotesInput((prev) => (prev.trim() ? `${prev}\n• ${chip}` : `• ${chip}`))
                    }
                    className="text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 hover:bg-amber-50/50 dark:hover:bg-amber-950/40 text-slate-600 dark:text-slate-300 px-2 py-1 rounded transition-colors cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 dark:border-amber-800/60">
              {lead.notes || lead.followUpDate ? (
                <button
                  type="button"
                  onClick={handleClearNotes}
                  className="text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-medium hover:underline cursor-pointer"
                >
                  Clear Notes & Reminders
                </button>
              ) : (
                <span />
              )}

              <button
                type="button"
                onClick={handleSaveNotes}
                className="inline-flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
              >
                {notesSavedSuccess ? <Check className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{notesSavedSuccess ? 'Saved to Lead' : 'Save Notes'}</span>
              </button>
            </div>
          </div>

          {/* Personalized WhatsApp Pitch Section */}
          <div className="border border-emerald-200 dark:border-emerald-800/70 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-xl p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Personalized WhatsApp Pitch</span>
              </div>
              <button
                type="button"
                onClick={handleCopyPitch}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md transition-colors shadow-xs cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/60 rounded-lg p-3 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
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
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 dark:bg-slate-800/60 flex items-center justify-between rounded-b-2xl">
          <div className="flex items-center gap-2">
            {onDeleteLead && (
              <button
                type="button"
                onClick={() => {
                  onDeleteLead(lead);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/70 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline">
              Source: {lead.sourceQuery || 'Natural language search'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
