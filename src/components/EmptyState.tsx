import React from 'react';
import { Target, Sparkles, MapPin } from 'lucide-react';
import { SEARCH_PRESETS } from '../data/searchPresets';

interface EmptyStateProps {
  onSelectPreset: (query: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPreset }) => {
  return (
    <div className="text-center max-w-xl mx-auto py-12 px-4">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
        <Target className="w-7 h-7" />
      </div>

      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 mb-3">
        <MapPin className="w-3.5 h-3.5" />
        <span>Jammu & Kashmir Regional Engine</span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        Discover Qualified J&K Business Leads
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
        Specialized lead discovery across Srinagar, Jammu, and the Kashmir Valley. Verifies local phone numbers, Instagram engagement, website status, and crafts instant WhatsApp sales pitches.
      </p>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 text-left shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
          <span>Try a sample Jammu & Kashmir prompt:</span>
        </div>

        <div className="space-y-2">
          {SEARCH_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.query)}
              className="w-full text-left p-3 rounded-lg border border-slate-100 dark:border-slate-800/80 hover:border-indigo-200 dark:hover:border-indigo-700/60 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/30 transition-all flex items-start justify-between gap-3 group cursor-pointer"
            >
              <div>
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {preset.query}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{preset.category}</span>
                  <span>•</span>
                  <span>{preset.location}</span>
                  <span>•</span>
                  <span className="text-indigo-600 dark:text-indigo-400">{preset.highlight}</span>
                </div>
              </div>
              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-300 bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-800/70 px-2 py-0.5 rounded shrink-0 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Run
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

