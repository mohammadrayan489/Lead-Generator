import React from 'react';
import { PipelineProgressState } from '../types/lead';
import { CheckCircle2, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface PipelineProgressProps {
  progress: PipelineProgressState;
  onDismiss?: () => void;
}

const STAGES = [
  { id: 'understanding', label: '1. Understand Request' },
  { id: 'searching', label: '2. Search Sources' },
  { id: 'discovering', label: '3. Discover Businesses' },
  { id: 'verifying', label: '4. Verify Information' },
  { id: 'social_check', label: '5. Social Profiles' },
  { id: 'website_check', label: '6. Website Status' },
  { id: 'deduplicating', label: '7. Remove Duplicates' },
  { id: 'qualifying', label: '8. Qualify Opportunities' },
  { id: 'completed', label: '9. Store & Pitch' },
];

export const PipelineProgress: React.FC<PipelineProgressProps> = ({ progress }) => {
  const percent = Math.min(100, Math.round((progress.currentStep / progress.totalSteps) * 100));

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            {progress.stage === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : progress.stage === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                AI Research Pipeline
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">
                Step {progress.currentStep} of {progress.totalSteps}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-slate-900 mt-0.5">
              {progress.message}
            </h4>
          </div>
        </div>

        {progress.intent && (
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium">
              <Sparkles className="w-3 h-3 text-indigo-500" />
              {progress.intent.businessCategory} in {progress.intent.targetLocation}
            </span>
            {progress.intent.filters.noWebsite && (
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium">
                No Website
              </span>
            )}
            {progress.intent.filters.strongSocialPresence && (
              <span className="px-2 py-0.5 rounded bg-pink-50 text-pink-700 border border-pink-200 text-xs font-medium">
                Active Social
              </span>
            )}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            progress.stage === 'completed'
              ? 'bg-emerald-500'
              : progress.stage === 'error'
              ? 'bg-rose-500'
              : 'bg-indigo-600'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Pipeline Stage Chips */}
      <div className="hidden lg:grid grid-cols-9 gap-2 mt-4 pt-3 border-t border-slate-100">
        {STAGES.map((s, idx) => {
          const stepNum = idx + 1;
          const isDone = progress.currentStep > stepNum || progress.stage === 'completed';
          const isCurrent = progress.currentStep === stepNum && progress.stage !== 'completed';

          return (
            <div
              key={s.id}
              className={`text-[11px] font-medium truncate ${
                isDone
                  ? 'text-emerald-700'
                  : isCurrent
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-400'
              }`}
            >
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
