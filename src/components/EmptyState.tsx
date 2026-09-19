import React from 'react';
import { Target, Sparkles, Instagram, Globe } from 'lucide-react';
import { SEARCH_PRESETS } from '../data/searchPresets';

interface EmptyStateProps {
  onSelectPreset: (query: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPreset }) => {
  return (
    <div className="text-center max-w-xl mx-auto py-12 px-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4">
        <Target className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Ready to Discover Qualified Business Leads
      </h3>
      <p className="text-sm text-slate-500 mb-8 leading-relaxed">
        Lead-Generator searches available business sources, verifies websites and social profiles, filters out duplicates, and scores sales opportunities with instant WhatsApp outreach pitches.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl p-5 text-left shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Try a sample natural-language prompt:</span>
        </div>

        <div className="space-y-2">
          {SEARCH_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.query)}
              className="w-full text-left p-3 rounded-lg border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/30 transition-all flex items-start justify-between gap-3 group"
            >
              <div>
                <div className="text-xs font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {preset.query}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Targeting: {preset.category} • {preset.location}
                </div>
              </div>
              <span className="text-[10px] font-semibold text-indigo-600 bg-white border border-indigo-100 px-2 py-0.5 rounded shrink-0">
                Run
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
