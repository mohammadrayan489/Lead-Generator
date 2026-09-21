import React, { useState } from 'react';
import { LeadStatus } from '../types/lead';
import {
  Sparkles,
  MessageCircle,
  Flame,
  CheckCircle2,
  XCircle,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';

export interface LeadStatusTrackerProps {
  currentStatus: LeadStatus;
  onStatusChange: (newStatus: LeadStatus) => void;
  leadId?: string;
  leadName?: string;
  compact?: boolean;
  className?: string;
  showHelperText?: boolean;
}

interface PrimaryStage {
  status: LeadStatus;
  stepNumber: number;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  activeColor: {
    bg: string;
    text: string;
    border: string;
    ring: string;
  };
}

const PRIMARY_STAGES: PrimaryStage[] = [
  {
    status: 'new',
    stepNumber: 1,
    label: 'New',
    shortLabel: 'New',
    icon: Sparkles,
    description: 'Fresh lead awaiting first WhatsApp outreach',
    activeColor: {
      bg: 'bg-blue-600 dark:bg-blue-600 text-white',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-600 dark:border-blue-500',
      ring: 'ring-blue-500/30',
    },
  },
  {
    status: 'contacted',
    stepNumber: 2,
    label: 'Contacted',
    shortLabel: 'Contacted',
    icon: MessageCircle,
    description: 'Pitch sent via WhatsApp, phone, or direct message',
    activeColor: {
      bg: 'bg-indigo-600 dark:bg-indigo-600 text-white',
      text: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-600 dark:border-indigo-500',
      ring: 'ring-indigo-500/30',
    },
  },
  {
    status: 'interested',
    stepNumber: 3,
    label: 'Interested',
    shortLabel: 'Interested',
    icon: Flame,
    description: 'Merchant replied positively, requested pricing or digital catalog demo',
    activeColor: {
      bg: 'bg-emerald-600 dark:bg-emerald-600 text-white',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-600 dark:border-emerald-500',
      ring: 'ring-emerald-500/30',
    },
  },
];

const OUTCOME_STAGES: Array<{
  status: LeadStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  activeBg: string;
}> = [
  {
    status: 'qualified',
    label: 'Qualified / Won',
    icon: CheckCircle2,
    description: 'Deal closed or converted to client',
    activeBg: 'bg-teal-600 text-white border-teal-700',
  },
  {
    status: 'lost',
    label: 'Lost / Closed',
    icon: XCircle,
    description: 'Declined or unreachable lead',
    activeBg: 'bg-rose-600 text-white border-rose-700',
  },
];

/**
 * Returns stage order index:
 * new: 1, contacted: 2, interested: 3, qualified: 4
 */
function getStageIndex(status: LeadStatus): number {
  switch (status) {
    case 'new':
    case 'discovered':
    case 'enriching':
    case 'verified':
      return 1;
    case 'contacted':
      return 2;
    case 'interested':
      return 3;
    case 'qualified':
      return 4;
    case 'lost':
    case 'unqualified':
      return 0;
    default:
      return 1;
  }
}

export const LeadStatusTracker: React.FC<LeadStatusTrackerProps> = ({
  currentStatus,
  onStatusChange,
  leadId,
  leadName,
  compact = false,
  className = '',
  showHelperText = true,
}) => {
  const [showOutcomeMenu, setShowOutcomeMenu] = useState(false);
  const [justUpdatedStatus, setJustUpdatedStatus] = useState<LeadStatus | null>(null);

  const currentIndex = getStageIndex(currentStatus);
  const isOutcomeStatus = currentStatus === 'qualified' || currentStatus === 'lost';

  const handleStageClick = (status: LeadStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (status === currentStatus) return;

    onStatusChange(status);
    setJustUpdatedStatus(status);
    setTimeout(() => setJustUpdatedStatus(null), 1800);
  };

  const currentStageDescription =
    PRIMARY_STAGES.find((s) => s.status === currentStatus)?.description ||
    OUTCOME_STAGES.find((s) => s.status === currentStatus)?.description ||
    'Track lead progression through the outreach pipeline';

  // Render Compact Mode (Segmented Button Group)
  if (compact) {
    return (
      <div
        id={leadId ? `status-tracker-compact-${leadId}` : undefined}
        className={`inline-flex items-center p-0.5 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-2xs ${className}`}
        role="group"
        aria-label="Lead status tracker"
      >
        {PRIMARY_STAGES.map((stage) => {
          const isActive = currentStatus === stage.status;
          const isPassed = !isActive && currentIndex > stage.stepNumber && currentIndex > 0;
          const StageIcon = stage.icon;

          return (
            <button
              key={stage.status}
              type="button"
              onClick={(e) => handleStageClick(stage.status, e)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer select-none ${
                isActive
                  ? `${stage.activeColor.bg} shadow-xs scale-[1.02]`
                  : isPassed
                  ? 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/40'
              }`}
              title={`${stage.label}: ${stage.description}`}
              aria-pressed={isActive}
            >
              {isPassed ? (
                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
              ) : (
                <StageIcon className="w-3 h-3 shrink-0" />
              )}
              <span>{stage.shortLabel}</span>
            </button>
          );
        })}

        {/* Outcome quick toggle */}
        <div className="relative border-l border-slate-200 dark:border-slate-700 ml-0.5 pl-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowOutcomeMenu(!showOutcomeMenu);
            }}
            className={`px-1.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-0.5 cursor-pointer ${
              isOutcomeStatus
                ? currentStatus === 'qualified'
                  ? 'bg-teal-600 text-white'
                  : 'bg-rose-600 text-white'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="More outcomes (Qualified, Lost)"
          >
            <span>{isOutcomeStatus ? (currentStatus === 'qualified' ? 'Won' : 'Lost') : 'More'}</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showOutcomeMenu && (
            <div
              className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-30 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              {OUTCOME_STAGES.map((outcome) => (
                <button
                  key={outcome.status}
                  type="button"
                  onClick={(e) => {
                    handleStageClick(outcome.status, e);
                    setShowOutcomeMenu(false);
                  }}
                  className={`w-full px-2.5 py-1.5 text-left text-xs font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    currentStatus === outcome.status
                      ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                      : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <outcome.icon className="w-3.5 h-3.5" />
                  <span>{outcome.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full Standard Stepper Mode
  return (
    <div
      id={leadId ? `status-tracker-full-${leadId}` : undefined}
      className={`w-full bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 rounded-xl p-2.5 sm:p-3 transition-colors ${className}`}
    >
      {/* Header with Title and Current State Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pipeline Tracker
          </span>
          {justUpdatedStatus && (
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded animate-in fade-in duration-200">
              Updated
            </span>
          )}
        </div>

        {/* Current Status Pill with Outcome Action */}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowOutcomeMenu(!showOutcomeMenu);
              }}
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
              title="Change to outcome stage (Qualified, Lost)"
            >
              <span>{isOutcomeStatus ? (currentStatus === 'qualified' ? 'Won' : 'Lost') : 'Outcome'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showOutcomeMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-30 py-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 mb-1">
                  Terminal Stages
                </div>
                {OUTCOME_STAGES.map((outcome) => (
                  <button
                    key={outcome.status}
                    type="button"
                    onClick={(e) => {
                      handleStageClick(outcome.status, e);
                      setShowOutcomeMenu(false);
                    }}
                    className={`w-full px-2.5 py-1.5 text-left text-xs font-medium flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      currentStatus === outcome.status
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50/50 dark:bg-indigo-950/40'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <outcome.icon className="w-3.5 h-3.5" />
                      <span>{outcome.label}</span>
                    </div>
                    {currentStatus === outcome.status && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stepper Track */}
      <div className="relative flex items-center justify-between gap-1 sm:gap-2">
        {/* Background Connecting Line */}
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-700 -z-0" />

        {/* Progress Connecting Line */}
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 transition-all duration-300 -z-0"
          style={{
            width:
              currentIndex <= 1
                ? '0%'
                : currentIndex === 2
                ? '50%'
                : 'calc(100% - 3rem)',
          }}
        />

        {PRIMARY_STAGES.map((stage) => {
          const isActive = currentStatus === stage.status;
          const isPassed = !isActive && currentIndex > stage.stepNumber && currentIndex > 0;
          const StageIcon = stage.icon;

          return (
            <button
              key={stage.status}
              type="button"
              onClick={(e) => handleStageClick(stage.status, e)}
              className={`relative z-10 flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer select-none group ${
                isActive
                  ? `${stage.activeColor.bg} border-transparent shadow-xs ring-2 ${stage.activeColor.ring} scale-[1.01]`
                  : isPassed
                  ? 'bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 shadow-2xs'
                  : 'bg-white dark:bg-slate-800/90 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-200 shadow-2xs'
              }`}
              title={`Click to mark lead as ${stage.label}: ${stage.description}`}
              aria-label={`Mark lead ${leadName || ''} as ${stage.label}`}
              aria-pressed={isActive}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : isPassed
                    ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-200'
                }`}
              >
                {isPassed ? (
                  <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-300 stroke-[3]" />
                ) : (
                  <StageIcon className="w-3 h-3" />
                )}
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="truncate">{stage.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Helper text explaining the current status */}
      {showHelperText && (
        <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 truncate pr-2">
            <Info className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{currentStageDescription}</span>
          </div>
          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
            1-click transition
          </span>
        </div>
      )}
    </div>
  );
};
