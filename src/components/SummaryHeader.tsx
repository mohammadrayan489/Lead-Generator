import React, { useMemo } from 'react';
import { Lead, LeadStatus } from '../types/lead';
import { calculateLeadsStatusSummary } from '../utils/statusBreakdown';
import { Layers, Filter, X, Globe, Trash2 } from 'lucide-react';

interface SummaryHeaderProps {
  leads: Lead[];
  selectedStatus: LeadStatus | 'all';
  onSelectStatus: (status: LeadStatus | 'all') => void;
  needsWebsiteCount?: number;
  onClearAll?: () => void;
  className?: string;
}

export const SummaryHeader: React.FC<SummaryHeaderProps> = ({
  leads,
  selectedStatus,
  onSelectStatus,
  needsWebsiteCount,
  onClearAll,
  className = '',
}) => {
  const summary = useMemo(() => calculateLeadsStatusSummary(leads), [leads]);
  const { totalLeads, breakdown } = summary;

  // Active status details for filter feedback
  const activeStatusItem = useMemo(() => {
    if (selectedStatus === 'all') return null;
    return breakdown.find((item) => item.status === selectedStatus) || null;
  }, [selectedStatus, breakdown]);

  return (
    <div
      id="leads-summary-header"
      className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 mb-8 shadow-xs transition-colors ${className}`}
    >
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white leading-none">
              Pipeline Summary
            </h3>
            <span className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
              Live Breakdown
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Aggregate count and stage distribution across your prospective sales pipeline.
          </p>
        </div>

        {/* Total Leads Counter Badge, Opportunities & Active Filter Reset */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {typeof needsWebsiteCount === 'number' && needsWebsiteCount > 0 && (
            <div
              id="summary-header-needs-website-badge"
              className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 px-2.5 py-1.5 rounded-lg text-xs font-medium"
              title="Leads without an active website"
            >
              <Globe className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{needsWebsiteCount} No Website</span>
            </div>
          )}

          <div
            id="summary-header-total-badge"
            className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg text-xs"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Total Pipeline Leads:</span>
            <span id="summary-header-total-count" className="text-sm font-bold text-slate-900 dark:text-white">
              {totalLeads}
            </span>
          </div>

          {onClearAll && totalLeads > 0 && (
            <button
              type="button"
              id="summary-header-clear-all-btn"
              onClick={onClearAll}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-800/80 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-700 hover:border-rose-200 dark:hover:border-rose-800/60 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
              title="Clear all leads from the current list"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
              <span className="hidden sm:inline">Clear All Leads</span>
              <span className="sm:hidden">Clear All</span>
            </button>
          )}

          {selectedStatus !== 'all' && (
            <button
              id="summary-header-clear-filter-btn"
              onClick={() => onSelectStatus('all')}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
              title="Clear status filter and show all leads"
            >
              <X className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span>Show All</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Total Leads + Status Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 my-4">
        {/* Total Leads Card */}
        <button
          type="button"
          id="summary-card-total"
          onClick={() => onSelectStatus('all')}
          className={`text-left p-3 rounded-lg border transition-all cursor-pointer relative ${
            selectedStatus === 'all'
              ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-xs'
              : 'bg-slate-50/80 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-medium opacity-80 mb-1">
            <span>All Leads</span>
            <span className="text-[10px] font-semibold">100%</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold tracking-tight">{totalLeads}</div>
          <div
            className={`text-[10px] mt-1 truncate ${
              selectedStatus === 'all'
                ? 'text-slate-300 dark:text-slate-600'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Full database
          </div>
        </button>

        {/* Individual Status Cards */}
        {breakdown.map((item) => {
          const isSelected = selectedStatus === item.status;
          return (
            <button
              type="button"
              key={item.status}
              id={`summary-status-card-${item.status}`}
              onClick={() => onSelectStatus(isSelected ? 'all' : item.status)}
              className={`text-left p-3 rounded-lg border transition-all cursor-pointer relative ${
                isSelected
                  ? 'ring-2 ring-indigo-500 border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/60 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${item.dotColor}`} />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {item.label}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400 dark:text-slate-400 shrink-0">
                  {item.percentage}%
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {item.count}
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-400 mt-1 truncate">
                {isSelected ? 'Currently filtering' : `${item.percentage}% of pipeline`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Visual Proportional Distribution Stacked Bar */}
      <div className="pt-2">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1.5">
          <span className="flex items-center gap-1.5">
            <Filter className="w-3 h-3 text-slate-400 dark:text-slate-500" />
            <span>Pipeline Distribution</span>
          </span>
          {activeStatusItem ? (
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Showing {activeStatusItem.label} ({activeStatusItem.count} leads •{' '}
              {activeStatusItem.percentage}%)
            </span>
          ) : (
            <span>Showing all {totalLeads} leads</span>
          )}
        </div>

        <div
          id="summary-distribution-bar"
          className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner"
        >
          {totalLeads === 0 ? (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-full" />
          ) : (
            breakdown
              .filter((item) => item.count > 0)
              .map((item) => {
                const widthPercent = (item.count / totalLeads) * 100;
                const isSelected = selectedStatus === item.status;
                return (
                  <button
                    type="button"
                    key={item.status}
                    onClick={() => onSelectStatus(isSelected ? 'all' : item.status)}
                    style={{ width: `${widthPercent}%` }}
                    className={`h-full ${item.dotColor} transition-all hover:opacity-85 focus:outline-none ${
                      isSelected ? 'ring-2 ring-slate-900 dark:ring-slate-100 ring-offset-1 z-10' : 'opacity-90'
                    }`}
                    title={`${item.label}: ${item.count} leads (${item.percentage}%)`}
                  />
                );
              })
          )}
        </div>
      </div>
    </div>
  );
};
