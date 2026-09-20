import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { LeadCard } from './LeadCard';
import {
  NicheDefinition,
  classifyLeadNiche,
  getLeadOutreachStage,
  LeadOutreachStage,
} from '../utils/nicheClassifier';
import {
  ChevronDown,
  ChevronUp,
  Sparkles,
  Star,
  MessageCircle,
  CheckCircle2,
  Send,
  Layers,
} from 'lucide-react';

interface NicheLeadSectionProps {
  nicheDef: NicheDefinition;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>;
  onDeleteLead: (lead: Lead) => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  selectedLeadIds: Set<string>;
  onToggleSelect: (id: string) => void;
  defaultExpanded?: boolean;
}

export const NicheLeadSection: React.FC<NicheLeadSectionProps> = ({
  nicheDef,
  leads,
  onSelectLead,
  onStatusChange,
  onDeleteLead,
  onUpdateLead,
  selectedLeadIds,
  onToggleSelect,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [stageFilter, setStageFilter] = useState<LeadOutreachStage | 'all'>('all');

  const NicheIcon = nicheDef.icon;

  // Breakdown by stage within this niche
  const newLeads = leads.filter((l) => getLeadOutreachStage(l) === 'new');
  const pitchedLeads = leads.filter((l) => getLeadOutreachStage(l) === 'pitched');
  const contactedLeads = leads.filter((l) => getLeadOutreachStage(l) === 'contacted');
  const qualifiedLeads = leads.filter((l) => getLeadOutreachStage(l) === 'qualified');

  const displayedLeads =
    stageFilter === 'all'
      ? leads
      : leads.filter((l) => getLeadOutreachStage(l) === stageFilter);

  // Quick Pitch Action: Find first uncontacted lead in this niche
  const nextLeadToPitch = newLeads[0] || leads[0];

  return (
    <div
      id={`niche-section-${nicheDef.id}`}
      className="mb-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all duration-200"
    >
      {/* Niche Section Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${nicheDef.badgeBg} ${nicheDef.badgeText} ${nicheDef.badgeBorder} shadow-2xs`}
          >
            <NicheIcon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {nicheDef.label}
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {nicheDef.description}
            </p>
          </div>
        </div>

        {/* Action Controls and Sub-stage Pills */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {/* Pitch Next Lead in this Niche Button */}
          {nextLeadToPitch && (
            <button
              type="button"
              onClick={() => onSelectLead(nextLeadToPitch)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
              title={`Open pitch for ${nextLeadToPitch.name}`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pitch Next {nicheDef.shortLabel}</span>
            </button>
          )}

          {/* Expand/Collapse Toggle Button */}
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse section' : 'Expand section'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="p-4 sm:p-5">
          {/* Sub-stage tabs inside this niche */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
                Filter Stage:
              </span>

              <button
                type="button"
                onClick={() => setStageFilter('all')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  stageFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>All {nicheDef.shortLabel}</span>
                <span className="text-[10px] px-1.5 rounded-full bg-slate-700 dark:bg-slate-300 text-slate-200 dark:text-slate-800">
                  {leads.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStageFilter('new')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  stageFilter === 'new'
                    ? 'bg-blue-600 text-white'
                    : 'text-blue-700 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200/50 dark:border-blue-900/50'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>New Leads</span>
                <span className="text-[10px] px-1.5 rounded-full bg-blue-500/20 text-blue-800 dark:text-blue-300">
                  {newLeads.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStageFilter('pitched')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  stageFilter === 'pitched'
                    ? 'bg-amber-500 text-white'
                    : 'text-amber-800 dark:text-amber-300 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200/50 dark:border-amber-800/50'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>Pitched (★)</span>
                <span className="text-[10px] px-1.5 rounded-full bg-amber-500/20 text-amber-900 dark:text-amber-200">
                  {pitchedLeads.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setStageFilter('contacted')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  stageFilter === 'contacted'
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-700 dark:text-indigo-400 bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200/50 dark:border-indigo-900/50'
                }`}
              >
                <MessageCircle className="w-3 h-3" />
                <span>Contacted</span>
                <span className="text-[10px] px-1.5 rounded-full bg-indigo-500/20 text-indigo-800 dark:text-indigo-300">
                  {contactedLeads.length}
                </span>
              </button>

              {qualifiedLeads.length > 0 && (
                <button
                  type="button"
                  onClick={() => setStageFilter('qualified')}
                  className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    stageFilter === 'qualified'
                      ? 'bg-emerald-600 text-white'
                      : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200/50 dark:border-emerald-900/50'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Qualified</span>
                  <span className="text-[10px] px-1.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    {qualifiedLeads.length}
                  </span>
                </button>
              )}
            </div>

            {/* Pitch Strategy Hint */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 italic max-w-md hidden md:block text-right">
              💡 {nicheDef.pitchTip}
            </div>
          </div>

          {/* Leads Grid for this Niche */}
          {displayedLeads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {displayedLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={onStatusChange}
                  onSelectLead={onSelectLead}
                  onDeleteLead={onDeleteLead}
                  onUpdateLead={onUpdateLead}
                  isSelected={selectedLeadIds.has(lead.id)}
                  onToggleSelect={onToggleSelect}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No {stageFilter} leads in {nicheDef.label} currently.
              </p>
              <button
                type="button"
                onClick={() => setStageFilter('all')}
                className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Show all {leads.length} leads in this niche
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
