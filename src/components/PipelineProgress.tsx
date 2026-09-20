import React from 'react';
import { PipelineProgressState } from '../types/lead';
import {
  CheckCircle2,
  Loader2,
  Sparkles,
  AlertCircle,
  MapPin,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Radio,
} from 'lucide-react';

interface PipelineProgressProps {
  progress: PipelineProgressState;
  onDismiss?: () => void;
}

const STAGES = [
  { id: 'understanding', label: '1. Intent & Count' },
  { id: 'searching', label: '2. Search Sources' },
  { id: 'google_maps', label: '3. Google Maps' },
  { id: 'social_check', label: '4. LinkedIn & X' },
  { id: 'youtube_check', label: '5. YouTube Footprint' },
  { id: 'website_check', label: '6. Website Audit' },
  { id: 'deduplicating', label: '7. Deduplicate' },
  { id: 'qualifying', label: '8. Score & WhatsApp' },
  { id: 'completed', label: '9. Save & Database' },
];

export const PipelineProgress: React.FC<PipelineProgressProps> = ({ progress }) => {
  const targetTotal = progress.targetTotal || progress.discoveredCount || 10;
  const currentCount = progress.discoveredCount || 0;
  const percent = Math.min(
    100,
    progress.stage === 'completed'
      ? 100
      : Math.max(8, Math.round((progress.currentStep / progress.totalSteps) * 100))
  );

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm mb-8 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            {progress.stage === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            ) : progress.stage === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            ) : (
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                <Radio className="w-3 h-3 animate-pulse text-indigo-500" />
                Real-Time Multi-Platform Research
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Target: {targetTotal} {targetTotal === 1 ? 'business' : 'businesses'}
              </span>
              {currentCount > 0 && (
                <>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    {currentCount}/{targetTotal} Verified
                  </span>
                </>
              )}
            </div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {progress.message}
            </h4>
          </div>
        </div>

        {/* Live Multi-Platform Radar Chips */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
            progress.activePlatform === 'google_maps'
              ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 ring-1 ring-amber-400'
              : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}>
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            Google Maps
          </span>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
            progress.activePlatform === 'linkedin'
              ? 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 ring-1 ring-blue-400'
              : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}>
            <Linkedin className="w-3.5 h-3.5 text-blue-600" />
            LinkedIn
          </span>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
            progress.activePlatform === 'twitter'
              ? 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/60 dark:text-sky-300 ring-1 ring-sky-400'
              : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}>
            <Twitter className="w-3.5 h-3.5 text-sky-500" />
            X (Twitter)
          </span>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
            progress.activePlatform === 'youtube'
              ? 'bg-red-100 text-red-900 border-red-300 dark:bg-red-950/60 dark:text-red-300 ring-1 ring-red-400'
              : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
          }`}>
            <Youtube className="w-3.5 h-3.5 text-red-600" />
            YouTube
          </span>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${
            progress.activePlatform === 'website_audit'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 ring-1 ring-emerald-400'
              : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900'
          }`}>
            <Globe className="w-3.5 h-3.5 text-rose-500" />
            Zero-Website Audit
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
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
      <div className="hidden lg:grid grid-cols-9 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {STAGES.map((s, idx) => {
          const stepNum = idx + 1;
          const isDone = progress.currentStep > stepNum || progress.stage === 'completed';
          const isCurrent = progress.currentStep === stepNum && progress.stage !== 'completed';

          return (
            <div
              key={s.id}
              className={`text-[11px] font-medium truncate ${
                isDone
                  ? 'text-emerald-700 dark:text-emerald-400'
                  : isCurrent
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-400 dark:text-slate-600'
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
