import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { LeadCard } from './LeadCard';
import {
  StageDefinition,
  classifyLeadNiche,
  NICHE_DEFINITIONS,
  NicheId,
} from '../utils/nicheClassifier';
import {
  ChevronDown,
  ChevronUp,
  Filter,
  Send,
} from 'lucide-react';

interface StagePipelineSectionProps {
  stageDef: StageDefinition;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onStatusChange: (id: string, status: LeadStatus) => Promise<void>;
  onDeleteLead: (lead: Lead) => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
  selectedLeadIds: Set<string>;
  onToggleSelect: (id: string) => void;
  defaultExpanded?: boolean;
}

export const StagePipelineSection: React.FC<StagePipelineSectionProps> = ({
  stageDef,
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
  const [nicheFilter, setNicheFilter] = useState<NicheId | 'all'>('all');

  const StageIcon = stageDef.icon;

  // Filter leads within this stage by niche
  const displayedLeads =
    nicheFilter === 'all'
      ? leads
      : leads.filter((l) => classifyLeadNiche(l) === nicheFilter);

  // Calculate counts per niche inside this stage
  const nicheCounts = leads.reduce<Record<string, number>>((acc, lead) => {
    const niche = classifyLeadNiche(lead);
    acc[niche] = (acc[niche] || 0) + 1;
    return acc;
  }, {});

  const activeNiches = Object.keys(nicheCounts) as NicheId[];

  const firstLeadInStage = displayedLeads[0];

  return (
    <div
      id={`stage-section-${stageDef.id}`}
      className="mb-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden transition-all duration-200"
    >
      {/* Stage Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${stageDef.colorClasses.bg} ${stageDef.colorClasses.text} ${stageDef.colorClasses.border} shadow-2xs`}
          >
            <StageIcon className="w-5 h-5" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {stageDef.label}
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stageDef.colorClasses.bg} ${stageDef.colorClasses.text} border ${stageDef.colorClasses.border}`}
              >
                {leads.length} {leads.length === 1 ? 'Lead' : 'Leads'}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {stageDef.description}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {stageDef.id === 'new' && firstLeadInStage && (
            <button
              type="button"
              onClick={() => onSelectLead(firstLeadInStage)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pitch Next New Lead</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse stage section' : 'Expand stage section'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isExpanded && (
        <div className="p-4 sm:p-5">
          {/* Sub-filtering by Niche inside this stage */}
          {activeNiches.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Filter by Niche:
              </span>

              <button
                type="button"
                onClick={() => setNicheFilter('all')}
                className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  nicheFilter === 'all'
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>All Niches</span>
                <span className="text-[10px] px-1.5 rounded-full bg-slate-700 dark:bg-slate-300 text-slate-200 dark:text-slate-800">
                  {leads.length}
                </span>
              </button>

              {activeNiches.map((nicheId) => {
                const def = NICHE_DEFINITIONS[nicheId];
                if (!def) return null;
                const count = nicheCounts[nicheId] || 0;
                const isActive = nicheFilter === nicheId;
                const NIcon = def.icon;

                return (
                  <button
                    key={nicheId}
                    type="button"
                    onClick={() => setNicheFilter(nicheId)}
                    className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : `${def.badgeBg} ${def.badgeText} border ${def.badgeBorder} hover:opacity-80`
                    }`}
                  >
                    <NIcon className="w-3 h-3" />
                    <span>{def.shortLabel}</span>
                    <span className="text-[10px] px-1.5 rounded-full bg-black/10 dark:bg-white/10 font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Leads Grid */}
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
                No leads in {stageDef.label} matching the selected niche.
              </p>
              <button
                type="button"
                onClick={() => setNicheFilter('all')}
                className="mt-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                Reset niche filter
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
