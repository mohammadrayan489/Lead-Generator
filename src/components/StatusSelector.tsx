import React, { useState, useRef, useEffect } from 'react';
import { LeadStatus } from '../types/lead';
import { ChevronDown, Check } from 'lucide-react';

export interface StatusOption {
  value: LeadStatus;
  label: string;
  description?: string;
  bg: string;
  text: string;
  dot: string;
  border: string;
  hoverBg: string;
}

export const PIPELINE_STATUS_CONFIG: Record<LeadStatus, StatusOption> = {
  new: {
    value: 'new',
    label: 'New',
    description: 'Fresh lead awaiting first contact',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    border: 'border-blue-200 dark:border-blue-800/70',
    hoverBg: 'hover:bg-blue-50/70 dark:hover:bg-blue-950/70',
  },
  contacted: {
    value: 'contacted',
    label: 'Contacted',
    description: 'Outreach sent via WhatsApp or call',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    text: 'text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-500',
    border: 'border-indigo-200 dark:border-indigo-800/70',
    hoverBg: 'hover:bg-indigo-50/70 dark:hover:bg-indigo-950/70',
  },
  interested: {
    value: 'interested',
    label: 'Interested',
    description: 'Prospect showed interest, requested demo or pricing',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800/70',
    hoverBg: 'hover:bg-emerald-50/70 dark:hover:bg-emerald-950/70',
  },
  qualified: {
    value: 'qualified',
    label: 'Qualified',
    description: 'High-potential prospect matching ICP',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800/70',
    hoverBg: 'hover:bg-emerald-50/70 dark:hover:bg-emerald-950/70',
  },
  lost: {
    value: 'lost',
    label: 'Lost',
    description: 'Lead rejected, unresponsive or closed-lost',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
    border: 'border-rose-200 dark:border-rose-800/70',
    hoverBg: 'hover:bg-rose-50/70 dark:hover:bg-rose-950/70',
  },
  discovered: {
    value: 'discovered',
    label: 'Discovered',
    description: 'Discovered from research pipeline',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400 dark:text-slate-500',
    border: 'border-slate-200 dark:border-slate-700',
    hoverBg: 'hover:bg-slate-50 dark:hover:bg-slate-750',
  },
  verified: {
    value: 'verified',
    label: 'Verified',
    description: 'Business details confirmed',
    bg: 'bg-sky-50 dark:bg-sky-950/50',
    text: 'text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
    border: 'border-sky-200 dark:border-sky-800/70',
    hoverBg: 'hover:bg-sky-50/70 dark:hover:bg-sky-950/70',
  },
  enriching: {
    value: 'enriching',
    label: 'Enriching',
    description: 'Fetching profile data',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-400',
    border: 'border-amber-200 dark:border-amber-800/70',
    hoverBg: 'hover:bg-amber-50/70 dark:hover:bg-amber-950/70',
  },
  unqualified: {
    value: 'unqualified',
    label: 'Unqualified',
    description: 'Does not match outreach criteria',
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-700 dark:text-zinc-300',
    dot: 'bg-zinc-400',
    border: 'border-zinc-200 dark:border-zinc-700',
    hoverBg: 'hover:bg-zinc-50 dark:hover:bg-zinc-750',
  },
};

export const ORDERED_PIPELINE_STATUSES: LeadStatus[] = [
  'new',
  'contacted',
  'interested',
  'qualified',
  'lost',
  'discovered',
  'unqualified',
];

interface StatusSelectorProps {
  currentStatus: LeadStatus;
  onStatusChange: (newStatus: LeadStatus) => void;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  onStatusChange,
  size = 'sm',
  disabled = false,
  className = '',
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeConfig = PIPELINE_STATUS_CONFIG[currentStatus] || PIPELINE_STATUS_CONFIG.discovered;

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (status: LeadStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== currentStatus) {
      onStatusChange(status);
    }
    setIsOpen(false);
  };

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2.5 py-1 gap-1.5 min-h-[26px]'
      : 'text-sm px-3 py-1.5 gap-2 min-h-[32px]';

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
      id={id || `status-selector-${currentStatus}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        title="Change lead pipeline status"
        className={`inline-flex items-center font-medium rounded-lg border transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
          activeConfig.bg
        } ${activeConfig.text} ${activeConfig.border} ${sizeClasses} ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'hover:brightness-95 active:scale-98'
        }`}
      >
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeConfig.dot}`} />
        <span className="font-semibold">{activeConfig.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 opacity-70 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Lead sales pipeline status"
          className="absolute left-0 mt-1.5 w-52 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-40 focus:outline-none animate-in fade-in zoom-in-95 duration-100"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Pipeline Stage
          </div>
          <div className="py-1">
            {ORDERED_PIPELINE_STATUSES.map((statusKey) => {
              const opt = PIPELINE_STATUS_CONFIG[statusKey];
              const isSelected = currentStatus === statusKey;

              return (
                <button
                  key={statusKey}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={(e) => handleSelect(statusKey, e)}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between text-xs transition-colors cursor-pointer group ${
                    isSelected
                      ? `${opt.bg} ${opt.text} font-semibold`
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${opt.dot}`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 opacity-90" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
