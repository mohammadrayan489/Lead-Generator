import React from 'react';
import { LeadStatus } from '../types/lead';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; bg: string; text: string; dot: string }> = {
  new: {
    label: 'New',
    bg: 'bg-blue-50 dark:bg-blue-950/50',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
  },
  discovered: {
    label: 'Discovered',
    bg: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-700 dark:text-slate-300',
    dot: 'bg-slate-400 dark:bg-slate-500',
  },
  enriching: {
    label: 'Enriching',
    bg: 'bg-amber-50 dark:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-400',
  },
  verified: {
    label: 'Verified',
    bg: 'bg-sky-50 dark:bg-sky-950/50',
    text: 'text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  qualified: {
    label: 'Qualified',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  contacted: {
    label: 'Contacted',
    bg: 'bg-indigo-50 dark:bg-indigo-950/50',
    text: 'text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-500',
  },
  interested: {
    label: 'Interested',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  lost: {
    label: 'Lost',
    bg: 'bg-rose-50 dark:bg-rose-950/50',
    text: 'text-rose-700 dark:text-rose-300',
    dot: 'bg-rose-500',
  },
  unqualified: {
    label: 'Unqualified',
    bg: 'bg-zinc-100 dark:bg-zinc-800',
    text: 'text-zinc-700 dark:text-zinc-300',
    dot: 'bg-zinc-400',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.discovered;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};
